import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Plus, Trash2, Edit3, RotateCcw, Sparkles } from 'lucide-react';
import { CustomInteraction, InteractionColorTheme } from '../../../types/common.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';

interface QuickInteractionBarProps {
  onTriggerInteraction: (interaction: CustomInteraction) => void;
}

export const DEFAULT_INTERACTIONS: CustomInteraction[] = [
  {
    id: 'heart',
    label: 'Thả Tim',
    emoji: '❤️',
    colorTheme: 'rose',
    notificationMessage: 'vừa gửi cho bạn một triệu trái tim! ❤️',
  },
  {
    id: 'kiss',
    label: 'Hôn Nè 💋',
    emoji: '💋',
    colorTheme: 'pink',
    notificationMessage: 'vừa gửi nụ hôn ngọt ngào "Chụt"! 💋',
  },
  {
    id: 'water',
    label: 'Uống Nước',
    emoji: '🥛',
    colorTheme: 'blue',
    notificationMessage: 'nhắc bạn nhớ uống nước ấm nhé! 🥛',
  },
  {
    id: 'hug',
    label: 'Ôm Cái 🫂',
    emoji: '🫂',
    colorTheme: 'amber',
    notificationMessage: 'vừa gửi cho bạn một cái ôm ấm áp! 🫂',
  },
];

export const THEME_STYLES: Record<
  InteractionColorTheme,
  {
    btnClass: string;
    badgeBg: string;
    name: string;
    border: string;
  }
> = {
  rose: {
    name: 'Hồng Rose',
    btnClass: 'from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border-rose-200 shadow-rose-200/50 text-rose-600',
    badgeBg: 'bg-rose-500',
    border: 'border-rose-400',
  },
  pink: {
    name: 'Hồng Sen',
    btnClass: 'from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-pink-200 shadow-pink-200/50 text-pink-600',
    badgeBg: 'bg-pink-500',
    border: 'border-pink-400',
  },
  purple: {
    name: 'Tím Lavender',
    btnClass: 'from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-200 shadow-purple-200/50 text-purple-600',
    badgeBg: 'bg-purple-500',
    border: 'border-purple-400',
  },
  blue: {
    name: 'Xanh Biển',
    btnClass: 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 border-blue-200 shadow-blue-200/50 text-blue-600',
    badgeBg: 'bg-blue-500',
    border: 'border-blue-400',
  },
  cyan: {
    name: 'Xanh Mint',
    btnClass: 'from-cyan-50 to-teal-50 hover:from-cyan-100 hover:to-teal-100 border-cyan-200 shadow-cyan-200/50 text-cyan-600',
    badgeBg: 'bg-cyan-500',
    border: 'border-cyan-400',
  },
  amber: {
    name: 'Cam Vàng',
    btnClass: 'from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200 shadow-amber-200/50 text-amber-600',
    badgeBg: 'bg-amber-500',
    border: 'border-amber-400',
  },
  emerald: {
    name: 'Xanh Lá',
    btnClass: 'from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-200 shadow-emerald-200/50 text-emerald-600',
    badgeBg: 'bg-emerald-500',
    border: 'border-emerald-400',
  },
  red: {
    name: 'Đỏ Yêu',
    btnClass: 'from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-red-200 shadow-red-200/50 text-red-600',
    badgeBg: 'bg-red-500',
    border: 'border-red-400',
  },
};

const SUGGESTED_EMOJIS = [
  '❤️', '💋', '🥛', '🫂', '🧋', '🌸', '☕', '🍜',
  '🚗', '🧸', '🍰', '🍓', '👑', '💌', '🎁', '💅',
  '🔥', '💤', '🥳', '🥰', '💍', '🍕', '✨', '💐',
  '🍦', '🐱', '🐶', '💕'
];

