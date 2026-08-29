import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, X, Share, PlusSquare, Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);

  // Nếu app đã được cài đặt (đang chạy toàn màn hình độc lập) hoặc user đã bấm tắt banner -> không hiện banner
  if (isInstalled || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    const res = await triggerInstall();
    if (res.outcome === 'ios' || isIOS) {
      setIsIOSModalOpen(true);
    } else if (res.outcome === 'unsupported') {
      alert('Để cài đặt ứng dụng: Hãy bấm vào dấu 3 chấm ⋮ trên trình duyệt -> Chọn "Cài đặt ứng dụng" hoặc "Thêm vào Màn hình chính" nhé!');
    }
  };

  return (
    <>
      {/* Banner Cài Đặt App */}
      <div className="relative mb-3.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 text-white shadow-glow animate-fade-in flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md shrink-0">
            <Smartphone className="w-5 h-5 text-white animate-bounce" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-black truncate flex items-center gap-1.5">
              <span>Cài Đặt App LoveSpace</span>
              <span className="text-[10px] bg-white text-rose-600 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                Miễn Phí
              </span>
            </h4>
            <p className="text-[11px] text-rose-100 line-clamp-1">
              Thêm icon ngoài màn hình chính, mở toàn màn hình & nhận chuông thông báo!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3 py-1.5 bg-white text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Tải App</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
            title="Đóng banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Hướng Dẫn Cài Đặt Cho iPhone / iOS Safari */}
      <Modal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
        title="📱 Hướng Dẫn Cài Đặt Trên iPhone"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-600 font-medium">
            Chỉ với <strong>3 bước đơn giản</strong> trong trình duyệt Safari để thêm icon LoveSpace ngoài màn hình iPhone:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
                <Share className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-800">Bước 1:</strong>
                <p className="text-slate-600 mt-0.5">
                  Bấm vào biểu tượng <strong>Chia sẻ ⎋</strong> ở thanh công cụ dưới đáy trình duyệt Safari.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
                <PlusSquare className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-800">Bước 2:</strong>
                <p className="text-slate-600 mt-0.5">
                  Cuộn xuống chọn dòng <strong>"Thêm vào MH chính" (Add to Home Screen)</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-800">Bước 3:</strong>
                <p className="text-slate-600 mt-0.5">
                  Bấm nút <strong>"Thêm" (Add)</strong> ở góc trên bên phải màn hình.
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="romantic"
            fullWidth
            onClick={() => setIsIOSModalOpen(false)}
          >
            Đã Hiểu & Đi Cài Đặt ✨
          </Button>
        </div>
      </Modal>
    </>
  );
};
