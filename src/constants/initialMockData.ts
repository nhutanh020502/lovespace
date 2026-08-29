import { CoupleSettings, MoodStatus, HealthStatus, ChatMessage, MemoryPhoto, PlaceFoodItem, TodoItem, BudgetGoal, ExpenseRecord } from '../types/common.types';

export const INITIAL_SETTINGS: CoupleSettings = {
  anniversaryDate: '2023-02-14',
  currentActiveUser: 'husband',
  soundEnabled: true,
  hapticEnabled: true,
  partner1: {
    id: 'user_husband',
    role: 'husband',
    name: 'Anh Chồng',
    nickname: 'Chồng Yêu 🐻',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    batteryLevel: 88,
    isOnline: true,
  },
  partner2: {
    id: 'user_wife',
    role: 'wife',
    name: 'Vợ Yêu',
    nickname: 'Vợ Nhỏ 🐰',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    batteryLevel: 65,
    isOnline: true,
  }
};

export const INITIAL_MOODS: Record<string, MoodStatus> = {
  user_husband: {
    userId: 'user_husband',
    mood: 'happy',
    caption: 'Đang làm việc chăm chỉ kiếm tiền dắt vợ đi ăn 💼❤️',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    updatedAt: new Date().toISOString(),
  },
  user_wife: {
    userId: 'user_wife',
    mood: 'pouting',
    caption: 'Hôm nay hơi dỗi một xíu vì thèm trà sữa mà chưa được uống 🧋😤',
    photoUrl: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=500&auto=format&fit=crop&q=80', // Cute angry cat photo
    updatedAt: new Date().toISOString(),
    isCustomPhoto: false,
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
    illnessName: 'Viêm họng nhẹ & đau đầu',
    symptoms: 'Hơi rát cổ họng, người hơi mỏi',
    severity: 'mild',
    medicines: [
      {
        id: 'med_1',
        name: 'Siro Bổ Phế Nam Hà',
        dosage: '10ml sau ăn',
        timeToTake: ['08:00', '13:00', '19:30'],
        note: 'Uống với nước ấm, đừng uống nước đá!'
      },
      {
        id: 'med_2',
        name: 'Vitamin C 500mg',
        dosage: '1 viên buổi sáng',
        timeToTake: ['08:30'],
        note: 'Tăng đề kháng'
      }
    ],
    allergies: ['Dị ứng Tôm cua biển', 'Phấn hoa ly', 'Thuốc Aspirin'],
    dislikedFoods: ['Hành lá', 'Ăn cay cấp 3', 'Ngò gai', 'Đồ quá béo ngấy'],
    favoriteComfortFoods: [
      'Trà sữa Ô Long nướng (50% đường, 30% đá)',
      'Bánh tráng nướng trứng cút phô mai',
      'Tokbokki phô mai xúc xích',
      'Canh chua cá lóc miền Tây'
    ],
    periodTracking: {
      lastPeriodDate: '2026-08-15',
      cycleLengthDays: 28,
      notes: 'Những ngày này hay đau lưng, thích uống nước gừng ấm & cần được ôm nhiều hơn ❤️'
    },
    lastUpdated: new Date().toISOString()
  },
  user_husband: {
    userId: 'user_husband',
    illnessName: 'Bình thường khỏe mạnh',
    severity: 'mild',
    medicines: [],
    allergies: ['Không có dị ứng nghiêm trọng'],
    dislikedFoods: ['Khổ qua (Mướp đắng)'],
    favoriteComfortFoods: ['Bún đậu mắm tôm', 'Phở bò tái nạm', 'Cà phê muối'],
    lastUpdated: new Date().toISOString()
  }
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'user_husband',
    text: 'Vợ ơi, trưa nay em muốn ăn gì anh đặt ship qua cho nè? 🛵🍱',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    reactions: { '❤️': ['user_wife'] },
    status: 'read'
  },
  {
    id: 'msg_2',
    senderId: 'user_wife',
    text: 'Em đang thèm cơm tấm sườn bì chả mà quán gần công ty hôm nay đóng cửa rồi 🥺',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reactions: { '🥺': ['user_husband'] },
    status: 'read'
  },
  {
    id: 'msg_3',
    senderId: 'user_husband',
    text: 'Để anh đặt bên Ba Ghiền ship qua cho vợ nha, nhớ uống thêm nước ấm đó! 🥛❤️',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    reactions: { '💋': ['user_wife'], '❤️': ['user_wife'] },
    isPinned: true,
    status: 'read'
  },
  {
    id: 'msg_4',
    senderId: 'user_wife',
    text: 'Dạ iu chồng nhiều lắm moahhh 💖🥰',
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=500&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    reactions: { '❤️': ['user_husband'] },
    status: 'read'
  }
];

