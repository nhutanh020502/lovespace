import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { UserProfile, MoodStatus } from '../../../types/common.types';
import { formatTimeVi } from '../../../utils/dateUtils';
import { Sparkles, MessageCircle, Heart, User, Users } from 'lucide-react';

interface PartnerStatusHeroProps {
  me: UserProfile;
  partner: UserProfile;
  myMood: MoodStatus;
  partnerMood: MoodStatus;
  onOpenMoodPicker: () => void;
  onOpenChat: () => void;
  onQuickPoke: () => void;
}

export const PartnerStatusHero: React.FC<PartnerStatusHeroProps> = ({
  me,
  partner,
  myMood,
  partnerMood,
  onOpenMoodPicker,
  onOpenChat,
  onQuickPoke,
}) => {
  // Tab xem cảm xúc của ai (mặc định xem đối phương, có thể chuyển sang xem của mình)
  const [viewRole, setViewRole] = useState<'partner' | 'me'>('partner');

  const currentDisplayUser = viewRole === 'partner' ? partner : me;
  const currentDisplayMood = viewRole === 'partner' ? partnerMood : myMood;

  const getMoodBadge = (mood: string) => {
    switch (mood) {
      case 'happy': return { text: '🥰 Đang rất vui', variant: 'rose' as const };
      case 'pouting': return { text: '😤 Đang giận dỗi nè', variant: 'amber' as const };
      case 'hungry': return { text: '🤤 Đói bụng thèm ăn', variant: 'pink' as const };
      case 'tired': return { text: '😴 Hơi mệt mỏi', variant: 'purple' as const };
      case 'missing_you': return { text: '💭 Đang nhớ người yêu', variant: 'rose' as const };
      case 'sick': return { text: '🤒 Đang bị ốm', variant: 'slate' as const };
      case 'busy': return { text: '💼 Đang bận việc', variant: 'blue' as const };
      case 'excited': return { text: '🥳 Hào hứng phấn khởi', variant: 'emerald' as const };
      default: return { text: '✨ Bình thường', variant: 'rose' as const };
    }
  };

  const badgeInfo = getMoodBadge(currentDisplayMood.mood);

  return (
    <Card variant="glass" className="relative p-4 sm:p-5 border border-white/80 shadow-glass-card">
      {/* Segmented Control Switch: Xem của Người yêu vs Xem của Tôi */}
      <div className="flex items-center justify-between p-1 bg-rose-50/80 rounded-2xl border border-rose-100 mb-3">
        <button
          onClick={() => setViewRole('partner')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            viewRole === 'partner'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{partner.nickname}</span>
        </button>

        <button
          onClick={() => setViewRole('me')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            viewRole === 'me'
              ? 'bg-white text-rose-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Bạn ({me.nickname})</span>
        </button>
      </div>

      {/* Header of Card */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={currentDisplayUser.avatar}
            alt={currentDisplayUser.name}
            size="md"
            borderVariant={viewRole === 'partner' ? 'rose' : 'white'}
            isOnline={currentDisplayUser.isOnline}
          />
          <div>
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <span>{currentDisplayUser.nickname}</span>
              <Badge variant={badgeInfo.variant} size="sm">
                {badgeInfo.text}
              </Badge>
            </h4>
            <p className="text-[11px] text-slate-400">
              Cập nhật lúc {formatTimeVi(currentDisplayMood.updatedAt)} hôm nay
            </p>
          </div>
        </div>

        {/* Nút Đổi Mood: CHỈ HIỂN THỊ KHI ĐANG XEM TAB "BẠN (TÔI)" */}
        {viewRole === 'me' ? (
          <button
            onClick={onOpenMoodPicker}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đổi Mood Của Bạn</span>
          </button>
        ) : (
          <span className="text-[11px] text-rose-500 font-semibold bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">
            Tâm trạng của {partner.nickname} 💕
          </span>
        )}
      </div>

      {/* Main Visual Image / Meme Section */}
      {currentDisplayMood.photoUrl && (
        <div className="relative rounded-2xl overflow-hidden my-3 border border-rose-100 shadow-sm max-h-64 sm:max-h-72 bg-slate-900/5 group">
          <img
            src={currentDisplayMood.photoUrl}
            alt="Mood"
            className="w-full h-52 sm:h-60 object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />

          {/* Caption Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent text-white">
            <p className="text-sm font-semibold leading-snug drop-shadow-md">
              "{currentDisplayMood.caption}"
            </p>
          </div>
        </div>
      )}

      {/* Footer Quick Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100/80">
        {viewRole === 'partner' ? (
          <>
            <button
              onClick={onQuickPoke}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold active:scale-95 transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-heartbeat" />
              <span>Thả Tim Cho {partner.nickname}</span>
            </button>
            <button
              onClick={onOpenChat}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 active:scale-95 transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Nhắn Tin Ngay</span>
            </button>
          </>
        ) : (
          <button
            onClick={onOpenMoodPicker}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold active:scale-95 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Đổi Trạng Thái / Meme Của Bạn 📸✨</span>
          </button>
        )}
      </div>
    </Card>
  );
};
