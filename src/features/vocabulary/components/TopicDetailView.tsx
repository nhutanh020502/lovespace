import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Plus,
  Search,
  Volume2,
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Sparkles,
  BookOpen,
  Trophy,
  BrainCircuit,
  Gift,
  Send,
  HelpCircle,
  RotateCcw,
  Check,
  Zap,
} from 'lucide-react';
import { VocabTopic, VocabWord } from '../../../types/vocab.types';
import { UserRole, UserProfile } from '../../../types/common.types';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { FlashcardModal } from './FlashcardModal';
import { VocabQuizModal } from './VocabQuizModal';
import { SpellingPracticeModal } from './SpellingPracticeModal';
import { WordFormModal } from './WordFormModal';
import { TopicModal } from './TopicModal';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import { triggerLoveConfetti } from '../../../components/ui/ConfettiEffect';

interface TopicDetailViewProps {
  topic: VocabTopic;
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  onBack: () => void;
  onUpdateTopic: (updated: VocabTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onNudgePartner: () => void;
  onShowToast: (msg: string) => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  currentRole,
  partner1,
  partner2,
  onBack,
  onUpdateTopic,
  onDeleteTopic,
  onNudgePartner,
  onShowToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'mastered'>('all');

  // Modals
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isSpellingOpen, setIsSpellingOpen] = useState(false);
  const [isWordFormOpen, setIsWordFormOpen] = useState(false);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<VocabWord | null>(null);

  const { speak, isSpeaking } = useSpeechPronunciation();

  const me = currentRole === 'husband' ? partner1 : partner2;
  const partner = currentRole === 'husband' ? partner2 : partner1;

  // Tính tiến độ thuộc bài của Chồng và Vợ
  const words = topic.words || [];
  const totalWords = words.length;

  const husbandMastered = useMemo(() => {
    return words.filter((w) => (w.masteredBy || []).includes('husband')).length;
  }, [words]);

  const wifeMastered = useMemo(() => {
    return words.filter((w) => (w.masteredBy || []).includes('wife')).length;
  }, [words]);

  const husbandPercent = totalWords > 0 ? Math.round((husbandMastered / totalWords) * 100) : 0;
  const wifePercent = totalWords > 0 ? Math.round((wifeMastered / totalWords) * 100) : 0;

  const myMasteredCount = currentRole === 'husband' ? husbandMastered : wifeMastered;
  const myCompletedWordIds = useMemo(() => {
    return words
      .filter((w) => (w.masteredBy || []).includes(currentRole))
      .map((w) => w.id);
  }, [words, currentRole]);

