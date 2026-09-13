import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Volume2, CheckCircle2, Circle, BookMarked, Filter } from 'lucide-react';
import { DailyVocabSet, VocabWord } from '../../../types/vocab.types';
import { UserRole } from '../../../types/common.types';
import { useSpeechPronunciation } from '../hooks/useSpeechPronunciation';
import { Card } from '../../../components/ui/Card';

interface WordBankSectionProps {
  currentRole: UserRole;
  allSets: DailyVocabSet[];
  onToggleMastered: (setId: string, wordId: string) => void;
}

export const WordBankSection: React.FC<WordBankSectionProps> = ({
  currentRole,
  allSets,
  onToggleMastered
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'mastered' | 'unmastered'>('all');
  const { speak } = useSpeechPronunciation();

  // Gom tất cả các từ từ tất cả các bộ theo ngày
  const allWordEntries = useMemo(() => {
    const list: Array<{
      word: VocabWord;
      setId: string;
      setDate: string;
      setTitle: string;
      isMastered: boolean;
    }> = [];

    allSets.forEach((set) => {
      const progress = currentRole === 'husband' ? set.partner1Progress : set.partner2Progress;
      const completedIds = progress?.completedWordIds || [];

      (set.words || []).forEach((w) => {
        list.push({
          word: w,
          setId: set.id,
          setDate: set.date,
          setTitle: set.title,
          isMastered: completedIds.includes(w.id)
        });
      });
    });

    return list;
  }, [allSets, currentRole]);

  const filteredWords = useMemo(() => {
    return allWordEntries.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.word.word.toLowerCase().includes(q) ||
        item.word.meaning.toLowerCase().includes(q) ||
        (item.word.example && item.word.example.toLowerCase().includes(q));

      if (!matchQuery) return false;

      if (filterType === 'mastered') return item.isMastered;
      if (filterType === 'unmastered') return !item.isMastered;
      return true;
    });
  }, [allWordEntries, searchQuery, filterType]);

  const masteredCount = allWordEntries.filter((w) => w.isMastered).length;

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <Card variant="glass" className="p-4 sm:p-5 border border-white/80 shadow-glass-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-purple-500 text-white shadow-glow">
              <BookMarked className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">
                Kho Từ Vựng Của Chúng Mình 📚
              </h3>
              <p className="text-[11px] text-slate-400">
                Tổng cộng {allWordEntries.length} từ • Đã thuộc {masteredCount} từ
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo từ tiếng Anh hoặc nghĩa tiếng Việt..."
            className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-2xl border border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none bg-white/90"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`py-1 px-3 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-purple-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({allWordEntries.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('mastered')}
            className={`py-1 px-3 rounded-xl text-xs font-bold transition-all ${
              filterType === 'mastered'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Đã thuộc ({masteredCount})
          </button>

          <button
            type="button"
            onClick={() => setFilterType('unmastered')}
            className={`py-1 px-3 rounded-xl text-xs font-bold transition-all ${
              filterType === 'unmastered'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Cần ôn ({allWordEntries.length - masteredCount})
          </button>
        </div>
      </Card>

      {/* List of Words */}
      <div className="space-y-2.5">
        {filteredWords.length === 0 ? (
          <div className="text-center py-10 px-4 bg-white/60 rounded-3xl border border-slate-200 text-slate-400 text-xs">
            Không tìm thấy từ vựng nào phù hợp!
          </div>
        ) : (
          filteredWords.map((item) => (
            <motion.div
              key={`${item.setId}_${item.word.id}`}
              layout
              className={`p-3.5 rounded-3xl border transition-all ${
                item.isMastered
                  ? 'bg-white/90 border-emerald-100 shadow-xs'
                  : 'bg-white/80 border-slate-100 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                {/* Mastered toggle */}
                <button
                  type="button"
                  onClick={() => onToggleMastered(item.setId, item.word.id)}
                  className="mt-0.5 p-1 rounded-full text-slate-300 hover:text-emerald-500 transition-colors shrink-0"
                >
                  {item.isMastered ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300" />
                  )}
                </button>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="text-base font-black text-slate-800 tracking-tight">
                      {item.word.word}
                    </h5>

                    {item.word.phonetic && (
                      <span className="text-xs font-mono font-bold text-purple-600">
                        {item.word.phonetic}
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-extrabold uppercase">
                      {item.word.partOfSpeech || 'Từ vựng'}
                    </span>

                    <button
                      type="button"
                      onClick={() => speak(item.word.word)}
                      className="p-1 rounded-full text-purple-500 hover:bg-purple-50 transition-colors"
                      title="Nghe phát âm"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-slate-700">{item.word.meaning}</p>

                  {item.word.example && (
                    <p className="text-[11px] text-slate-400 italic">
                      "{item.word.example}"
                    </p>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 shrink-0 font-medium pt-1">
                  {item.setDate}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
