import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  RotateCw,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { VocabWord } from '../../../types/vocab.types';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import confetti from 'canvas-confetti';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabWord[];
  completedWordIds: string[];
  onToggleMastered: (wordId: string) => void;
  onCompleteAll?: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  isOpen,
  onClose,
  words,
  completedWordIds,
  onToggleMastered,
  onCompleteAll
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const { speak, isSpeaking } = useSpeechPronunciation();

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [isOpen]);

  if (!isOpen || words.length === 0) return null;

  const currentWord = words[currentIndex] || words[0];
  const isMastered = completedWordIds.includes(currentWord.id);
  const masteredCount = words.filter((w) => completedWordIds.includes(w.id)).length;
  const progressPercent = Math.round((masteredCount / words.length) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    setDirection('right');
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setDirection('left');
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(words.length - 1);
    }
  };

  const handleToggleKnown = () => {
    onToggleMastered(currentWord.id);
    if (!isMastered) {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 }
      });
      if (masteredCount + 1 === words.length && onCompleteAll) {
        onCompleteAll();
      }
    }
    handleNext();
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(currentWord.word);
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
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-glow">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Flashcard 3D Cặp Đôi 💕
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold">
                  Thẻ {currentIndex + 1} / {words.length} • Đã thuộc {masteredCount}/{words.length} từ
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

          {/* Progress Bar */}
          <div className="w-full bg-rose-100/70 h-2 rounded-full mt-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-rose-500 to-pink-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* 3D Flip Card Container */}
          <div className="py-4 flex-1 flex flex-col items-center justify-center perspective-[1000px] min-h-[310px]">
            <motion.div
              className="relative w-full h-[300px] cursor-pointer select-none"
              onClick={() => setIsFlipped(!isFlipped)}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* MẶT TRƯỚC (Front: Question) */}
              <div
                className="absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-between text-center bg-gradient-to-b from-rose-50/90 via-pink-50/80 to-white border-2 border-rose-200/80 shadow-luxury"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-full flex justify-between items-center text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-rose-100/80 text-rose-700 font-extrabold text-[10px] uppercase tracking-wider">
                    {currentWord.partOfSpeech || 'Từ Vựng'}
                  </span>
                  {isMastered && (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã thuộc
                    </span>
                  )}
                </div>

                <div className="my-auto space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                    {currentWord.word}
                  </h2>

                  {currentWord.phonetic && (
                    <p className="text-sm font-mono text-rose-500 font-bold tracking-wide">
                      {currentWord.phonetic}
                    </p>
                  )}

                  {/* Button Phát Âm */}
                  <div className="pt-2">
                    <button
                      onClick={handleSpeak}
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 ${
                        isSpeaking
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-white text-rose-600 hover:bg-rose-100/70 border border-rose-200'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{isSpeaking ? 'Đang phát âm...' : 'Nghe phát âm'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Chạm vào thẻ để lật xem nghĩa tiếng Việt & ví dụ
                </p>
              </div>

              {/* MẶT SAU (Back: Answer) */}
              <div
                className="absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-between text-center bg-gradient-to-b from-white via-rose-50/70 to-pink-50 border-2 border-rose-300 shadow-luxury"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="w-full flex justify-between items-center text-xs">
                  <span className="text-xs font-bold text-rose-500">Mặt Đáp Án</span>
                  <button
                    onClick={handleSpeak}
                    type="button"
                    className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="my-auto space-y-3 w-full px-2">
                  <h3 className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">
                    {currentWord.meaning}
                  </h3>

                  {currentWord.example && (
                    <div className="p-3 rounded-2xl bg-white/80 border border-rose-100 shadow-xs text-left">
                      <p className="text-xs font-semibold text-slate-700 italic">
                        "{currentWord.example}"
                      </p>
                      {currentWord.exampleMeaning && (
                        <p className="text-[11px] text-slate-500 mt-1">
                          👉 {currentWord.exampleMeaning}
                        </p>
                      )}
                    </div>
                  )}

                  {currentWord.memoryTip && (
                    <p className="text-[11px] text-amber-700 bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-200/70 font-medium text-left">
                      💡 <strong>Mẹo nhớ:</strong> {currentWord.memoryTip}
                    </p>
                  )}
                </div>

                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <RotateCw className="w-3 h-3" /> Chạm lại để lật về từ tiếng Anh
                </p>
              </div>
            </motion.div>
          </div>

          {/* Navigation and Action Controls */}
          <div className="pt-2 space-y-2.5">
            {/* Buttons: Chưa Thuộc / Đã Thuộc */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleNext}
                className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-97"
              >
                <span>Chưa thuộc 🥺</span>
              </button>

              <button
                type="button"
                onClick={handleToggleKnown}
                className={`py-3 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-97 shadow-md ${
                  isMastered
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow hover:opacity-95'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isMastered ? 'Đã thuộc làu làu ✨' : 'Đánh dấu ĐÃ THUỘC ✨'}</span>
              </button>
            </div>

            {/* Previous / Next Arrow Bar */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handlePrev}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 p-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Thẻ trước</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 p-1.5"
              >
                <span>Thẻ kế tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
