// Định nghĩa các kiểu dữ liệu cho module Học Từ Vựng Tiếng Anh (LoveVocab)

export type WordPartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrase'
  | 'idiom';

export interface VocabWord {
  id: string;
  word: string;
  phonetic?: string; // Ví dụ: /ˈtʃer.ɪʃ/
  partOfSpeech?: WordPartOfSpeech | string; // 'noun', 'verb', 'adjective'...
  meaning: string; // Nghĩa tiếng Việt
  example?: string; // Câu ví dụ tiếng Anh
  exampleMeaning?: string; // Nghĩa tiếng Việt của câu ví dụ
  memoryTip?: string; // Mẹo nhớ hoặc liên tưởng vui
  topic?: string;
  createdAt?: string;
}

export interface PartnerVocabProgress {
  userId: string;
  role: 'husband' | 'wife';
  completedWordIds: string[]; // Danh sách ID từ đã thuộc
  quizScore?: number; // Điểm trắc nghiệm (0 - 10)
  isCompleted: boolean; // Đã thuộc đủ 10/10 từ chưa
  finishedAt?: string;
}

export interface CoupleReward {
  isUnlocked: boolean;
  rewardTitle: string; // "Được bao 1 ly trà sữa trân châu", "15 phút massage lưng"...
  unlockedAt?: string;
  claimedByRole?: 'husband' | 'wife' | 'both';
  customNote?: string;
}

export interface DailyVocabSet {
  id: string;
  date: string; // YYYY-MM-DD
  title: string; // "10 Từ Vựng Ngày 13/09" hoặc "Chủ đề: Tình Yêu Lãng Mạn"
  topic?: string;
  words: VocabWord[];
  partner1Progress: PartnerVocabProgress;
  partner2Progress: PartnerVocabProgress;
  reward?: CoupleReward;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VocabStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
  history?: Record<string, boolean>; // date -> bothCompleted
}
