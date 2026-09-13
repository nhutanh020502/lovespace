import { CoupleSettings, MoodStatus, HealthStatus, ChatMessage, MemoryPhoto, PlaceFoodItem, TodoItem, BudgetGoal, ExpenseRecord } from '../types/common.types';

export const INITIAL_SETTINGS: CoupleSettings = {
  anniversaryDate: new Date().toISOString().split('T')[0],
  currentActiveUser: 'husband',
  soundEnabled: true,
  hapticEnabled: true,
  partner1: {
    id: 'user_husband',
    role: 'husband',
    name: 'Chồng',
    nickname: 'Chồng 🐻',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    batteryLevel: 100,
    isOnline: true,
  },
  partner2: {
    id: 'user_wife',
    role: 'wife',
    name: 'Vợ',
    nickname: 'Vợ 🐰',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    batteryLevel: 100,
    isOnline: true,
  }
};

export const INITIAL_MOODS: Record<string, MoodStatus> = {
  user_husband: {
    userId: 'user_husband',
    mood: 'happy',
    caption: '',
    updatedAt: new Date().toISOString(),
  },
  user_wife: {
    userId: 'user_wife',
    mood: 'happy',
    caption: '',
    updatedAt: new Date().toISOString(),
  }
};

export const PRESET_MEMES = [
  {
    id: 'cat_angry',
    mood: 'pouting',
    title: 'Mèo Giận Dỗi',
    url: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format&fit=crop&q=80',
    tag: '😤 Đang dỗi'
  },
  {
    id: 'cat_hungry',
    mood: 'hungry',
    title: 'Mèo Đói Meo',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80',
    tag: '🤤 Thèm ăn'
  },
  {
    id: 'capybara_chill',
    mood: 'happy',
    title: 'Capybara Vui Vẻ',
    url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=500&auto=format&fit=crop&q=80',
    tag: '🥰 Rất vui'
  },
  {
    id: 'panda_sleepy',
    mood: 'tired',
    title: 'Panda Buồn Ngủ',
    url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=500&auto=format&fit=crop&q=80',
    tag: '😴 Buồn ngủ'
  },
  {
    id: 'shiba_love',
    mood: 'missing_you',
    title: 'Shiba Nhớ Em/Anh',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80',
    tag: '💭 Đang nhớ'
  },
  {
    id: 'bear_sick',
    mood: 'sick',
    title: 'Gấu Cảm Cúm',
    url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=80',
    tag: '🤒 Hơi mệt'
  }
];

export const INITIAL_HEALTH: Record<string, HealthStatus> = {
  user_wife: {
    userId: 'user_wife',
    illnessName: 'Khỏe mạnh bình thường',
    symptoms: '',
    severity: 'mild',
    medicines: [],
    allergies: [],
    dislikedFoods: [],
    favoriteComfortFoods: [],
    periodTracking: {
      lastPeriodDate: new Date().toISOString().split('T')[0],
      cycleLengthDays: 28,
      notes: ''
    },
    lastUpdated: new Date().toISOString()
  },
  user_husband: {
    userId: 'user_husband',
    illnessName: 'Khỏe mạnh bình thường',
    symptoms: '',
    severity: 'mild',
    medicines: [],
    allergies: [],
    dislikedFoods: [],
    favoriteComfortFoods: [],
    lastUpdated: new Date().toISOString()
  }
};

// Toàn bộ danh sách thực tế - Khởi tạo rỗng, không chứa dữ liệu mẫu hardcoded
export const INITIAL_MESSAGES: ChatMessage[] = [];
export const INITIAL_MEMORIES: MemoryPhoto[] = [];
export const INITIAL_PLACES: PlaceFoodItem[] = [];
export const INITIAL_TODOS: TodoItem[] = [];
export const INITIAL_BUDGET: { goals: BudgetGoal[]; records: ExpenseRecord[] } = {
  goals: [],
  records: []
};
