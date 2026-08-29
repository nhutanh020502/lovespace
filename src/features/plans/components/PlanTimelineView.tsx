import React from 'react';
import { PlanTimelineItem, DatingPlan } from '../../../types/plan.types';
import { Button } from '../../../components/ui/Button';
import { Edit2, Trash2, Plus, CheckCircle2, Circle, ExternalLink, Clock, DollarSign } from 'lucide-react';

interface PlanTimelineViewProps {
  plan: DatingPlan;
  selectedDayIndex: number;
  items: PlanTimelineItem[];
  onOpenAddItem: (dayIndex: number) => void;
  onOpenEditItem: (item: PlanTimelineItem) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleCompleteItem: (itemId: string) => void;
  readOnly?: boolean;
}

export const PlanTimelineView: React.FC<PlanTimelineViewProps> = ({
  plan,
  selectedDayIndex,
  items,
  onOpenAddItem,
  onOpenEditItem,
  onDeleteItem,
  onToggleCompleteItem,
  readOnly = false,
}) => {
  const dayItems = items.filter((item) => (item.dayIndex || 1) === selectedDayIndex);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-3 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold text-slate-800">
            Dòng thời gian buổi hẹn {plan.totalDays > 1 ? `- Ngày ${selectedDayIndex}` : ''}
          </span>
        </div>

        {!readOnly && (
          <Button
            variant="romantic"
            size="sm"
            onClick={() => onOpenAddItem(selectedDayIndex)}
            className="text-xs py-1 px-2.5 h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Thêm chặng</span>
          </Button>
        )}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-rose-400 before:via-pink-300 before:to-rose-100">
        {dayItems.length > 0 ? (
          dayItems.map((item, idx) => (
            <div key={item.id} className="relative group">
              {/* Glowing Node on Timeline */}
              <button
                type="button"
                onClick={() => !readOnly && onToggleCompleteItem(item.id)}
                className={`absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform active:scale-95 ${
                  item.isCompleted
                    ? 'bg-emerald-500 border-white text-white shadow-sm'
                    : 'bg-white border-rose-400 text-rose-500 shadow-xs group-hover:scale-110'
                }`}
                title={item.isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-black">{idx + 1}</span>
                )}
              </button>

              {/* Card Content */}
              <div
                className={`p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border transition-all shadow-xs hover:shadow-md ${
                  item.isCompleted
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-rose-100 hover:border-rose-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0 flex-1">
                    {/* Time & Cost Badge */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                        ⏰ {item.timeRange}
                      </span>
                      {item.estimatedCost && (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 flex items-center gap-0.5">
                          <DollarSign className="w-3 h-3" />
                          <span>{item.estimatedCost}</span>
                        </span>
                      )}
                    </div>

                    {/* Activity */}
                    <div className="flex items-start gap-2 pt-1">
                      {item.emoji && <span className="text-lg shrink-0">{item.emoji}</span>}
                      <div>
                        <h4
                          className={`text-xs sm:text-sm font-bold text-slate-800 leading-snug ${
                            item.isCompleted ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {item.activity}
                        </h4>
                        {item.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">{item.notes}</p>
                        )}
                        {item.locationUrl && (
                          <a
                            href={item.locationUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:underline font-bold mt-1.5"
                          >
                            <span>📍 Mở Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {!readOnly && (
                    <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100">
                      <button
                        onClick={() => onOpenEditItem(item)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="Sửa chặng này"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Xóa chặng này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            Chưa có lịch trình cho ngày này. Bấm "+ Thêm chặng" để tạo ngay! 💕
          </div>
        )}
      </div>

      {/* Footer Tự Động Cộng Tổng Chi Phí */}
      {dayItems.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-100/90 border border-amber-300 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black">💰 Tổng chi phí ngày {selectedDayIndex}:</span>
            <span className="text-sm sm:text-base font-black text-amber-950 bg-amber-300/90 px-2.5 py-0.5 rounded-xl border border-amber-400">
              ~ {dayItems.reduce((acc, it) => acc + (it.numericCost || 0), 0).toLocaleString('vi-VN')} đ
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-800 italic">
            ✨ Tự động cộng từ từng việc làm trong ngày
          </span>
        </div>
      )}
    </div>
  );
};
