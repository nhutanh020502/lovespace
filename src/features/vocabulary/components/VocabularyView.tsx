import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, BookOpen, Sparkles, BookMarked } from 'lucide-react';
import { DailyVocabSet, VocabWord, VocabStreak } from '../../../types/vocab.types';
import { UserRole, UserProfile } from '../../../types/common.types';
import { DailyWordDeck } from './DailyWordDeck';
import { WordBankSection } from './WordBankSection';
import { FlashcardModal } from './FlashcardModal';
import { VocabQuizModal } from './VocabQuizModal';
import { WordFormModal } from './WordFormModal';
import { PresetPacksModal } from './PresetPacksModal';
import { CoupleRewardModal } from './CoupleRewardModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { generateUUID } from '../../../utils/uuidUtils';

interface VocabularyViewProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  vocabSets: DailyVocabSet[];
  streak: VocabStreak;
  onUpdateVocabSets: (newSets: DailyVocabSet[]) => void;
  onUpdateStreak: (newStreak: VocabStreak) => void;
  onNudgePartner: () => void;
  onShowToast: (msg: string) => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  currentRole,
  partner1,
  partner2,
  vocabSets,
  streak,
  onUpdateVocabSets,
  onUpdateStreak,
  onNudgePartner,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'bank'>('today');

  // Modals state
  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isWordFormOpen, setIsWordFormOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);
  const [isPresetPacksOpen, setIsPresetPacksOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);

  // Today's Date String (YYYY-MM-DD)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayDisplay = format(new Date(), 'EEEE, dd/MM/yyyy', { locale: vi });

  // Bộ từ của ngày hôm nay
  const todaySet = useMemo<DailyVocabSet>(() => {
    const found = vocabSets.find((s) => s.date === todayStr);
    if (found) return found;

    // Nếu chưa có, tạo cấu trúc rỗng ban đầu cho ngày hôm nay
    return {
      id: generateUUID(),
      date: todayStr,
      title: `10 Từ Vựng Ngày ${format(new Date(), 'dd/MM')}`,
      topic: 'Chưa chọn chủ đề',
      words: [],
      partner1Progress: {
        userId: partner1.id,
        role: 'husband' as const,
        completedWordIds: [],
        isCompleted: false,
        score: 0
      },
      partner2Progress: {
        userId: partner2.id,
        role: 'wife' as const,
        completedWordIds: [],
        isCompleted: false,
        score: 0
      },
      reward: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [vocabSets, todayStr, partner1.id, partner2.id]);

  // Cập nhật bộ từ hôm nay
  const updateTodaySet = (updater: (prev: DailyVocabSet) => DailyVocabSet) => {
    const updated = updater(todaySet);
    const existingIndex = vocabSets.findIndex((s) => s.date === todayStr);

    let newSets: DailyVocabSet[];
    if (existingIndex >= 0) {
      newSets = vocabSets.map((s, idx) => (idx === existingIndex ? updated : s));
    } else {
      newSets = [updated, ...vocabSets];
    }

    onUpdateVocabSets(newSets);

    // Kiểm tra streak nếu cả hai cùng hoàn thành
    const totalWords = updated.words.length;
    const p1Done = updated.partner1Progress.completedWordIds.length === totalWords && totalWords > 0;
    const p2Done = updated.partner2Progress.completedWordIds.length === totalWords && totalWords > 0;

    if (p1Done && p2Done && streak.lastCompletedDate !== todayStr) {
      const newCurrentStreak = streak.currentStreak + 1;
      const newLongest = Math.max(streak.longestStreak, newCurrentStreak);
      onUpdateStreak({
        currentStreak: newCurrentStreak,
        longestStreak: newLongest,
        lastCompletedDate: todayStr,
        history: {
          ...(streak.history || {}),
          [todayStr]: true
        }
      });
      onShowToast('🎉 Tuyệt vời! Cả hai đã hoàn thành bài học và giữ vững chuỗi Streak!');
      setIsRewardOpen(true);
    }
  };

  // 1. Toggle thuộc từ
  const handleToggleMastered = (wordId: string) => {
    updateTodaySet((prev) => {
      const isHusband = currentRole === 'husband';
      const targetProgress = isHusband ? prev.partner1Progress : prev.partner2Progress;
      const currentCompleted = targetProgress.completedWordIds || [];

      const nextCompleted = currentCompleted.includes(wordId)
        ? currentCompleted.filter((id) => id !== wordId)
        : [...currentCompleted, wordId];

      const isCompleted = nextCompleted.length === prev.words.length && prev.words.length > 0;

      const updatedProgress = {
        ...targetProgress,
        completedWordIds: nextCompleted,
        isCompleted,
        finishedAt: isCompleted ? new Date().toISOString() : targetProgress.finishedAt
      };

      return {
        ...prev,
        partner1Progress: isHusband ? updatedProgress : prev.partner1Progress,
        partner2Progress: isHusband ? prev.partner2Progress : updatedProgress,
        updatedAt: new Date().toISOString()
      };
    });
  };

  // Toggle từ trong kho từ vựng tổng hợp
  const handleToggleMasteredInBank = (setId: string, wordId: string) => {
    const targetSet = vocabSets.find((s) => s.id === setId);
    if (!targetSet) return;

    const isHusband = currentRole === 'husband';
    const targetProgress = isHusband ? targetSet.partner1Progress : targetSet.partner2Progress;
    const currentCompleted = targetProgress.completedWordIds || [];

    const nextCompleted = currentCompleted.includes(wordId)
      ? currentCompleted.filter((id) => id !== wordId)
      : [...currentCompleted, wordId];

    const isCompleted = nextCompleted.length === targetSet.words.length && targetSet.words.length > 0;

    const updatedSet: DailyVocabSet = {
      ...targetSet,
      partner1Progress: isHusband
        ? { ...targetProgress, completedWordIds: nextCompleted, isCompleted }
        : targetSet.partner1Progress,
      partner2Progress: isHusband
        ? targetSet.partner2Progress
        : { ...targetProgress, completedWordIds: nextCompleted, isCompleted },
      updatedAt: new Date().toISOString()
    };

    onUpdateVocabSets(vocabSets.map((s) => (s.id === setId ? updatedSet : s)));
  };

  // 2. Lưu kết quả Quiz
  const handleSaveQuizResult = (score: number) => {
    updateTodaySet((prev) => {
      const isHusband = currentRole === 'husband';
      const targetProgress = isHusband ? prev.partner1Progress : prev.partner2Progress;

      const updatedProgress = {
        ...targetProgress,
        quizScore: score
      };

      return {
        ...prev,
        partner1Progress: isHusband ? updatedProgress : prev.partner1Progress,
        partner2Progress: isHusband ? prev.partner2Progress : updatedProgress,
        updatedAt: new Date().toISOString()
      };
    });
  };

  // 3. Thêm / Sửa 1 từ
  const handleSaveWord = (savedWord: VocabWord) => {
    updateTodaySet((prev) => {
      const exists = prev.words.some((w) => w.id === savedWord.id);
      const newWords = exists
        ? prev.words.map((w) => (w.id === savedWord.id ? savedWord : w))
        : [...prev.words, savedWord];

      return {
        ...prev,
        words: newWords,
        updatedAt: new Date().toISOString()
      };
    });
    onShowToast('Đã lưu từ vựng thành công! ✨');
  };

  // 4. Nhập nhanh nhiều từ
  const handleBulkImport = (bulkWords: VocabWord[]) => {
    updateTodaySet((prev) => {
      return {
        ...prev,
        words: bulkWords,
        partner1Progress: { ...prev.partner1Progress, completedWordIds: [], isCompleted: false },
        partner2Progress: { ...prev.partner2Progress, completedWordIds: [], isCompleted: false },
        updatedAt: new Date().toISOString()
      };
    });
    onShowToast(`Đã nhập nhanh ${bulkWords.length} từ vào bài học hôm nay! ✨`);
  };

  // 5. Áp dụng gói từ vựng có sẵn
  const handleApplyPresetPack = (packWords: VocabWord[], packTitle: string, topic: string) => {
    updateTodaySet((prev) => {
      return {
        ...prev,
        title: packTitle,
        topic,
        words: packWords,
        partner1Progress: { ...prev.partner1Progress, completedWordIds: [], isCompleted: false },
        partner2Progress: { ...prev.partner2Progress, completedWordIds: [], isCompleted: false },
        updatedAt: new Date().toISOString()
      };
    });
    onShowToast(`Đã áp dụng gói "${packTitle}" thành công! ✨`);
  };

  // 6. Xóa từ
  const handleDeleteWord = (wordId: string) => {
    updateTodaySet((prev) => {
      return {
        ...prev,
        words: prev.words.filter((w) => w.id !== wordId),
        partner1Progress: {
          ...prev.partner1Progress,
          completedWordIds: prev.partner1Progress.completedWordIds.filter((id) => id !== wordId)
        },
        partner2Progress: {
          ...prev.partner2Progress,
          completedWordIds: prev.partner2Progress.completedWordIds.filter((id) => id !== wordId)
        },
        updatedAt: new Date().toISOString()
      };
    });
    onShowToast('Đã xóa từ vựng.');
  };

  // 7. Lưu phần thưởng tình yêu
  const handleSaveReward = (rewardTitle: string) => {
    updateTodaySet((prev) => ({
      ...prev,
      reward: {
        isUnlocked: true,
        rewardTitle,
        unlockedAt: new Date().toISOString(),
        claimedByRole: currentRole
      },
      updatedAt: new Date().toISOString()
    }));
  };

  const myProgress = currentRole === 'husband' ? todaySet.partner1Progress : todaySet.partner2Progress;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Header & Couple Streak Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-200/60 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 text-white shadow-glow">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                Cùng Nhau Học Từ Vựng
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black flex items-center gap-1 border border-amber-200">
                🔥 {streak.currentStreak} Ngày Liên Tiếp
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              10 từ mỗi ngày cùng người yêu • Kỷ lục: {streak.longestStreak} ngày
            </p>
          </div>
        </div>

        {/* Tab Switcher (Hôm Nay vs Kho Từ Vựng) with Shared LayoutId */}
        <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-rose-50 rounded-2xl border border-rose-100 relative">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`relative flex-1 sm:flex-initial py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 z-10 ${
              activeTab === 'today' ? 'text-white' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            {activeTab === 'today' && (
              <motion.div
                layoutId="vocabTabPill"
                className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <BookOpen className="w-3.5 h-3.5" />
            <span>10 Từ Hôm Nay</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bank')}
            className={`relative flex-1 sm:flex-initial py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 z-10 ${
              activeTab === 'bank' ? 'text-white' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            {activeTab === 'bank' && (
              <motion.div
                layoutId="vocabTabPill"
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl -z-10 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <BookMarked className="w-3.5 h-3.5" />
            <span>Kho Từ Vựng</span>
          </button>
        </div>
      </div>

      {/* 2. Body View */}
      {activeTab === 'today' ? (
        <DailyWordDeck
          currentRole={currentRole}
          partner1={partner1}
          partner2={partner2}
          dailySet={todaySet}
          onToggleMastered={handleToggleMastered}
          onOpenFlashcards={() => setIsFlashcardsOpen(true)}
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenWordForm={(word) => {
            setEditingWord(word || null);
            setIsWordFormOpen(true);
          }}
          onOpenPresetPacks={() => setIsPresetPacksOpen(true)}
          onOpenRewardModal={() => setIsRewardOpen(true)}
          onDeleteWord={handleDeleteWord}
          onNudgePartner={() => {
            onNudgePartner();
            onShowToast(`Đã gửi thông báo nhắc nhở tới ${currentRole === 'husband' ? partner2.nickname : partner1.nickname}! 🚀`);
          }}
        />
      ) : (
        <WordBankSection
          currentRole={currentRole}
          allSets={vocabSets}
          onToggleMastered={handleToggleMasteredInBank}
        />
      )}

      {/* 3. Modals */}
      <FlashcardModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        words={todaySet.words}
        completedWordIds={myProgress.completedWordIds || []}
        onToggleMastered={handleToggleMastered}
        onCompleteAll={() => {
          onShowToast('🎉 Chúc mừng bạn đã thuộc toàn bộ từ vựng hôm nay!');
        }}
      />

      <VocabQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        words={todaySet.words}
        onSaveQuizResult={handleSaveQuizResult}
      />

      <WordFormModal
        isOpen={isWordFormOpen}
        onClose={() => {
          setIsWordFormOpen(false);
          setEditingWord(null);
        }}
        editingWord={editingWord}
        onSaveWord={handleSaveWord}
        onBulkImportWords={handleBulkImport}
      />

      <PresetPacksModal
        isOpen={isPresetPacksOpen}
        onClose={() => setIsPresetPacksOpen(false)}
        onApplyPack={handleApplyPresetPack}
      />

      <CoupleRewardModal
        isOpen={isRewardOpen}
        onClose={() => setIsRewardOpen(false)}
        rewardTitle={todaySet.reward?.rewardTitle}
        onSaveReward={handleSaveReward}
      />
    </div>
  );
};
