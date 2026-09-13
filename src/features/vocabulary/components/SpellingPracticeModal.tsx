import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VocabWord } from '../../../types/vocab.types';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import { Volume2, CheckCircle2, XCircle, Sparkles, HelpCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { triggerLoveConfetti } from '../../../components/ui/ConfettiEffect';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface SpellingPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabWord[];
  topicTitle: string;
  onWordMastered?: (wordId: string) => void;
}

export const SpellingPracticeModal: React.FC<SpellingPracticeModalProps> = ({
  isOpen,
  onClose,
  words,
  topicTitle,
  onWordMastered,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const { speak, isSpeaking } = useSpeechPronunciation();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setInputVal('');
      setStatus('idle');
      setRevealedHints(0);
      setCorrectCount(0);
      setIsFinished(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentWord) {
      setInputVal('');
      setStatus('idle');
      setRevealedHints(0);
      // Tự động phát âm khi chuyển sang từ mới
      speak(currentWord.word);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, isOpen]);

  if (!isOpen || words.length === 0) return null;

  const handleCheck = () => {
    if (!currentWord || status !== 'idle') return;
    const cleanInput = inputVal.trim().toLowerCase();
    const target = currentWord.word.trim().toLowerCase();

    if (cleanInput === target) {
      setStatus('correct');
      setCorrectCount((prev) => prev + 1);
      if (onWordMastered) {
        onWordMastered(currentWord.id);
      }

      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setIsFinished(true);
          triggerLoveConfetti();
        }
      }, 1200);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('idle');
        inputRef.current?.focus();
      }, 1200);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCheck();
    }
  };

  const handleHint = () => {
    if (!currentWord) return;
    const target = currentWord.word;
    if (revealedHints < target.length) {
      const nextCount = revealedHints + 1;
      setRevealedHints(nextCount);
      setInputVal(target.slice(0, nextCount));
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setInputVal('');
    setStatus('idle');
    setRevealedHints(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`✍️ Luyện Gõ Từ Vựng: ${topicTitle}`} maxWidth="md">
      {isFinished ? (
        <div className="py-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl shadow-sm animate-bounce">
            🎉
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Hoàn Thành Bài Luyện Gõ!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Bạn đã viết đúng <strong>{correctCount}/{words.length}</strong> từ vựng xuất sắc!
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" fullWidth onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Luyện Lại
            </Button>
            <Button variant="romantic" fullWidth onClick={onClose}>
              Đóng & Xem Tiếp ✨
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {/* Progress header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-rose-100 pb-2">
            <span>
              Từ số <strong className="text-rose-600">{currentIndex + 1}</strong> / {words.length}
            </span>
            <span className="text-emerald-600 font-extrabold">Đúng: {correctCount}</span>
          </div>

          {/* Meaning Prompt Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-rose-50/90 via-pink-50/80 to-purple-50/90 border border-rose-200/80 text-center space-y-2 shadow-sm">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-100 px-2.5 py-0.5 rounded-full inline-block">
              Nghĩa Tiếng Việt
            </span>

            <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
              "{currentWord?.meaning}"
            </h3>

            {currentWord?.partOfSpeech && (
              <span className="text-[11px] font-bold text-slate-400 block italic">
                ({currentWord.partOfSpeech})
              </span>
            )}

            {/* Pronunciation button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => speak(currentWord?.word || '')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSpeaking
                    ? 'bg-rose-500 text-white shadow-glow scale-105'
                    : 'bg-white text-rose-600 hover:bg-rose-100 border border-rose-200 shadow-xs'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>Nghe Phát Âm</span>
              </button>
            </div>
          </div>

          {/* Input Box with Status Animation */}
          <div className="space-y-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Gõ từ tiếng Anh vào đây..."
                disabled={status !== 'idle'}
                className={`w-full text-center text-lg sm:text-xl font-black rounded-2xl px-4 py-3.5 border-2 outline-none transition-all shadow-sm ${
                  status === 'correct'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-4 ring-emerald-200'
                    : status === 'wrong'
                    ? 'border-red-500 bg-red-50 text-red-700 ring-4 ring-red-200 animate-shake'
                    : 'border-rose-300 bg-white text-slate-800 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
                }`}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
              />

              {status === 'correct' && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                  <CheckCircle2 className="w-6 h-6 animate-scale-in" />
                </div>
              )}
              {status === 'wrong' && (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-500">
                  <XCircle className="w-6 h-6 animate-scale-in" />
                </div>
              )}
            </div>

            {status === 'wrong' && (
              <p className="text-xs text-red-600 text-center font-bold animate-fade-in">
                Chưa đúng rồi! Đáp án là: <strong className="underline">{currentWord?.word}</strong>
              </p>
            )}

            {/* Hint and Skip Controls */}
            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={handleHint}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Gợi ý chữ cái ({revealedHints}/{currentWord?.word.length})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (currentIndex < words.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                  } else {
                    setIsFinished(true);
                  }
                }}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600"
              >
                Bỏ qua ➔
              </button>
            </div>
          </div>

          {/* Action button */}
          <Button
            variant="romantic"
            fullWidth
            size="lg"
            onClick={handleCheck}
            disabled={!inputVal.trim() || status !== 'idle'}
            className="shadow-glow"
          >
            {status === 'correct' ? (
              <span>Chính Xác! Tuyệt Vời 🎉</span>
            ) : status === 'wrong' ? (
              <span>Thử Lại Nhé...</span>
            ) : (
              <span>Kiểm Tra Đáp Án 🚀</span>
            )}
          </Button>
        </div>
      )}
    </Modal>
  );
};
