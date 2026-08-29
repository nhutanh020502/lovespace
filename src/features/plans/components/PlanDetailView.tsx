import React, { useState } from 'react';
import { DatingPlan, PlanTimelineItem, PackingItem } from '../../../types/plan.types';
import { PlanTableView } from './PlanTableView';
import { PlanTimelineView } from './PlanTimelineView';
import { PlanItemModal } from './PlanItemModal';
import { PackingListModal } from './PackingListModal';
import { PlanModal } from './PlanModal';
import { Button } from '../../../components/ui/Button';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Luggage,
  Table as TableIcon,
  Clock,
  Copy,
  Edit,
  Trash2,
  Hotel,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { formatDateVi } from '../../../utils/dateUtils';

interface PlanDetailViewProps {
  plan: DatingPlan;
  onBack: () => void;
  onUpdatePlan: (updatedPlan: DatingPlan) => void;
  onDeletePlan: (planId: string) => void;
  onClonePlan: (plan: DatingPlan) => void;
  currentUserId: string;
}

export const PlanDetailView: React.FC<PlanDetailViewProps> = ({
  plan,
  onBack,
  onUpdatePlan,
  onDeletePlan,
  onClonePlan,
  currentUserId,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  // Modals
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PlanTimelineItem | null>(null);
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);

  // 1. Mở Modal Thêm Chặng
  const handleOpenAddItem = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  // 2. Mở Modal Sửa Chặng
  const handleOpenEditItem = (item: PlanTimelineItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  // 3. Lưu Chặng (Thêm mới hoặc Cập nhật)
  const handleSaveItem = (itemData: Partial<PlanTimelineItem>) => {
    let updatedItems: PlanTimelineItem[];
    if (editingItem) {
      updatedItems = plan.items.map((it) =>
        it.id === editingItem.id ? ({ ...it, ...itemData } as PlanTimelineItem) : it
      );
    } else {
      const newItem: PlanTimelineItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        dayIndex: itemData.dayIndex || selectedDayIndex,
        timeRange: itemData.timeRange || '09:00',
        activity: itemData.activity || '',
        emoji: itemData.emoji || '🚗',
        estimatedCost: itemData.estimatedCost || '',
        numericCost: itemData.numericCost || 0,
        paidBy: itemData.paidBy || 'husband',
        locationUrl: itemData.locationUrl,
        notes: itemData.notes,
        isCompleted: false,
      };
      updatedItems = [...plan.items, newItem];
    }

    onUpdatePlan({
      ...plan,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    });
  };

  // 4. Xóa Chặng
  const handleDeleteItem = (itemId: string) => {
    onUpdatePlan({
      ...plan,
      items: plan.items.filter((it) => it.id !== itemId),
      updatedAt: new Date().toISOString(),
    });
  };

  // 5. Đánh dấu hoàn thành chặng
  const handleToggleCompleteItem = (itemId: string) => {
    onUpdatePlan({
      ...plan,
      items: plan.items.map((it) => (it.id === itemId ? { ...it, isCompleted: !it.isCompleted } : it)),
      updatedAt: new Date().toISOString(),
    });
  };

  // 6. Cập nhật Packing List
  const handleUpdatePackingList = (newPackingList: PackingItem[]) => {
    onUpdatePlan({
      ...plan,
      packingList: newPackingList,
      updatedAt: new Date().toISOString(),
    });
  };

  // Tính tổng số chặng đã hoàn thành
  const completedCount = plan.items.filter((it) => it.isCompleted).length;
  const totalItemsCount = plan.items.length;
  const packedCount = (plan.packingList || []).filter((p) => p.isPacked).length;
  const totalPackingCount = (plan.packingList || []).length;

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* 1. Top Navigation Bar & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-200/60 shadow-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all active:scale-95 shadow-xs"
            title="Quay lại danh sách kế hoạch"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight truncate">
                {plan.title}
              </h2>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                  plan.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : plan.status === 'ongoing'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}
              >
                {plan.status === 'completed' ? 'Đã đi xong' : plan.status === 'ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>
                  {formatDateVi(plan.startDate)}
                  {plan.endDate && plan.endDate !== plan.startDate ? ` - ${formatDateVi(plan.endDate)}` : ''}
                </span>
              </span>
              {plan.destination && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{plan.destination}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nút Chức Năng Phụ (Sửa, Nhân bản, Xếp đồ, Xóa) */}
        <div className="flex items-center gap-1.5 flex-wrap self-end sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPackingModalOpen(true)}
            className="text-xs py-1.5 px-2.5 h-8 relative"
            title="Danh sách đồ mang theo"
          >
            <Luggage className="w-3.5 h-3.5 mr-1 text-rose-500" />
            <span>Xếp đồ</span>
            {totalPackingCount > 0 && (
              <span className="ml-1 text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full">
                {packedCount}/{totalPackingCount}
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onClonePlan(plan)}
            className="text-xs py-1.5 px-2.5 h-8"
            title="Nhân bản làm kế hoạch mới"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            <span>Nhân bản</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditPlanModalOpen(true)}
            className="text-xs py-1.5 px-2.5 h-8"
            title="Sửa thông tin kế hoạch"
          >
            <Edit className="w-3.5 h-3.5 mr-1" />
            <span>Sửa</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn xóa toàn bộ kế hoạch này không?')) {
                onDeletePlan(plan.id);
                onBack();
              }
            }}
            className="text-xs py-1.5 px-2.5 h-8 text-slate-400 hover:text-red-600 hover:border-red-200"
            title="Xóa kế hoạch"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. Banner Tóm Tắt & Thông Tin Khách Sạn / Di Chuyển */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-glow">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block">Tiến độ chuyến đi</span>
            <strong className="text-xs sm:text-sm font-black text-slate-800">
              {completedCount}/{totalItemsCount} chặng đã qua ({totalItemsCount > 0 ? Math.round((completedCount / totalItemsCount) * 100) : 0}%)
            </strong>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-glow">
            <span className="text-sm font-bold">🛵</span>
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-slate-400 block">Phương tiện</span>
            <strong className="text-xs font-bold text-slate-800 truncate block">
              {plan.transportInfo || 'Chưa cập nhật'}
            </strong>
          </div>
        </div>

        {plan.hotelInfo?.name ? (
          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-blue-100 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-500 text-white shadow-glow">
              <Hotel className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-slate-400 block">Nơi nghỉ chân</span>
              <strong className="text-xs font-bold text-slate-800 truncate block">
                {plan.hotelInfo.name}
              </strong>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-100 shadow-xs flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-pink-500 text-white shadow-glow">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">Thời lượng</span>
              <strong className="text-xs font-black text-slate-800">
                {plan.totalDays > 1 ? `${plan.totalDays} Ngày ${plan.totalDays - 1} Đêm` : 'Hẹn hò trong ngày'}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* 3. Thanh Điều Khiển: Tab Ngày (nếu nhiều ngày) & Chuyển đổi View Mode (Bảng vs Timeline) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-2 bg-white/60 backdrop-blur-md rounded-2xl border border-rose-100">
        {/* Tab Ngày */}
        {plan.totalDays > 1 ? (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {Array.from({ length: plan.totalDays }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDayIndex(d)}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedDayIndex === d
                    ? 'bg-rose-500 text-white shadow-sm scale-105'
                    : 'bg-white/80 text-slate-600 hover:bg-rose-50'
                }`}
              >
                <span>📅 Ngày {d}</span>
                <span className="text-[10px] opacity-80">
                  ({plan.items.filter((it) => (it.dayIndex || 1) === d).length})
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
            <span>🌸 Lịch trình chi tiết:</span>
          </div>
        )}

        {/* Nút đổi Bảng / Timeline */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Chế độ Bảng chuẩn"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Bảng Kế Hoạch</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'timeline'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Chế độ Dòng thời gian"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Dòng Thời Gian</span>
          </button>
        </div>
      </div>

      {/* 4. Nội Dung Chính: Table View hoặc Timeline View */}
      {viewMode === 'table' ? (
        <PlanTableView
          plan={plan}
          selectedDayIndex={selectedDayIndex}
          items={plan.items}
          onOpenAddItem={handleOpenAddItem}
          onOpenEditItem={handleOpenEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleCompleteItem={handleToggleCompleteItem}
          onUpdatePlanItems={(newItems) => onUpdatePlan({ ...plan, items: newItems, updatedAt: new Date().toISOString() })}
        />
      ) : (
        <PlanTimelineView
          plan={plan}
          selectedDayIndex={selectedDayIndex}
          items={plan.items}
          onOpenAddItem={handleOpenAddItem}
          onOpenEditItem={handleOpenEditItem}
          onDeleteItem={handleDeleteItem}
          onToggleCompleteItem={handleToggleCompleteItem}
        />
      )}

      {/* 5. Modals */}
      <PlanModal
        isOpen={isEditPlanModalOpen}
        onClose={() => setIsEditPlanModalOpen(false)}
        onSave={(data) => onUpdatePlan({ ...plan, ...data, updatedAt: new Date().toISOString() })}
        initialPlan={plan}
        currentUserId={currentUserId}
      />

      <PlanItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={editingItem}
        dayIndex={selectedDayIndex}
        totalDays={plan.totalDays}
      />

      <PackingListModal
        isOpen={isPackingModalOpen}
        onClose={() => setIsPackingModalOpen(false)}
        packingList={plan.packingList || []}
        onUpdatePackingList={handleUpdatePackingList}
      />
    </div>
  );
};
