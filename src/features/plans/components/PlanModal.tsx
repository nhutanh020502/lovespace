import React, { useState, useEffect } from 'react';
import { DatingPlan } from '../../../types/plan.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Calendar, MapPin, Hotel, Sparkles } from 'lucide-react';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Partial<DatingPlan>) => void;
  initialPlan?: DatingPlan | null;
  currentUserId: string;
}

const TITLE_SUGGESTIONS = [
  'Kế hoạch ngày 31/8 ⏰',
  'Hẹn hò cuối tuần ngọt ngào 💕',
  'Du Lịch Đà Lạt 3N2Đ 🌲🌸',
  'Chuyến Đi Vũng Tàu Ăn Hải Sản 🌊🦀',
  'Kỷ niệm ngày yêu 💖',
  'Ở nhà chill & Nấu ăn cùng nhau 👩‍🍳👨‍🍳',
];

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan,
  currentUserId,
}) => {
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalDays, setTotalDays] = useState(1);
  const [timeHeaderNote, setTimeHeaderNote] = useState('(tại cục chồng hay đi trễ)');
  const [summaryBudgetNote, setSummaryBudgetNote] = useState('Tổng chi phí (dự kiến) ~ 1 củ 🥹');
  const [destination, setDestination] = useState('Sài Gòn');
  const [transportInfo, setTransportInfo] = useState('🛵 Xe máy cá nhân');
  const [hotelName, setHotelName] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [hotelCost, setHotelCost] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (initialPlan) {
      setTitle(initialPlan.title || '');
      setStartDate(initialPlan.startDate || new Date().toISOString().split('T')[0]);
      setEndDate(initialPlan.endDate || initialPlan.startDate || new Date().toISOString().split('T')[0]);
      setTotalDays(initialPlan.totalDays || 1);
      setIsMultiDay(initialPlan.totalDays > 1);
      setTimeHeaderNote(initialPlan.timeHeaderNote || '(tại cục chồng hay đi trễ)');
      setSummaryBudgetNote(initialPlan.summaryBudgetNote || 'Tổng chi phí (dự kiến) ~ 1 củ 🥹');
      setDestination(initialPlan.destination || 'Sài Gòn');
      setTransportInfo(initialPlan.transportInfo || '🛵 Xe máy cá nhân');
      setHotelName(initialPlan.hotelInfo?.name || '');
      setHotelAddress(initialPlan.hotelInfo?.address || '');
      setHotelCost(initialPlan.hotelInfo?.cost);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('Kế hoạch hẹn hò 💕');
      setStartDate(today);
      setEndDate(today);
      setTotalDays(1);
      setIsMultiDay(false);
      setTimeHeaderNote('(tại cục chồng hay đi trễ)');
      setSummaryBudgetNote('Tổng chi phí (dự kiến) ~ 1 củ 🥹');
      setDestination('Sài Gòn');
      setTransportInfo('🛵 Xe máy cá nhân');
      setHotelName('');
      setHotelAddress('');
      setHotelCost(undefined);
    }
  }, [initialPlan, isOpen]);

  // Tự động tính số ngày khi chọn khoảng ngày
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (!isMultiDay) {
      setEndDate(val);
      setTotalDays(1);
    } else {
      calculateTotalDays(val, endDate);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    calculateTotalDays(startDate, val);
  };

  const calculateTotalDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalDays(Math.max(1, diffDays || 1));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      startDate,
      endDate: isMultiDay ? endDate : startDate,
      totalDays: isMultiDay ? Math.max(1, totalDays) : 1,
      timeHeaderNote: timeHeaderNote.trim(),
      summaryBudgetNote: summaryBudgetNote.trim(),
      destination: destination.trim(),
      transportInfo: transportInfo.trim(),
      hotelInfo: hotelName.trim()
        ? {
            name: hotelName.trim(),
            address: hotelAddress.trim(),
            cost: hotelCost,
          }
        : undefined,
      createdBy: initialPlan?.createdBy || currentUserId,
      status: initialPlan?.status || 'upcoming',
      items: initialPlan?.items || [],
      packingList: initialPlan?.packingList || [],
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPlan ? 'Chỉnh Sửa Kế Hoạch Hẹn Hò 🗓️' : 'Tạo Kế Hoạch Hẹn Hò / Chuyến Đi Mới ✨'}
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Loại chuyến đi (1 ngày vs Dài ngày) */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Loại kế hoạch:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setIsMultiDay(false);
                setEndDate(startDate);
                setTotalDays(1);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                !isMultiDay
                  ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">☕</span>
              <span>Hẹn Hò 1 Ngày</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMultiDay(true);
                const nextDays = new Date(new Date(startDate).getTime() + 2 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split('T')[0];
                setEndDate(nextDays);
                calculateTotalDays(startDate, nextDays);
              }}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center gap-1 ${
                isMultiDay
                  ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="text-base">🌴</span>
              <span>Du Lịch Dài Ngày ({totalDays > 1 ? `${totalDays}N${totalDays - 1}Đ` : 'Nhiều ngày'})</span>
            </button>
          </div>
        </div>

        {/* Tên Kế Hoạch */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tên chuyến đi / buổi hẹn <span className="text-rose-500">*</span>:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Kế hoạch ngày 31/8, Đi Đà Lạt 3N2Đ..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            autoFocus
          />

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {TITLE_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTitle(sug)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Ngày diễn ra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
              {isMultiDay ? 'Ngày bắt đầu:' : 'Ngày hẹn hò:'}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          {isMultiDay && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
                Ngày kết thúc ({totalDays} ngày {totalDays - 1} đêm):
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              />
            </div>
          )}
        </div>

        {/* Địa Điểm & Phương Tiện */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
              Địa điểm / Thành phố:
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Sài Gòn, Đà Lạt, Vũng Tàu..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phương tiện di chuyển:</label>
            <input
              type="text"
              value={transportInfo}
              onChange={(e) => setTransportInfo(e.target.value)}
              placeholder="🛵 Cục chồng chở, Xe Limousine, Máy bay..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Ghi chú hóm hỉnh cho Header & Footer (Giống ảnh mẫu) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
              Ghi chú cột thời gian:
            </label>
            <input
              type="text"
              value={timeHeaderNote}
              onChange={(e) => setTimeHeaderNote(e.target.value)}
              placeholder="Ví dụ: (tại cục chồng hay đi trễ)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú dòng tổng chi phí:</label>
            <input
              type="text"
              value={summaryBudgetNote}
              onChange={(e) => setSummaryBudgetNote(e.target.value)}
              placeholder="Ví dụ: Tổng chi phí (dự kiến) ~ 1 củ 🥹"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Thông tin Khách sạn / Homestay nếu đi dài ngày */}
        {isMultiDay && (
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2.5 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <Hotel className="w-4 h-4 text-blue-600" />
              <span>Thông tin Khách sạn / Homestay nghỉ chân</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Tên khách sạn / homestay..."
                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
              <input
                type="text"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                placeholder="Địa chỉ homestay..."
                className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" size="sm" onClick={handleSave} disabled={!title.trim()}>
            {initialPlan ? 'Lưu Thay Đổi' : 'Bắt Đầu Lên Lịch Trình ✨'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