  // Lọc từ vựng
  const filteredWords = useMemo(() => {
    return words.filter((w) => {
      const isMasteredByMe = (w.masteredBy || []).includes(currentRole);
      if (filterMode === 'mastered' && !isMasteredByMe) return false;
      if (filterMode === 'unmastered' && isMasteredByMe) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        (w.phonetic && w.phonetic.toLowerCase().includes(q)) ||
        (w.example && w.example.toLowerCase().includes(q))
      );
    });
  }, [words, filterMode, searchQuery, currentRole]);

  // Toggle trạng thái đã thuộc từ cho vai hiện tại
  const handleToggleMastered = (wordId: string) => {
    const updatedWords = words.map((w) => {
      if (w.id !== wordId) return w;
      const currentList = w.masteredBy || [];
      const hasMastered = currentList.includes(currentRole);
      const nextList = hasMastered
        ? currentList.filter((r) => r !== currentRole)
        : [...currentList, currentRole];

      return {
        ...w,
        masteredBy: nextList,
      };
    });

    const isNowMastered = !(words.find((w) => w.id === wordId)?.masteredBy || []).includes(currentRole);

    onUpdateTopic({
      ...topic,
      words: updatedWords,
      updatedAt: new Date().toISOString(),
    });

    if (isNowMastered) {
      onShowToast(`Đã thuộc từ vựng! 🎉`);
    }
  };

  // Thêm / sửa từ
  const handleSaveWord = (wordData: VocabWord) => {
    let updatedWords: VocabWord[];
    if (editingWord) {
      updatedWords = words.map((w) => (w.id === wordData.id ? { ...w, ...wordData } : w));
      onShowToast('Đã cập nhật từ vựng!');
    } else {
      updatedWords = [wordData, ...words];
      onShowToast('Đã thêm từ mới vào chủ đề! ✨');
      triggerLoveConfetti();
    }

    onUpdateTopic({
      ...topic,
      words: updatedWords,
      updatedAt: new Date().toISOString(),
    });
    setEditingWord(null);
  };

  // Dán nhanh hàng loạt từ
  const handleBulkImport = (newWords: VocabWord[]) => {
    const updatedWords = [...newWords, ...words];
    onUpdateTopic({
      ...topic,
      words: updatedWords,
      updatedAt: new Date().toISOString(),
    });
    onShowToast(`Đã thêm nhanh ${newWords.length} từ vào chủ đề! 🚀`);
    triggerLoveConfetti();
  };

  // Xóa từ
  const handleDeleteWord = (wordId: string) => {
    const updatedWords = words.filter((w) => w.id !== wordId);
    onUpdateTopic({
      ...topic,
      words: updatedWords,
      updatedAt: new Date().toISOString(),
    });
    onShowToast('Đã xóa từ vựng.');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Header Bar with Back Button & Topic Meta */}
      <div className="flex items-center justify-between gap-2 p-3 sm:p-4 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-200/80 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors shrink-0 cursor-pointer"
            title="Quay lại danh sách chủ đề"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl select-none shrink-0">{topic.emoji || '📚'}</span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight truncate">
                {topic.title}
              </h2>
            </div>
            {topic.description && (
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                {topic.description}
              </p>
            )}
          </div>
        </div>

        {/* Nút sửa / xóa chủ đề */}
        <div className="flex items-center gap-1 shrink-0">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsEditTopicOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Chỉnh sửa chủ đề"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (window.confirm(`Bạn có chắc muốn xóa chủ đề "${topic.title}" cùng toàn bộ từ vựng bên trong?`)) {
                onDeleteTopic(topic.id);
                onBack();
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            title="Xóa chủ đề này"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 2. Bảng Thi Đua Cặp Đôi (Couple Progress Comparison) */}
      <Card variant="glass" className="p-4 sm:p-5 border border-white/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Tiến Độ Thuộc Bài: Chồng 🐻 vs Vợ 🐰</span>
          </span>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={onNudgePartner}
            className="flex items-center gap-1 text-[11px] font-black text-rose-600 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200 transition-colors shadow-xs cursor-pointer"
            title="Giục người yêu vào cùng học"
          >
            <Send className="w-3 h-3" />
            <span>Ủn mông {partner.nickname} 🚀</span>
          </motion.button>
        </div>

        {/* Progress Bars */}
        <div className="space-y-2.5">
          {/* Chồng */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <span>🐻 Chồng:</span>
                <span className="text-rose-600 font-extrabold">{husbandMastered}/{totalWords} từ</span>
              </span>
              <span className="text-rose-500 font-extrabold">{husbandPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: husbandPercent / 100 }}
                style={{ transformOrigin: 'left' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              />
            </div>
          </div>

          {/* Vợ */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
              <span className="flex items-center gap-1">
                <span>🐰 Vợ:</span>
                <span className="text-pink-600 font-extrabold">{wifeMastered}/{totalWords} từ</span>
              </span>
              <span className="text-pink-500 font-extrabold">{wifePercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden p-0.5 border border-slate-200/60">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: wifePercent / 100 }}
                style={{ transformOrigin: 'left' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="h-full w-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
              />
            </div>
          </div>
        </div>

        {/* Reward Unlocked Banner (if any reward title configured) */}
        {topic.reward?.rewardTitle && (
          <div className="mt-2 p-2.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-700 font-medium">
                Phần thưởng khi cả 2 thuộc 100%: <strong>{topic.reward.rewardTitle}</strong>
              </span>
            </div>
            {husbandPercent === 100 && wifePercent === 100 && totalWords > 0 && (
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full shrink-0">
                🎉 Đã Mở Khóa!
              </span>
            )}
          </div>
        )}
      </Card>

      {/* 3. Chế Độ Học Tập (3 Learning Modes Action Buttons) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Flashcard 3D */}
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={() => {
            if (totalWords === 0) {
              onShowToast('Vui lòng thêm từ vựng vào chủ đề trước khi học thẻ!');
              return;
            }
            setIsFlashcardOpen(true);
          }}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow cursor-pointer select-none"
        >
          <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md mb-1.5">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-tight text-center">
            Thẻ 3D
          </span>
          <span className="text-[10px] text-rose-100 font-medium hidden xs:block">
            Lật mặt & Nghe
          </span>
        </motion.button>

        {/* Mini Quiz */}
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={() => {
            if (totalWords === 0) {
              onShowToast('Vui lòng thêm từ vựng vào chủ đề trước khi làm trắc nghiệm!');
              return;
            }
            setIsQuizOpen(true);
          }}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-md cursor-pointer select-none"
        >
          <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md mb-1.5">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-tight text-center">
            Trắc Nghiệm
          </span>
          <span className="text-[10px] text-purple-100 font-medium hidden xs:block">
            Chọn 4 đáp án
          </span>
        </motion.button>

        {/* Luyện Gõ Từ (Spelling) */}
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={() => {
            if (totalWords === 0) {
              onShowToast('Vui lòng thêm từ vựng vào chủ đề trước khi luyện gõ!');
              return;
            }
            setIsSpellingOpen(true);
          }}
          className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md cursor-pointer select-none"
        >
          <div className="p-2 rounded-2xl bg-white/20 backdrop-blur-md mb-1.5">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-xs sm:text-sm font-black tracking-tight text-center">
            Luyện Gõ
          </span>
          <span className="text-[10px] text-emerald-100 font-medium hidden xs:block">
            Viết chuẩn chính tả
          </span>
        </motion.button>
      </div>

      {/* 4. Quản Lý Danh Sách Từ Vựng Trong Chủ Đề */}
      <div className="space-y-3">
        {/* Toolbar: Search, Filters & Add Word Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm từ tiếng Anh, nghĩa tiếng Việt..."
              className="w-full bg-white/90 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-400 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 justify-between sm:justify-end">
            {/* Filter Pills */}
            <div className="flex p-1 bg-white/80 rounded-2xl border border-slate-200/80 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  filterMode === 'all'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                Tất cả ({totalWords})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('unmastered')}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  filterMode === 'unmastered'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                Chưa thuộc ({totalWords - myMasteredCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('mastered')}
                className={`px-2.5 py-1 rounded-xl transition-all ${
                  filterMode === 'mastered'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                Đã thuộc ({myMasteredCount})
              </button>
            </div>

            {/* Nút Thêm Từ */}
            <Button
              variant="romantic"
              size="sm"
              onClick={() => {
                setEditingWord(null);
                setIsWordFormOpen(true);
              }}
              className="shadow-xs shrink-0"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>Thêm Từ</span>
            </Button>
          </div>
        </div>

        {/* Danh sách từ vựng */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white/60 backdrop-blur-md rounded-3xl border-2 border-dashed border-rose-200/80 space-y-2">
            <span className="text-3xl block">📖</span>
            <h4 className="text-sm font-black text-slate-800">
              {words.length === 0 ? 'Chủ đề này chưa có từ vựng nào' : 'Không tìm thấy từ vựng phù hợp'}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {words.length === 0
                ? 'Hãy bấm nút "+ Thêm Từ" ở trên để tự tạo từng từ hoặc dán nhanh hàng loạt 10-20 từ nhé!'
                : 'Thử đổi từ khóa tìm kiếm hoặc chọn bộ lọc "Tất cả".'}
            </p>
            {words.length === 0 && (
              <Button
                variant="romantic"
                size="sm"
                onClick={() => {
                  setEditingWord(null);
                  setIsWordFormOpen(true);
                }}
                className="mt-2 shadow-glow"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm Từ Ngay ✨
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredWords.map((item, index) => {
              const isMasteredByMe = (item.masteredBy || []).includes(currentRole);
              const isHusbandDone = (item.masteredBy || []).includes('husband');
              const isWifeDone = (item.masteredBy || []).includes('wife');

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isMasteredByMe
                      ? 'bg-emerald-50/50 border-emerald-200/80 shadow-xs'
                      : 'bg-white/95 border-rose-100 hover:border-rose-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Tickbox mastered */}
                    <button
                      type="button"
                      onClick={() => handleToggleMastered(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0 cursor-pointer"
                      title={isMasteredByMe ? 'Bấm để đánh dấu chưa thuộc' : 'Bấm để đánh dấu đã thuộc'}
                    >
                      {isMasteredByMe ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    {/* Word Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h4 className="text-base font-black text-slate-800 tracking-tight">
                          {item.word}
                        </h4>

                        {item.phonetic && (
                          <span className="text-xs text-rose-500 font-mono font-bold">
                            {item.phonetic}
                          </span>
                        )}

                        {item.partOfSpeech && (
                          <span className="text-[10px] text-slate-400 font-bold italic bg-slate-100 px-1.5 py-0.2 rounded-md">
                            {item.partOfSpeech}
                          </span>
                        )}

                        {/* Button phát âm */}
                        <button
                          type="button"
                          onClick={() => speak(item.word)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Phát âm từ này"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Nghĩa tiếng Việt */}
                      <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
                        {item.meaning}
                      </p>

                      {/* Ví dụ */}
                      {item.example && (
                        <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          "{item.example}"
                          {item.exampleMeaning && (
                            <span className="block text-slate-400 not-italic mt-0.5">
                              ➔ {item.exampleMeaning}
                            </span>
                          )}
                        </p>
                      )}

                      {/* Mẹo nhớ */}
                      {item.memoryTip && (
                        <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg inline-block mt-1.5 border border-amber-100">
                          💡 {item.memoryTip}
                        </p>
                      )}

                      {/* Badges who mastered */}
                      <div className="flex items-center gap-2 mt-2 pt-1 border-t border-slate-100 text-[10px] font-bold">
                        <span className="text-slate-400">Trạng thái:</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md ${
                            isHusbandDone ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          🐻 Chồng {isHusbandDone ? '✓' : '...'}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded-md ${
                            isWifeDone ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          🐰 Vợ {isWifeDone ? '✓' : '...'}
                        </span>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete Word */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWord(item);
                          setIsWordFormOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Sửa từ này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Xóa từ "${item.word}" khỏi chủ đề này?`)) {
                            handleDeleteWord(item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa từ này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* 1. Modal Thẻ Flashcard 3D */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        words={words}
        completedWordIds={myCompletedWordIds}
        onToggleMastered={handleToggleMastered}
      />

      {/* 2. Modal Mini Quiz */}
      <VocabQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        words={words}
        onSaveQuizResult={(score) => {
          onShowToast(`Đã hoàn thành Quiz với điểm số: ${score}/${words.length}! 🎉`);
        }}
      />

      {/* 3. Modal Luyện Gõ Từ Vựng */}
      <SpellingPracticeModal
        isOpen={isSpellingOpen}
        onClose={() => setIsSpellingOpen(false)}
        words={words}
        topicTitle={topic.title}
        onWordMastered={handleToggleMastered}
      />

      {/* 4. Modal Thêm / Sửa Từ Vựng */}
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

      {/* 5. Modal Chỉnh Sửa Chủ Đề */}
      <TopicModal
        isOpen={isEditTopicOpen}
        onClose={() => setIsEditTopicOpen(false)}
        topicToEdit={topic}
        onSave={(data) => {
          onUpdateTopic({
            ...topic,
            ...data,
            reward: data.rewardTitle
              ? {
                  rewardTitle: data.rewardTitle,
                  isUnlocked: topic.reward?.isUnlocked || false,
                }
              : undefined,
            updatedAt: new Date().toISOString(),
          });
          onShowToast('Đã lưu chỉnh sửa chủ đề!');
        }}
      />
    </div>
  );
};
