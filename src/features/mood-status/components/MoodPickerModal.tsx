import React, { useState, useRef } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { MoodType, MoodStatus } from '../../../types/common.types';
import { PRESET_MEMES } from '../../../constants/initialMockData';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';
import { Sparkles, Camera, Image as ImageIcon, Check, Loader2 } from 'lucide-react';

interface MoodPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMood: MoodStatus;
  onSaveMood: (updatedMood: Partial<MoodStatus>) => void;
}

export const MoodPickerModal: React.FC<MoodPickerModalProps> = ({
  isOpen,
  onClose,
  currentMood,
  onSaveMood,
}) => {
  const [selectedMood, setSelectedMood] = useState<MoodType>(currentMood.mood);
  const [caption, setCaption] = useState(currentMood.caption || '');
  const [photoUrl, setPhotoUrl] = useState(currentMood.photoUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Đồng bộ lại state mỗi khi mở modal hoặc currentMood đổi
  React.useEffect(() => {
    if (isOpen) {
      setSelectedMood(currentMood.mood);
      setCaption(currentMood.caption || '');
      setPhotoUrl(currentMood.photoUrl || '');
    }
  }, [isOpen, currentMood]);

  const moodOptions: Array<{ type: MoodType; label: string; icon: string; bg: string }> = [
    { type: 'happy', label: 'Vui vẻ', icon: '🥰', bg: 'bg-rose-100 text-rose-700' },
    { type: 'pouting', label: 'Đang dỗi', icon: '😤', bg: 'bg-orange-100 text-orange-700' },
    { type: 'hungry', label: 'Đói bụng', icon: '🤤', bg: 'bg-amber-100 text-amber-700' },
    { type: 'tired', label: 'Mệt mỏi', icon: '😴', bg: 'bg-indigo-100 text-indigo-700' },
    { type: 'missing_you', label: 'Đang nhớ', icon: '💭', bg: 'bg-pink-100 text-pink-700' },
    { type: 'sick', label: 'Hơi ốm', icon: '🤒', bg: 'bg-red-100 text-red-700' },
    { type: 'busy', label: 'Đang bận', icon: '💼', bg: 'bg-slate-100 text-slate-700' },
    { type: 'excited', label: 'Hào hứng', icon: '🥳', bg: 'bg-emerald-100 text-emerald-700' },
  ];

  // Xử lý upload ảnh từ thiết bị
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setPhotoUrl(url);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSelectPresetMeme = (meme: typeof PRESET_MEMES[0]) => {
    setPhotoUrl(meme.url);
    if (meme.mood) {
      setSelectedMood(meme.mood as MoodType);
    }
  };

  const handleSave = () => {
    onSaveMood({
      mood: selectedMood,
      caption: caption.trim() || 'Hôm nay cảm xúc thế này nè ❤️',
      photoUrl: photoUrl || currentMood.photoUrl,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cập Nhật Trạng Thái & Cảm Xúc 💖" maxWidth="lg">
      <div className="space-y-5">
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
            placeholder="Ví dụ: Đang thèm trà sữa quá, ai mua cho là hết dỗi..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
          />
        </div>

        {/* 3. Chọn Hình Ảnh / Meme hoặc Chụp Ảnh Thật */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Chọn Ảnh / Meme Cảm Xúc (Theo yêu cầu của vợ) 📸
            </label>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200"
            >
              <Camera className="w-3.5 h-3.5" />
              Tải ảnh thật / Selfie
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {isUploading ? (
            <div className="w-full py-6 border-2 border-dashed border-rose-300 rounded-2xl flex flex-col items-center justify-center bg-rose-50/50 my-2">
              <Loader2 className="w-6 h-6 text-rose-500 animate-spin mb-1" />
              <span className="text-xs font-bold text-rose-600">Đang tải ảnh lên Cloudinary...</span>
            </div>
          ) : (
            /* Kho meme có sẵn */
            <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto p-1">
              {PRESET_MEMES.map((meme) => (
                <div
                  key={meme.id}
                  onClick={() => handleSelectPresetMeme(meme)}
                  className={`relative group rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    photoUrl === meme.url
                      ? 'border-rose-500 ring-2 ring-rose-300 scale-100'
                      : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={meme.url} alt={meme.title} className="w-full h-20 object-cover rounded-xl" />
                  <span className="absolute bottom-1 left-1 right-1 text-[10px] font-bold bg-black/60 text-white px-1.5 py-0.5 rounded-md truncate">
                    {meme.title}
                  </span>
                  {photoUrl === meme.url && (
                    <div className="absolute top-1 right-1 bg-rose-500 text-white p-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Preview ảnh đã chọn */}
          {photoUrl && (
            <div className="mt-3 flex items-center gap-3 p-2 bg-rose-50/70 border border-rose-200/60 rounded-2xl">
              <img src={photoUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm" />
              <div className="flex-1 text-xs">
                <span className="font-semibold text-slate-700">Ảnh cảm xúc đang chọn</span>
                <p className="text-slate-500 text-[11px]">Sẽ hiện to trên màn hình người yêu</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setPhotoUrl('')}>
                Bỏ ảnh
              </Button>
            </div>
          )}
        </div>

        {/* Nút lưu */}
        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" fullWidth onClick={handleSave}>
            <Sparkles className="w-4 h-4 mr-1.5" />
            Cập Nhật Ngay
          </Button>
        </div>
      </div>
    </Modal>
  );
};
