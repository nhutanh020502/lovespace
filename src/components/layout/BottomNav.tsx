import React from 'react';
import { Home, HeartPulse, MessageCircleHeart, UtensilsCrossed, Images } from 'lucide-react';
import { clsx } from 'clsx';

export type TabType = 'home' | 'health' | 'chat' | 'places' | 'memories';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadCount = 0
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Trang Chủ', icon: Home },
    { id: 'health' as TabType, label: 'Sức Khỏe', icon: HeartPulse },
    { id: 'chat' as TabType, label: 'Nhắn Tin', icon: MessageCircleHeart, badge: unreadCount },
    { id: 'places' as TabType, label: 'Ăn Uống', icon: UtensilsCrossed },
    { id: 'memories' as TabType, label: 'Kỷ Niệm', icon: Images },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-nav safe-bottom transition-all">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-1.5 sm:py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={clsx(
                'relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 cursor-pointer active:scale-90',
                isActive
                  ? 'text-rose-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-700 font-medium'
              )}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <div className="absolute inset-0 bg-rose-100/70 rounded-2xl -z-10 shadow-sm shadow-rose-200/50" />
              )}

              <div className="relative">
                <Icon className={clsx('w-5 h-5 transition-transform', isActive && 'stroke-[2.5px] animate-bounce-subtle')} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white">
                    {item.badge}
                  </span>
                ) : null}
              </div>

              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
