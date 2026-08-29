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
  | 'happy'       // Vui vẻ 🥰
  | 'pouting'     // Đang dỗi / Giận 😤
  | 'hungry'      // Đói bụng 🤤
  | 'tired'       // Mệt mỏi 😴
  | 'missing_you' // Đang nhớ 💭
  | 'sick'        // Đang ốm 🤒
  | 'busy'        // Đang bận 💼
  | 'excited';    // Hào hứng 🥳

export interface MoodStatus {
  userId: string;
  mood: MoodType;
  caption: string;
  photoUrl?: string; // Ảnh meme hoặc ảnh selfie thật
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
  location: string; // 'Đà Lạt', 'Hà Nội', 'Tiệm Cà Phê...'
  tags: string[];
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
