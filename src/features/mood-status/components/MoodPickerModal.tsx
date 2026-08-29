import React, { useState, useRef, useEffect } from 'react';
import { MoodStatus, MoodType } from '../../../types/common.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Camera, Image as ImageIcon, Link as LinkIcon, Loader2, Sparkles, Plus, Trash2, Check, RotateCcw } from 'lucide-react';
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

  // Quản lý toàn bộ danh sách tâm trạng (cho phép thêm / xóa bất kỳ mục nào)
  const [moodList, setMoodList] = useState<MoodOptionItem[]>(() => {
    try {
      const saved = localStorage.getItem('lovespace_all_moods_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_RICH_MOODS;
  });

  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomEmoji, setNewCustomEmoji] = useState('🥰');

  // Selected item object
  const activeMoodObj =
    moodList.find((m) => m.type === selectedMoodType) || {
      type: selectedMoodType,
      label: currentMood.customLabel || selectedMoodType,
      icon: currentMood.customEmoji || '✨',
      variant: 'rose' as const,
    };

  // State Kho Meme / Ảnh đã lưu trong hệ thống
  const [savedMemes, setSavedMemes] = useState<{ id: string; url: string; createdAt: string }[]>(() => {
    try {
      const saved = localStorage.getItem('lovespace_saved_memes');
      const list = saved ? JSON.parse(saved) : [];
      if (currentMood.photoUrl && !list.some((m: any) => m.url === currentMood.photoUrl)) {
        return [{ id: 'current_photo', url: currentMood.photoUrl, createdAt: new Date().toISOString() }, ...list];
      }
      return list;
    } catch {
      return currentMood.photoUrl ? [{ id: 'current_photo', url: currentMood.photoUrl, createdAt: new Date().toISOString() }] : [];
    }
  });

  const [isAddingLink, setIsAddingLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const updated = [...moodList, newMood];
    setMoodList(updated);
    localStorage.setItem('lovespace_all_moods_list', JSON.stringify(updated));

    setSelectedMoodType(customType);
    setNewCustomLabel('');
    setIsCreatingCustom(false);
  };

  // Cho phép xóa bất kỳ tâm trạng nào trong danh sách
  const handleDeleteMood = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = moodList.filter((m) => m.type !== type);
    setMoodList(updated);
    localStorage.setItem('lovespace_all_moods_list', JSON.stringify(updated));
    if (selectedMoodType === type && updated.length > 0) {
      setSelectedMoodType(updated[0].type);
    }
  };

  // Khôi phục lại danh sách tâm trạng gốc ban đầu
  const handleResetDefaultMoods = () => {
    setMoodList(DEFAULT_RICH_MOODS);
    localStorage.setItem('lovespace_all_moods_list', JSON.stringify(DEFAULT_RICH_MOODS));
    setSelectedMoodType('happy');
  };

  // Tải ảnh từ máy và lưu luôn vào Kho Ảnh/Meme của 2 bạn
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setPhotoUrl(url);
        const newMeme = {
          id: `meme_${Date.now()}`,
          url,
          createdAt: new Date().toISOString(),
        };
        const updated = [newMeme, ...savedMemes.filter((m) => m.url !== url)];
        setSavedMemes(updated);
        localStorage.setItem('lovespace_saved_memes', JSON.stringify(updated));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = event.target?.result as string;
          setPhotoUrl(res);
          const newMeme = {
            id: `meme_${Date.now()}`,
            url: res,
            createdAt: new Date().toISOString(),
          };
          const updated = [newMeme, ...savedMemes.filter((m) => m.url !== res)];
          setSavedMemes(updated);
          localStorage.setItem('lovespace_saved_memes', JSON.stringify(updated));
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

  // Xóa ảnh khỏi kho lưu trữ
  const handleDeleteMeme = (memeId: string, memeUrl: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedMemes.filter((m) => m.id !== memeId);
    setSavedMemes(updated);
    localStorage.setItem('lovespace_saved_memes', JSON.stringify(updated));
    if (photoUrl === memeUrl) {
      setPhotoUrl('');
    }
  };

  // Dán link ảnh và lưu vào kho
  const handleSaveLinkToLibrary = () => {
    if (!photoUrl.trim()) return;
    const newMeme = {
      id: `meme_${Date.now()}`,
      url: photoUrl.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newMeme, ...savedMemes.filter((m) => m.url !== photoUrl.trim())];
    setSavedMemes(updated);
    localStorage.setItem('lovespace_saved_memes', JSON.stringify(updated));
    setIsAddingLink(false);
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
        {/* Hidden input for Device File Selector */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* 1. Chọn loại tâm trạng phong phú */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              1. Bạn đang cảm thấy thế nào? ({moodList.length})
            </label>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleResetDefaultMoods}
                className="text-[11px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 bg-slate-100/80 hover:bg-rose-50 px-2 py-1 rounded-full border border-slate-200 transition-colors"
                title="Khôi phục lại danh sách mặc định"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Mặc định</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingCustom(!isCreatingCustom)}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo riêng</span>
              </button>
            </div>
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

          {/* Grid Danh sách các tâm trạng đa dạng - Hỗ trợ xóa bất kỳ mục nào */}
          <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
            {moodList.map((opt) => {
              const isSelected = selectedMoodType === opt.type;
              return (
                <div
                  key={opt.type}
                  onClick={() => setSelectedMoodType(opt.type)}
                  className={`group relative flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all select-none cursor-pointer ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 shadow-md scale-102 font-black text-rose-700 ring-2 ring-rose-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-rose-200'
                  }`}
                >
                  {/* Nút Xóa bất kỳ tâm trạng nào */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteMood(opt.type, e)}
                    className="absolute top-1 right-1 p-1 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Xóa tâm trạng này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-2xl mb-1">{opt.icon}</span>
                  <span className="text-[11px] text-center leading-tight line-clamp-2">{opt.label}</span>
                </div>
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

        {/* 3. KHO ẢNH & MEME ĐÃ LƯU TRONG MÁY CHỦ (Thêm ảnh, Chọn ảnh, Xóa ảnh) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider">
              3. Kho Ảnh & Meme Đã Lưu ({savedMemes.length} ảnh):
            </label>
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="romantic"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm Ảnh Vào Kho 🖼️
              </Button>
            </div>
          </div>

          {isUploading && (
            <div className="w-full py-5 border-2 border-dashed border-rose-300 rounded-2xl flex flex-col items-center justify-center bg-rose-50/50 my-2 animate-pulse">
              <Loader2 className="w-6 h-6 text-rose-500 animate-spin mb-1" />
              <span className="text-xs font-bold text-rose-600">Đang tải ảnh mới lên kho lưu trữ...</span>
            </div>
          )}

          {/* Grid hiển thị tất cả các ảnh / meme đã lưu */}
          {savedMemes.length === 0 ? (
            <div className="text-center py-8 bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 p-4">
              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-600 mb-1">Kho meme/ảnh hiện đang trống</p>
              <p className="text-[11px] text-slate-400 mb-3">Bấm nút "Thêm Ảnh Vào Kho" để tải ảnh từ máy lên và lưu trữ mãi mãi.</p>
              <Button size="sm" variant="romantic" onClick={() => fileInputRef.current?.click()}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tải ảnh đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-52 overflow-y-auto p-1.5 bg-slate-50/60 rounded-2xl border border-slate-200">
              {savedMemes.map((meme) => {
                const isSelected = photoUrl === meme.url;
                return (
                  <div
                    key={meme.id}
                    onClick={() => setPhotoUrl(isSelected ? '' : meme.url)}
                    className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square bg-white shadow-xs ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-300 scale-102 shadow-md'
                        : 'border-slate-200 hover:border-rose-300 hover:scale-102'
                    }`}
                  >
                    <img
                      src={meme.url}
                      alt="Saved Meme"
                      className="w-full h-full object-cover"
                    />

                    {/* Dấu tích chọn */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                        <span className="p-1 rounded-full bg-rose-500 text-white shadow-md">
                          <Check className="w-4 h-4" />
                        </span>
                      </div>
                    )}

                    {/* Nút Xóa khỏi kho */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteMeme(meme.id, meme.url, e)}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white hover:bg-red-600 transition-colors opacity-90 sm:opacity-0 sm:group-hover:opacity-100 shadow-sm"
                      title="Xóa khỏi kho lưu trữ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tùy chọn dán link URL */}
          <div className="mt-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsAddingLink(!isAddingLink)}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{isAddingLink ? 'Ẩn ô dán link' : 'Hoặc dán URL link ảnh từ web'}</span>
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl('')}
                className="text-[11px] font-bold text-slate-400 hover:text-red-500"
              >
                ✕ Bỏ chọn ảnh
              </button>
            )}
          </div>

          {isAddingLink && (
            <div className="flex gap-2 mt-2 animate-fade-in">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Dán link ảnh (https://...)"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-400"
              />
              <Button size="sm" variant="romantic" onClick={handleSaveLinkToLibrary} disabled={!photoUrl.trim()}>
                Lưu vào kho
              </Button>
            </div>
          )}

          {/* Full preview with natural aspect ratio without cropping */}
          {photoUrl && !isUploading && (
            <div className="relative rounded-2xl overflow-hidden border border-rose-200/80 bg-slate-900/5 mt-2.5">
              <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 bg-rose-50/80 border-b border-rose-100 flex items-center justify-between">
                <span>Ảnh tâm trạng đang được chọn:</span>
                <span className="text-rose-600 font-black">✓ Đã chọn</span>
              </div>
              <img
                src={photoUrl}
                alt="Preview"
                className="w-full h-auto object-contain block"
              />
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
