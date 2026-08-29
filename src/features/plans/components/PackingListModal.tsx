import React, { useState } from 'react';
import { PackingItem } from '../../../types/plan.types';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { CheckSquare, Square, Plus, Trash2, Luggage } from 'lucide-react';

interface PackingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  packingList: PackingItem[];
  onUpdatePackingList: (newList: PackingItem[]) => void;
  readOnly?: boolean;
}

const DEFAULT_PACKING_SUGGESTIONS = [
  'Áo khoác đôi',
  'Váy sống ảo',
  'Sạc dự phòng & Dây sạc',
  'Kem chống nắng & Mỹ phẩm',
  'Thuốc say xe & Panadol',
  'Ô che mưa / Dù đôi',
  'Máy ảnh / Tripod',
  'Kính râm thời trang',
];

export const PackingListModal: React.FC<PackingListModalProps> = ({
  isOpen,
  onClose,
  packingList,
  onUpdatePackingList,
  readOnly = false,
}) => {
  const [newItemName, setNewItemName] = useState('');
  const [assignedTo, setAssignedTo] = useState<'husband' | 'wife' | 'both'>('both');

  const handleAddItem = () => {
    if (!newItemName.trim()) return;
    const newItem: PackingItem = {
      id: `pack_${Date.now()}`,
      name: newItemName.trim(),
      assignedTo,
      isPacked: false,
    };
    onUpdatePackingList([...packingList, newItem]);
    setNewItemName('');
  };

  const handleAddSuggestion = (name: string) => {
    if (packingList.some((p) => p.name === name)) return;
    const newItem: PackingItem = {
      id: `pack_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name,
      assignedTo: 'both',
      isPacked: false,
    };
    onUpdatePackingList([...packingList, newItem]);
  };

  const handleTogglePacked = (id: string) => {
    onUpdatePackingList(
      packingList.map((item) => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    onUpdatePackingList(packingList.filter((item) => item.id !== id));
  };

  const packedCount = packingList.filter((p) => p.isPacked).length;
  const progressPercent = packingList.length > 0 ? Math.round((packedCount / packingList.length) * 100) : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎒 Danh Sách Đồ Chuẩn Bị Mang Theo">
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Luggage className="w-4 h-4 text-rose-500" />
              <span>Tiến độ xếp đồ vào vali</span>
            </span>
            <span className="text-rose-600">
              {packedCount}/{packingList.length} món ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Input Thêm Món Đồ */}
        {!readOnly && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                placeholder="Nhập món đồ cần mang..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
              />
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="both">Cả hai 💕</option>
                <option value="husband">Chồng 🐻</option>
                <option value="wife">Vợ 🐰</option>
              </select>
              <Button variant="romantic" size="sm" onClick={handleAddItem} disabled={!newItemName.trim()}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1 items-center pt-1">
              <span className="text-[10px] font-bold text-slate-400">Gợi ý nhanh:</span>
              {DEFAULT_PACKING_SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddSuggestion(sug)}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Danh Sách Đồ */}
        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {packingList.length > 0 ? (
            packingList.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all ${
                  item.isPacked
                    ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 hover:border-rose-300 text-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleTogglePacked(item.id)}
                  className="flex items-center gap-2 min-w-0 flex-1 text-left"
                >
                  {item.isPacked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0 hover:text-rose-500" />
                  )}
                  <span className={`text-xs font-bold truncate ${item.isPacked ? 'line-through' : ''}`}>
                    {item.name}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-500 shrink-0">
                    {item.assignedTo === 'husband' ? '🐻 Chồng' : item.assignedTo === 'wife' ? '🐰 Vợ' : '💕 Cả hai'}
                  </span>
                </button>

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    title="Xóa món này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              Chưa có danh sách đồ mang theo. Thêm các món đồ cần chuẩn bị để không bị quên nhé! 🎒
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="romantic" size="sm" onClick={onClose}>
            Xong
          </Button>
        </div>
      </div>
    </Modal>
  );
};
