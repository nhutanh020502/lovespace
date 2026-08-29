import React, { useState, useRef } from 'react';
import { MoodStatus, MoodType } from '../../../types/common.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Camera, Image as ImageIcon, Link as LinkIcon, Loader2, Sparkles } from 'lucide-react';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';

interface MoodPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: MoodStatus;
  onSaveMood: (updated: Partial<MoodStatus>) => void;
}

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onSaveMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood.mood);
  const [caption, setCaption] = useState(currentMood.caption);
  const [photoUrl, setPhotoUrl] = useState(currentMood.photoUrl || '');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const moodOptions: { type: MoodType; label: string; icon: string }[] = [
    { type: 'happy', label: 'Rất vui', icon: '🥰' },
    { type: 'missing_you', label: 'Nhớ anh/em', icon: '💭' },
    { type: 'pouting', label: 'Đang dỗi', icon: '😤' },
    { type: 'hungry', label: 'Đói bụng', icon: '🤤' },
    { type: 'tired', label: 'Mệt mỏi', icon: '😴' },
    { type: 'excited', label: 'Hào hứng', icon: '🥳' },
    { type: 'busy', label: 'Bận việc', icon: '💼' },
    { type: 'sick', label: 'Bị ốm', icon: '🤒' },
  ];

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
      mood: selectedMood,
      caption: caption.trim() || 'Hôm nay thế nào?',
      photoUrl: photoUrl.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cập Nhật Trạng Thái & Cảm Xúc 💖" maxWidth="lg">
      <div className="space-y-4">
        {/* Hidden inputs */}
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

        {/* 1. Chọn loại tâm trạng */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
            1. Bạn đang cảm thấy thế nào?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {moodOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => setSelectedMood(opt.type)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                  selectedMood === opt.type
                    ? 'border-rose-400 bg-rose-50 shadow-md scale-105 font-bold text-rose-700'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-2xl mb-1">{opt.icon}</span>
                <span className="text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Dòng suy nghĩ / Caption */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            2. Lời nhắn / Dòng suy nghĩ:
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Ví dụ: Đang nhớ người yêu nhiều lắm..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* 3. Tải Ảnh / Chụp Ảnh / Dán Link */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
            3. Hình ảnh / Meme cảm xúc (Hiện đầy đủ không bị cắt):
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
              Chụp Ảnh Ngay
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
              Chọn Từ Máy
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
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors text-xs font-bold"
                title="Bỏ ảnh"
              >
                ✕ Xóa ảnh
              </button>
            </div>
          )}
        </div>

        {/* Nút lưu */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" fullWidth onClick={handleSave} disabled={isUploading}>
            <Sparkles className="w-4 h-4 mr-1.5" />
            Cập Nhật Ngay
          </Button>
        </div>
      </div>
    </Modal>
  );
};
