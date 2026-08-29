import React, { useState } from 'react';
import { EMOJI_CATEGORIES, ALL_EMOJIS } from '../../constants/emojiList';

interface EmojiPickerPaletteProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
  className?: string;
}

export const EmojiPickerPalette: React.FC<EmojiPickerPaletteProps> = ({
  selectedEmoji,
  onSelectEmoji,
  className = '',
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentCategory = EMOJI_CATEGORIES.find((c) => c.id === activeCategoryId);
  const displayedEmojis =
    activeCategoryId === 'all'
      ? ALL_EMOJIS
      : currentCategory
      ? currentCategory.emojis
      : ALL_EMOJIS;

  return (
    <div className={`p-2.5 bg-white/90 backdrop-blur-md rounded-2xl border border-rose-200/80 shadow-inner space-y-2 ${className}`}>
      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategoryId('all')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
            activeCategoryId === 'all'
              ? 'bg-rose-500 text-white shadow-sm scale-102'
              : 'bg-rose-50/70 text-slate-600 hover:bg-rose-100/70'
          }`}
        >
          <span>✨</span>
          <span>Tất cả ({ALL_EMOJIS.length})</span>
        </button>

        {EMOJI_CATEGORIES.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1 ${
                isActive
                  ? 'bg-rose-500 text-white shadow-sm scale-102'
                  : 'bg-rose-50/70 text-slate-600 hover:bg-rose-100/70'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Emojis */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 max-h-44 overflow-y-auto p-1 bg-rose-50/40 rounded-xl border border-rose-100/60">
        {displayedEmojis.map((em, idx) => {
          const isSelected = selectedEmoji === em;
          return (
            <button
              key={`${em}_${idx}`}
              type="button"
              onClick={() => onSelectEmoji(em)}
              className={`text-xl sm:text-2xl p-1.5 rounded-xl transition-all cursor-pointer select-none flex items-center justify-center ${
                isSelected
                  ? 'bg-rose-300 ring-2 ring-rose-500 scale-115 shadow-sm'
                  : 'hover:bg-white/90 hover:scale-110 active:scale-95'
              }`}
            >
              {em}
            </button>
          );
        })}
      </div>
    </div>
  );
};