export const QuickInteractionBar: React.FC<QuickInteractionBarProps> = ({
  onTriggerInteraction,
}) => {
  const [interactions, setInteractions] = useState<CustomInteraction[]>(() => {
    try {
      const saved = localStorage.getItem('lovespace_custom_interactions');
      return saved ? JSON.parse(saved) : DEFAULT_INTERACTIONS;
    } catch {
      return DEFAULT_INTERACTIONS;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [label, setLabel] = useState('');
  const [emoji, setEmoji] = useState('❤️');
  const [colorTheme, setColorTheme] = useState<InteractionColorTheme>('rose');
  const [notificationMessage, setNotificationMessage] = useState('');

  const saveInteractionsToStorage = (list: CustomInteraction[]) => {
    setInteractions(list);
    localStorage.setItem('lovespace_custom_interactions', JSON.stringify(list));
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setLabel('');
    setEmoji('💖');
    setColorTheme('rose');
    setNotificationMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: CustomInteraction) => {
    setEditingId(item.id);
    setLabel(item.label);
    setEmoji(item.emoji);
    setColorTheme(item.colorTheme);
    setNotificationMessage(item.notificationMessage || '');
    setIsModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!label.trim()) return;

    if (editingId) {
      const updated = interactions.map((it) =>
        it.id === editingId
          ? {
              ...it,
              label: label.trim(),
              emoji: emoji.trim() || '✨',
              colorTheme,
              notificationMessage: notificationMessage.trim() || undefined,
            }
          : it
      );
      saveInteractionsToStorage(updated);
    } else {
      const newItem: CustomInteraction = {
        id: `custom_${Date.now()}`,
        label: label.trim(),
        emoji: emoji.trim() || '✨',
        colorTheme,
        notificationMessage: notificationMessage.trim() || undefined,
      };
      saveInteractionsToStorage([...interactions, newItem]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = interactions.filter((it) => it.id !== id);
    saveInteractionsToStorage(updated);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Bạn có chắc muốn khôi phục 4 nút tương tác mặc định ban đầu?')) {
      saveInteractionsToStorage(DEFAULT_INTERACTIONS);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span>Tương Tác 1-Chạm Yêu Thương 💕</span>
        </span>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-[11px] font-extrabold text-rose-600 hover:text-rose-700 bg-rose-50/90 hover:bg-rose-100/80 px-2.5 py-1 rounded-full border border-rose-200/70 shadow-sm active:scale-95 transition-all"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Tùy chỉnh nút</span>
        </button>
      </div>

      {/* Grid of Custom Interaction Buttons */}
      <div className={`grid ${interactions.length <= 4 ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-6'} gap-2 sm:gap-2.5`}>
        {interactions.map((item) => {
          const theme = THEME_STYLES[item.colorTheme] || THEME_STYLES.rose;

          return (
            <motion.button
              key={item.id}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTriggerInteraction(item)}
              className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border bg-gradient-to-b shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${theme.btnClass}`}
            >
              <div className="p-1 sm:p-1.5 rounded-xl bg-white/90 backdrop-blur-sm shadow-sm mb-1 text-base sm:text-xl select-none">
                {item.emoji}
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-slate-800 tracking-tight line-clamp-1 text-center">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* MODAL TÙY CHỈNH NÚT TƯƠNG TÁC */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="⚙️ Tùy Chỉnh Nút Tương Tác 1-Chạm"
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Danh sách các nút hiện tại */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
                1. Danh sách các nút đang có:
              </label>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm nút mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
              {interactions.map((it) => {
                const theme = THEME_STYLES[it.colorTheme] || THEME_STYLES.rose;
                return (
                  <div
                    key={it.id}
                    className={`flex items-center justify-between p-2.5 rounded-2xl border ${theme.btnClass} bg-white shadow-sm`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xl p-1 bg-white rounded-xl shadow-xs border border-slate-100">{it.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{it.label}</p>
                        <p className="text-[10px] text-slate-500 truncate">{theme.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(it)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Sửa nút này"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(it.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa nút này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Thêm/Sửa Nút */}
          <div className="p-3.5 bg-gradient-to-r from-rose-50/70 to-pink-50/70 rounded-2xl border border-rose-200 space-y-3 shadow-inner">
            <span className="text-xs font-black text-slate-800 block">
              {editingId ? '✏️ Chỉnh sửa nút đã chọn:' : '➕ Thêm nút tương tác mới:'}
            </span>

            {/* 1. Chọn Icon / Emoji */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Biểu tượng (Icon / Emoji):
              </label>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl p-2 bg-white rounded-xl shadow-sm border border-rose-200">{emoji}</span>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="Gõ hoặc chọn emoji bên dưới"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
                />
              </div>

              {/* Emoji swatch bar */}
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-white/70 rounded-xl border border-rose-100">
                {SUGGESTED_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`text-lg p-1.5 rounded-lg transition-transform ${
                      emoji === em ? 'bg-rose-200 scale-110 shadow-sm' : 'hover:bg-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tên Nút */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Tên hiển thị trên nút:
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ví dụ: Thèm Trà Sữa 🧋, Nấu Cơm Nha, Đón Em Đi..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* 3. Lời nhắn gửi đối phương (Push Notification) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Lời nhắn thông báo gửi tới người yêu (Push):
              </label>
              <input
                type="text"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                placeholder="Ví dụ: Người yêu ơi, đang thèm trà sữa quá nè!"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>

            {/* 4. Chọn Màu Sắc Gradient */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                Chọn màu sắc nút:
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(THEME_STYLES) as InteractionColorTheme[]).map((themeKey) => {
                  const t = THEME_STYLES[themeKey];
                  const isSelected = colorTheme === themeKey;

                  return (
                    <button
                      key={themeKey}
                      type="button"
                      onClick={() => setColorTheme(themeKey)}
                      className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-extrabold transition-all ${
                        isSelected
                          ? `${t.border} bg-white shadow-sm ring-2 ring-rose-300 scale-102`
                          : 'border-slate-200 bg-white/60 hover:bg-white text-slate-600'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${t.badgeBg}`} />
                      <span className="truncate">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="button"
              variant="romantic"
              size="sm"
              fullWidth
              onClick={handleSaveItem}
              disabled={!label.trim()}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              {editingId ? 'Cập Nhật Nút' : 'Lưu Nút Mới'}
            </Button>
          </div>

          {/* Sticky footer with reset option */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 p-4 sm:-mx-5 sm:-mb-5 sm:p-5">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục mặc định</span>
            </button>

            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
