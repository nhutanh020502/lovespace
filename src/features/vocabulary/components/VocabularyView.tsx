import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Plus,
  Search,
  BookOpen,
  Sparkles,
  ChevronRight,
  Send,
  FolderHeart,
  Trophy,
  GraduationCap,
} from 'lucide-react';
import { VocabTopic, VocabStreak } from '../../../types/vocab.types';
import { UserRole, UserProfile } from '../../../types/common.types';
import { TopicModal } from './TopicModal';
import { TopicDetailView } from './TopicDetailView';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { generateUUID } from '../../../utils/uuidUtils';
import { TOPIC_COLOR_THEMES } from '../constants/presetVocabPacks';

interface VocabularyViewProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  topics: VocabTopic[];
  streak: VocabStreak;
  onAddTopic: (topic: VocabTopic) => void;
  onUpdateTopic: (topic: VocabTopic) => void;
  onDeleteTopic: (topicId: string) => void;
  onUpdateStreak: (newStreak: VocabStreak) => void;
  onNudgePartner: () => void;
  onShowToast: (msg: string) => void;
}

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  currentRole,
  partner1,
  partner2,
  topics,
  streak,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  onUpdateStreak: _onUpdateStreak,
  onNudgePartner,
  onShowToast,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const me = currentRole === 'husband' ? partner1 : partner2;
  const partner = currentRole === 'husband' ? partner2 : partner1;

  // Lọc chủ đề theo tìm kiếm
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.toLowerCase();
    return topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [topics, searchQuery]);

  // Nếu đang xem chi tiết một chủ đề
  const selectedTopic = topics.find((t) => t.id === selectedTopicId);
  if (selectedTopic) {
    return (
      <TopicDetailView
        topic={selectedTopic}
        currentRole={currentRole}
        partner1={partner1}
        partner2={partner2}
        onBack={() => setSelectedTopicId(null)}
        onUpdateTopic={onUpdateTopic}
        onDeleteTopic={onDeleteTopic}
        onNudgePartner={onNudgePartner}
        onShowToast={onShowToast}
      />
    );
  }

  const handleCreateTopic = (data: {
    title: string;
    description?: string;
    emoji: string;
    colorTheme: any;
    rewardTitle?: string;
  }) => {
    const newTopic: VocabTopic = {
      id: generateUUID(),
      title: data.title,
      description: data.description,
      emoji: data.emoji || '📚',
      colorTheme: data.colorTheme || 'rose',
      words: [],
      reward: data.rewardTitle
        ? {
            rewardTitle: data.rewardTitle,
            isUnlocked: false,
          }
        : undefined,
      createdBy: me.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTopic(newTopic);
    setSelectedTopicId(newTopic.id);
    onShowToast(`Đã tạo chủ đề "${newTopic.title}" thành công! ✨`);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Header Banner & Streak Flame */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/85 backdrop-blur-md border border-rose-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-glow">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>Học Từ Vựng Theo Chủ Đề</span>
              <span className="text-xs font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                {topics.length} Chủ đề
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Tự tạo chủ đề, thêm từ vựng & cùng nhau ôn luyện mỗi ngày 💕
            </p>
          </div>
        </div>

        {/* Streak Counter & Nudge Partner Button */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-xs font-black text-amber-800">
              Streak: {streak.currentStreak || 0} ngày 🔥
            </span>
          </div>

          <Button
            variant="romantic"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-glow"
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>Tạo Chủ Đề</span>
          </Button>
        </div>
      </div>

      {/* 2. Search Box (chỉ hiện khi có từ 2 chủ đề trở lên) */}
      {topics.length > 1 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm chủ đề từ vựng..."
            className="w-full bg-white/90 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-400 shadow-xs"
          />
        </div>
      )}

      {/* 3. Grid of Topic Cards OR Empty State */}
      {filteredTopics.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="text-center py-16 px-4 bg-white/60 backdrop-blur-md rounded-3xl border-2 border-dashed border-rose-200/80 space-y-3"
        >
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center text-3xl shadow-xs">
            📚
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-800">
              {topics.length === 0 ? 'Chưa có chủ đề từ vựng nào' : 'Không tìm thấy chủ đề phù hợp'}
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              {topics.length === 0
                ? 'Toàn bộ từ vựng sẽ do bạn tự quản lý và thêm vào. Hãy bắt đầu bằng cách tạo một chủ đề đầu tiên (ví dụ: "Tiếng Anh Hẹn Hò", "Giao Tiếp Du Lịch", "IELTS"...)!'
                : 'Thử tìm với từ khóa khác nhé.'}
            </p>
          </div>

          {topics.length === 0 && (
            <Button
              variant="romantic"
              size="md"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-2 shadow-glow"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Tạo Chủ Đề Đầu Tiên Ngay ✨
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
          {filteredTopics.map((item) => {
            const words = item.words || [];
            const total = words.length;
            const husbandDone = words.filter((w) => (w.masteredBy || []).includes('husband')).length;
            const wifeDone = words.filter((w) => (w.masteredBy || []).includes('wife')).length;

            const husbandPct = total > 0 ? Math.round((husbandDone / total) * 100) : 0;
            const wifePct = total > 0 ? Math.round((wifeDone / total) * 100) : 0;

            const theme = TOPIC_COLOR_THEMES.find((t) => t.id === item.colorTheme) || TOPIC_COLOR_THEMES[0];

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -3, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onClick={() => setSelectedTopicId(item.id)}
                className="group p-4 sm:p-4.5 rounded-3xl bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/80 hover:border-rose-300 shadow-sm hover:shadow-md transition-all cursor-pointer select-none space-y-3 relative overflow-hidden"
              >
                {/* Top: Emoji, Title & Word count badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="text-3xl p-2 rounded-2xl bg-rose-50 border border-rose-100 shadow-xs shrink-0 select-none group-hover:scale-110 transition-transform">
                      {item.emoji || '📚'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-black text-slate-800 tracking-tight truncate group-hover:text-rose-600 transition-colors">
                        {item.title}
                      </h3>
                      {item.description ? (
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                          {item.description}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Bấm để học & xem từ vựng
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {total} từ
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>

                {/* Progress bars: Chồng vs Vợ */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-bold">
                  {/* Chồng */}
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>🐻 Chồng: {husbandDone}/{total}</span>
                      <span className="text-blue-600">{husbandPct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${husbandPct}%` }}
                        className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>

                  {/* Vợ */}
                  <div>
                    <div className="flex justify-between text-slate-600 mb-0.5">
                      <span>🐰 Vợ: {wifeDone}/{total}</span>
                      <span className="text-rose-600">{wifePct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${wifePct}%` }}
                        className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal Tạo Chủ Đề Mới */}
      <TopicModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateTopic}
      />
    </div>
  );
};
