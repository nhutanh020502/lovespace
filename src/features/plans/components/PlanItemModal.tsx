import React, { useState, useEffect } from 'react';
import { PlanTimelineItem } from '../../../types/plan.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { EmojiPickerPalette } from '../../../components/ui/EmojiPickerPalette';
import { DollarSign, Clock, MapPin, Sparkles } from 'lucide-react';

interface PlanItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<PlanTimelineItem>) => void;
  initialItem?: PlanTimelineItem | null;
  dayIndex: number;
  totalDays: number;
}

const COMMON_EMOJIS = ['🚗', '🛵', '🐶', '🍱', '🍵', '🧋', '❤️🔥', '🍜', '🎬', '🛍️', '🏨', '☕', '🍓', '🍰', '🌅', '🎡'];

const COST_QUICK_PRESETS = [
  { label: '0đ (Cục chồng chở)', val: '0đ tại có cục chồng chở' },
  { label: '50k', val: '50k' },
  { label: '100k', val: '100k' },
  { label: '200k', val: '200k' },
  { label: '~250 - 300k', val: '~250 - 300k' },
  { label: '400k', val: '400k' },
  { label: '500k', val: '500k' },
  { label: '1 triệu', val: '1000k' },
];

export const PlanItemModal: React.FC<PlanItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  dayIndex,
  totalDays,
}) => {
  const [selectedDay, setSelectedDay] = useState(dayIndex);
  const [timeRange, setTimeRange] = useState('');
  const [activity, setActivity] = useState('');
  const [emoji, setEmoji] = useState('🚗');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [paidBy, setPaidBy] = useState<'husband' | 'wife' | 'shared'>('husband');
  const [showEmojiPalette, setShowEmojiPalette] = useState(false);

  useEffect(() => {
    if (initialItem) {
      setSelectedDay(initialItem.dayIndex || dayIndex);
      setTimeRange(initialItem.timeRange || '');
      setActivity(initialItem.activity || '');
      setEmoji(initialItem.emoji || '🚗');
      setEstimatedCost(initialItem.estimatedCost || (initialItem.numericCost ? `${initialItem.numericCost / 1000}k` : ''));
      setLocationUrl(initialItem.locationUrl || '');
      setNotes(initialItem.notes || '');
      setPaidBy(initialItem.paidBy || 'husband');
    } else {
      setSelectedDay(dayIndex);
      setTimeRange('09:00 - 10:00');
      setActivity('');
      setEmoji('🚗');
      setEstimatedCost('0đ');
      setLocationUrl('');
      setNotes('');
      setPaidBy('husband');
    }
  }, [initialItem, dayIndex, isOpen]);

  // Trích xuất và phân tích số tiền tự động cực kỳ thông minh
  const parseNumericCost = (str: string): number => {
    if (!str) return 0;
    const clean = str.toLowerCase().trim();
    if (clean.includes('0đ') || clean.includes('miễn phí') || clean.includes('free')) return 0;

    // Xử lý các dạng ~250 - 300k, 250k - 300k
    const numbers = clean.replace(/,/g, '.').match(/\d+(\.\d+)?/g);
    if (!numbers || numbers.length === 0) return 0;

    let avg = 0;
    if (numbers.length >= 2 && (clean.includes('-') || clean.includes('~'))) {
      avg = (parseFloat(numbers[0]) + parseFloat(numbers[1])) / 2;
    } else {
      avg = parseFloat(numbers[0]);
    }

    if (clean.includes('tr') || clean.includes('triệu') || clean.includes('củ')) {
      return avg * 1000000;
    }
    if (clean.includes('k')) {
      return avg * 1000;
    }
    // Nếu gõ số lớn hơn 1000 (vd: 200000)
    if (avg >= 1000) {
      return avg;
    }
    // Nếu gõ số nhỏ (vd: 50, 100, 200, 250) -> mặc định là 50k, 100k, 200k, 250k
    if (avg > 0 && avg < 1000) {
      return avg * 1000;
    }
    return avg;
  };

  const calculatedNumeric = parseNumericCost(estimatedCost);

  const formatVND = (val: number) => {
    return `${val.toLocaleString('vi-VN')} đ`;
  };

  const handleSave = () => {
    if (!activity.trim()) return;

    onSave({
      dayIndex: selectedDay,
      timeRange: timeRange.trim() || '09:00',
      activity: activity.trim(),
      emoji,
      estimatedCost: estimatedCost.trim() || (calculatedNumeric > 0 ? formatVND(calculatedNumeric) : '0đ'),
      numericCost: calculatedNumeric,
      locationUrl: locationUrl.trim(),
      notes: notes.trim(),
      paidBy,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialItem ? 'Chỉnh Sửa Khung Giờ & Hoạt Động ✏️' : 'Thêm Khung Giờ & Việc Cần Làm ➕'}
    >
      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Chọn ngày (Nếu là chuyến đi dài ngày) */}
        {totalDays > 1 && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Áp dụng cho ngày:</label>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDay(d)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDay === d
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ngày {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. KHUNG GIỜ CHI TIẾT */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            <Clock className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
            Khung giờ làm việc / hoạt động <span className="text-rose-500">*</span>:
          </label>
          <input
            type="text"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            placeholder="Ví dụ: 09:00 - 10:30, 11:15 ~ 12:30, 18:00..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* 2. VIỆC CẦN LÀM / HOẠT ĐỘNG */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
            Làm gì trong khung giờ này? <span className="text-rose-500">*</span>:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPalette(!showEmojiPalette)}
              className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center text-xl shadow-xs transition-transform active:scale-95"
              title="Chọn Emoji biểu cảm"
            >
              {emoji}
            </button>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Ví dụ: Ăn Bún đậu A Chảnh, Uống matcha, Đi xem phim..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              autoFocus
            />
          </div>

          {/* Quick Emoji Bar */}
          <div className="flex flex-wrap gap-1 mt-1.5 items-center">
            {COMMON_EMOJIS.map((em, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setEmoji(em)}
                className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                  emoji === em ? 'bg-rose-500 text-white scale-110 shadow-xs' : 'bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {em}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowEmojiPalette(!showEmojiPalette)}
              className="text-[10px] font-bold text-rose-600 hover:underline px-1.5"
            >
              {showEmojiPalette ? 'Thu gọn' : 'Xem thêm emoji ✨'}
            </button>
          </div>

          {/* Expanded Emoji Palette */}
          {showEmojiPalette && (
            <div className="mt-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 animate-fade-in max-h-44 overflow-y-auto">
              <EmojiPickerPalette selectedEmoji={emoji} onSelectEmoji={(em) => { setEmoji(em); setShowEmojiPalette(false); }} />
            </div>
          )}
        </div>

        {/* 3. CHI PHÍ & TỰ ĐỘNG CỘNG TỔNG */}
        <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-950 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
              <span>Việc này tốn bao nhiêu tiền?</span>
            </label>
            {/* Live Recognized Sum */}
            <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-lg border border-amber-300">
              Cộng vào tổng: {formatVND(calculatedNumeric)}
            </span>
          </div>

          <input
            type="text"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Nhập số tiền (vd: 200k, 250 - 300k, 200000, 0đ...)"
            className="w-full bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-inner"
          />

          {/* Quick Cost Presets */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {COST_QUICK_PRESETS.map((c, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setEstimatedCost(c.val)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                  estimatedCost === c.val
                    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. AI CHI TRẢ */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Ai chi trả cho khoản này:</label>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPaidBy('husband')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                paidBy === 'husband'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🐻 Chồng bao</span>
            </button>
            <button
              type="button"
              onClick={() => setPaidBy('wife')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                paidBy === 'wife'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>🐰 Vợ bao</span>
            </button>
            <button
              type="button"
              onClick={() => setPaidBy('shared')}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                paidBy === 'shared'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>💕 Quỹ chung</span>
            </button>
          </div>
        </div>

        {/* Link Bản Đồ & Lời Dặn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              <MapPin className="w-3.5 h-3.5 inline mr-1 text-rose-500" />
              Link Google Maps:
            </label>
            <input
              type="url"
              value={locationUrl}
              onChange={(e) => setLocationUrl(e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhớ mang áo ấm, chụp nhiều ảnh..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" size="sm" onClick={handleSave} disabled={!activity.trim()}>
            {initialItem ? 'Lưu Thay Đổi' : 'Thêm Vào Lịch Trình ✨'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