export const INITIAL_MEMORIES: MemoryPhoto[] = [
  {
    id: 'mem_1',
    photoUrl: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&auto=format&fit=crop&q=80',
    date: '2025-12-24',
    note: 'Đêm Giáng Sinh cùng nhau dạo phố đi bộ, hai đứa lạnh cóng nhưng tay nắm tay ấm áp vô cùng 🎄✨',
    location: 'Hồ Hoàn Kiếm, Hà Nội',
    tags: ['Noel', 'Kỷ niệm', 'Hà Nội'],
    uploadedBy: 'user_husband',
    createdAt: '2025-12-25T10:00:00Z'
  },
  {
    id: 'mem_2',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    date: '2026-04-30',
    note: 'Chuyến đi biển đầu tiên sau chuỗi ngày làm việc vất vả. Ngắm hoàng hôn bên bờ biển cùng em là điều tuyệt vời nhất 🌅🌊',
    location: 'Bãi biển Mỹ Khê, Đà Nẵng',
    tags: ['Du lịch', 'Biển', 'Hoàng hôn'],
    uploadedBy: 'user_wife',
    createdAt: '2026-05-01T15:30:00Z'
  },
  {
    id: 'mem_3',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
    date: '2026-07-15',
    note: 'Quán cà phê nhỏ xinh trên đồi, hai đứa ngồi nghe nhạc Acoustic và ngắm mây bay ☕🌿',
    location: 'Tiệm Cà Phê Tháng Năm, Đà Lạt',
    tags: ['Đà Lạt', 'Cafe', 'Chill'],
    uploadedBy: 'user_husband',
    createdAt: '2026-07-16T09:15:00Z'
  }
];

export const INITIAL_PLACES: PlaceFoodItem[] = [
  {
    id: 'place_1',
    name: 'Lẩu Bò Ba Toa Nhà Gỗ',
    category: 'restaurant',
    address: '1/29 Hoàng Diệu, TP. Đà Lạt',
    googleMapsUrl: 'https://maps.google.com',
    estimatedPrice: '250k - 350k / 2 người',
    mustTryDishes: 'Lẩu bắp bò gân, mì trứng, chấm chao',
    notes: 'Quán siêu đông nên đi trước 18h nhé!',
    rating: 5,
    isVisited: true,
    addedBy: 'user_husband',
    createdAt: '2026-06-01T10:00:00Z'
  },
  {
    id: 'place_2',
    name: 'Cà Phê Cheo Veooo',
    category: 'cafe',
    address: '116 Hùng Vương, P. 11, TP. Đà Lạt',
    googleMapsUrl: 'https://maps.google.com',
    estimatedPrice: '50k - 75k / món',
    mustTryDishes: 'Trà đào cam sả, Cà phê cốt dừa',
    notes: 'Điểm ngắm hoàng hôn đỉnh chóp, nhiều góc chụp đẹp cho vợ',
    rating: 5,
    isVisited: true,
    addedBy: 'user_wife',
    createdAt: '2026-06-02T14:20:00Z'
  },
  {
    id: 'place_3',
    name: 'Bánh Mì Huỳnh Hoa',
    category: 'street_food',
    address: '26 Lê Thị Riêng, Quận 1, TP. HCM',
    googleMapsUrl: 'https://maps.google.com',
    estimatedPrice: '68k / ổ',
    mustTryDishes: 'Bánh mì đặc biệt full chả pate',
    notes: 'Mua 1 ổ hai đứa ăn chung là no nê',
    rating: 4,
    isVisited: false,
    addedBy: 'user_husband',
    createdAt: '2026-07-10T11:00:00Z'
  },
  {
    id: 'place_4',
    name: 'Tiệm Trà Sữa MayCha',
    category: 'cafe',
    address: '38 Trịnh Đình Trọng, Tân Phú',
    googleMapsUrl: 'https://maps.google.com',
    estimatedPrice: '30k - 50k',
    mustTryDishes: 'Trà sữa olong nướng trân châu phô mai tươi',
    notes: 'Quán ruột của vợ, dắt qua đây là hết dỗi 100%!',
    rating: 5,
    isVisited: false,
    addedBy: 'user_husband',
    createdAt: '2026-08-01T16:00:00Z'
  }
];

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo_1',
    title: 'Nhắc vợ uống siro ho lúc 19:30',
    description: 'Pha với nửa ly nước ấm',
    category: 'daily',
    assignedTo: 'husband',
    dueDate: '2026-08-29',
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo_2',
    title: 'Đặt vé máy bay đi du lịch Phú Quốc',
    description: 'Săn vé bay sáng sớm giá tốt',
    category: 'travel',
    assignedTo: 'both',
    dueDate: '2026-09-15',
    isCompleted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'todo_3',
    title: 'Cùng nhau dọn dẹp tủ quần áo & giặt rèm cửa',
    description: 'Cuối tuần bật nhạc nghe rồi cùng dọn',
    category: 'weekend',
    assignedTo: 'both',
    dueDate: '2026-08-30',
    isCompleted: true,
    completedAt: '2026-08-28T18:00:00Z',
    completedBy: 'wife',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_BUDGET: { goals: BudgetGoal[]; records: ExpenseRecord[] } = {
  goals: [
    {
      id: 'goal_1',
      title: 'Heo Đất Du Lịch Phú Quốc 🌴',
      targetAmount: 15000000,
      currentAmount: 9500000,
      deadline: '2026-11-20'
    },
    {
      id: 'goal_2',
      title: 'Quỹ Ăn Uống Cuối Tuần 🍲',
      targetAmount: 3000000,
      currentAmount: 2150000,
    }
  ],
  records: [
    {
      id: 'rec_1',
      title: 'Chồng trích lương tháng 8 nuôi heo đất',
      amount: 3000000,
      type: 'deposit',
      category: 'Nuôi Heo',
      recordedBy: 'user_husband',
      date: '2026-08-25',
      note: 'Dành dụm đi Phú Quốc'
    },
    {
      id: 'rec_2',
      title: 'Đi ăn tối buffet lẩu cuối tuần',
      amount: 650000,
      type: 'expense',
      category: 'Ăn Uống',
      recordedBy: 'user_wife',
      date: '2026-08-27',
      note: 'Hai đứa ăn rất ngon miệng'
    }
  ]
};
