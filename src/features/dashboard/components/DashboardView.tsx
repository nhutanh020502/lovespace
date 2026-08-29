import React, { useState } from 'react';
import { UserRole, UserProfile, MoodStatus, TodoItem, HealthStatus } from '../../../types/common.types';
import { LoveCounterCard } from './LoveCounterCard';
import { PartnerStatusHero } from './PartnerStatusHero';
import { SOSRescueBanner } from './SOSRescueBanner';
import { QuickInteractionBar } from './QuickInteractionBar';
import { TodoSection } from '../../todo/components/TodoSection';
import { MoodPickerModal } from '../../mood-status/components/MoodPickerModal';
import { triggerLoveConfetti } from '../../../components/ui/ConfettiEffect';

interface DashboardViewProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  anniversaryDate: string;
  moodData: Record<string, MoodStatus>;
  healthData: Record<string, HealthStatus>;
  todos: TodoItem[];
  onUpdateMood: (userId: string, mood: Partial<MoodStatus>) => void;
  onNavigateTab: (tab: any) => void;
  onPokeHeart: () => void;
  onSendKiss: () => void;
  onRemindWater: () => void;
  onSendHug: () => void;
  onToggleTodo: (todoId: string) => void;
  onAddTodo: (todo: any) => void;
  onUpdateTodo: (todoId: string, updated: Partial<TodoItem>) => void;
  onDeleteTodo: (todoId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentRole,
  partner1,
  partner2,
  anniversaryDate,
  moodData,
  healthData,
  todos,
  onUpdateMood,
  onNavigateTab,
  onPokeHeart,
  onSendKiss,
  onRemindWater,
  onSendHug,
  onToggleTodo,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const me = currentRole === 'husband' ? partner1 : partner2;
  const partner = currentRole === 'husband' ? partner2 : partner1;

  const myMood = moodData[me.id] || {
    userId: me.id,
    mood: 'happy',
    caption: 'Yêu vợ nhiều lắm ❤️',
    updatedAt: new Date().toISOString()
  };

  const partnerMood = moodData[partner.id] || {
    userId: partner.id,
    mood: 'happy',
    caption: 'Hôm nay rất vui ❤️',
    updatedAt: new Date().toISOString()
  };

  const partnerHealth = healthData[partner.id];

  const [isMoodPickerOpen, setIsMoodPickerOpen] = useState(false);

  const handleQuickPoke = () => {
    onPokeHeart();
    triggerLoveConfetti();
  };

  return (
    <div className="space-y-4 pb-20 max-w-2xl mx-auto">
      {/* 1. Đồng Hồ Đếm Ngày Yêu Nhau */}
      <LoveCounterCard startDate={anniversaryDate} />

      {/* 2. Banner Cứu Hộ / Dỗ Dành khi Đối Phương Đang Dỗi hoặc Đang Đói */}
      {(partnerMood.mood === 'pouting' || partnerMood.mood === 'hungry') && (
        <SOSRescueBanner
          favoriteFood={partnerHealth?.favoriteComfortFoods?.[0]}
          onOpenPlaces={() => onNavigateTab('places')}
          onSendHug={onSendHug}
        />
      )}

      {/* 3. Hero Trạng Thái & Cảm Xúc Bằng Hình Ảnh / Meme của Đối Phương hoặc của Tôi */}
      <PartnerStatusHero
        me={me}
        partner={partner}
        myMood={myMood}
        partnerMood={partnerMood}
        onOpenMoodPicker={() => setIsMoodPickerOpen(true)}
        onOpenChat={() => onNavigateTab('chat')}
        onQuickPoke={handleQuickPoke}
      />

      {/* 4. Thanh Tương Tác 1 Chạm Nhanh (Thả tim, Hôn, Nhắc nước, Ôm) */}
      <QuickInteractionBar
        onPokeHeart={handleQuickPoke}
        onSendKiss={onSendKiss}
        onRemindWater={onRemindWater}
        onSendHug={onSendHug}
      />

      {/* 5. Việc Cần Làm Chung */}
      <TodoSection
        currentRole={currentRole}
        todos={todos}
        onToggleTodo={onToggleTodo}
        onAddTodo={onAddTodo}
        onUpdateTodo={onUpdateTodo}
        onDeleteTodo={onDeleteTodo}
      />

      {/* Modal Đổi Mood & Ảnh Meme của Tôi */}
      <MoodPickerModal
        isOpen={isMoodPickerOpen}
        onClose={() => setIsMoodPickerOpen(false)}
        currentMood={myMood}
        onSaveMood={(updated) => onUpdateMood(me.id, updated)}
      />
    </div>
  );
};
