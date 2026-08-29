import React from 'react';
import { Heart, Sparkles, GlassWater, HeartHandshake, Flame } from 'lucide-react';

interface QuickInteractionBarProps {
  onPokeHeart: () => void;
  onSendKiss: () => void;
  onRemindWater: () => void;
  onSendHug: () => void;
}

export const QuickInteractionBar: React.FC<QuickInteractionBarProps> = ({
  onPokeHeart,
  onSendKiss,
  onRemindWater,
  onSendHug,
}) => {
  const interactions = [
    { label: 'Thả Tim', icon: Heart, color: 'text-rose-500 bg-rose-50 hover:bg-rose-100 border-rose-200', action: onPokeHeart },
    { label: 'Hôn Nè 💋', icon: Sparkles, color: 'text-pink-500 bg-pink-50 hover:bg-pink-100 border-pink-200', action: onSendKiss },
    { label: 'Uống Nước', icon: GlassWater, color: 'text-blue-500 bg-blue-50 hover:bg-blue-100 border-blue-200', action: onRemindWater },
    { label: 'Ôm Cái 🫂', icon: HeartHandshake, color: 'text-amber-500 bg-amber-50 hover:bg-amber-100 border-amber-200', action: onSendHug },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {interactions.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={item.action}
            className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border shadow-sm active:scale-90 transition-all duration-150 ${item.color}`}
          >
            <Icon className="w-5 h-5 mb-1 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
