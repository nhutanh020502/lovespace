import React, { useState, useRef, useEffect } from 'react';
import { MoodStatus, MoodType } from '../../../types/common.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Camera, Image as ImageIcon, Link as LinkIcon, Loader2, Sparkles, Plus, Trash2, Check } from 'lucide-react';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';
import { EmojiPickerPalette } from '../../../components/ui/EmojiPickerPalette';

interface MoodPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: MoodStatus;
  onSaveMood: (updated: Partial<MoodStatus>) => void;
}

export interface MoodOptionItem {
  type: string;
  label: string;
  icon: string;
  variant?: 'rose' | 'pink' | 'amber' | 'purple' | 'blue' | 'slate' | 'emerald';
  isCustom?: boolean;
}

const DEFAULT_RICH_MOODS: MoodOptionItem[] = [
  { type: 'happy', label: 'Vui vẻ / Yêu đời', icon: '🥰', variant: 'rose' },
  { type: 'missing_you', label: 'Đang nhớ người yêu', icon: '💭', variant: 'rose' },
  { type: 'pouting', label: 'Đang dỗi hờn', icon: '😤', variant: 'amber' },
  { type: 'hungry', label: 'Đói bụng thèm ăn', icon: '🤤', variant: 'pink' },
  { type: 'sleepy', label: 'Buồn ngủ / Mệt', icon: '😴', variant: 'purple' },
  { type: 'want_hug', label: 'Muốn được ôm 🫂', icon: '🥺', variant: 'rose' },
  { type: 'excited', label: 'Hào hứng phấn khởi', icon: '🥳', variant: 'emerald' },
  { type: 'boba', label: 'Thèm trà sữa 🧋', icon: '🧋', variant: 'amber' },
  { type: 'want_hangout', label: 'Muốn đi chơi 🚗', icon: '🌴', variant: 'emerald' },
  { type: 'cuddle', label: 'Cần dỗ dành 💕', icon: '🧸', variant: 'pink' },
  { type: 'grumpy', label: 'Đang quạu / Khó ở', icon: '😡', variant: 'amber' },
  { type: 'sick', label: 'Hơi ốm / Mệt', icon: '🤒', variant: 'slate' },
  { type: 'busy', label: 'Đang bận việc', icon: '💼', variant: 'blue' },
  { type: 'chill', label: 'Chill thư giãn', icon: '☕', variant: 'purple' },
  { type: 'pretty', label: 'Xinh đẹp tự tin 💅', icon: '👑', variant: 'pink' },
  { type: 'thinking', label: 'Đang suy nghĩ 🤔', icon: '✨', variant: 'blue' },
];

