import React from 'react';
import { AlertCircle, Coffee, HeartHandshake, Smile, ArrowRight } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

interface SOSRescueBannerProps {
  favoriteFood?: string;
  onOpenPlaces: () => void;
  onSendHug: () => void;
}

export const SOSRescueBanner: React.FC<SOSRescueBannerProps> = ({
  favoriteFood = 'Trà sữa olong nướng 50% đường',
  onOpenPlaces,
  onSendHug
}) => {
  return (
    <Card variant="romantic" className="p-4 border-2 border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-rose-50/90 to-pink-50/90 shadow-md">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-sm">
          <AlertCircle className="w-5 h-5 animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
              🚨 CẤP CỨU: NGƯỜI YÊU ĐANG DỖI!
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 mt-1 leading-relaxed">
            Bí kíp dỗ dành khẩn cấp: <strong>1. Tuyệt đối không cãi lý</strong> &bull; <strong>2. Đặt ngay món khoái khẩu!</strong>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={onOpenPlaces}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-rose-700 text-xs font-bold shadow-sm border border-rose-200 hover:bg-rose-50 active:scale-95 transition-all"
            >
              <Coffee className="w-3.5 h-3.5 text-rose-500" />
              <span>Mua món khoái khẩu</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={onSendHug}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-sm hover:bg-amber-600 active:scale-95 transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Gửi Cái Ôm Dỗ Dành 🫂</span>
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};
