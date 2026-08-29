import React from 'react';
import { PlanTimelineItem, DatingPlan } from '../../../types/plan.types';
import { Button } from '../../../components/ui/Button';
import { Edit2, Trash2, Plus, CheckCircle2, Circle, ExternalLink, Calculator, DollarSign } from 'lucide-react';

interface PlanTableViewProps {
  plan: DatingPlan;
  selectedDayIndex: number;
  items: PlanTimelineItem[];
  onOpenAddItem: (dayIndex: number) => void;
  onOpenEditItem: (item: PlanTimelineItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleCompleteItem: (itemId: string) => void;
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
  readOnly = false,
}) => {
  // Lọc items của ngày được chọn
  const dayItems = items.filter((item) => (item.dayIndex || 1) === selectedDayIndex);

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

  return (
    <div className="w-full bg-white rounded-2xl sm:rounded-3xl border border-slate-300/80 shadow-md overflow-hidden animate-fade-in text-slate-800">
      {/* 1. Header Bảng: Tên Kế Hoạch (Giống mẫu ảnh) */}
      <div className="bg-slate-50/95 border-b border-slate-300/80 px-4 py-3 sm:py-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">⏰</span>
          <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
            {plan.title}{' '}
            {plan.totalDays > 1 && (
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 ml-1">
                Ngày {selectedDayIndex}
              </span>
            )}
          </h3>
        </div>

        {!readOnly && (
          <Button
            variant="romantic"
            size="sm"
            onClick={() => onOpenAddItem(selectedDayIndex)}
            className="text-xs shrink-0 py-1.5 px-3 h-8 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>+ Thêm khung giờ</span>
          </Button>
        )}
      </div>

      {/* 2. Nội dung bảng (Table 3 cột chi tiết) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[520px]">
          <thead>
            <tr className="border-b border-slate-300/80 bg-slate-100/80 text-slate-800 text-xs sm:text-sm font-black">
              <th className="py-3 px-3 sm:px-4 w-[28%] border-r border-slate-300/80 text-center leading-tight">
                Thời gian dự kiến
                {plan.timeHeaderNote && (
                  <span className="block text-[11px] font-medium text-slate-500 mt-0.5 lowercase">
                    {plan.timeHeaderNote}
                  </span>
                )}
              </th>
              <th className="py-3 px-3 sm:px-4 w-[48%] border-r border-slate-300/80 text-center">
                Lịch trình hoạt động
              </th>
              <th className="py-3 px-3 sm:px-4 w-[24%] text-center">
                Dự trù ngân sách
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300/80 text-xs sm:text-sm">
            {dayItems.length > 0 ? (
              dayItems.map((item) => (
                <tr
                  key={item.id}
                  className={`group transition-colors hover:bg-rose-50/40 ${
                    item.isCompleted ? 'bg-slate-50/60 opacity-80' : ''
                  }`}
                >
                  {/* Cột 1: Thời gian */}
                  <td className="py-3 px-3 sm:px-4 border-r border-slate-300/80 font-black text-slate-800 whitespace-nowrap text-center align-middle">
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
                  </td>

                  {/* Cột 2: Lịch trình & Hoạt động */}
                  <td className="py-3 px-3 sm:px-4 border-r border-slate-300/80 align-middle">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 min-w-0">
                        {item.emoji && <span className="text-base shrink-0 select-none">{item.emoji}</span>}
                        <div className="min-w-0">
                          <span
                            className={`font-semibold text-slate-800 break-words ${
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

                      {/* Nút Sửa & Xóa (Hiện khi hover hoặc trên mobile) */}
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
                  </td>

                  {/* Cột 3: Dự trù ngân sách từng việc */}
                  <td className="py-3 px-3 sm:px-4 font-semibold text-slate-800 text-center align-middle whitespace-nowrap">
                    {item.estimatedCost ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-slate-900 font-bold">{item.estimatedCost}</span>
                        {item.numericCost !== undefined && item.numericCost > 0 && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200/60 font-semibold">
                            +{formatShortCurrency(item.numericCost)}
                          </span>
                        )}
                      </div>
                    ) : item.numericCost && item.numericCost > 0 ? (
                      <span className="text-slate-900 font-bold">+{formatVND(item.numericCost)}</span>
                    ) : (
                      <span className="text-slate-300 font-normal">0đ</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400 italic">
                  Chưa có khung giờ nào. Bấm nút "+ Thêm khung giờ" để tạo lịch trình và tự động tính tiền nhé! 📝✨
                </td>
              </tr>
            )}
          </tbody>

          {/* 3. Footer Bảng: TỔNG CHI PHÍ TỰ ĐỘNG CỘNG (Màu vàng cam pastel giống mẫu ảnh) */}
          <tfoot>
            <tr className="bg-amber-100/90 border-t-2 border-amber-300 text-amber-950 font-bold text-xs sm:text-sm">
              <td colSpan={3} className="py-3.5 px-4 space-y-2">
                {/* Dòng 1: Tổng chi phí tự động cộng */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-amber-950 text-sm flex items-center gap-1.5">
                      <Calculator className="w-4 h-4 text-amber-700" />
                      <span>{plan.summaryBudgetNote || 'Tổng chi phí (dự kiến):'}</span>
                    </span>
                    <span className="bg-amber-400/90 text-amber-950 text-sm sm:text-base font-black px-3 py-0.5 rounded-xl border border-amber-500/50 shadow-sm animate-pulse">
                      ~ {formatVND(totalNumeric)} {totalNumeric > 0 && `(${formatShortCurrency(totalNumeric)})`} 🥹
                    </span>
                  </div>

                  {plan.totalDays > 1 && (
                    <div className="text-xs font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-xl border border-amber-300 self-start sm:self-auto">
                      🌟 Tổng cả chuyến ({plan.totalDays} ngày): {formatVND(allDaysTotal)}
                    </div>
                  )}
                </div>

                {/* Dòng 2: Chi tiết người chi trả tự động tính */}
                {totalNumeric > 0 && (
                  <div className="pt-1.5 border-t border-amber-200/80 flex flex-wrap items-center gap-3 text-[11px] font-bold text-amber-900/90">
                    <span className="text-slate-500">Phân chia dự kiến:</span>
                    {husbandTotal > 0 && (
                      <span className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-blue-200 text-blue-900">
                        <span>🐻 Chồng:</span>
                        <strong className="text-blue-700">{formatVND(husbandTotal)}</strong>
                      </span>
                    )}
                    {wifeTotal > 0 && (
                      <span className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-rose-200 text-rose-900">
                        <span>🐰 Vợ:</span>
                        <strong className="text-rose-700">{formatVND(wifeTotal)}</strong>
                      </span>
                    )}
                    {sharedTotal > 0 && (
                      <span className="flex items-center gap-1 bg-white/70 px-2 py-0.5 rounded-lg border border-amber-300 text-amber-950">
                        <span>💕 Quỹ chung:</span>
                        <strong>{formatVND(sharedTotal)}</strong>
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