const POPULAR_EMOJIS = [
  '🥰', '😘', '💖', '🥺', '🤤', '😤', '😴', '🧋',
  '🌸', '👑', '💅', '🍲', '🍜', '🚗', '🧸', '🍰',
  '🍓', '✨', '🔥', '💤', '🌹', '💍', '🎉', '🐱'
];

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onSaveMood,
}) => {
  const [selectedMoodType, setSelectedMoodType] = useState<string>(currentMood.mood);
  const [caption, setCaption] = useState(currentMood.caption);
  const [photoUrl, setPhotoUrl] = useState(currentMood.photoUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  // Custom mood states
  const [customMoods, setCustomMoods] = useState<MoodOptionItem[]>(() => {
    try {
      const saved = localStorage.getItem('lovespace_custom_moods');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomEmoji, setNewCustomEmoji] = useState('🥰');

  // Selected item object
  const allMoods = [...DEFAULT_RICH_MOODS, ...customMoods];
  const activeMoodObj =
    allMoods.find((m) => m.type === selectedMoodType) || {
      type: selectedMoodType,
      label: currentMood.customLabel || selectedMoodType,
      icon: currentMood.customEmoji || '✨',
      variant: 'rose' as const,
    };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Lưu danh sách custom moods vào localStorage
  const handleSaveCustomMood = () => {
    if (!newCustomLabel.trim()) return;

    const customType = `custom_${Date.now()}`;
    const newMood: MoodOptionItem = {
      type: customType,
      label: newCustomLabel.trim(),
      icon: newCustomEmoji,
      variant: 'rose',
      isCustom: true,
    };

    const updated = [...customMoods, newMood];
    setCustomMoods(updated);
    localStorage.setItem('lovespace_custom_moods', JSON.stringify(updated));

    setSelectedMoodType(customType);
    setNewCustomLabel('');
    setIsCreatingCustom(false);
  };

  const handleDeleteCustomMood = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customMoods.filter((m) => m.type !== type);
    setCustomMoods(updated);
    localStorage.setItem('lovespace_custom_moods', JSON.stringify(updated));
    if (selectedMoodType === type) {
      setSelectedMoodType('happy');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setPhotoUrl(url);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhotoUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = () => {
    onSaveMood({
      mood: selectedMoodType,
      customEmoji: activeMoodObj.icon,
      customLabel: activeMoodObj.label,
      caption: caption.trim() || 'Hôm nay thế nào?',
      photoUrl: photoUrl.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cập Nhật Trạng Thái & Cảm Xúc 💖" maxWidth="lg">
      <div className="space-y-4 pb-2">
        {/* Hidden inputs for Camera & Device Gallery */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        {/* 1. Chọn loại tâm trạng phong phú */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              1. Bạn đang cảm thấy thế nào?
            </label>
            <button
              type="button"
              onClick={() => setIsCreatingCustom(!isCreatingCustom)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo tâm trạng riêng</span>
            </button>
          </div>

          {/* Form Tạo Custom Mood Mới */}
          {isCreatingCustom && (
            <div className="p-3 mb-3 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-200 animate-fade-in space-y-2.5 shadow-sm">
              <span className="text-xs font-bold text-slate-700 block">Tự tạo tâm trạng riêng của bạn:</span>
              
              <div className="flex gap-2 items-center">
                <span className="text-2xl p-1 bg-white rounded-xl shadow-sm border border-rose-100">{newCustomEmoji}</span>
                <input
                  type="text"
                  value={newCustomLabel}
                  onChange={(e) => setNewCustomLabel(e.target.value)}
                  placeholder="Ví dụ: Đang chờ anh đón, Thèm lẩu cay..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
                />
                <Button size="sm" variant="romantic" onClick={handleSaveCustomMood} disabled={!newCustomLabel.trim()}>
                  Lưu
                </Button>
              </div>

              {/* Kho Emoji phong phú hơn 200+ icon phân loại */}
              <EmojiPickerPalette
                selectedEmoji={newCustomEmoji}
                onSelectEmoji={setNewCustomEmoji}
              />
            </div>
          )}

          {/* Grid Danh sách các tâm trạng đa dạng */}
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
            {allMoods.map((opt) => {
              const isSelected = selectedMoodType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setSelectedMoodType(opt.type)}
                  className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all select-none ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 shadow-md scale-102 font-black text-rose-700 ring-2 ring-rose-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {opt.isCustom && (
                    <span
                      onClick={(e) => handleDeleteCustomMood(opt.type, e)}
                      className="absolute top-1 right-1 p-0.5 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50"
                      title="Xóa tâm trạng này"
                    >
                      <Trash2 className="w-3 h-3" />
                    </span>
                  )}
                  <span className="text-2xl mb-1">{opt.icon}</span>
                  <span className="text-[11px] text-center leading-tight line-clamp-2">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Dòng suy nghĩ / Caption */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
            2. Lời nhắn / Dòng suy nghĩ:
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ví dụ: Đang nhớ người yêu nhiều lắm..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* 3. Tải Ảnh từ máy / Chụp Ảnh / Dán Link (100% Ảnh Thực Tế, Bỏ Toàn Bộ Mẫu Cũ) */}
        <div>
          <label className="block text-xs font-black text-slate-700 mb-1.5 uppercase tracking-wider">
            3. Hình ảnh / Meme của bạn (Chụp hoặc chọn từ máy):
          </label>

          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant="romantic"
              size="sm"
              fullWidth
              onClick={() => cameraInputRef.current?.click()}
              disabled={isUploading}
            >
              <Camera className="w-4 h-4 mr-1.5" />
              Chụp Ảnh Ngay 📸
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <ImageIcon className="w-4 h-4 mr-1.5" />
              Chọn Từ Máy 🖼️
            </Button>
          </div>

          <div className="relative mb-2">
            <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Hoặc dán đường link ảnh trực tiếp (https://...)"
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-400"
            />
          </div>

          {isUploading && (
            <div className="w-full py-6 border-2 border-dashed border-rose-300 rounded-2xl flex flex-col items-center justify-center bg-rose-50/50 my-2">
              <Loader2 className="w-6 h-6 text-rose-500 animate-spin mb-1" />
              <span className="text-xs font-bold text-rose-600">Đang tải ảnh lên đám mây...</span>
            </div>
          )}

          {/* Full preview with natural aspect ratio without cropping */}
          {photoUrl && !isUploading && (
            <div className="relative rounded-2xl overflow-hidden border border-rose-200/80 bg-slate-900/5 mt-2">
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-auto object-contain block"
              />
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors text-xs font-bold shadow-md"
                title="Bỏ ảnh"
              >
                ✕ Xóa ảnh
              </button>
            </div>
          )}
        </div>

        {/* Nút lưu sticky rõ ràng */}
        <div className="flex gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 p-4 sm:-mx-5 sm:-mb-5 sm:p-5">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" fullWidth onClick={handleSave} disabled={isUploading}>
            <Sparkles className="w-4 h-4 mr-1.5" />
            Cập Nhật Cảm Xúc 💕
          </Button>
        </div>
      </div>
    </Modal>
  );
};
