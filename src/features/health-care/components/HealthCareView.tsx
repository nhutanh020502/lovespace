import React, { useState } from 'react';
import { HealthStatus, UserRole, UserProfile } from '../../../types/common.types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import {
  HeartPulse,
  AlertTriangle,
  Pill,
  Heart,
  ShieldAlert,
  Plus,
  Sparkles,
  Bell,
  CalendarHeart,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { formatDateVi } from '../../../utils/dateUtils';

interface HealthCareViewProps {
  currentRole: UserRole;
  partner1: UserProfile;
  partner2: UserProfile;
  healthData: Record<string, HealthStatus>;
  onUpdateHealth: (userId: string, updated: Partial<HealthStatus>) => void;
  onRemindMedicine: (medName: string) => void;
}

export const HealthCareView: React.FC<HealthCareViewProps> = ({
  currentRole,
  partner1,
  partner2,
  healthData,
  onUpdateHealth,
  onRemindMedicine,
}) => {
  // Tab chọn xem & quản lý hồ sơ sức khỏe của ai (mặc định mở người yêu hoặc bản thân)
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>(
    currentRole === 'husband' ? 'wife' : 'husband'
  );

  const targetUser = selectedTargetRole === 'husband' ? partner1 : partner2;
  const health: HealthStatus = healthData[targetUser.id] || {
    userId: targetUser.id,
    illnessName: 'Khỏe mạnh bình thường',
    symptoms: '',
    severity: 'mild',
    medicines: [],
    allergies: [],
    dislikedFoods: [],
    favoriteComfortFoods: [],
    lastUpdated: new Date().toISOString(),
  };

  // State cho inline input thêm nhanh Dị ứng, Món ghét, Món khoái khẩu
  const [newAllergyText, setNewAllergyText] = useState('');
  const [isAddingAllergy, setIsAddingAllergy] = useState(false);

  const [newDislikeText, setNewDislikeText] = useState('');
  const [isAddingDislike, setIsAddingDislike] = useState(false);

  const [newComfortText, setNewComfortText] = useState('');
  const [isAddingComfort, setIsAddingComfort] = useState(false);

  // State cho Modal Sửa Tình Trạng Bệnh (Illness & Symptoms)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editIllness, setEditIllness] = useState(health.illnessName || '');
  const [editSymptoms, setEditSymptoms] = useState(health.symptoms || '');
  const [editSeverity, setEditSeverity] = useState<'mild' | 'moderate' | 'severe'>(health.severity || 'mild');

  // State cho Modal Sửa / Thêm Thuốc
  const [isMedModalOpen, setIsMedModalOpen] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTimes, setMedTimes] = useState('08:00, 19:30');
  const [medNote, setMedNote] = useState('');

  // State cho Modal Sửa Chu Kỳ (Vợ)
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState(
    health.periodTracking?.lastPeriodDate || new Date().toISOString().split('T')[0]
  );
  const [cycleDays, setCycleDays] = useState(health.periodTracking?.cycleLengthDays || 28);
  const [periodNotes, setPeriodNotes] = useState(
    health.periodTracking?.notes || 'Uống nước ấm, chuẩn bị túi chườm và kiên nhẫn hơn vào những ngày nhạy cảm nhé! ❤️'
  );

  // State cho chỉnh sửa món khoái khẩu
  const [editingComfortIndex, setEditingComfortIndex] = useState<number | null>(null);
  const [editComfortValue, setEditComfortValue] = useState('');

  // =========================================================================
  // CRUD HANDLERS - 100% CẬP NHẬT TỰ ĐỘNG
  // =========================================================================

  // 1. Dị ứng (Allergies)
  const handleAddAllergy = () => {
    if (!newAllergyText.trim()) return;
    const clean = newAllergyText.trim();
    if (health.allergies.includes(clean)) {
      setNewAllergyText('');
      setIsAddingAllergy(false);
      return;
    }
    const updated = [...health.allergies, clean];
    onUpdateHealth(targetUser.id, {
      allergies: updated,
      lastUpdated: new Date().toISOString(),
    });
    setNewAllergyText('');
    setIsAddingAllergy(false);
  };

  const handleDeleteAllergy = (idx: number) => {
    const updated = health.allergies.filter((_, i) => i !== idx);
    onUpdateHealth(targetUser.id, {
      allergies: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  // 2. Món ghét / Kỵ (Disliked Foods)
  const handleAddDislike = () => {
    if (!newDislikeText.trim()) return;
    const clean = newDislikeText.trim();
    if (health.dislikedFoods.includes(clean)) {
      setNewDislikeText('');
      setIsAddingDislike(false);
      return;
    }
    const updated = [...health.dislikedFoods, clean];
    onUpdateHealth(targetUser.id, {
      dislikedFoods: updated,
      lastUpdated: new Date().toISOString(),
    });
    setNewDislikeText('');
    setIsAddingDislike(false);
  };

  const handleDeleteDislike = (idx: number) => {
    const updated = health.dislikedFoods.filter((_, i) => i !== idx);
    onUpdateHealth(targetUser.id, {
      dislikedFoods: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  // 3. Món khoái khẩu dỗ dành (Comfort Foods)
  const handleAddComfort = () => {
    if (!newComfortText.trim()) return;
    const clean = newComfortText.trim();
    const updated = [...health.favoriteComfortFoods, clean];
    onUpdateHealth(targetUser.id, {
      favoriteComfortFoods: updated,
      lastUpdated: new Date().toISOString(),
    });
    setNewComfortText('');
    setIsAddingComfort(false);
  };

  const handleSaveEditComfort = (idx: number) => {
    if (!editComfortValue.trim()) return;
    const updated = [...health.favoriteComfortFoods];
    updated[idx] = editComfortValue.trim();
    onUpdateHealth(targetUser.id, {
      favoriteComfortFoods: updated,
      lastUpdated: new Date().toISOString(),
    });
    setEditingComfortIndex(null);
  };

  const handleDeleteComfort = (idx: number) => {
    const updated = health.favoriteComfortFoods.filter((_, i) => i !== idx);
    onUpdateHealth(targetUser.id, {
      favoriteComfortFoods: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  // 4. Lưu Tình Trạng Bệnh
  const handleSaveStatus = () => {
    onUpdateHealth(targetUser.id, {
      illnessName: editIllness.trim() || 'Khỏe mạnh bình thường',
      symptoms: editSymptoms.trim(),
      severity: editSeverity,
      lastUpdated: new Date().toISOString(),
    });
    setIsStatusModalOpen(false);
  };

  // 5. Thuốc & Toa thuốc
  const handleOpenAddMed = () => {
    setEditingMedId(null);
    setMedName('');
    setMedDosage('');
    setMedTimes('08:00, 19:30');
    setMedNote('');
    setIsMedModalOpen(true);
  };

  const handleOpenEditMed = (med: any) => {
    setEditingMedId(med.id);
    setMedName(med.name);
    setMedDosage(med.dosage);
    setMedTimes(med.timeToTake.join(', '));
    setMedNote(med.note || '');
    setIsMedModalOpen(true);
  };

  const handleSaveMedicine = () => {
    if (!medName.trim()) return;
    const timesArray = medTimes.split(',').map((t) => t.trim()).filter(Boolean);

    let updatedMeds = [...health.medicines];
    if (editingMedId) {
      updatedMeds = updatedMeds.map((m) =>
        m.id === editingMedId
          ? {
              ...m,
              name: medName.trim(),
              dosage: medDosage.trim() || '1 liều',
              timeToTake: timesArray,
              note: medNote.trim(),
            }
          : m
      );
    } else {
      updatedMeds.push({
        id: 'med_' + Date.now(),
        name: medName.trim(),
        dosage: medDosage.trim() || '1 liều',
        timeToTake: timesArray,
        note: medNote.trim(),
      });
    }

    onUpdateHealth(targetUser.id, {
      medicines: updatedMeds,
      lastUpdated: new Date().toISOString(),
    });
    setIsMedModalOpen(false);
  };

  const handleDeleteMedicine = (medId: string) => {
    const updated = health.medicines.filter((m) => m.id !== medId);
    onUpdateHealth(targetUser.id, {
      medicines: updated,
      lastUpdated: new Date().toISOString(),
    });
  };

  // 6. Lưu Chu kỳ (Vợ)
  const handleSavePeriod = () => {
    onUpdateHealth(targetUser.id, {
      periodTracking: {
        lastPeriodDate,
        cycleLengthDays: Number(cycleDays) || 28,
        notes: periodNotes.trim(),
      },
      lastUpdated: new Date().toISOString(),
    });
    setIsPeriodModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 1. Header Chọn Hồ Sơ & Nút Chuyển Đổi */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-200/60 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-glow">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
              Hồ Sơ Sức Khỏe & Chăm Sóc
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Không bỏ sót toa thuốc, kỵ món & bí kíp dỗ dành 💕
            </p>
          </div>
        </div>

        {/* Nút Tab Chuyển đổi Chồng <-> Vợ */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-rose-50 rounded-2xl border border-rose-100">
          <button
            onClick={() => setSelectedTargetRole('husband')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedTargetRole === 'husband'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span>🐻 {partner1.nickname || partner1.name}</span>
          </button>
          <button
            onClick={() => setSelectedTargetRole('wife')}
            className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedTargetRole === 'wife'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span>🐰 {partner2.nickname || partner2.name}</span>
          </button>
        </div>
      </div>

      {/* 2. Banner Tình Trạng Bệnh & Triệu Chứng Hiện Tại */}
      <Card
        variant="glass"
        className={`p-4 sm:p-5 border-l-4 ${
          health.severity === 'severe'
            ? 'border-l-red-500 bg-red-50/40'
            : health.severity === 'moderate'
            ? 'border-l-amber-500 bg-amber-50/40'
            : 'border-l-emerald-500 bg-emerald-50/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {health.severity === 'severe' ? '🤒' : health.severity === 'moderate' ? '🤧' : '💖'}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-800">
                  {health.illnessName || 'Khỏe mạnh bình thường'}
                </h3>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    health.severity === 'severe'
                      ? 'bg-red-100 text-red-700'
                      : health.severity === 'moderate'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {health.severity === 'severe' ? 'Cần chăm sóc gấp' : health.severity === 'moderate' ? 'Cần theo dõi' : 'Bình thường'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật lần cuối: {formatDateVi(health.lastUpdated)}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditIllness(health.illnessName || '');
              setEditSymptoms(health.symptoms || '');
              setEditSeverity(health.severity || 'mild');
              setIsStatusModalOpen(true);
            }}
            className="shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1" />
            <span>Sửa Tình Trạng</span>
          </Button>
        </div>

        {health.symptoms && (
          <div className="mt-2.5 p-2.5 rounded-2xl bg-white/80 border border-slate-200/60 text-xs text-slate-700">
            <strong className="text-slate-800">Triệu chứng:</strong> {health.symptoms}
          </div>
        )}
      </Card>

      {/* 3. DỊ ỨNG & MÓN GHÉT (FULL CRUD INLINE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* CARD DỊ ỨNG / KỴ THUỐC */}
        <Card variant="glass" className="p-4 border-l-4 border-l-red-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Dị Ứng / Kỵ Thuốc (Tránh Xa)
                </h4>
              </div>
              <button
                onClick={() => setIsAddingAllergy(true)}
                className="p-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-0.5 transition-all"
                title="Thêm dị ứng"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[11px]">Thêm</span>
              </button>
            </div>

            {/* Danh sách Dị ứng */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {health.allergies.length > 0 ? (
                health.allergies.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold animate-fade-in"
                  >
                    <span>⛔ {item}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAllergy(idx)}
                      className="w-3.5 h-3.5 rounded-full hover:bg-red-200/80 flex items-center justify-center text-red-500 hover:text-red-800 transition-colors"
                      title="Xóa dị ứng này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Chưa có dị ứng nào. Bấm "+ Thêm" để lưu!</span>
              )}
            </div>
          </div>

          {/* Ô nhập thêm nhanh Dị ứng */}
          {isAddingAllergy && (
            <div className="mt-3 pt-2.5 border-t border-red-100 flex items-center gap-1.5 animate-fade-in">
              <input
                type="text"
                value={newAllergyText}
                onChange={(e) => setNewAllergyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAllergy()}
                placeholder="Ví dụ: Tôm cua, Phấn hoa, Aspirin..."
                autoFocus
                className="flex-1 bg-white border border-red-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-400"
              />
              <button
                onClick={handleAddAllergy}
                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsAddingAllergy(false);
                  setNewAllergyText('');
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </Card>

        {/* CARD MÓN KHÔNG ĂN ĐƯỢC / GHÉT */}
        <Card variant="glass" className="p-4 border-l-4 border-l-amber-500 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Món Không Ăn Được / Ghét
                </h4>
              </div>
              <button
                onClick={() => setIsAddingDislike(true)}
                className="p-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-bold flex items-center gap-0.5 transition-all"
                title="Thêm món ghét"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-[11px]">Thêm</span>
              </button>
            </div>

            {/* Danh sách Món ghét */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
              {health.dislikedFoods.length > 0 ? (
                health.dislikedFoods.map((item, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold animate-fade-in"
                  >
                    <span>🚫 {item}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteDislike(idx)}
                      className="w-3.5 h-3.5 rounded-full hover:bg-amber-200/80 flex items-center justify-center text-amber-600 hover:text-amber-900 transition-colors"
                      title="Xóa món này"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">Ăn được mọi món! Bấm "+ Thêm" để lưu món kỵ.</span>
              )}
            </div>
          </div>

          {/* Ô nhập thêm nhanh Món ghét */}
          {isAddingDislike && (
            <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center gap-1.5 animate-fade-in">
              <input
                type="text"
                value={newDislikeText}
                onChange={(e) => setNewDislikeText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDislike()}
                placeholder="Ví dụ: Hành lá, Ngò gai, Đồ quá béo..."
                autoFocus
                className="flex-1 bg-white border border-amber-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleAddDislike}
                className="p-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setIsAddingDislike(false);
                  setNewDislikeText('');
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* 4. MÓN KHOÁI KHẨU (COMFORT FOODS - CỨ MUA LÀ HẾT GIẬN) */}
      <Card variant="romantic" className="p-4 sm:p-5 border border-pink-200">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-pink-500 text-white shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800">
                Món Khoái Khẩu ("Cứ Mua Là Hết Giận") 🧋✨
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Bí kíp dỗ dành ngọt ngào mọi lúc</p>
            </div>
          </div>

          <Button
            variant="romantic"
            size="sm"
            onClick={() => setIsAddingComfort(true)}
            className="shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Thêm Món</span>
          </Button>
        </div>

        {/* Ô thêm nhanh món khoái khẩu */}
        {isAddingComfort && (
          <div className="mb-3 p-3 rounded-2xl bg-white/90 border border-pink-200 flex items-center gap-2 animate-fade-in shadow-sm">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500 shrink-0" />
            <input
              type="text"
              value={newComfortText}
              onChange={(e) => setNewComfortText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComfort()}
              placeholder="Ví dụ: Trà sữa Ô Long nướng (50% đường, 30% đá), Tokbokki..."
              autoFocus
              className="flex-1 bg-transparent text-xs font-bold text-slate-800 focus:outline-none placeholder:font-normal"
            />
            <button
              onClick={handleAddComfort}
              className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Lưu
            </button>
            <button
              onClick={() => {
                setIsAddingComfort(false);
                setNewComfortText('');
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Danh sách các món khoái khẩu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {health.favoriteComfortFoods.length > 0 ? (
            health.favoriteComfortFoods.map((food, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/90 hover:bg-white border border-pink-100 shadow-sm transition-all text-xs font-bold text-slate-800"
              >
                {editingComfortIndex === idx ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <input
                      type="text"
                      value={editComfortValue}
                      onChange={(e) => setEditComfortValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEditComfort(idx)}
                      autoFocus
                      className="flex-1 bg-pink-50 border border-pink-200 rounded-xl px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEditComfort(idx)}
                      className="p-1 bg-pink-500 text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingComfortIndex(null)}
                      className="p-1 text-slate-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 shrink-0 animate-pulse" />
                      <span className="truncate">{food}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setEditingComfortIndex(idx);
                          setEditComfortValue(food);
                        }}
                        className="p-1 text-slate-400 hover:text-pink-600 rounded-lg transition-colors"
                        title="Sửa món"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteComfort(idx)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Xóa món"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full py-4 text-center text-xs text-slate-400 italic">
              Chưa có món khoái khẩu nào. Bấm nút "+ Thêm Món" để ghi nhớ nhé!
            </div>
          )}
        </div>
      </Card>

      {/* 5. TOA THUỐC & LỊCH UỐNG THUỐC (FULL CRUD) */}
      <Card variant="glass" className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-indigo-500 text-white shadow-glow">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800">
                Toa Thuốc & Lịch Uống Đều Đặn 💊
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Bấm "Nhắc" để gửi chuông nhắc nhở qua máy người yêu</p>
            </div>
          </div>

          <Button variant="romantic" size="sm" onClick={handleOpenAddMed} className="shrink-0">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Thêm Thuốc</span>
          </Button>
        </div>

        {health.medicines.length === 0 ? (
          <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
            Hiện không cần uống thuốc gì. Chúc hai bạn luôn tràn đầy sức khỏe! 🌸
          </div>
        ) : (
          <div className="space-y-2.5">
            {health.medicines.map((med) => (
              <div
                key={med.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/90 border border-slate-200/60 shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-800">{med.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span>
                      ⏰ Giờ uống:{' '}
                      <strong className="text-rose-600">{med.timeToTake.join(', ')}</strong>
                    </span>
                    {med.note && <span>• 📝 {med.note}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onRemindMedicine(med.name)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition-all shadow-sm active:scale-95"
                    title="Gửi chuông nhắc uống thuốc"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Nhắc</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditMed(med)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg text-xs transition-colors"
                    title="Sửa thuốc"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMedicine(med.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg text-xs transition-colors"
                    title="Xóa thuốc"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 6. THEO DÕI CHU KỲ (VỢ) HOẶC LỜI NHẮC (CHỒNG) */}
      {selectedTargetRole === 'wife' ? (
        <Card variant="glass" className="p-4 sm:p-5 border-l-4 border-l-pink-400">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <CalendarHeart className="w-5 h-5 text-pink-500 shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
                  Theo Dõi Chu Kỳ Của Vợ 🌸
                </h4>
                <p className="text-[11px] text-slate-500">Dự đoán chu kỳ & bí quyết chăm sóc</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLastPeriodDate(health.periodTracking?.lastPeriodDate || new Date().toISOString().split('T')[0]);
                setCycleDays(health.periodTracking?.cycleLengthDays || 28);
                setPeriodNotes(health.periodTracking?.notes || 'Uống nước ấm, chuẩn bị túi chườm...');
                setIsPeriodModalOpen(true);
              }}
              className="shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" />
              <span>Chỉnh Sửa</span>
            </Button>
          </div>

          <div className="bg-pink-50/80 p-3.5 rounded-2xl border border-pink-100 mb-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600">Lần gần nhất:</span>
              <strong className="text-slate-800">
                {formatDateVi(health.periodTracking?.lastPeriodDate || '2026-08-15')}
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs font-medium pt-1.5 border-t border-pink-200/50">
              <span className="text-slate-600">Chu kỳ trung bình:</span>
              <strong className="text-pink-700">
                {health.periodTracking?.cycleLengthDays || 28} ngày
              </strong>
            </div>
            <div className="flex items-center justify-between text-xs font-medium pt-1.5 border-t border-pink-200/50">
              <span className="text-slate-600">Dự kiến kỳ tiếp theo:</span>
              <strong className="text-pink-600 font-black">
                {(() => {
                  const last = new Date(health.periodTracking?.lastPeriodDate || '2026-08-15');
                  const days = health.periodTracking?.cycleLengthDays || 28;
                  const next = new Date(last.getTime() + days * 24 * 60 * 60 * 1000);
                  return formatDateVi(next.toISOString().split('T')[0]);
                })()}
              </strong>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-white/70 p-3 rounded-2xl border border-pink-100">
            💡 <strong>Lời nhắc cho chồng:</strong>{' '}
            <span className="text-rose-600 font-bold">
              {health.periodTracking?.notes || 'Chuẩn bị nước ấm, túi chườm, đồ ngọt khoái khẩu và kiên nhẫn hơn vào những ngày nhạy cảm nhé! ❤️'}
            </span>
          </p>
        </Card>
      ) : (
        <Card variant="glass" className="p-4 sm:p-5 border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h4 className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
              Chăm Sóc Sức Khỏe Cho Chồng 🐻
            </h4>
          </div>
          <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-100 space-y-2 text-xs text-slate-700 font-medium">
            <p>• <strong>Uống đủ nước:</strong> Nhắc anh uống đủ 2 lít nước mỗi ngày khi làm việc.</p>
            <p>• <strong>Giấc ngủ ngon:</strong> Nhắc anh không thức quá khuya sau 23h30.</p>
            <p>• <strong>Tiếp thêm năng lượng:</strong> Chuẩn bị một cái ôm ấm áp để tiếp sức cho anh nhé! ❤️</p>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SỬA TÌNH TRẠNG SỨC KHỎE (ILLNESS & SYMPTOMS) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Cập Nhật Tình Trạng Sức Khỏe 🩺"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tình trạng bệnh hiện tại:</label>
            <input
              type="text"
              value={editIllness}
              onChange={(e) => setEditIllness(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Cảm sốt nhẹ, Đau họng, Khỏe mạnh..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mức độ cần chăm sóc:</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEditSeverity('mild')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  editSeverity === 'mild'
                    ? 'bg-emerald-500 text-white border-emerald-500'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Bình thường
              </button>
              <button
                type="button"
                onClick={() => setEditSeverity('moderate')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  editSeverity === 'moderate'
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Cần theo dõi
              </button>
              <button
                type="button"
                onClick={() => setEditSeverity('severe')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  editSeverity === 'severe'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                Cần chăm sóc gấp
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Triệu chứng chi tiết:</label>
            <textarea
              rows={3}
              value={editSymptoms}
              onChange={(e) => setEditSymptoms(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Hơi sốt nhẹ về chiều, rát cổ họng, mệt mỏi..."
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 p-4 sm:-mx-5 sm:-mb-5 sm:p-5">
            <Button variant="secondary" fullWidth onClick={() => setIsStatusModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="romantic" fullWidth onClick={handleSaveStatus}>
              Lưu Thay Đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 2: THÊM / SỬA TOA THUỐC */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isMedModalOpen}
        onClose={() => setIsMedModalOpen(false)}
        title={editingMedId ? 'Sửa Toa Thuốc 💊' : 'Thêm Thuốc Mới 💊'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên thuốc:</label>
            <input
              type="text"
              value={medName}
              onChange={(e) => setMedName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Siro ho Nam Hà, Paracetamol 500mg..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Liều lượng:</label>
            <input
              type="text"
              value={medDosage}
              onChange={(e) => setMedDosage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: 1 viên sau ăn, 10ml..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giờ uống (cách nhau dấu phẩy):</label>
            <input
              type="text"
              value={medTimes}
              onChange={(e) => setMedTimes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="08:00, 13:00, 19:30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú lưu ý:</label>
            <input
              type="text"
              value={medNote}
              onChange={(e) => setMedNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="Uống với nước ấm, không uống lúc đói..."
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 p-4 sm:-mx-5 sm:-mb-5 sm:p-5">
            <Button variant="secondary" fullWidth onClick={() => setIsMedModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="romantic" fullWidth onClick={handleSaveMedicine}>
              {editingMedId ? 'Lưu Thuốc' : 'Thêm Vào Toa'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL 3: SỬA THEO DÕI CHU KỲ (VỢ) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        title="Chăm Sóc Chu Kỳ Của Vợ 🌸"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu kỳ gần nhất:</label>
            <input
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Số ngày trong chu kỳ (thường là 28 - 32 ngày):</label>
            <input
              type="number"
              min={20}
              max={45}
              value={cycleDays}
              onChange={(e) => setCycleDays(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Lời nhắc / Bí kíp dỗ dành vợ:</label>
            <textarea
              rows={3}
              value={periodNotes}
              onChange={(e) => setPeriodNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-400"
              placeholder="Chuẩn bị nước ấm, túi chườm, kiên nhẫn hơn..."
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 p-4 sm:-mx-5 sm:-mb-5 sm:p-5">
            <Button variant="secondary" fullWidth onClick={() => setIsPeriodModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="romantic" fullWidth onClick={handleSavePeriod}>
              Lưu Cài Đặt
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
