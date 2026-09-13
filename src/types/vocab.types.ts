// Định nghĩa các kiểu dữ liệu cho module Học Từ Vựng Tiếng Anh Theo Chủ Đề (LoveVocab)

export type WordPartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'idiom';

export type TopicColorTheme = 'rose' | 'pink' | 'purple' | 'blue' | 'amber' | 'emerald';

export interface VocabWord {
  id: string;
  topicId?: string;
  word: string;
  phonetic?: string; // Ví dụ: /ˈtʃer.ɪʃ/
  partOfSpeech?: WordPartOfSpeech | string; // 'noun', 'verb', 'adjective'...
  meaning: string; // Nghĩa tiếng Việt
  example?: string; // Câu ví dụ tiếng Anh
  exampleMeaning?: string; // Nghĩa tiếng Việt của câu ví dụ
  memoryTip?: string; // Mẹo nhớ hoặc liên tưởng vui
  topic?: string;
  masteredBy?: string[]; // Danh sách userId hoặc role đã thuộc từ này (VD: ['husband', 'wife'])
  createdAt?: string;
}

export interface CoupleReward {
  isUnlocked: boolean;
  rewardTitle: string; // "Được bao 1 ly trà sữa trân châu", "15 phút massage lưng"...
  unlockedAt?: string;
  claimedByRole?: 'husband' | 'wife' | 'both';
  customNote?: string;
}

export interface VocabTopic {
  id: string;
  title: string; // "Tiếng Anh Hẹn Hò & Tình Yêu 💕"
  description?: string; // "Các từ và mẫu câu ngọt ngào khi đi chơi cùng nhau"
  emoji: string; // "☕", "✈️", "💬", "💖"
  colorTheme: TopicColorTheme;
  words: VocabWord[];
  reward?: CoupleReward;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VocabStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  history?: Record<string, boolean>; // date -> completed
}

// Giữ lại để tương thích ngược nếu cần
export interface PartnerVocabProgress {
  userId: string;
  role: 'husband' | 'wife';
  completedWordIds: string[];
  quizScore?: number;
  isCompleted: boolean;
  finishedAt?: string;
}

export interface DailyVocabSet {
  id: string;
  date: string;
  title: string;
  topic?: string;
  words: VocabWord[];
  partner1Progress: PartnerVocabProgress;
  partner2Progress: PartnerVocabProgress;
  reward?: CoupleReward;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
