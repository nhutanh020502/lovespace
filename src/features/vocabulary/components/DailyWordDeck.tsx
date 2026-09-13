import React from 'react';
import { motion } from 'framer-motion';
import {
  Volume2,
  CheckCircle2,
  Circle,
  Plus,
  BookOpen,
  Sparkles,
  Zap,
  Gift,
  BellRing,
  Edit2,
  Trash2,
  Flame,
  Layers
} from 'lucide-react';
import { VocabWord, DailyVocabSet } from '../../../types/vocab.types';
import { UserRole, UserProfile } from '../../../types/common.types';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import { Avatar } from '../../../components/ui/Avatar';
import { Card } from '../../../components/ui/Card';

interface DailyWordDeckProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  dailySet: DailyVocabSet;
  onToggleMastered: (wordId: string) => void;
  onOpenFlashcards: () => void;
  onOpenQuiz: () => void;
  onOpenWordForm: (editingWord?: VocabWord) => void;
  onOpenPresetPacks: () => void;
  onOpenRewardModal: () => void;
  onDeleteWord: (wordId: string) => void;
  onNudgePartner: () => void;
}

export const DailyWordDeck: React.FC<DailyWordDeckProps> = ({
  currentRole,
  partner1,
  partner2,
  dailySet,
  onToggleMastered,
  onOpenFlashcards,
  onOpenQuiz,
  onOpenWordForm,
  onOpenPresetPacks,
  onOpenRewardModal,
  onDeleteWord,
  onNudgePartner
}) => {
  const { speak, isSpeaking } = useSpeechPronunciation();

  const words = dailySet.words || [];
  const totalWords = words.length;

  const husbandProgress = dailySet.partner1Progress || {
    completedWordIds: [],
    isCompleted: false,
    score: 0
  };
  const wifeProgress = dailySet.partner2Progress || {
    completedWordIds: [],
    isCompleted: false,
    score: 0
  };

  const husbandCompletedCount = (husbandProgress.completedWordIds || []).length;
  const wifeCompletedCount = (wifeProgress.completedWordIds || []).length;

  const husbandPercent = totalWords > 0 ? Math.round((husbandCompletedCount / totalWords) * 100) : 0;
  const wifePercent = totalWords > 0 ? Math.round((wifeCompletedCount / totalWords) * 100) : 0;

  const myProgress = currentRole === 'husband' ? husbandProgress : wifeProgress;
  const partnerProgress = currentRole === 'husband' ? wifeProgress : husbandProgress;
  const partnerProfile = currentRole === 'husband' ? partner2 : partner1;

  const isBothCompleted =
    totalWords > 0 &&
    husbandCompletedCount === totalWords &&
    wifeCompletedCount === totalWords;

  return (
    <div className="space-y-4">
      {/* 1. Bảng Thi Đua & Tiến Độ Chồng 🐻 vs Vợ 🐰 */}
      <Card variant="glass" className="p-4 sm:p-5 border border-white/80 shadow-glass-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-glow">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">
                Tiến Độ Học Từ Vựng Hôm Nay 💕
              </h3>
              <p className="text-[11px] text-slate-400">
                {dailySet.title || '10 Từ Mỗi Ngày'} • {totalWords} từ
              </p>
            </div>
          </div>

          {/* Nút Chọn Gói / Thêm Từ */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenPresetPacks}
              className="py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold text-[11px] border border-purple-200/60 transition-all active:scale-95 flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Gói Có Sẵn</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenWordForm()}
              className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] border border-rose-200/60 transition-all active:scale-95 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Từ</span>
            </button>
          </div>
        </div>

        {/* Thanh Tiến Độ Đôi: Chồng vs Vợ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Chồng Progress */}
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={partner1.avatar}
                  alt={partner1.nickname}
                  size="sm"
                  badge="🐻"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">{partner1.nickname}</p>
                  <p className="text-[10px] text-slate-400">
                    {husbandCompletedCount === totalWords && totalWords > 0
                      ? 'Đã xong 100% ✨'
                      : `Đã thuộc ${husbandCompletedCount}/${totalWords} từ`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-rose-500">{husbandPercent}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-full rounded-full"
                animate={{ width: `${husbandPercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Vợ Progress */}
          <div className="p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar
                  src={partner2.avatar}
                  alt={partner2.nickname}
                  size="sm"
                  badge="🐰"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">{partner2.nickname}</p>
                  <p className="text-[10px] text-slate-400">
                    {wifeCompletedCount === totalWords && totalWords > 0
                      ? 'Đã xong 100% ✨'
                      : `Đã thuộc ${wifeCompletedCount}/${totalWords} từ`}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-rose-500">{wifePercent}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-pink-400 to-rose-500 h-full rounded-full"
                animate={{ width: `${wifePercent}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
        </div>

        {/* Nút Ủn Mông Hoặc Banner Hoàn Thành */}
        {isBothCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-amber-200/80 flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="text-xs font-black text-slate-800">
                  Cả hai đã thuộc hết 10 từ hôm nay! 🎉
                </p>
                <p className="text-[11px] text-rose-600 font-medium">
                  {dailySet.reward?.rewardTitle || 'Chạm vào hộp quà để xem phần thưởng tình yêu!'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenRewardModal}
              className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Xem Quà</span>
            </button>
          </motion.div>
        ) : (
          !partnerProgress.isCompleted &&
          totalWords > 0 && (
            <div className="pt-1 flex items-center justify-between p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-xs">
              <span className="text-slate-600 text-[11px] font-medium flex items-center gap-1">
                💬 {partnerProfile.nickname} vẫn chưa hoàn thành 10 từ nè!
              </span>
              <button
                type="button"
                onClick={onNudgePartner}
                className="py-1 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] shadow-xs transition-all active:scale-95 flex items-center gap-1"
              >
                <BellRing className="w-3 h-3" />
                <span>Ủn mông học bài 🚀</span>
              </button>
            </div>
          )
        )}
      </Card>

      {/* 2. Thanh Nút Chế Độ Học Tập (Flashcard 3D & Mini Quiz) */}
      {totalWords > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenFlashcards}
            className="p-3.5 rounded-3xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-luxury flex items-center justify-center gap-2 font-bold text-xs sm:text-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lật Thẻ Flashcard 3D 🎴</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={onOpenQuiz}
            className="p-3.5 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow-amber flex items-center justify-center gap-2 font-bold text-xs sm:text-sm cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Thử Thách Trắc Nghiệm ⚡</span>
          </motion.button>
        </div>
      )}

      {/* 3. Danh Sách Các Từ Của Hôm Nay */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black text-slate-700 tracking-wide uppercase">
            Danh Sách 10 Từ ({totalWords} từ)
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">
            Tick vào hình tròn để đánh dấu đã thuộc
          </span>
        </div>

        {totalWords === 0 ? (
          /* Trạng thái rỗng khi chưa có từ nào hôm nay */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 px-4 bg-white/70 backdrop-blur-sm rounded-3xl border-2 border-dashed border-rose-200/80 space-y-3"
          >
            <span className="text-4xl block">📚</span>
            <div>
              <p className="text-sm font-black text-slate-800">
                Hôm nay chưa có bộ 10 từ vựng nào!
              </p>
              <p className="text-xs text-slate-400 mt-0.5 max-w-sm mx-auto">
                Hãy chọn ngay một gói có sẵn siêu hay hoặc tự dán 10 từ vào để hai đứa cùng học nhé!
              </p>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={onOpenPresetPacks}
                className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs shadow-glow flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Chọn Gói Có Sẵn ✨</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenWordForm()}
                className="py-2.5 px-4 rounded-2xl bg-white border border-rose-200 text-rose-600 font-bold text-xs shadow-sm hover:bg-rose-50 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Nhập Nhanh 10 Từ</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Danh sách các từ */
          <div className="space-y-2.5">
            {words.map((item, idx) => {
              const isMastered = (myProgress.completedWordIds || []).includes(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3.5 rounded-3xl border transition-all ${
                    isMastered
                      ? 'bg-white/90 border-emerald-200 shadow-xs'
                      : 'bg-white/80 border-slate-100 shadow-sm hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    {/* Tick Checkbox */}
                    <button
                      type="button"
                      onClick={() => onToggleMastered(item.id)}
                      className="mt-0.5 p-1 rounded-full text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                    >
                      {isMastered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </button>

                    {/* Word Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h5 className="text-base font-black text-slate-800 tracking-tight">
                          {item.word}
                        </h5>

                        {item.phonetic && (
                          <span className="text-xs font-mono font-bold text-rose-500">
                            {item.phonetic}
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase">
                          {item.partOfSpeech || 'Từ Vựng'}
                        </span>

                        {/* Button Loa Phát Âm */}
                        <button
                          type="button"
                          onClick={() => speak(item.word)}
                          title="Phát âm tiếng Anh chuẩn"
                          className="p-1 rounded-full text-rose-500 hover:bg-rose-50 transition-colors active:scale-90"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs font-bold text-rose-600 leading-snug">
                        {item.meaning}
                      </p>

                      {item.example && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                          "{item.example}"
                          {item.exampleMeaning && (
                            <span className="text-slate-400 not-italic block mt-0.5">
                              👉 {item.exampleMeaning}
                            </span>
                          )}
                        </p>
                      )}

                      {item.memoryTip && (
                        <p className="text-[10px] text-amber-700 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/60 inline-block mt-1 font-medium">
                          💡 {item.memoryTip}
                        </p>
                      )}
                    </div>

                    {/* Edit & Delete Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenWordForm(item)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                        title="Sửa từ"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteWord(item.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa từ"
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
    </div>
  );
};
