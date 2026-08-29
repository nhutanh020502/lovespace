import React, { useState } from 'react';
import { TodoItem, UserRole } from '../../../types/common.types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { CheckSquare, Square, Plus, Sparkles, CheckCircle2, User, Calendar, Edit3, Trash2 } from 'lucide-react';
import { formatDateVi } from '../../../utils/dateUtils';
import { triggerCelebration } from '../../../components/ui/ConfettiEffect';

interface TodoSectionProps {
  currentRole: UserRole;
  todos: TodoItem[];
  onToggleTodo: (todoId: string) => void;
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'isCompleted'>) => void;
  onUpdateTodo: (todoId: string, updated: Partial<TodoItem>) => void;
  onDeleteTodo: (todoId: string) => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  currentRole,
  todos,
  onToggleTodo,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  // Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TodoItem['category']>('daily');
  const [assignedTo, setAssignedTo] = useState<TodoItem['assignedTo']>('both');
  const [dueDate, setDueDate] = useState('');

  const handleOpenAdd = () => {
    setEditingTodoId(null);
    setTitle('');
    setCategory('daily');
    setAssignedTo('both');
    setDueDate('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo: TodoItem) => {
    setEditingTodoId(todo.id);
    setTitle(todo.title);
    setCategory(todo.category);
    setAssignedTo(todo.assignedTo);
    setDueDate(todo.dueDate || '');
    setIsModalOpen(true);
  };

  const handleToggle = (id: string, isCurrentlyCompleted: boolean) => {
    onToggleTodo(id);
    if (!isCurrentlyCompleted) {
      triggerCelebration();
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    if (editingTodoId) {
      onUpdateTodo(editingTodoId, {
        title: title.trim(),
        category,
        assignedTo,
        dueDate: dueDate || undefined,
      });
    } else {
      onAddTodo({
        title: title.trim(),
        category,
        assignedTo,
        dueDate: dueDate || undefined,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <Card variant="glass" className="p-4 sm:p-5 border border-white/80 shadow-glass-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-emerald-500 text-white">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Việc Cần Làm Cùng Nhau</h3>
            <p className="text-[11px] text-slate-400">
              Đã xong {todos.filter((t) => t.isCompleted).length}/{todos.length} việc
            </p>
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={handleOpenAdd}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Thêm Việc
        </Button>
      </div>

      {/* Todo list items */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">Chưa có việc nào cần làm.</p>
        ) : (
          todos.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start gap-3 p-3 rounded-2xl border transition-all ${
                item.isCompleted
                  ? 'bg-slate-50/70 border-slate-200/50 opacity-60'
                  : 'bg-white border-slate-100 shadow-sm hover:border-rose-200'
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(item.id, item.isCompleted)}
                className={`mt-0.5 p-1 rounded-lg transition-colors ${
                  item.isCompleted ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-600'
                }`}
              >
                {item.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 cursor-pointer" onClick={() => handleOpenEdit(item)}>
                <p
                  className={`text-xs sm:text-sm font-bold text-slate-800 ${
                    item.isCompleted ? 'line-through text-slate-400' : ''
                  }`}
                >
                  {item.title}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    <User className="w-3 h-3" />
                    {item.assignedTo === 'both' ? 'Cả hai' : item.assignedTo === 'husband' ? 'Chồng làm' : 'Vợ làm'}
                  </span>

                  {item.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Hạn: {formatDateVi(item.dueDate)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons (Edit & Delete) */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(item)}
                  title="Chỉnh sửa việc này"
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTodo(item.id)}
                  title="Xóa việc"
                  className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Thêm / Chỉnh Sửa Việc */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTodoId ? '✏️ Chỉnh Sửa Việc Cần Làm' : '📝 Thêm Việc Cần Làm'}
      >
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên công việc:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Đặt vé xem phim tối thứ 7..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phân loại:</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'daily', label: 'Hàng ngày' },
                { id: 'weekend', label: 'Cuối tuần' },
                { id: 'future', label: 'Kế hoạch tương lai' },
                { id: 'travel', label: 'Đi chơi / Du lịch' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    category === c.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phân công ai làm:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'both', label: 'Cả hai 🐻🐰' },
                { id: 'husband', label: 'Chồng 🐻' },
                { id: 'wife', label: 'Vợ 🐰' },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAssignedTo(a.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    assignedTo === a.id
                      ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hạn hoàn thành (tùy chọn):</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="romantic" fullWidth onClick={handleSave}>
              {editingTodoId ? 'Cập Nhật Việc' : 'Thêm Vào Danh Sách'}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};
