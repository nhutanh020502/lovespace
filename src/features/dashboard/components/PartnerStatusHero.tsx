import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { UserProfile, MoodStatus } from '../../../types/common.types';
import { formatTimeVi } from '../../../utils/dateUtils';
import { Sparkles, MessageCircle, Heart, User, Users, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [viewRole, setViewRole] = useState<'partner' | 'me'>('partner');

  const currentDisplayUser = viewRole === 'partner' ? partner : me;
  const currentDisplayMood = viewRole === 'partner' ? partnerMood : myMood;

  const getMoodConfig = (mood: string) => {
    switch (mood) {
      case 'happy':
        return {
          text: '🥰 Đang rất vui vẻ',
          variant: 'rose' as const,
          glowColor: 'from-rose-500/30 to-pink-400/20',
          emoji: '🥰',
        };
      case 'pouting':
        return {
          text: '😤 Đang giận dỗi nè',
          variant: 'amber' as const,
          glowColor: 'from-amber-500/35 to-orange-400/20',
          emoji: '😤',
        };
      case 'hungry':
        return {
          text: '🤤 Đói bụng thèm ăn',
          variant: 'pink' as const,
          glowColor: 'from-pink-500/30 to-rose-400/20',
          emoji: '🧋',
        };
      case 'tired':
        return {
          text: '😴 Hơi mệt mỏi',
          variant: 'purple' as const,
          glowColor: 'from-purple-500/30 to-indigo-400/20',
          emoji: '😴',
        };
      case 'missing_you':
        return {
          text: '💭 Đang nhớ người yêu',
          variant: 'rose' as const,
          glowColor: 'from-rose-600/35 to-pink-500/25',
          emoji: '💖',
        };
      case 'sick':
        return {
          text: '🤒 Đang bị ốm',
          variant: 'slate' as const,
          glowColor: 'from-blue-400/30 to-slate-400/20',
          emoji: '🤒',
        };
      case 'busy':
        return {
          text: '💼 Đang bận việc',
          variant: 'blue' as const,
          glowColor: 'from-blue-500/25 to-indigo-400/20',
          emoji: '💼',
        };
      case 'excited':
        return {
          text: '🥳 Hào hứng phấn khởi',
          variant: 'emerald' as const,
          glowColor: 'from-emerald-500/30 to-teal-400/20',
          emoji: '🎉',
        };
      default:
        return {
          text: '✨ Bình thường',
          variant: 'rose' as const,
          glowColor: 'from-rose-400/25 to-pink-300/15',
          emoji: '✨',
        };
    }
  };

  const moodConfig = getMoodConfig(currentDisplayMood.mood);

  return (
    <Card
      variant="luxury"
      className="relative p-4 sm:p-5 border border-white/90 shadow-luxury overflow-hidden transition-all duration-300"
    >
      {/* Living Ambient Mood Glow Aura */}
      <div
        className={`absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-bl ${moodConfig.glowColor} blur-3xl pointer-events-none transition-colors duration-700 -z-10`}
      />

      {/* Segmented Control Switch: Xem của Người yêu vs Xem của Tôi */}
      <div className="flex items-center justify-between p-1 bg-rose-50/90 rounded-2xl border border-rose-100/80 mb-3 shadow-inner">
        <button
          onClick={() => setViewRole('partner')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            viewRole === 'partner'
              ? 'bg-white text-rose-600 shadow-sm scale-101'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span className="truncate">{partner.nickname || partner.name}</span>
        </button>

        <button
          onClick={() => setViewRole('me')}
          className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            viewRole === 'me'
              ? 'bg-white text-rose-600 shadow-sm scale-101'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span className="truncate">Bạn ({me.nickname || me.name})</span>
        </button>
      </div>

      {/* Header of Card */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative">
            <Avatar
              src={currentDisplayUser.avatar}
              alt={currentDisplayUser.name}
              size="md"
              borderVariant={viewRole === 'partner' ? 'rose' : 'white'}
              isOnline={currentDisplayUser.isOnline}
            />
            <span className="absolute -bottom-1 -right-1 text-sm select-none">
              {moodConfig.emoji}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-sm font-black text-slate-800 truncate" title={currentDisplayUser.nickname}>
                {currentDisplayUser.nickname || currentDisplayUser.name}
              </h4>
              <Badge variant={moodConfig.variant} size="sm">
                {moodConfig.text}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              Cập nhật lúc {formatTimeVi(currentDisplayMood.updatedAt)} hôm nay
            </p>
          </div>
        </div>

        {/* Nút Đổi Mood: CHỈ HIỂN THỊ KHI ĐANG XEM TAB "BẠN (TÔI)" */}
        {viewRole === 'me' ? (
          <button
            onClick={onOpenMoodPicker}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-extrabold shadow-glow active:scale-95 transition-all shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Đổi Mood</span>
          </button>
        ) : (
          <span className="text-[11px] text-rose-600 font-bold bg-rose-50/90 px-2.5 py-1 rounded-full border border-rose-200/60 shrink-0 hidden xs:inline-block">
            Tâm trạng đối phương 💕
          </span>
        )}
      </div>

      {/* Main Visual Image / Meme Section with Ambient Glow Frame */}
      {currentDisplayMood.photoUrl && (
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative rounded-3xl overflow-hidden my-3 border border-white/80 shadow-md max-h-64 sm:max-h-72 bg-slate-900/5 group"
        >
          <img
            src={currentDisplayMood.photoUrl}
            alt="Mood"
            className="w-full h-52 sm:h-60 object-cover object-center group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />

          {/* Luxury Gradient Caption Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent text-white">
            <p className="text-xs sm:text-sm font-bold leading-snug drop-shadow-md">
              "{currentDisplayMood.caption}"
            </p>
          </div>
        </motion.div>
      )}

      {/* Footer Quick Actions */}
      <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
        {viewRole === 'partner' ? (
          <>
            <button
              onClick={onQuickPoke}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-600 text-xs font-black active:scale-95 transition-all border border-rose-200/60 shadow-sm"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-heartbeat" />
              <span>Thả Tim Cho {partner.nickname}</span>
            </button>
            <button
              onClick={onOpenChat}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-rose-600 text-xs font-black border border-slate-200 active:scale-95 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4 text-rose-500" />
              <span>Nhắn Tin Ngay</span>
            </button>
          </>
        ) : (
          <button
            onClick={onOpenMoodPicker}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-black active:scale-95 transition-all shadow-glow"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>Cập Nhật Cảm Xúc & Ảnh Meme Của Bạn 📸✨</span>
          </button>
        )}
      </div>
    </Card>
  );
};
