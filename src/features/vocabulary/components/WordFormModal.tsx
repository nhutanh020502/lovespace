import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Sparkles, FileText, Check, AlertCircle } from 'lucide-react';
import { VocabWord, WordPartOfSpeech } from '../../../types/vocab.types';
import { generateUUID } from '../../../utils/uuidUtils';

interface WordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingWord?: VocabWord | null;
  onSaveWord: (word: VocabWord) => void;
  onBulkImportWords: (words: VocabWord[]) => void;
}

export const WordFormModal: React.FC<WordFormModalProps> = ({
  isOpen,
  onClose,
  editingWord,
  onSaveWord,
  onBulkImportWords
}) => {
  const [activeMode, setActiveMode] = useState<'single' | 'bulk'>('single');

  // Single word form state
  const [word, setWord] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState<WordPartOfSpeech>('noun');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [exampleMeaning, setExampleMeaning] = useState('');
  const [memoryTip, setMemoryTip] = useState('');

  // Bulk import state
  const [bulkText, setBulkText] = useState('');
  const [parsedWords, setParsedWords] = useState<VocabWord[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (editingWord) {
        setActiveMode('single');
        setWord(editingWord.word || '');
        setPhonetic(editingWord.phonetic || '');
        setPartOfSpeech((editingWord.partOfSpeech as WordPartOfSpeech) || 'noun');
        setMeaning(editingWord.meaning || '');
        setExample(editingWord.example || '');
        setExampleMeaning(editingWord.exampleMeaning || '');
        setMemoryTip(editingWord.memoryTip || '');
      } else {
        setWord('');
        setPhonetic('');
        setPartOfSpeech('noun');
        setMeaning('');
        setExample('');
        setExampleMeaning('');
        setMemoryTip('');
        setBulkText('');
        setParsedWords([]);
      }
    }
  }, [isOpen, editingWord]);

  // Phân tích văn bản nhập nhanh dạng: word : meaning : example
  useEffect(() => {
    if (!bulkText.trim()) {
      setParsedWords([]);
      return;
    }

    const lines = bulkText.split('\n').filter((l) => l.trim().length > 0);
    const parsed: VocabWord[] = [];

    lines.forEach((line) => {
      // Phân tách bởi dấu : hoặc - hoặc |
      const parts = line.split(/[:|\-–—]/).map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        parsed.push({
          id: generateUUID(),
          word: parts[0],
          meaning: parts[1],
          example: parts[2] || '',
          exampleMeaning: parts[3] || '',
          partOfSpeech: 'phrase',
          createdAt: new Date().toISOString()
        });
      }
    });

    setParsedWords(parsed);
  }, [bulkText]);

  if (!isOpen) return null;

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;

    const saved: VocabWord = {
      id: editingWord?.id || generateUUID(),
      word: word.trim(),
      phonetic: phonetic.trim() || undefined,
      partOfSpeech,
      meaning: meaning.trim(),
      example: example.trim() || undefined,
      exampleMeaning: exampleMeaning.trim() || undefined,
      memoryTip: memoryTip.trim() || undefined,
      masteredBy: editingWord?.masteredBy || [],
      createdAt: editingWord?.createdAt || new Date().toISOString()
    };

    onSaveWord(saved);
    onClose();
  };

  const handleBulkSubmit = () => {
    if (parsedWords.length === 0) return;
    onBulkImportWords(parsedWords);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 p-5 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-rose-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-rose-500 text-white shadow-glow">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">
                  {editingWord ? 'Sửa Từ Vựng' : 'Thêm Từ Vựng Vào Bài Học'}
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold">
                  Tự tạo từ vựng yêu thích hoặc dán nhanh 10 từ cùng lúc
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-rose-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs (chỉ hiện khi thêm mới) */}
          {!editingWord && (
            <div className="flex p-1 bg-rose-50 rounded-2xl border border-rose-100 mt-3">
              <button
                type="button"
                onClick={() => setActiveMode('single')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'single'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                ✏️ Thêm từng từ
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('bulk')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeMode === 'bulk'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                ⚡ Nhập nhanh 10 từ (Bulk Paste)
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-1">
            {activeMode === 'single' ? (
              <form id="single-word-form" onSubmit={handleSingleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Từ tiếng Anh <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. cherish"
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Phiên âm IPA
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. /ˈtʃer.ɪʃ/"
                      value={phonetic}
                      onChange={(e) => setPhonetic(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Loại từ
                    </label>
                    <select
                      value={partOfSpeech}
                      onChange={(e) => setPartOfSpeech(e.target.value as WordPartOfSpeech)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 outline-none bg-white font-medium"
                    >
                      <option value="noun">Danh từ (noun)</option>
                      <option value="verb">Động từ (verb)</option>
                      <option value="adjective">Tính từ (adjective)</option>
                      <option value="adverb">Trạng từ (adverb)</option>
                      <option value="phrase">Cụm từ (phrase)</option>
                      <option value="idiom">Thành ngữ (idiom)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nghĩa tiếng Việt <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. yêu thương, trân trọng"
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Câu ví dụ tiếng Anh
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. I cherish every moment with you."
                    value={example}
                    onChange={(e) => setExample(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nghĩa câu ví dụ
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Anh trân trọng từng khoảnh khắc bên em."
                    value={exampleMeaning}
                    onChange={(e) => setExampleMeaning(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Mẹo nhớ hoặc ghi chú tình cảm
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nhớ đến nụ cười của em là nhớ từ này"
                    value={memoryTip}
                    onChange={(e) => setMemoryTip(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-800 space-y-1">
                  <p className="font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Định dạng nhập nhanh mỗi dòng:
                  </p>
                  <p className="font-mono text-[11px] bg-white/80 p-1.5 rounded-lg border border-amber-200">
                    Từ tiếng Anh : Nghĩa tiếng Việt : Câu ví dụ
                  </p>
                  <p className="text-[10px] text-amber-600">
                    Bạn có thể copy paste 10 dòng từ ghi chú hoặc ChatGPT vào đây, hệ thống sẽ tự phân tách thành 10 thẻ!
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Dán danh sách từ vựng vào đây:
                  </label>
                  <textarea
                    rows={6}
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`cherish : yêu thương, trân trọng : I cherish you\nserendipity : sự may mắn kỳ diệu : Meeting you was serendipity\nsoulmate : tri kỷ suốt đời : You are my soulmate\nadore : mê đắm, yêu tha thiết : I adore your smile`}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Preview kết quả đã parse */}
                {parsedWords.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã nhận diện thành công {parsedWords.length} từ:
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      {parsedWords.map((pw, i) => (
                        <div key={i} className="text-[11px] flex items-center justify-between text-slate-700">
                          <span className="font-bold text-rose-600">{pw.word}</span>
                          <span className="text-slate-500 truncate max-w-[200px]">{pw.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-rose-100 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors"
            >
              Hủy
            </button>

            {activeMode === 'single' ? (
              <button
                type="submit"
                form="single-word-form"
                className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-glow hover:opacity-95 transition-all"
              >
                {editingWord ? 'Lưu Thay Đổi ✨' : 'Thêm Từ Vựng ✨'}
              </button>
            ) : (
              <button
                type="button"
                disabled={parsedWords.length === 0}
                onClick={handleBulkSubmit}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nhập {parsedWords.length} Từ Này ✨
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
