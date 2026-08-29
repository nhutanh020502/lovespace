import React, { useState, useEffect } from 'react';
import { Heart, Battery, BellRing, UserCheck, Settings } from 'lucide-react';
import { UserProfile, UserRole } from '../../types/common.types';
import { Avatar } from '../ui/Avatar';
import { requestNotificationPermission, getNotificationPermissionStatus } from '../../services/notificationService';

interface TopHeaderProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  onSwitchRole: (newRole: UserRole) => void;
  onOpenSettings?: () => void;
  onShowToast?: (msg: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentRole,
  partner1,
  partner2,
  onSwitchRole,
  onOpenSettings,
  onShowToast,
}) => {
  const me = currentRole === 'husband' ? partner1 : partner2;
  const myPartner = currentRole === 'husband' ? partner2 : partner1;

  const [notifStatus, setNotifStatus] = useState<'granted' | 'denied' | 'default'>(getNotificationPermissionStatus());

  useEffect(() => {
    setNotifStatus(getNotificationPermissionStatus());
  }, []);

  const handleNotificationClick = async () => {
    const res = await requestNotificationPermission();
    setNotifStatus(getNotificationPermissionStatus());
    if (onShowToast) {
      onShowToast(res.message);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-romantic border-b border-rose-200/50 px-4 py-2.5 transition-all">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        {/* Left: Couple mini avatar & names */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center -space-x-2">
            <Avatar
              src={partner1.avatar}
              alt={partner1.name}
              size="sm"
              borderVariant="white"
            />
            <Avatar
              src={partner2.avatar}
              alt={partner2.name}
              size="sm"
              borderVariant="rose"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-rose-700">{partner1.nickname}</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 animate-pulse" />
              <span className="text-xs font-bold text-pink-700">{partner2.nickname}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>Đang là: <strong className="text-rose-600">{me.name}</strong></span>
              {myPartner.batteryLevel !== undefined && (
                <span className="flex items-center gap-0.5 text-slate-400">
                  <Battery className="w-3 h-3 text-emerald-500" />
                  {myPartner.batteryLevel}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Switch Role Toggle (Chồng <-> Vợ) & Notification Bell & Settings */}
        <div className="flex items-center gap-1.5">
          {/* Nút Bật Thông Báo */}
          <button
            onClick={handleNotificationClick}
            title={
              notifStatus === 'granted'
                ? 'Thông báo đẩy đang BẬT (Bấm để kiểm tra)'
                : notifStatus === 'denied'
                ? 'Thông báo đang bị chặn trong trình duyệt'
                : 'Bấm để bật nhận thông báo đẩy'
            }
            className="relative p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 shadow-sm border border-rose-200 active:scale-95 transition-all"
          >
            <BellRing className={`w-4 h-4 text-rose-500 ${notifStatus !== 'granted' ? 'animate-bounce' : 'animate-pulse'}`} />
            <span
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                notifStatus === 'granted'
                  ? 'bg-emerald-500'
                  : notifStatus === 'denied'
                  ? 'bg-red-500'
                  : 'bg-amber-400'
              }`}
            />
          </button>

          {/* Nút Cài Đặt Không Gian Yêu */}
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Cài đặt tên, ảnh đại diện, ngày yêu nhau"
              className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-rose-600 shadow-sm border border-rose-200 active:scale-95 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Nút Đổi Vai */}
          <button
            onClick={() => onSwitchRole(currentRole === 'husband' ? 'wife' : 'husband')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
            title="Đổi góc nhìn giữa Chồng và Vợ"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Đổi Vai: {currentRole === 'husband' ? '🐻 Chồng' : '🐰 Vợ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
