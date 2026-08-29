import React, { useState, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { CoupleSettings } from '../../types/common.types';
import { Settings, Heart, Calendar, Volume2, VolumeX, Smartphone, Camera, Loader2, BellRing } from 'lucide-react';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';
import { requestNotificationPermission, showSystemNotification } from '../../services/notificationService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CoupleSettings;
  onSaveSettings: (newSettings: CoupleSettings) => void;
  onLogout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onLogout,
}) => {
  const [partner1Nick, setPartner1Nick] = useState(settings.partner1.nickname);
  const [partner1Avatar, setPartner1Avatar] = useState(settings.partner1.avatar);
  const [partner2Nick, setPartner2Nick] = useState(settings.partner2.nickname);
  const [partner2Avatar, setPartner2Avatar] = useState(settings.partner2.avatar);
  const [anniversaryDate, setAnniversaryDate] = useState(settings.anniversaryDate);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [hapticEnabled, setHapticEnabled] = useState(settings.hapticEnabled);

  const [uploadingRole, setUploadingRole] = useState<'husband' | 'wife' | null>(null);
  const husbandFileRef = useRef<HTMLInputElement>(null);
  const wifeFileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setPartner1Nick(settings.partner1.nickname);
      setPartner1Avatar(settings.partner1.avatar);
      setPartner2Nick(settings.partner2.nickname);
      setPartner2Avatar(settings.partner2.avatar);
      setAnniversaryDate(settings.anniversaryDate);
      setSoundEnabled(settings.soundEnabled);
      setHapticEnabled(settings.hapticEnabled);
    }
  }, [isOpen, settings]);

  const handleUploadAvatar = async (role: 'husband' | 'wife', file: File) => {
    setUploadingRole(role);
    try {
      const url = await uploadImageToCloudinary(file);
      if (role === 'husband') {
        setPartner1Avatar(url);
      } else {
        setPartner2Avatar(url);
      }
    } finally {
      setUploadingRole(null);
    }
  };

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      anniversaryDate,
      soundEnabled,
      hapticEnabled,
      partner1: {
        ...settings.partner1,
        nickname: partner1Nick.trim() || settings.partner1.nickname,
        avatar: partner1Avatar,
      },
      partner2: {
        ...settings.partner2,
        nickname: partner2Nick.trim() || settings.partner2.nickname,
        avatar: partner2Avatar,
      },
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Cài Đặt & Tùy Chỉnh Không Gian Yêu">
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* 1. Hồ sơ Chồng & Vợ */}
        <div className="space-y-3 p-3.5 bg-rose-50/70 rounded-2xl border border-rose-100">
          <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Biệt danh & Ảnh đại diện</span>
          </h4>

          {/* Chồng */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
            <div className="relative group">
              <Avatar src={partner1Avatar} alt="Chồng" size="md" borderVariant="rose" />
              <button
                onClick={() => husbandFileRef.current?.click()}
                disabled={uploadingRole === 'husband'}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploadingRole === 'husband' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                type="file"
                ref={husbandFileRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUploadAvatar('husband', e.target.files[0])}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Biệt danh Chồng:</label>
              <input
                type="text"
                value={partner1Nick}
                onChange={(e) => setPartner1Nick(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-rose-400"
                placeholder="Ví dụ: Anh Gấu 🐻"
              />
            </div>
          </div>

          {/* Vợ */}
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-rose-100 shadow-sm">
            <div className="relative group">
              <Avatar src={partner2Avatar} alt="Vợ" size="md" borderVariant="rose" />
              <button
                onClick={() => wifeFileRef.current?.click()}
                disabled={uploadingRole === 'wife'}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploadingRole === 'wife' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                type="file"
                ref={wifeFileRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUploadAvatar('wife', e.target.files[0])}
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-bold text-slate-500 mb-0.5">Biệt danh Vợ:</label>
              <input
                type="text"
                value={partner2Nick}
                onChange={(e) => setPartner2Nick(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-rose-400"
                placeholder="Ví dụ: Bé Thỏ 🐰"
              />
            </div>
          </div>
        </div>

        {/* 2. Ngày Kỷ Niệm */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-rose-500" />
            <span>Ngày Bắt Đầu Yêu Nhau:</span>
          </label>
          <input
            type="date"
            value={anniversaryDate}
            onChange={(e) => setAnniversaryDate(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* 3. Âm Thanh & Rung Phản Hồi */}
        <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-xs font-bold text-slate-700">Âm thanh tương tác (Audio FX)</span>
            </div>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-slate-700">Rung phản hồi (Haptic Touch)</span>
            </div>
            <input
              type="checkbox"
              checked={hapticEnabled}
              onChange={(e) => setHapticEnabled(e.target.checked)}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 4. Kiểm tra thông báo đẩy */}
        <div className="p-3 bg-pink-50 rounded-2xl border border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-rose-500" />
            <div>
              <span className="text-xs font-bold text-slate-800">Thông báo đẩy (Push)</span>
              <p className="text-[10px] text-slate-500">Nhận chuông khi người yêu nhắn tin, thả tim</p>
            </div>
          </div>
          <button
            type="button"
            onClick={async () => {
              const granted = await requestNotificationPermission();
              if (granted) {
                showSystemNotification('💖 Test Thông Báo', 'Thông báo đẩy của bạn đang hoạt động rất tốt!');
              }
            }}
            className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-600 text-[11px] font-bold shadow-sm active:scale-95 transition-all"
          >
            Thử ngay
          </button>
        </div>

        {/* 4. Tải file APK Android */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500 text-white">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">App Android (.APK)</span>
              <p className="text-[10px] text-slate-500">Tải file cài đặt trực tiếp vào điện thoại</p>
            </div>
          </div>
          <a
            href="/LoveSpace.apk"
            download="LoveSpace.apk"
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all"
          >
            Tải APK
          </a>
        </div>

        {/* 5. Đăng xuất / Đổi tài khoản */}
        {onLogout && (
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onLogout}
              className="w-full py-2 px-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Đăng Xuất / Đổi Tài Khoản Khác</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button variant="secondary" fullWidth onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" fullWidth onClick={handleSave}>
            Lưu Thay Đổi
          </Button>
        </div>
      </div>
    </Modal>
  );
};
