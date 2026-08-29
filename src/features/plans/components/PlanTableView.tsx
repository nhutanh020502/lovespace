import React, { useState } from 'react';
import { PlanTimelineItem, DatingPlan } from '../../../types/plan.types';
import { Button } from '../../../components/ui/Button';
import {
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  Circle,
  ExternalLink,
  Calculator,
  Save,
  Check,
  Sparkles,
} from 'lucide-react';

interface PlanTableViewProps {
  plan: DatingPlan;
  selectedDayIndex: number;
  items: PlanTimelineItem[];
  onOpenAddItem: (dayIndex: number) => void;
  onOpenEditItem: (item: PlanTimelineItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleCompleteItem: (itemId: string) => void;
  onUpdatePlanItems?: (newItems: PlanTimelineItem[]) => void;
  readOnly?: boolean;
}

export const PlanTableView: React.FC<PlanTableViewProps> = ({
  plan,
  selectedDayIndex,
  items,
  onOpenAddItem,
  onOpenEditItem,
  onDeleteItem,
  onToggleCompleteItem,
  onUpdatePlanItems,
  readOnly = false,
}) => {
  const [isInlineEditMode, setIsInlineEditMode] = useState(false);

  // Lọc items của ngày được chọn
  const dayItems = items.filter((item) => (item.dayIndex || 1) === selectedDayIndex);

  // Hàm trích xuất số tiền tự động
  const parseNumericCost = (str: string): number => {
    if (!str) return 0;
    const clean = str.toLowerCase().trim();
    if (clean.includes('0đ') || clean.includes('miễn phí') || clean.includes('free')) return 0;

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
    if (avg >= 1000) {
      return avg;
    }
    if (avg > 0 && avg < 1000) {
      return avg * 1000;
    }
    return avg;
  };

  // Tính tổng chi phí tự động cộng dồn của ngày này
  const totalNumeric = dayItems.reduce((acc, item) => acc + (item.numericCost || 0), 0);

  // Tính chi phí theo từng người chi trả
  const husbandTotal = dayItems
    .filter((item) => item.paidBy === 'husband' || !item.paidBy)
    .reduce((acc, item) => acc + (item.numericCost || 0), 0);

  const wifeTotal = dayItems
    .filter((item) => item.paidBy === 'wife')
    .reduce((acc, item) => acc + (item.numericCost || 0), 0);

  const sharedTotal = dayItems
    .filter((item) => item.paidBy === 'shared')
    .reduce((acc, item) => acc + (item.numericCost || 0), 0);

  // Tính tổng toàn bộ chuyến đi (nếu nhiều ngày)
  const allDaysTotal = items.reduce((acc, item) => acc + (item.numericCost || 0), 0);

  const formatVND = (val: number) => {
    return `${val.toLocaleString('vi-VN')} đ`;
  };

  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) {
      const mil = val / 1000000;
      return `${mil % 1 === 0 ? mil : mil.toFixed(2)} triệu`;
    }
    if (val >= 1000) {
      return `${Math.round(val / 1000)}k`;
    }
    return `${val.toLocaleString('vi-VN')}đ`;
  };

  // Cập nhật từng ô trực tiếp trên bảng (Inline Edit)
  const handleInlineChange = (itemId: string, field: keyof PlanTimelineItem, value: any) => {
    if (!onUpdatePlanItems) return;
    const newItems = items.map((it) => {
      if (it.id === itemId) {
        const updated = { ...it, [field]: value };
        if (field === 'estimatedCost') {
          updated.numericCost = parseNumericCost(value);
        }
        return updated;
      }
      return it;
    });
    onUpdatePlanItems(newItems);
  };

  // Thêm nhanh 1 dòng trực tiếp vào bảng
  const handleQuickAddRow = () => {
    if (!onUpdatePlanItems) return;
    const lastItem = dayItems[dayItems.length - 1];
    const newItem: PlanTimelineItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      dayIndex: selectedDayIndex,
      timeRange: lastItem ? '19:00 - 20:30' : '09:00 - 10:00',
      activity: 'Đi dạo / Cà phê chill 💕',
      emoji: '☕',
      estimatedCost: '100k',
      numericCost: 100000,
      paidBy: 'husband',
      isCompleted: false,
    };
    onUpdatePlanItems([...items, newItem]);
  };

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-700 shadow-xl overflow-hidden animate-fade-in text-slate-900 font-sans">
      {/* 1. Header Bảng: Tên Kế Hoạch (Giống 100% hình mẫu) */}
      <div className="bg-slate-50 border-b-2 border-slate-700 px-4 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">⏰</span>
          <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
            {plan.title}{' '}
            {plan.totalDays > 1 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-300 ml-1">
                Ngày {selectedDayIndex}
              </span>
            )}
          </h3>
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút Bật/Tắt Chế Độ Sửa Trực Tiếp Ngay Trên Bảng */}
            <button
              type="button"
              onClick={() => setIsInlineEditMode(!isInlineEditMode)}
              className={`py-1 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                isInlineEditMode
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Chỉnh sửa trực tiếp từng ô trên bảng"
            >
              {isInlineEditMode ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Xong sửa</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sửa trực tiếp</span>
                </>
              )}
            </button>

            <Button
              variant="romantic"
              size="sm"
              onClick={() => onOpenAddItem(selectedDayIndex)}
              className="text-xs py-1 px-2.5 h-8 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Thêm chặng</span>
            </Button>
          </div>
        )}
      </div>

      {/* 2. Nội dung bảng (Table 3 cột nét đậm chuẩn như ảnh của bạn) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b-2 border-slate-700 bg-slate-100 text-slate-900 text-xs sm:text-sm font-black">
              <th className="py-3 px-3 sm:px-4 w-[28%] border-r-2 border-slate-700 text-center leading-tight">
                Thời gian dự kiến
                {plan.timeHeaderNote && (
                  <span className="block text-[11px] font-semibold text-slate-600 mt-0.5 lowercase">
                    {plan.timeHeaderNote}
                  </span>
                )}
              </th>
              <th className="py-3 px-3 sm:px-4 w-[48%] border-r-2 border-slate-700 text-center">
                Lịch trình
              </th>
              <th className="py-3 px-3 sm:px-4 w-[24%] text-center">
                Dự trù ngân sách
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-700 text-xs sm:text-sm font-medium">
            {dayItems.length > 0 ? (
              dayItems.map((item) => (
                <tr
                  key={item.id}
                  className={`group transition-colors hover:bg-rose-50/30 ${
                    item.isCompleted && !isInlineEditMode ? 'bg-slate-50 opacity-75' : ''
                  }`}
                >
                  {/* CỘT 1: THỜI GIAN */}
                  <td className="py-3 px-3 sm:px-4 border-r-2 border-slate-700 font-black text-slate-900 whitespace-nowrap text-center align-middle">
                    {isInlineEditMode ? (
                      <input
                        type="text"
                        value={item.timeRange}
                        onChange={(e) => handleInlineChange(item.id, 'timeRange', e.target.value)}
                        placeholder="09:00 - 10:00"
                        className="w-full bg-yellow-50 border border-yellow-400 rounded-lg px-2 py-1 text-xs font-black text-center text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center gap-1.5">
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => onToggleCompleteItem(item.id)}
                            className="text-slate-400 hover:text-emerald-600 transition-colors"
                            title={item.isCompleted ? 'Đánh dấu chưa đi' : 'Đã đi xong chặng này'}
                          >
                            {item.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4 hover:scale-110" />
                            )}
                          </button>
                        )}
                        <span className={item.isCompleted ? 'line-through text-slate-400' : ''}>
                          {item.timeRange}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* CỘT 2: LỊCH TRÌNH */}
                  <td className="py-3 px-3 sm:px-4 border-r-2 border-slate-700 align-middle">
                    {isInlineEditMode ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={item.emoji || '📍'}
                          onChange={(e) => handleInlineChange(item.id, 'emoji', e.target.value)}
                          className="w-8 text-center bg-yellow-50 border border-yellow-400 rounded-lg py-1 text-sm focus:outline-none"
                          title="Emoji"
                        />
                        <input
                          type="text"
                          value={item.activity}
                          onChange={(e) => handleInlineChange(item.id, 'activity', e.target.value)}
                          placeholder="Nhập việc cần làm..."
                          className="flex-1 bg-yellow-50 border border-yellow-400 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                          type="button"
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa dòng này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 min-w-0">
                          {item.emoji && <span className="text-base shrink-0 select-none">{item.emoji}</span>}
                          <div className="min-w-0">
                            <span
                              className={`font-semibold text-slate-900 break-words ${
                                item.isCompleted ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {item.activity}
                            </span>
                            {item.notes && (
                              <p className="text-[11px] text-slate-500 mt-0.5 italic">{item.notes}</p>
                            )}
                            {item.locationUrl && (
                              <a
                                href={item.locationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:underline font-bold mt-1"
                              >
                                <span>📍 Xem bản đồ</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Nút Sửa & Xóa khi hover */}
                        {!readOnly && (
                          <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onOpenEditItem(item)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Sửa khung giờ này"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteItem(item.id)}
                              className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                              title="Xóa khung giờ này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* CỘT 3: DỰ TRÙ NGÂN SÁCH */}
                  <td className="py-3 px-3 sm:px-4 font-semibold text-slate-900 text-center align-middle whitespace-nowrap">
                    {isInlineEditMode ? (
                      <input
                        type="text"
                        value={item.estimatedCost || ''}
                        onChange={(e) => handleInlineChange(item.id, 'estimatedCost', e.target.value)}
                        placeholder="200k, 0đ..."
                        className="w-full bg-yellow-50 border border-yellow-400 rounded-lg px-2 py-1 text-xs font-bold text-center text-slate-900 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    ) : item.estimatedCost ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-slate-900 font-bold">{item.estimatedCost}</span>
                        {item.numericCost !== undefined && item.numericCost > 0 && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-semibold">
                            +{formatShortCurrency(item.numericCost)}
                          </span>
                        )}
                      </div>
                    ) : item.numericCost && item.numericCost > 0 ? (
                      <span className="text-slate-900 font-bold">+{formatVND(item.numericCost)}</span>
                    ) : (
                      <span className="text-slate-400 font-normal">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                  Chưa có khung giờ nào. Bấm nút "+ Thêm khung giờ" để bắt đầu lên lịch trình nhé! 📝
                </td>
              </tr>
            )}

            {/* Nút Thêm Dòng Nhanh Khi Đang Ở Chế Độ Sửa Trực Tiếp */}
            {isInlineEditMode && (
              <tr className="bg-slate-50">
                <td colSpan={3} className="py-2.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={handleQuickAddRow}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-300 transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Thêm dòng khung giờ mới</span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>

          {/* 3. Footer Bảng: TỔNG CHI PHÍ TỰ ĐỘNG CỘNG (Màu vàng cam pastel chuẩn ảnh mẫu) */}
          <tfoot>
            <tr className="bg-[#fff3cd] border-t-2 border-slate-700 text-amber-950 font-bold text-xs sm:text-sm">
              <td colSpan={3} className="py-3 px-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {/* Dòng Tổng chi phí dự kiến nổi bật màu đỏ đậm giống ảnh */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-red-600 text-xs sm:text-sm">
                      {plan.summaryBudgetNote || 'Tổng chi phí (dự kiến)'}
                    </span>
                    <span className="text-red-600 font-black text-sm sm:text-base">
                      ~ {totalNumeric > 0 ? `${formatVND(totalNumeric)} (${formatShortCurrency(totalNumeric)})` : '0đ'} 🥹
                    </span>
                  </div>

                  {plan.totalDays > 1 && (
                    <span className="text-xs font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-xl border border-amber-300 self-start sm:self-auto">
                      🌟 Tổng cả chuyến ({plan.totalDays} ngày): {formatVND(allDaysTotal)}
                    </span>
                  )}
                </div>

                {/* Phân chia chi tiết */}
                {totalNumeric > 0 && (
                  <div className="pt-2 mt-1.5 border-t border-amber-300/60 flex flex-wrap items-center gap-3 text-[11px] font-bold text-amber-950">
                    <span className="text-slate-600">Phân chia dự kiến:</span>
                    {husbandTotal > 0 && (
                      <span className="bg-white/80 px-2 py-0.5 rounded-md border border-blue-300 text-blue-900">
                        🐻 Chồng: <strong>{formatVND(husbandTotal)}</strong>
                      </span>
                    )}
                    {wifeTotal > 0 && (
                      <span className="bg-white/80 px-2 py-0.5 rounded-md border border-rose-300 text-rose-900">
                        🐰 Vợ: <strong>{formatVND(wifeTotal)}</strong>
                      </span>
                    )}
                    {sharedTotal > 0 && (
                      <span className="bg-white/80 px-2 py-0.5 rounded-md border border-amber-400 text-amber-950">
                        💕 Quỹ chung: <strong>{formatVND(sharedTotal)}</strong>
                      </span>
                    )}
                  </div>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
