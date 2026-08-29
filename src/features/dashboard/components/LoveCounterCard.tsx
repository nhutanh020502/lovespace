import React, { useState, useEffect } from 'react';
import { calculateLoveDuration, LoveDuration, formatDateVi } from '../../../utils/dateUtils';
import { Heart, Calendar, Flame } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

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

  return (
    <Card variant="romantic" className="relative overflow-hidden p-5 border border-rose-200/80 shadow-glass">
      {/* Decorative Background Glow */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-rose-400/20 to-pink-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-600">
          <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>Bên Nhau Được</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white/70 px-2.5 py-1 rounded-full border border-rose-100">
          <Calendar className="w-3 h-3 text-rose-400" />
          <span>Từ {formatDateVi(startDate)}</span>
        </div>
      </div>

      {/* Big Number of Days */}
      <div className="flex items-baseline justify-center gap-2 my-2">
        <span className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent tracking-tight">
          {duration.totalDays}
        </span>
        <span className="text-lg font-bold text-rose-600">Ngày</span>
      </div>

      {/* Realtime clock (Hours, Minutes, Seconds) */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-rose-200/50 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl py-2 px-1 border border-rose-100 shadow-sm">
          <span className="text-base sm:text-lg font-extrabold text-slate-800">{String(duration.hours).padStart(2, '0')}</span>
          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Giờ</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl py-2 px-1 border border-rose-100 shadow-sm">
          <span className="text-base sm:text-lg font-extrabold text-slate-800">{String(duration.minutes).padStart(2, '0')}</span>
          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Phút</span>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl py-2 px-1 border border-rose-100 shadow-sm">
          <span className="text-base sm:text-lg font-extrabold text-rose-600">{String(duration.seconds).padStart(2, '0')}</span>
          <span className="block text-[10px] font-semibold text-slate-400 uppercase">Giây</span>
        </div>
      </div>
    </Card>
  );
};
