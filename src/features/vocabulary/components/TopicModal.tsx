import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { VocabTopic, TopicColorTheme } from '../../../types/vocab.types';
import { TOPIC_COLOR_THEMES } from '../constants/presetVocabPacks';
import { EmojiPickerPalette } from '../../../components/ui/EmojiPickerPalette';
import { FolderHeart, Sparkles, Gift } from 'lucide-react';

interface TopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicToEdit?: VocabTopic | null;
  onSave: (topicData: {
    title: string;
    description?: string;
    emoji: string;
    colorTheme: TopicColorTheme;
    rewardTitle?: string;
  }) => void;
}

const QUICK_TOPIC_EMOJIS = ['📚', '☕', '✈️', '💬', '🍽️', '💖', '🍿', '🛍️', '💼', '🌸', '🏖️', '🏨', '🎓', '🎯', '🐾', '💍'];

export const TopicModal: React.FC<TopicModalProps> = ({
  isOpen,
  onClose,
  topicToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('📚');
  const [colorTheme, setColorTheme] = useState<TopicColorTheme>('rose');
  const [rewardTitle, setRewardTitle] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (topicToEdit) {
        setTitle(topicToEdit.title);
        setDescription(topicToEdit.description || '');
        setEmoji(topicToEdit.emoji || '📚');
        setColorTheme(topicToEdit.colorTheme || 'rose');
        setRewardTitle(topicToEdit.reward?.rewardTitle || '');
      } else {
        setTitle('');
        setDescription('');
        setEmoji('📚');
        setColorTheme('rose');
        setRewardTitle('');
      }
      setShowEmojiPicker(false);
    }
  }, [isOpen, topicToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      emoji: emoji.trim() || '📚',
      colorTheme,
      rewardTitle: rewardTitle.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={topicToEdit ? '✏️ Chỉnh Sửa Chủ Đề Từ Vựng' : '✨ Tạo Chủ Đề Từ Vựng Mới'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Biểu tượng & Tên chủ đề */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Biểu Tượng & Tên Chủ Đề <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-12 h-11 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-2xl flex items-center justify-center transition-all shrink-0 shadow-xs cursor-pointer"
              title="Chọn biểu tượng khác"
            >
              {emoji}
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Tiếng Anh Giao Tiếp Hằng Ngày, Du Lịch..."
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400 shadow-xs"
              autoFocus
            />
          </div>
        </div>

        {/* Quick Emoji Bar & Palette */}
        {showEmojiPicker ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">Chọn Emoji biểu tượng:</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="text-[10px] text-rose-600 font-bold hover:underline"
              >
                Đóng
              </button>
            </div>
            <EmojiPickerPalette
              selectedEmoji={emoji}
              onSelectEmoji={(em) => {
                setEmoji(em);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 shrink-0">Gợi ý:</span>
            {QUICK_TOPIC_EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setEmoji(em)}
                className={`text-lg p-1 rounded-xl transition-all ${
                  emoji === em ? 'bg-rose-200 scale-110 shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {em}
              </button>
            ))}
          </div>
        )}

        {/* Mô tả chủ đề */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Mô Tả Ngắn (Tùy chọn)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Những câu và từ hay dùng khi đi ăn uống, hẹn hò..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-400 shadow-xs"
          />
        </div>

        {/* Bảng màu chủ đề */}
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            Màu Sắc Đại Diện
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {TOPIC_COLOR_THEMES.map((theme) => {
              const isSelected = colorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setColorTheme(theme.id as TopicColorTheme)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                    isSelected
                      ? `${theme.lightBg} ${theme.border} ring-2 ring-rose-400 scale-102 shadow-xs`
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${theme.bg} shrink-0`} />
                  <span className="truncate">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Phần thưởng tình yêu khi hoàn thành chủ đề */}
        <div className="p-3 bg-gradient-to-r from-rose-50/80 to-pink-50/80 rounded-2xl border border-rose-200/80 space-y-1.5">
          <label className="text-xs font-black text-rose-700 flex items-center gap-1">
            <Gift className="w-3.5 h-3.5 text-rose-500" />
            <span>Phần Thưởng Tình Yêu (Khi cả 2 cùng thuộc hết chủ đề):</span>
          </label>
          <input
            type="text"
            value={rewardTitle}
            onChange={(e) => setRewardTitle(e.target.value)}
            placeholder="Ví dụ: Được bao 1 ly trà sữa, 1 chầu xem phim, massage 15 phút..."
            className="w-full bg-white border border-rose-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400 shadow-xs"
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" variant="romantic" fullWidth disabled={!title.trim()}>
            {topicToEdit ? 'Lưu Thay Đổi' : 'Tạo Chủ Đề ✨'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
