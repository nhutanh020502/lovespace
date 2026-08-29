import React, { useState, useEffect } from 'react';
import { PlanTimelineItem } from '../../../types/plan.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { EmojiPickerPalette } from '../../../components/ui/EmojiPickerPalette';

interface PlanItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<PlanTimelineItem>) => void;
  initialItem?: PlanTimelineItem | null;
  dayIndex: number;
  totalDays: number;
}

const COMMON_EMOJIS = ['🚗', '🛵', '🐶', '🍱', '🍵', '🧋', '❤️🔥', '🍜', '🎬', '🛍️', '🏨', '☕', '🍓', '🍰', '🌅', '🎡'];

const TIME_PRESETS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:30 - 13:30',
  '14:00 - 18:00',
  '18:00 - 19:30',
  '20:00 - 22:00',
];

const COST_PRESETS = ['0đ tại có cục chồng chở', '50k', '100k', '150k', '~200k', '~250 - 300k', '500k'];

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
      setEstimatedCost(initialItem.estimatedCost || '');
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

  // Trích xuất số từ chuỗi chi phí (vd: "~250 - 300k" -> 275000, "200k" -> 200000)
  const parseNumericCost = (str: string): number => {
    if (!str) return 0;
    const clean = str.toLowerCase();
    const numbers = clean.match(/\d+(\.\d+)?/g);
    if (!numbers || numbers.length === 0) return 0;

    let avg = 0;
    if (numbers.length >= 2) {
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
    if (avg < 1000 && avg > 0) {
      return avg * 1000; // Mặc định nếu gõ 200 -> 200k
    }
    return avg;
  };

  const handleSave = () => {
    if (!activity.trim()) return;

    onSave({
      dayIndex: selectedDay,
      timeRange: timeRange.trim() || '09:00',
      activity: activity.trim(),
      emoji,
      estimatedCost: estimatedCost.trim(),
      numericCost: parseNumericCost(estimatedCost),
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
      title={initialItem ? 'Chỉnh Sửa Chặng Lịch Trình ✏️' : 'Thêm Chặng Lịch Trình Mới ➕'}
    >
      <div className="space-y-4">
        {/* Chọn ngày (Nếu là kế hoạch nhiều ngày) */}
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

        {/* Thời gian */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Thời gian dự kiến <span className="text-rose-500">*</span>:
          </label>
          <input
            type="text"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            placeholder="Ví dụ: 10:00 - 11:00 hoặc 12:15 ~ 12:30"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
          />
          {/* Quick Time Presets */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {TIME_PRESETS.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTimeRange(t)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Emoji & Tên Hoạt Động */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Biểu tượng & Lịch trình hoạt động <span className="text-rose-500">*</span>:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEmojiPalette(!showEmojiPalette)}
              className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center justify-center text-xl shadow-xs transition-transform active:scale-95"
              title="Chọn Emoji khác"
            >
              {emoji}
            </button>
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Ví dụ: Đến YEPO - Dog & Ice Cream rùi chơi, chụp hình..."
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
            <div className="mt-2 p-2 bg-slate-50 rounded-2xl border border-slate-200 animate-fade-in max-h-48 overflow-y-auto">
              <EmojiPickerPalette selectedEmoji={emoji} onSelectEmoji={(em) => { setEmoji(em); setShowEmojiPalette(false); }} />
            </div>
          )}
        </div>

        {/* Dự trù ngân sách & Người chi trả */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dự trù ngân sách:</label>
            <input
              type="text"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="Ví dụ: ~250 - 300k, 200k, 0đ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            />
            {/* Quick Cost Presets */}
            <div className="flex flex-wrap gap-1 mt-1.5">
              {COST_PRESETS.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setEstimatedCost(c)}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ai chi trả:</label>
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
                <span>🐻 Chồng</span>
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
                <span>🐰 Vợ</span>
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
        </div>

        {/* Link Google Maps & Ghi chú thêm */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Link Google Maps (Nếu có):</label>
          <input
            type="url"
            value={locationUrl}
            onChange={(e) => setLocationUrl(e.target.value)}
            placeholder="https://maps.app.goo.gl/..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú hoặc lời dặn:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ví dụ: Nhớ mang váy xinh để chụp ảnh, ghé mua thêm quà..."
            rows={2}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="romantic" size="sm" onClick={handleSave} disabled={!activity.trim()}>
            {initialItem ? 'Cập Nhật Chặng' : 'Thêm Vào Lịch Trình'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
