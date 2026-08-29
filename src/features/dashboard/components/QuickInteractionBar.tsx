import React from 'react';
import { Heart, Sparkles, GlassWater, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

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
    {
      label: 'Thả Tim',
      icon: Heart,
      color: 'text-rose-500 from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border-rose-200 shadow-rose-200/50',
      iconClass: 'fill-rose-500 animate-heartbeat',
      action: onPokeHeart,
    },
    {
      label: 'Hôn Nè 💋',
      icon: Sparkles,
      color: 'text-pink-600 from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-pink-200 shadow-pink-200/50',
      iconClass: 'animate-spin-slow',
      action: onSendKiss,
    },
    {
      label: 'Uống Nước',
      icon: GlassWater,
      color: 'text-blue-500 from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200 shadow-blue-200/50',
      iconClass: 'animate-bounce',
      action: onRemindWater,
    },
    {
      label: 'Ôm Cái 🫂',
      icon: HeartHandshake,
      color: 'text-amber-500 from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200 shadow-amber-200/50',
      iconClass: 'animate-pulse',
      action: onSendHug,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {interactions.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.button
            key={index}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            onClick={item.action}
            className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border bg-gradient-to-b shadow-sm hover:shadow-md transition-all duration-200 ${item.color}`}
          >
            <div className="p-1.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm mb-1">
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.iconClass}`} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-tight">{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
