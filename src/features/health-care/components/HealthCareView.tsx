import React, { useState } from 'react';
import { HealthStatus, UserRole, UserProfile } from '../../../types/common.types';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { HeartPulse, AlertTriangle, Pill, Heart, ShieldAlert, Plus, Sparkles, Bell, CalendarHeart } from 'lucide-react';
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
  // Chọn xem hồ sơ sức khỏe của ai (mặc định xem của người yêu để chăm sóc)
  const [selectedTargetRole, setSelectedTargetRole] = useState<UserRole>(
    currentRole === 'husband' ? 'wife' : 'husband'
  );

  const targetUser = selectedTargetRole === 'husband' ? partner1 : partner2;
  const health = healthData[targetUser.id] || {
    userId: targetUser.id,
    severity: 'mild',
    medicines: [],
    allergies: [],
    dislikedFoods: [],
    favoriteComfortFoods: [],
    lastUpdated: new Date().toISOString()
  };

  // State cho Modal chỉnh sửa
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editIllness, setEditIllness] = useState(health.illnessName || '');
  const [editSymptoms, setEditSymptoms] = useState(health.symptoms || '');
  const [editAllergies, setEditAllergies] = useState(health.allergies.join(', '));
  const [editDislikes, setEditDislikes] = useState(health.dislikedFoods.join(', '));
  const [editComforts, setEditComforts] = useState(health.favoriteComfortFoods.join(', '));
  const [editLastPeriodDate, setEditLastPeriodDate] = useState(health.periodTracking?.lastPeriodDate || '2026-08-15');

  // Tự động đồng bộ state khi mở modal hoặc đổi người xem
  React.useEffect(() => {
    if (isEditModalOpen) {
      setEditIllness(health.illnessName || '');
      setEditSymptoms(health.symptoms || '');
      setEditAllergies((health.allergies || []).join(', '));
      setEditDislikes((health.dislikedFoods || []).join(', '));
      setEditComforts((health.favoriteComfortFoods || []).join(', '));
      setEditLastPeriodDate(health.periodTracking?.lastPeriodDate || '2026-08-15');
    }
  }, [isEditModalOpen, selectedTargetRole, health]);

  // Modal thêm thuốc
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTimes, setNewMedTimes] = useState('08:00, 19:30');
  const [newMedNote, setNewMedNote] = useState('');

  const handleSaveProfile = () => {
    onUpdateHealth(targetUser.id, {
      illnessName: editIllness.trim() || 'Khỏe mạnh bình thường',
      symptoms: editSymptoms.trim(),
      allergies: editAllergies.split(',').map((s) => s.trim()).filter(Boolean),
      dislikedFoods: editDislikes.split(',').map((s) => s.trim()).filter(Boolean),
      favoriteComfortFoods: editComforts.split(',').map((s) => s.trim()).filter(Boolean),
      periodTracking: selectedTargetRole === 'wife' ? {
        lastPeriodDate: editLastPeriodDate,
        cycleLengthDays: 28,
        notes: 'Uống nước ấm, tránh đồ lạnh',
      } : undefined,
      lastUpdated: new Date().toISOString(),
    });
    setIsEditModalOpen(false);
  };

  const handleAddMedicine = () => {
    if (!newMedName.trim()) return;
    const newMed = {
      id: 'med_' + Date.now(),
      name: newMedName.trim(),
      dosage: newMedDosage.trim() || '1 liều',
      timeToTake: newMedTimes.split(',').map((s) => s.trim()).filter(Boolean),
      note: newMedNote.trim(),
    };

    onUpdateHealth(targetUser.id, {
      medicines: [...health.medicines, newMed],
      lastUpdated: new Date().toISOString(),
    });

    setNewMedName('');
    setNewMedDosage('');
    setNewMedNote('');
    setIsAddMedModalOpen(false);
  };

  const handleDeleteMedicine = (medId: string) => {
    onUpdateHealth(targetUser.id, {
      medicines: health.medicines.filter((m) => m.id !== medId),
      lastUpdated: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Chọn Xem Hồ Sơ Ai */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-500" />
            <span>Sổ Tay Sức Khỏe & Chăm Sóc</span>
          </h2>
          <p className="text-xs text-slate-500">
            Ghi nhớ mọi thói quen, thuốc thang & món kỵ của người yêu
          </p>
        </div>

        {/* Switch xem Vợ / Chồng */}
        <div className="flex bg-white/80 p-1 rounded-2xl border border-rose-200 shadow-sm">
          <button
            onClick={() => setSelectedTargetRole('wife')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTargetRole === 'wife'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Vợ Nhỏ 🐰
          </button>
          <button
            onClick={() => setSelectedTargetRole('husband')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedTargetRole === 'husband'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Chồng Yêu 🐻
          </button>
        </div>
      </div>

      {/* 1. Tình trạng bệnh hiện tại */}
      <Card variant="romantic" className="p-4 sm:p-5 border border-rose-200 shadow-glass">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-rose-500 text-white">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tình Trạng Sức Khỏe Hôm Nay
              </h3>
              <p className="text-[11px] text-slate-500">
                Hồ sơ của <strong>{targetUser.name}</strong>
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditIllness(health.illnessName || '');
              setEditSymptoms(health.symptoms || '');
              setEditAllergies(health.allergies.join(', '));
              setEditDislikes(health.dislikedFoods.join(', '));
              setEditComforts(health.favoriteComfortFoods.join(', '));
              setIsEditModalOpen(true);
            }}
          >
            Chỉnh sửa
          </Button>
        </div>

        <div className="bg-white/80 rounded-2xl p-3.5 mt-2 border border-rose-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-base font-extrabold text-slate-800">
              {health.illnessName || 'Đang rất khỏe mạnh 🥰'}
            </span>
            <Badge variant={health.illnessName?.includes('Khỏe') ? 'emerald' : 'amber'}>
              {health.illnessName?.includes('Khỏe') ? 'Khỏe Mạnh' : 'Đang Cần Chăm Sóc'}
            </Badge>
          </div>
          {health.symptoms && (
            <p className="text-xs text-slate-600 mt-1.5 font-medium">
              Triệu chứng: {health.symptoms}
            </p>
          )}
        </div>
      </Card>

      {/* 2. Lịch Uống Thuốc & Nhắc Nhở */}
      <Card variant="glass" className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-indigo-500 text-white">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Toa Thuốc & Lịch Uống</h3>
              <span className="text-[11px] text-slate-400">Bấm chuông để nhắc đối phương</span>
            </div>
          </div>

          <Button size="sm" variant="outline" onClick={() => setIsAddMedModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Thêm thuốc
          </Button>
        </div>

        {health.medicines.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
            Hiện không phải uống thuốc gì. Chúc hai bạn luôn tràn đầy sức khỏe! ✨
          </div>
        ) : (
          <div className="space-y-2.5">
            {health.medicines.map((med) => (
              <div
                key={med.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-slate-100 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{med.name}</span>
                    <Badge variant="blue" size="sm">{med.dosage}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                    <span>Giờ uống: <strong>{med.timeToTake.join(' & ')}</strong></span>
                    {med.note && <span className="text-amber-600 font-medium">({med.note})</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={() => onRemindMedicine(med.name)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold active:scale-95 transition-all"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Nhắc</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMedicine(med.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 3. Dị Ứng & Món Ăn Kỵ / Không Ăn Được */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Dị ứng */}
        <Card variant="glass" className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dị Ứng / Kỵ Thuốc (Tuyệt Đối Tránh)
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {health.allergies.length > 0 ? (
              health.allergies.map((item, idx) => (
                <Badge key={idx} variant="rose" size="md">
                  ⛔ {item}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400">Chưa ghi nhận dị ứng</span>
            )}
          </div>
        </Card>

        {/* Món ghét / Không ăn được */}
        <Card variant="glass" className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Món Không Ăn Được / Ghét
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {health.dislikedFoods.length > 0 ? (
              health.dislikedFoods.map((item, idx) => (
                <Badge key={idx} variant="amber" size="md">
                  🚫 {item}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400">Ăn được mọi món</span>
            )}
          </div>
        </Card>
      </div>

      {/* 4. Món Khoái Khẩu (Comfort Food - Mua Là Hết Giận) */}
      <Card variant="romantic" className="p-4 sm:p-5 border border-pink-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-2xl bg-pink-500 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Món Khoái Khẩu ("Cứ Mua Là Hết Giận") 🧋✨
            </h4>
            <p className="text-[11px] text-slate-500">Bí kíp dỗ dành ngọt ngào</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {health.favoriteComfortFoods.map((food, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/90 border border-pink-100 shadow-sm text-xs font-semibold text-slate-700"
            >
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 shrink-0" />
              <span>{food}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* 5. Theo Dõi Chu Kỳ & Chăm Sóc Sức Khỏe Riêng Biệt */}
      {selectedTargetRole === 'wife' ? (
        <Card variant="glass" className="p-4 border-l-4 border-l-pink-400">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CalendarHeart className="w-5 h-5 text-pink-500" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Theo Dõi Chu Kỳ Của Vợ 🌸
              </h4>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
              Chu kỳ 28 ngày
            </span>
          </div>

          <div className="bg-pink-50/70 p-3 rounded-2xl border border-pink-100 mb-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Lần gần nhất:</span>
              <strong className="text-slate-800">{formatDateVi(health.periodTracking?.lastPeriodDate || '2026-08-15')}</strong>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5 pt-1.5 border-t border-pink-200/50">
              <span className="text-slate-500">Dự kiến kỳ tiếp theo:</span>
              <strong className="text-pink-600">
                {(() => {
                  const last = new Date(health.periodTracking?.lastPeriodDate || '2026-08-15');
                  const next = new Date(last.getTime() + 28 * 24 * 60 * 60 * 1000);
                  return formatDateVi(next.toISOString().split('T')[0]);
                })()}
              </strong>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            💡 <strong>Lời nhắc cho chồng:</strong> <span className="text-rose-600 font-medium">Chuẩn bị nước ấm, túi chườm, đồ ngọt khoái khẩu và kiên nhẫn hơn vào những ngày nhạy cảm nhé! ❤️</span>
          </p>
        </Card>
      ) : (
        <Card variant="glass" className="p-4 border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Chăm Sóc Sức Khỏe Cho Chồng 🐻
            </h4>
          </div>
          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 space-y-1.5 text-xs text-slate-600">
            <p>• <strong>Uống đủ nước:</strong> Nhắc anh uống đủ 2 lít nước mỗi ngày khi làm việc.</p>
            <p>• <strong>Giấc ngủ:</strong> Nhắc anh không thức quá khuya sau 23h30.</p>
            <p>• <strong>Năng lượng:</strong> Chuẩn bị một cái ôm ấm áp để tiếp sức cho anh nhé! ❤️</p>
          </div>
        </Card>
      )}

      {/* Modal Chỉnh Sửa Hồ Sơ */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Chỉnh Sửa Hồ Sơ Sức Khỏe 🩺">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bệnh / Tình trạng hiện tại:</label>
            <input
              type="text"
              value={editIllness}
              onChange={(e) => setEditIllness(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Viêm họng nhẹ, đau đầu..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Triệu chứng chi tiết:</label>
            <input
              type="text"
              value={editSymptoms}
              onChange={(e) => setEditSymptoms(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Hơi sốt nhẹ về chiều, rát cổ họng..."
            />
          </div>

          {/* Ngày chu kỳ gần nhất (Chỉ dành cho Vợ) */}
          {selectedTargetRole === 'wife' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu kỳ dâu gần nhất:</label>
              <input
                type="date"
                value={editLastPeriodDate}
                onChange={(e) => setEditLastPeriodDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Danh sách Dị ứng (cách nhau bằng dấu phẩy):</label>
            <input
              type="text"
              value={editAllergies}
              onChange={(e) => setEditAllergies(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Tôm cua, phấn hoa ly, thuốc Paracetamol..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Món không ăn được (cách nhau bằng dấu phẩy):</label>
            <input
              type="text"
              value={editDislikes}
              onChange={(e) => setEditDislikes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Hành lá, ngò gai, ăn cay..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Món khoái khẩu dỗ dành (cách nhau bằng dấu phẩy):</label>
            <input
              type="text"
              value={editComforts}
              onChange={(e) => setEditComforts(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Trà sữa olong nướng, Tokbokki, bánh tráng nướng..."
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button variant="secondary" fullWidth onClick={() => setIsEditModalOpen(false)}>Hủy</Button>
            <Button variant="romantic" fullWidth onClick={handleSaveProfile}>Lưu Hồ Sơ</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Thêm Thuốc */}
      <Modal isOpen={isAddMedModalOpen} onClose={() => setIsAddMedModalOpen(false)} title="Thêm Toa Thuốc Mới 💊">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên thuốc:</label>
            <input
              type="text"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Siro ho Nam Hà, Paracetamol 500mg..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Liều lượng:</label>
            <input
              type="text"
              value={newMedDosage}
              onChange={(e) => setNewMedDosage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: 1 viên, 10ml sau ăn..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giờ uống (cách nhau dấu phẩy):</label>
            <input
              type="text"
              value={newMedTimes}
              onChange={(e) => setNewMedTimes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="08:00, 13:00, 19:30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú quan trọng:</label>
            <input
              type="text"
              value={newMedNote}
              onChange={(e) => setNewMedNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Uống với nước ấm, không uống lúc đói..."
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button variant="secondary" fullWidth onClick={() => setIsAddMedModalOpen(false)}>Hủy</Button>
            <Button variant="romantic" fullWidth onClick={handleAddMedicine}>Thêm Vào Toa</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
