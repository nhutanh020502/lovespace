import React from 'react';
import { Home, HeartPulse, MessageCircleHeart, UtensilsCrossed, Images, CalendarHeart, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export type TabType = 'home' | 'plans' | 'chat' | 'vocab' | 'health' | 'places' | 'memories';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Trang Chủ', icon: Home },
    { id: 'plans' as TabType, label: 'Kế Hoạch', icon: CalendarHeart },
    { id: 'chat' as TabType, label: 'Nhắn Tin', icon: MessageCircleHeart, badge: unreadCount },
    { id: 'vocab' as TabType, label: 'Học Tập', icon: GraduationCap },
    { id: 'health' as TabType, label: 'Sức Khỏe', icon: HeartPulse },
    { id: 'places' as TabType, label: 'Ăn Uống', icon: UtensilsCrossed },
    { id: 'memories' as TabType, label: 'Kỷ Niệm', icon: Images },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 px-2 sm:px-3 pointer-events-none flex justify-center safe-bottom">
      <nav className="pointer-events-auto floating-dock rounded-full px-1.5 sm:px-2.5 py-1 sm:py-1.5 max-w-lg w-full flex items-center justify-around shadow-luxury border border-white/80">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-1.5 sm:px-2.5 rounded-full transition-colors cursor-pointer select-none',
                isActive ? 'text-rose-600 font-extrabold' : 'text-slate-400 hover:text-slate-600 font-semibold'
              )}
            >
              {/* Fluid Sliding Active Indicator with Spring Motion */}
              {isActive && (
                <motion.div
                  layoutId="activeNavBubble"
                  className="absolute inset-0 bg-gradient-to-tr from-rose-100/90 via-pink-100/80 to-rose-50/90 rounded-full -z-10 shadow-sm border border-rose-200/50"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <motion.div
                  animate={isActive ? { scale: [1, 1.2, 1], rotate: [0, -6, 6, 0] } : { scale: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <Icon
                    className={clsx(
                      'w-4.5 h-4.5 sm:w-5 sm:h-5 transition-colors',
                      isActive ? 'stroke-[2.5px] text-rose-600 drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]' : 'text-slate-400'
                    )}
                  />
                </motion.div>

                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <span className="text-[9px] sm:text-[10.5px] mt-0.5 tracking-tight">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
};
