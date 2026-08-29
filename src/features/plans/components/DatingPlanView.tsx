import React, { useState } from 'react';
import { DatingPlan, PlanStatus } from '../../../types/plan.types';
import { PlanDetailView } from './PlanDetailView';
import { PlanModal } from './PlanModal';
import { Button } from '../../../components/ui/Button';
import {
  CalendarHeart,
  Plus,
  Search,
  MapPin,
  Calendar,
  Clock,
  Luggage,
  Sparkles,
  ChevronRight,
  FolderArchive,
  Compass,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import { formatDateVi } from '../../../utils/dateUtils';

interface DatingPlanViewProps {
  plans: DatingPlan[];
  onAddPlan: (plan: DatingPlan) => void;
  onUpdatePlan: (plan: DatingPlan) => void;
  onDeletePlan: (planId: string) => void;
  currentUserId: string;
}

export const DatingPlanView: React.FC<DatingPlanViewProps> = ({
  plans,
  onAddPlan,
  onUpdatePlan,
  onDeletePlan,
  currentUserId,
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Lọc kế hoạch theo Tab & Tìm kiếm
  const filteredPlans = plans.filter((p) => {
    const matchesTab = p.status === activeStatusTab;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.destination && p.destination.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.timeHeaderNote && p.timeHeaderNote.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.items.some((it) => it.activity.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  // Nhân bản kế hoạch
  const handleClonePlan = (sourcePlan: DatingPlan) => {
    const today = new Date().toISOString().split('T')[0];
    const clonedPlan: DatingPlan = {
      ...sourcePlan,
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: `${sourcePlan.title} (Bản Sao)`,
      startDate: today,
      endDate: sourcePlan.totalDays > 1 ? today : undefined,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUserId,
      items: sourcePlan.items.map((it) => ({
        ...it,
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        isCompleted: false,
      })),
      packingList: sourcePlan.packingList?.map((pk) => ({
        ...pk,
        id: `pack_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        isPacked: false,
      })),
    };

    onAddPlan(clonedPlan);
    setSelectedPlanId(clonedPlan.id);
  };

  // Tạo kế hoạch mới
  const handleCreatePlan = (planData: Partial<DatingPlan>) => {
    const newPlan: DatingPlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: planData.title || 'Kế hoạch hẹn hò 💕',
      startDate: planData.startDate || new Date().toISOString().split('T')[0],
      endDate: planData.endDate,
      totalDays: planData.totalDays || 1,
      timeHeaderNote: planData.timeHeaderNote || '(tại cục chồng hay đi trễ)',
      summaryBudgetNote: planData.summaryBudgetNote || 'Tổng chi phí (dự kiến) ~ 1 củ 🥹',
      destination: planData.destination || 'Sài Gòn',
      transportInfo: planData.transportInfo || '🛵 Xe máy cá nhân',
      hotelInfo: planData.hotelInfo,
      status: 'upcoming',
      items: [],
      packingList: [
        { id: `pk_${Date.now()}_1`, name: 'Áo khoác đôi', assignedTo: 'both', isPacked: false },
        { id: `pk_${Date.now()}_2`, name: 'Sạc dự phòng', assignedTo: 'husband', isPacked: false },
        { id: `pk_${Date.now()}_3`, name: 'Son môi & Gương', assignedTo: 'wife', isPacked: false },
      ],
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddPlan(newPlan);
    setSelectedPlanId(newPlan.id);
  };

  // Nếu đang xem chi tiết một Kế Hoạch
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);
  if (selectedPlan) {
    return (
      <PlanDetailView
        plan={selectedPlan}
        onBack={() => setSelectedPlanId(null)}
        onUpdatePlan={onUpdatePlan}
        onDeletePlan={onDeletePlan}
        onClonePlan={handleClonePlan}
        currentUserId={currentUserId}
      />
    );
  }

  // Đếm số lượng theo tab
  const upcomingCount = plans.filter((p) => p.status === 'upcoming').length;
  const ongoingCount = plans.filter((p) => p.status === 'ongoing').length;
  const completedCount = plans.filter((p) => p.status === 'completed').length;

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* 1. Header & Nút Tạo Kế Hoạch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-200/60 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-glow">
            <CalendarHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Lịch Trình & Kế Hoạch Hẹn Hò</span>
              <span className="text-xs bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded-full">
                {plans.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cùng nhau lên lịch hẹn, chuyến đi & dự trù ngân sách ngọt ngào 💕
            </p>
          </div>
        </div>

        <Button
          variant="romantic"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto shadow-md"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Tạo Kế Hoạch Mới</span>
        </Button>
      </div>

      {/* 2. Thanh Tìm Kiếm & Tabs Trạng Thái */}
      <div className="space-y-2.5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên kế hoạch, địa điểm (Đà Lạt, Sài Gòn, Bún đậu, YEPO...)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 backdrop-blur-md border border-rose-100 text-xs font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-rose-400 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* 3 Tabs Phân Loại */}
        <div className="flex items-center gap-1.5 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-rose-100/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveStatusTab('upcoming')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeStatusTab === 'upcoming'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sắp Diễn Ra</span>
            <span className="text-[10px] opacity-80">({upcomingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStatusTab('ongoing')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeStatusTab === 'ongoing'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Đang Diễn Ra</span>
            <span className="text-[10px] opacity-80">({ongoingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStatusTab('completed')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeStatusTab === 'completed'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Kỷ Niệm Đã Đi</span>
            <span className="text-[10px] opacity-80">({completedCount})</span>
          </button>
        </div>
      </div>

      {/* 3. Danh Sách Các Thẻ Kế Hoạch (Plan Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => {
            const completedItems = plan.items.filter((it) => it.isCompleted).length;
            const totalItems = plan.items.length;
            const totalNumericCost = plan.items.reduce((acc, it) => acc + (it.numericCost || 0), 0);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className="group p-4 rounded-3xl bg-white/85 hover:bg-white backdrop-blur-md border border-rose-100 hover:border-rose-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
              >
                {/* Header Card */}
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {plan.totalDays > 1 ? '🌴' : '☕'}
                      </span>
                      <div>
                        <h3 className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors">
                          {plan.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-rose-500" />
                            <span>{formatDateVi(plan.startDate)}</span>
                          </span>
                          {plan.destination && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              <span>{plan.destination}</span>
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        plan.totalDays > 1
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {plan.totalDays > 1 ? `${plan.totalDays}N${plan.totalDays - 1}Đ` : '1 Ngày'}
                    </span>
                  </div>

                  {plan.timeHeaderNote && (
                    <p className="text-[11px] text-slate-600 bg-rose-50/60 px-2.5 py-1 rounded-xl italic border border-rose-100/60">
                      💡 {plan.timeHeaderNote}
                    </p>
                  )}
                </div>

                {/* Chặng nổi bật & Tiêu biểu */}
                {plan.items.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-slate-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400">Các điểm dừng chân:</span>
                    <div className="flex flex-wrap gap-1">
                      {plan.items.slice(0, 3).map((it) => (
                        <span
                          key={it.id}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700"
                        >
                          <span>{it.emoji || '📍'}</span>
                          <span className="truncate max-w-[120px]">{it.activity}</span>
                        </span>
                      ))}
                      {plan.items.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5">
                          +{plan.items.length - 3} chặng khác
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Footer Card */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-600">
                      {totalItems > 0 ? (
                        <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{completedItems}/{totalItems} chặng</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">Chưa có chặng</span>
                      )}
                    </span>
                    {plan.summaryBudgetNote && (
                      <span className="text-[11px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        💰 {plan.summaryBudgetNote}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-rose-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Xem lịch trình</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center space-y-3 bg-white/50 backdrop-blur-md rounded-3xl border border-dashed border-rose-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center text-xl">
              🗓️
            </div>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              {searchQuery
                ? 'Không tìm thấy kế hoạch nào khớp với từ khóa tìm kiếm.'
                : activeStatusTab === 'upcoming'
                ? 'Chưa có buổi hẹn hò hoặc chuyến đi nào sắp tới. Bấm nút "+ Tạo Kế Hoạch Mới" để cùng lên lịch nhé!'
                : activeStatusTab === 'ongoing'
                ? 'Hôm nay chưa có lịch trình nào đang diễn ra.'
                : 'Chưa có chuyến đi nào trong kho lưu trữ kỷ niệm.'}
            </p>
            {!searchQuery && (
              <Button variant="romantic" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Lên Kế Hoạch Ngay</span>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal Tạo Kế Hoạch Mới */}
      <PlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreatePlan}
        currentUserId={currentUserId}
      />
    </div>
  );
};
