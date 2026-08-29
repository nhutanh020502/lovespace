// Định nghĩa các kiểu dữ liệu cốt lõi cho LoveSpace

export type UserRole = 'husband' | 'wife';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  nickname: string;
  avatar: string;
  batteryLevel?: number;
  isOnline?: boolean;
  lastActive?: string;
}

export type MoodType =
  | 'happy'
  | 'pouting'
  | 'hungry'
  | 'tired'
  | 'missing_you'
  | 'sick'
  | 'busy'
  | 'excited'
  | 'sleepy'
  | 'want_hug'
  | 'want_hangout'
  | 'need_cuddle'
  | 'grumpy'
  | 'loving'
  | 'thinking'
  | 'chill'
  | string;

export interface MoodStatus {
  userId: string;
  mood: MoodType;
  caption: string;
  customEmoji?: string;
  customLabel?: string;
  photoUrl?: string; // Ảnh từ máy người dùng hoặc chụp camera
  updatedAt: string;
  isCustomPhoto?: boolean;
}

export interface HealthStatus {
  userId: string;
  illnessName?: string; // Bệnh đang mắc (Cảm sốt, đau đầu, viêm họng...)
  symptoms?: string;
  severity: 'mild' | 'moderate' | 'severe';
  medicines: Array<{
    id: string;
    name: string;
    dosage: string;
    timeToTake: string[]; // ['08:00', '13:00', '20:00']
    note?: string;
  }>;
  allergies: string[]; // ['Hải sản', 'Phấn hoa', 'Paracetamol']
  dislikedFoods: string[]; // ['Hành lá', 'Ăn cay cấp 3', 'Ngò rí']
  favoriteComfortFoods: string[]; // ['Trà sữa ô long nướng 50% đường', 'Tokbokki']
  periodTracking?: {
    lastPeriodDate: string;
    cycleLengthDays: number;
    notes?: string;
  };
  lastUpdated: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  stickerUrl?: string;
  createdAt: string;
  reactions: Record<string, string[]>; // { '❤️': ['husband_id'], '💋': ['wife_id'] }
  isPinned?: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface MemoryPhoto {
  id: string;
  photoUrl: string;
  date: string; // YYYY-MM-DD
  note: string; // Câu chuyện / Ghi chú kỷ niệm
  location: string; // 'Đà Lạt', 'Hà Nội', 'Quận 1, TP.HCM...'
  tags: string[];
  type?: 'couple_photo' | 'places_dating'; // 'couple_photo' (Ảnh chung) vs 'places_dating' (Điểm hẹn ăn chơi)
  linkUrl?: string; // Link bài viết / Google Maps / Website
  latitude?: number;
  longitude?: number;
  uploadedBy: string;
  createdAt: string;
}

export interface PlaceFoodItem {
  id: string;
  name: string;
  category: 'restaurant' | 'cafe' | 'travel' | 'entertainment' | 'street_food';
  address: string;
  googleMapsUrl?: string;
  estimatedPrice?: string;
  mustTryDishes?: string;
  notes?: string;
  rating?: number; // 1 to 5
  isVisited: boolean;
  addedBy: string;
  createdAt: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  category: 'daily' | 'weekend' | 'future' | 'travel';
  assignedTo: 'husband' | 'wife' | 'both';
  dueDate?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
}

export interface BudgetGoal {
  id: string;
  title: string; // 'Quỹ du lịch Đà Lạt'
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  type: 'deposit' | 'expense';
  category: string;
  recordedBy: string;
  date: string;
  note?: string;
}

export interface CoupleSettings {
  anniversaryDate: string; // '2023-10-20'
  partner1: UserProfile;
  partner2: UserProfile;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  currentActiveUser: UserRole; // 'husband' or 'wife'
}

export type InteractionColorTheme =
  | 'rose'
  | 'pink'
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'amber'
  | 'emerald'
  | 'red';

export interface CustomInteraction {
  id: string;
  label: string;
  emoji: string;
  colorTheme: InteractionColorTheme;
  notificationMessage?: string;
}
