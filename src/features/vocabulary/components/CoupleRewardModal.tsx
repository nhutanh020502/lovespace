import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Heart, Check } from 'lucide-react';
import { COUPLE_REWARDS_POOL } from '../constants/presetVocabPacks';
import confetti from 'canvas-confetti';

interface CoupleRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  rewardTitle?: string;
  onSaveReward: (title: string) => void;
}

export const CoupleRewardModal: React.FC<CoupleRewardModalProps> = ({
  isOpen,
  onClose,
  rewardTitle,
  onSaveReward
}) => {
  const [isOpened, setIsOpened] = useState(false);
  const [currentReward, setCurrentReward] = useState('');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (rewardTitle) {
        setCurrentReward(rewardTitle);
        setIsOpened(true);
      } else {
        // Bốc ngẫu nhiên một phần thưởng lãng mạn
        const randomGift =
          COUPLE_REWARDS_POOL[Math.floor(Math.random() * COUPLE_REWARDS_POOL.length)];
        setCurrentReward(randomGift);
        setIsOpened(false);
      }
      setIsCustomizing(false);
      setCustomText('');
    }
  }, [isOpen, rewardTitle]);

  if (!isOpen) return null;

  const handleOpenBox = () => {
    setIsOpened(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    onSaveReward(currentReward);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setCurrentReward(customText.trim());
    onSaveReward(customText.trim());
    setIsCustomizing(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-5 text-center flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!isOpened ? (
            /* Hộp quà chưa mở */
            <div className="py-6 space-y-4">
              <motion.div
                animate={{
                  rotate: [-3, 3, -3],
                  scale: [1, 1.05, 1]
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white text-5xl shadow-glow cursor-pointer"
                onClick={handleOpenBox}
              >
                🎁
              </motion.div>

              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Chúc Mừng Hai Đứa! 🎉
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Cả Chồng và Vợ đều đã hoàn thành xuất sắc 10 từ vựng hôm nay! Chạm vào hộp quà để nhận phần thưởng nhé.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleOpenBox}
                className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-sm shadow-glow flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mở Hộp Quà Tình Yêu 🎁</span>
              </motion.button>
            </div>
          ) : (
            /* Hộp quà đã mở */
            <div className="py-6 space-y-4 w-full">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="text-5xl"
              >
                🎊
              </motion.div>

              <div>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-extrabold text-[10px] uppercase tracking-wider">
                  Phiếu Quà Thưởng Hôm Nay
                </span>
                <h3 className="text-xl font-black text-slate-800 mt-2">
                  Phần Thưởng Cặp Đôi 💕
                </h3>
              </div>

              {!isCustomizing ? (
                <div className="p-4 rounded-3xl bg-gradient-to-tr from-rose-50 via-pink-50 to-amber-50 border-2 border-rose-200 shadow-sm space-y-2">
                  <p className="text-base font-black text-rose-600 tracking-tight">
                    {currentReward}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Người hoàn thành trước có quyền yêu cầu đối phương thực hiện quà này nha! 😉
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveCustom} className="space-y-2">
                  <input
                    type="text"
                    required
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Nhập phần thưởng hai đứa muốn..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCustomizing(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-bold text-slate-600"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-rose-500 text-xs font-bold text-white shadow-xs"
                    >
                      Lưu lại
                    </button>
                  </div>
                </form>
              )}

              <div className="flex gap-2 justify-center pt-2">
                {!isCustomizing && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomText(currentReward);
                      setIsCustomizing(true);
                    }}
                    className="text-xs font-bold text-rose-500 hover:text-rose-600 p-2"
                  >
                    Đổi phần thưởng khác ✏️
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-glow hover:opacity-95"
                >
                  Tuyệt vời ✨
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
