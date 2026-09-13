import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, Volume2, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { VocabWord } from '../../../types/vocab.types';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import confetti from 'canvas-confetti';

interface VocabQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  words: VocabWord[];
  onSaveQuizResult: (score: number) => void;
}

interface Question {
  word: VocabWord;
  options: string[];
  correctAnswer: string;
}

export const VocabQuizModal: React.FC<VocabQuizModalProps> = ({
  isOpen,
  onClose,
  words,
  onSaveQuizResult
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { speak } = useSpeechPronunciation();

  // Tạo bộ câu hỏi xáo trộn 4 đáp án
  const questions: Question[] = useMemo(() => {
    if (words.length === 0) return [];

    // Fallback meanings nếu danh sách từ ít hơn 4
    const fallbackDistractors = [
      'yêu thương sâu sắc',
      'cảm giác bình yên',
      'chuyến đi ngọt ngào',
      'lời hứa trọn đời',
      'nụ cười tỏa nắng',
      'sự kiên nhẫn dịu dàng',
      'bữa tối lãng mạn',
      'sự âu yếm chân thành'
    ];

    return words.map((targetWord) => {
      const otherMeanings = words
        .filter((w) => w.id !== targetWord.id)
        .map((w) => w.meaning);

      const combinedPool = Array.from(new Set([...otherMeanings, ...fallbackDistractors]));
      // Xáo trộn lấy 3 distractors
      const shuffledDistractors = [...combinedPool]
        .filter((m) => m !== targetWord.meaning)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [targetWord.meaning, ...shuffledDistractors].sort(
        () => 0.5 - Math.random()
      );

      return {
        word: targetWord,
        options,
        correctAnswer: targetWord.meaning
      };
    });
  }, [words]);

  useEffect(() => {
    if (isOpen) {
      setCurrentQIndex(0);
      setSelectedOption(null);
      setScore(0);
      setIsAnswered(false);
      setIsFinished(false);
    }
  }, [isOpen]);

  if (!isOpen || questions.length === 0) return null;

  const currentQ = questions[currentQIndex] || questions[0];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;

    setSelectedOption(opt);
    setIsAnswered(true);

    const isCorrect = opt === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setIsFinished(true);
        const finalScore = isCorrect ? score + 1 : score;
        onSaveQuizResult(finalScore);

        if (finalScore >= 8) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 800);
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswered(false);
    setIsFinished(false);
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
              <div className="p-2 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-glow-amber">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  Thử Thách Trắc Nghiệm Cặp Đôi ⚡
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold">
                  {!isFinished
                    ? `Câu ${currentQIndex + 1} / ${questions.length} • Đúng ${score} câu`
                    : 'Đã hoàn thành bài kiểm tra!'}
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

          {!isFinished ? (
            <div className="py-4 space-y-4 flex-1 flex flex-col justify-between">
              {/* Progress Bar */}
              <div className="w-full bg-rose-100/70 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full"
                  animate={{
                    width: `${((currentQIndex + 1) / questions.length) * 100}%`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-rose-50/70 to-pink-50/50 border border-rose-200/80 text-center space-y-2 relative">
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  {currentQ.word.partOfSpeech || 'Từ Vựng'}
                </span>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                    {currentQ.word.word}
                  </h2>
                  <button
                    type="button"
                    onClick={() => speak(currentQ.word.word)}
                    className="p-1.5 rounded-full bg-white hover:bg-rose-100 text-rose-500 shadow-xs active:scale-95 transition-all"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {currentQ.word.phonetic && (
                  <p className="text-xs font-mono text-rose-500 font-bold">
                    {currentQ.word.phonetic}
                  </p>
                )}

                <p className="text-xs text-slate-500 font-medium pt-1">
                  Nghĩa tiếng Việt chính xác của từ này là gì?
                </p>
              </div>

              {/* 4 Choices */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQ.correctAnswer;

                  let btnStyle = 'bg-white border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-slate-700';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-md';
                    } else {
                      btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-50';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full p-3.5 rounded-2xl border font-bold text-xs sm:text-sm text-left flex items-center justify-between transition-all ${btnStyle}`}
                    >
                      <span className="flex-1 pr-2">{option}</span>
                      {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 shrink-0" />}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Kết quả bài thi */
            <div className="py-6 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-glow-amber text-3xl"
              >
                {score >= 8 ? '🏆' : score >= 5 ? '🎉' : '💪'}
              </motion.div>

              <div>
                <h3 className="text-xl font-black text-slate-800">
                  {score >= 8
                    ? 'Xuất Sắc Quá Cục Yêu Ơi! 🌟'
                    : score >= 5
                    ? 'Khá Lắm Nè! Cố Lên Nhé 💕'
                    : 'Không Sao, Ôn Lại Chút Là Nhớ Ngay! 💖'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Bạn đã trả lời đúng{' '}
                  <strong className="text-rose-600 text-sm font-black">
                    {score}/{questions.length}
                  </strong>{' '}
                  câu hỏi từ vựng hôm nay.
                </p>
              </div>

              <div className="w-full p-3 rounded-2xl bg-rose-50/80 border border-rose-100 text-left text-xs text-slate-600 space-y-1">
                <p className="font-bold text-rose-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Điểm số đã được tự động lưu vào tiến độ!
                </p>
                <p className="text-[11px] text-slate-500">
                  Đối phương sẽ thấy điểm thi của bạn trên bảng tiến độ chung của 2 đứa.
                </p>
              </div>

              <div className="flex gap-2.5 w-full pt-2">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-97"
                >
                  <RotateCcw className="w-4 h-4" /> Làm lại bài
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-glow hover:opacity-95 transition-all active:scale-97"
                >
                  Xong rùi ✨
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
