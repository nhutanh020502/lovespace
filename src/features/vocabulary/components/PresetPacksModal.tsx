import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, BookOpen } from 'lucide-react';
import { PRESET_VOCAB_PACKS, PresetVocabPack } from '../constants/presetVocabPacks';
import { VocabWord } from '../../../types/vocab.types';
import { generateUUID } from '../../../utils/uuidUtils';

interface PresetPacksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPack: (words: VocabWord[], packTitle: string, topic: string) => void;
}

export const PresetPacksModal: React.FC<PresetPacksModalProps> = ({
  isOpen,
  onClose,
  onApplyPack
}) => {
  if (!isOpen) return null;

  const handleSelectPack = (pack: PresetVocabPack) => {
    const vocabWords: VocabWord[] = pack.words.map((w) => ({
      ...w,
      id: generateUUID(),
      topic: pack.topic,
      createdAt: new Date().toISOString()
    }));

    onApplyPack(vocabWords, pack.title, pack.topic);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-5 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-glow">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Kho Gói 10 Từ Chọn Lọc Sẵn ✨
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold">
                  Chọn ngay một chủ đề yêu thích để hai đứa cùng học hôm nay
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of Packs */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
            {PRESET_VOCAB_PACKS.map((pack) => (
              <motion.div
                key={pack.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-3xl bg-white border border-rose-100 hover:border-rose-300 shadow-sm transition-all space-y-3 relative overflow-hidden group cursor-pointer"
                onClick={() => handleSelectPack(pack)}
              >
                {/* Background ambient accent */}
                <div
                  className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${pack.gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`}
                />

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-2xl bg-rose-50 border border-rose-100 shadow-xs">
                      {pack.emoji}
                    </span>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                        {pack.title}
                      </h4>
                      <p className="text-[11px] text-rose-500 font-bold">{pack.topic}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-rose-100/80 text-rose-700 text-[10px] font-black">
                    10 Từ
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{pack.description}</p>

                {/* Preview 3 words */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pack.words.slice(0, 3).map((w, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      {w.word} ({w.meaning})
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded-lg bg-slate-50 text-[10px] font-semibold text-slate-400">
                    +7 từ nữa...
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all flex items-center gap-1"
                  >
                    <span>Áp dụng gói này</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
