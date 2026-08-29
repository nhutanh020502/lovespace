import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Heart, Sparkles, Phone, User, KeyRound, Copy, Check, Share2, Loader2, ArrowLeft } from 'lucide-react';
import { triggerLoveConfetti, triggerCelebration } from '../../../components/ui/ConfettiEffect';
import {
  findCoupleByPhone,
  createCoupleSpace,
  joinCoupleSpace,
  CoupleRecord,
} from '../../../services/supabaseSync';
import { supabase, isSupabaseConfigured } from '../../../services/supabaseClient';

interface AuthAndPairingViewProps {
  onAuthSuccess: (session: {
    phone: string;
    name: string;
    role: 'husband' | 'wife';
    coupleId: string;
    partnerName: string;
    partnerPhone?: string;
    anniversaryDate?: string;
  }) => void;
}

export const AuthAndPairingView: React.FC<AuthAndPairingViewProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'welcome' | 'create' | 'join' | 'waiting'>('welcome');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'husband' | 'wife'>('husband');
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [createdCouple, setCreatedCouple] = useState<CoupleRecord | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // 1. Tự động kiểm tra nếu SĐT đã có không gian đôi
  const handleQuickLogin = async () => {
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ!');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const couple = await findCoupleByPhone(phone.trim());
      if (couple) {
        const isPartner1 = couple.partner1_phone === phone.trim();
        const userRole = isPartner1 ? couple.partner1_role : (couple.partner2_role || 'wife');
        const userName = isPartner1 ? couple.partner1_name : (couple.partner2_name || name.trim() || 'Người Yêu');
        const partnerName = isPartner1 ? (couple.partner2_name || 'Người Yêu') : couple.partner1_name;
        const partnerPhone = isPartner1 ? couple.partner2_phone : couple.partner1_phone;

        triggerCelebration();
        onAuthSuccess({
          phone: phone.trim(),
          name: userName,
          role: userRole,
          coupleId: couple.id,
          partnerName,
          partnerPhone,
          anniversaryDate: couple.anniversary_date,
        });
      } else {
        setErrorMessage('Số điện thoại này chưa được đăng ký không gian yêu nào. Hãy bấm "Tạo Không Gian Yêu" hoặc "Nhập Mã" nhé!');
      }
    } catch {
      setErrorMessage('Không thể kiểm tra tài khoản. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Tạo không gian yêu mới
  const handleCreateSpace = async () => {
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ (ít nhất 9 số)!');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên hoặc biệt danh của bạn!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const couple = await createCoupleSpace(phone.trim(), name.trim(), role);
      if (couple) {
        setCreatedCouple(couple);
        setMode('waiting');
        triggerLoveConfetti();
      } else {
        setErrorMessage('Không thể tạo phòng lúc này. Vui lòng thử lại!');
      }
    } catch {
      setErrorMessage('Lỗi kết nối khi tạo phòng.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Tham gia phòng bằng mã mời
  const handleJoinSpace = async () => {
    if (!phone.trim() || phone.trim().length < 9) {
      setErrorMessage('Vui lòng nhập số điện thoại của bạn!');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên / biệt danh của bạn!');
      return;
    }
    if (!inviteCodeInput.trim()) {
      setErrorMessage('Vui lòng nhập mã ghép đôi do người yêu gửi!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await joinCoupleSpace(inviteCodeInput.trim(), phone.trim(), name.trim());
      if (res.success && res.couple) {
        triggerCelebration();
        const couple = res.couple;
        const isPartner1 = couple.partner1_phone === phone.trim();
        const userRole = isPartner1 ? couple.partner1_role : (couple.partner2_role || 'wife');
        const partnerName = isPartner1 ? (couple.partner2_name || 'Người Yêu') : couple.partner1_name;

        onAuthSuccess({
          phone: phone.trim(),
          name: name.trim(),
          role: userRole,
          coupleId: couple.id,
          partnerName,
          partnerPhone: isPartner1 ? couple.partner2_phone : couple.partner1_phone,
          anniversaryDate: couple.anniversary_date,
        });
      } else {
        setErrorMessage(res.message || 'Mã ghép đôi không chính xác hoặc đã đủ 2 người!');
      }
    } catch {
      setErrorMessage('Lỗi khi tham gia không gian.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Lắng nghe Realtime khi đang ở màn hình chờ (Waiting Screen)
  useEffect(() => {
    if (mode !== 'waiting' || !createdCouple || !isSupabaseConfigured || !supabase) return;

    const channel = supabase
      .channel(`couple_wait_${createdCouple.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${createdCouple.id}`,
        },
        (payload: any) => {
          const updated = payload.new as CoupleRecord;
          if (updated && updated.status === 'active' && updated.partner2_phone) {
            triggerCelebration();
            onAuthSuccess({
              phone: updated.partner1_phone,
              name: updated.partner1_name,
              role: updated.partner1_role,
              coupleId: updated.id,
              partnerName: updated.partner2_name || 'Người Yêu',
              partnerPhone: updated.partner2_phone,
              anniversaryDate: updated.anniversary_date,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [mode, createdCouple, onAuthSuccess]);

  const handleCopyCode = () => {
    if (createdCouple) {
      navigator.clipboard.writeText(createdCouple.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareZalo = () => {
    if (createdCouple) {
      const text = `Bé yêu ơi, vào Không Gian Yêu của chúng mình nhé! Mã ghép đôi của 2 đứa mình là: ${createdCouple.invite_code}. Mở app tại: ${window.location.origin}`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      alert('Đã copy lời mời ngọt ngào kèm mã ghép đôi! Bạn hãy dán gửi qua Zalo / Messenger cho người yêu nhé 💕');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100 flex items-center justify-center p-4 selection:bg-rose-200">
      <Card variant="glass" className="w-full max-w-md p-6 sm:p-8 border border-white/80 shadow-2xl relative overflow-hidden">
        {/* Decorative Top Heart Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white shadow-glow mb-2">
            <Heart className="w-8 h-8 fill-white animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">LoveSpace 💕</h1>
          <p className="text-xs font-semibold text-rose-600 mt-0.5">Không gian riêng tư chỉ dành cho 2 người</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50/90 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold animate-shake">
            {errorMessage}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: MÀN HÌNH CHỌN TẠO PHÒNG HOẶC NHẬP MÃ */}
        {/* ========================================================================= */}
        {mode === 'welcome' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-500" />
                <span>Số điện thoại của bạn:</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                className="w-full bg-white/90 border border-rose-200 rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-sm"
              />
            </div>

            <div className="pt-2 space-y-2.5">
              <Button
                variant="romantic"
                fullWidth
                size="lg"
                onClick={() => {
                  if (!phone.trim()) {
                    setErrorMessage('Vui lòng nhập số điện thoại trước!');
                    return;
                  }
                  setMode('create');
                }}
                className="shadow-glow"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Tạo Không Gian Yêu Mới
              </Button>

              <Button
                variant="outline"
                fullWidth
                size="lg"
                onClick={() => {
                  if (!phone.trim()) {
                    setErrorMessage('Vui lòng nhập số điện thoại trước!');
                    return;
                  }
                  setMode('join');
                }}
              >
                <KeyRound className="w-4 h-4 mr-1.5 text-rose-500" />
                Tôi Đã Có Mã Ghép Đôi
              </Button>

              <button
                type="button"
                onClick={handleQuickLogin}
                disabled={isLoading}
                className="w-full py-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors"
              >
                {isLoading ? 'Đang kiểm tra...' : 'Đã từng tạo phòng? Bấm vào đây để vào lại'}
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: TẠO KHÔNG GIAN YÊU MỚI */}
        {/* ========================================================================= */}
        {mode === 'create' && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setMode('welcome')}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-500" />
                <span>Tên / Biệt danh của bạn:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Anh Gấu, Chồng Iu..."
                className="w-full bg-white/90 border border-rose-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Vai trò của bạn trong mối quan hệ:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('husband')}
                  className={`py-3 px-3 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                    role === 'husband'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-102'
                      : 'bg-white/80 text-slate-600 border-rose-100 hover:bg-rose-50'
                  }`}
                >
                  <span className="text-xl">🐻</span>
                  <span>Chồng (Anh Yêu)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('wife')}
                  className={`py-3 px-3 rounded-2xl text-xs font-black border transition-all flex flex-col items-center gap-1 ${
                    role === 'wife'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-102'
                      : 'bg-white/80 text-slate-600 border-rose-100 hover:bg-rose-50'
                  }`}
                >
                  <span className="text-xl">🐰</span>
                  <span>Vợ (Bé Yêu)</span>
                </button>
              </div>
            </div>

            <Button
              variant="romantic"
              fullWidth
              size="lg"
              onClick={handleCreateSpace}
              disabled={isLoading}
              className="mt-2 shadow-glow"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {isLoading ? 'Đang tạo không gian...' : 'Tạo Mã Ghép Đôi Ngay 💕'}
            </Button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: NHẬP MÃ GHÉP ĐÔI TỪ NGƯỜI YÊU */}
        {/* ========================================================================= */}
        {mode === 'join' && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setMode('welcome')}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-rose-500" />
                <span>Tên / Biệt danh của bạn:</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ví dụ: Bé Thỏ, Vợ Nhỏ..."
                className="w-full bg-white/90 border border-rose-200 rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-500 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                <span>Nhập mã ghép đôi (6 ký tự):</span>
              </label>
              <input
                type="text"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                placeholder="Ví dụ: LOVE88"
                maxLength={8}
                className="w-full bg-white/90 border-2 border-rose-300 rounded-2xl px-4 py-3 text-center text-lg font-black tracking-widest text-rose-600 uppercase focus:outline-none focus:border-rose-500 shadow-sm"
              />
            </div>

            <Button
              variant="romantic"
              fullWidth
              size="lg"
              onClick={handleJoinSpace}
              disabled={isLoading}
              className="mt-2 shadow-glow"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Heart className="w-4 h-4 mr-2 fill-white" />}
              {isLoading ? 'Đang xác nhận ghép đôi...' : 'Xác Nhận Vào Nhà Cùng Người Yêu 💕'}
            </Button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 4: MÀN HÌNH CHỜ NGƯỜI YÊU NHẬP MÃ (WAITING REALTIME) */}
        {/* ========================================================================= */}
        {mode === 'waiting' && createdCouple && (
          <div className="text-center space-y-4 animate-fade-in py-2">
            <div className="p-4 bg-rose-50 rounded-3xl border border-rose-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã ghép đôi của bạn</span>
              <div className="text-3xl font-black text-rose-600 tracking-widest my-2 select-all font-mono">
                {createdCouple.invite_code}
              </div>
              <p className="text-[11px] text-slate-500">
                Hãy gửi mã này cho người yêu để cùng bước vào Không Gian Yêu nhé!
              </p>
            </div>

            {/* Waiting Animation */}
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-rose-600 py-1">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>Đang đợi người yêu ghép đôi...</span>
            </div>

            <div className="space-y-2">
              <Button variant="romantic" fullWidth size="lg" onClick={handleShareZalo} className="shadow-glow">
                <Share2 className="w-4 h-4 mr-2" />
                Gửi Lời Mời Qua Zalo / Messenger
              </Button>

              <Button variant="outline" fullWidth size="sm" onClick={handleCopyCode}>
                {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                {copied ? 'Đã sao chép mã thành công!' : 'Sao chép mã'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
