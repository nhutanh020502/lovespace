import React, { useState, useEffect } from 'react';
import { calculateLoveDuration, LoveDuration, formatDateVi } from '../../../utils/dateUtils';
import { Heart, Calendar, Flame, Sparkles, Trophy } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { triggerLoveConfetti, triggerCelebration } from '../../../components/ui/ConfettiEffect';
import { motion } from 'framer-motion';

interface LoveCounterCardProps {
  startDate: string;
  onOpenAnniversaryDetails?: () => void;
}

export const LoveCounterCard: React.FC<LoveCounterCardProps> = ({ startDate }) => {
  const [duration, setDuration] = useState<LoveDuration>(() => calculateLoveDuration(startDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(calculateLoveDuration(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  // Tính cột mốc tiếp theo (100 ngày, 1 năm = 365, 500, 1000, 1500, 2000 ngày...)
  const milestones = [100, 365, 500, 730, 1000, 1500, 2000, 3650, 5000];
  const nextMilestone = milestones.find((m) => m > duration.totalDays) || duration.totalDays + 100;
  const prevMilestone = [...milestones].reverse().find((m) => m <= duration.totalDays) || 0;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((duration.totalDays - prevMilestone) / (nextMilestone - prevMilestone)) * 100))
  );

  return (
    <Card
      variant="hologram"
      className="relative overflow-hidden p-5 sm:p-6 border border-rose-200/80 shadow-luxury group select-none"
    >
      {/* Concentric Heartwave Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
        <div className="w-56 h-56 rounded-full border-2 border-rose-400/20 animate-heartwave-1" />
        <div className="w-72 h-72 rounded-full border-2 border-pink-400/15 animate-heartwave-2" />
        <div className="w-96 h-96 rounded-full border-2 border-purple-400/10 animate-heartwave-3" />
      </div>

      {/* Decorative Glow Corner */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-rose-400/25 via-pink-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-rose-600">
          <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>Bên Nhau Được</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-white/85 px-3 py-1 rounded-full border border-rose-200/60 shadow-sm backdrop-blur-md">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          <span>Từ {formatDateVi(startDate)}</span>
        </div>
      </div>

      {/* Big Number of Days with Heartbeat Pop */}
      <div
        onClick={() => {
          triggerLoveConfetti();
        }}
        className="flex items-baseline justify-center gap-2.5 my-2 cursor-pointer group/days active:scale-95 transition-transform"
        title="Bấm để nổ pháo hoa ăn mừng 💕"
      >
        <span className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tighter drop-shadow-sm group-hover/days:scale-105 transition-transform duration-300">
          {duration.totalDays}
        </span>
        <div className="flex flex-col items-start">
          <span className="text-xl sm:text-2xl font-black text-rose-600 tracking-tight">Ngày</span>
          <span className="text-[10px] font-bold text-rose-400 flex items-center gap-0.5">
            <Sparkles className="w-3 h-3 animate-spin-slow" />
            <span>Yêu thương</span>
          </span>
        </div>
      </div>

      {/* Realtime Clock (Hours, Minutes, Seconds with Spring Number Animation) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 pt-3 border-t border-rose-200/50 text-center">
        <div className="bg-white/85 hover:bg-white backdrop-blur-md rounded-2xl py-2 px-1.5 border border-rose-100/90 shadow-sm transition-all">
          <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
            {String(duration.hours).padStart(2, '0')}
          </span>
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Giờ</span>
        </div>

        <div className="bg-white/85 hover:bg-white backdrop-blur-md rounded-2xl py-2 px-1.5 border border-rose-100/90 shadow-sm transition-all">
          <span className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
            {String(duration.minutes).padStart(2, '0')}
          </span>
          <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Phút</span>
        </div>

        <div className="bg-white/85 hover:bg-white backdrop-blur-md rounded-2xl py-2 px-1.5 border border-rose-100/90 shadow-sm transition-all">
          <span className="text-lg sm:text-xl font-black text-rose-600 tracking-tight animate-pulse">
            {String(duration.seconds).padStart(2, '0')}
          </span>
          <span className="block text-[10px] font-extrabold text-rose-400 uppercase tracking-wider">Giây</span>
        </div>
      </div>

      {/* Love Milestone Progress Bar */}
      <div className="mt-3.5 pt-2.5 border-t border-rose-100/80">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Cột mốc kế tiếp: <strong className="text-rose-600">{nextMilestone} Ngày</strong></span>
          </span>
          <span className="text-rose-500 font-extrabold">{progressPercent}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-rose-100/80 overflow-hidden p-0.5 border border-rose-200/50 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 shadow-glow"
          />
        </div>
      </div>
    </Card>
  );
};
