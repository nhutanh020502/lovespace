// Định nghĩa kiểu dữ liệu cho module Kế Hoạch & Lịch Trình Hẹn Hò / Du Lịch

export interface PlanTimelineItem {
  id: string;
  dayIndex: number; // Ngày thứ mấy trong chuyến đi (1, 2, 3...) - mặc định là 1 nếu đi 1 ngày
  timeRange: string; // "09:00", "10:00 - 11:00", "12:15 ~ 12:30"
  activity: string; // "Đến YEPO - Dog & Ice Cream rùi chơi, chụp hình pla pla"
  emoji?: string; // "🐶", "🚗", "🍱", "❤️🔥"
  estimatedCost?: string; // "~250 - 300k", "200k", "0đ tại có cục chồng chở"
  numericCost?: number; // 250000 (để tự động tính toán)
  actualCost?: number; // Chi phí thực tế nếu có
  paidBy?: 'husband' | 'wife' | 'shared'; // Ai trả
  locationUrl?: string; // Link Google Maps / TikTok
  isCompleted?: boolean; // Đã đi xong chặng này chưa
  notes?: string; // Ghi chú thêm
}

export interface PackingItem {
  id: string;
  name: string; // "Váy trắng sống ảo", "Sạc dự phòng", "Kem chống nắng"
  assignedTo?: 'husband' | 'wife' | 'both';
  isPacked: boolean;
}

export interface HotelInfo {
  name?: string;
  address?: string;
  checkIn?: string;
  checkOut?: string;
  cost?: number;
  notes?: string;
}

export type PlanStatus = 'upcoming' | 'ongoing' | 'completed';

export interface DatingPlan {
  id: string;
  title: string; // "Kế hoạch ngày 31/8" hoặc "Du Lịch Đà Lạt 3N2Đ"
  startDate: string; // "2026-08-31"
  endDate?: string; // "2026-09-02" (nếu đi dài ngày)
  totalDays: number; // 1 (hẹn hò trong ngày) hoặc nhiều ngày (3, 4...)
  timeHeaderNote?: string; // "(tại cục chồng hay đi trễ)"
  summaryBudgetNote?: string; // "Tổng chi phí (dự kiến) ~ 1 củ 🥹"
  destination?: string; // "Sài Gòn", "Đà Lạt", "Vũng Tàu"
  coverUrl?: string;
  hotelInfo?: HotelInfo;
  transportInfo?: string; // "Xe máy cá nhân", "Xe Limousine", "Vé máy bay"
  status: PlanStatus;
  items: PlanTimelineItem[];
  packingList?: PackingItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
