import React, { useState, useRef } from 'react';
import { MemoryPhoto, UserRole } from '../../../types/common.types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Lightbox } from '../../../components/ui/Lightbox';
import { Images, Plus, Search, MapPin, Calendar, Camera, Edit3, Trash2, Loader2 } from 'lucide-react';
import { formatDateVi } from '../../../utils/dateUtils';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';

interface MemoryGalleryViewProps {
  currentRole: UserRole;
  memories: MemoryPhoto[];
  onAddMemory: (memory: Omit<MemoryPhoto, 'id' | 'createdAt' | 'uploadedBy'>) => void;
  onUpdateMemory: (memoryId: string, updated: Partial<MemoryPhoto>) => void;
  onDeleteMemory: (memoryId: string) => void;
}

export const MemoryGalleryView: React.FC<MemoryGalleryViewProps> = ({
  currentRole,
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);

  // Modal Thêm / Chỉnh Sửa Ảnh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Danh sách địa điểm duy nhất để lọc
  const uniqueLocations = Array.from(new Set(memories.map((m) => m.location).filter(Boolean)));

  // Lọc theo từ khóa ghi chú và địa điểm
  const filteredMemories = memories.filter((mem) => {
    const matchesSearch =
      !searchQuery.trim() ||
      mem.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLocation =
      selectedLocation === 'all' || mem.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  const handleOpenAdd = () => {
    setEditingMemoryId(null);
    setPhotoUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setNote('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mem: MemoryPhoto) => {
    setEditingMemoryId(mem.id);
    setPhotoUrl(mem.photoUrl);
    setDate(mem.date);
    setLocation(mem.location || '');
    setNote(mem.note);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await uploadImageToCloudinary(file);
        setPhotoUrl(url);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = () => {
    if (!photoUrl || !note.trim()) return;

    if (editingMemoryId) {
      onUpdateMemory(editingMemoryId, {
        photoUrl,
        date,
        location: location.trim() || 'Kỷ niệm yêu thương',
        note: note.trim(),
      });
    } else {
      onAddMemory({
        photoUrl,
        date,
        location: location.trim() || 'Kỷ niệm yêu thương',
        note: note.trim(),
        tags: [],
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Images className="w-6 h-6 text-rose-500" />
            <span>Kho Ảnh & Kỷ Niệm Yêu Thương</span>
          </h2>
          <p className="text-xs text-slate-500">Lưu giữ từng khoảnh khắc, địa điểm & câu chuyện ngọt ngào</p>
        </div>

        <Button size="sm" variant="romantic" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Thêm Ảnh
        </Button>
      </div>

      {/* Thanh Tìm Kiếm Thông Minh */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm theo ghi chú, cảm xúc, địa điểm (ví dụ: Đà Lạt, Noel, mưa...)"
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-rose-200/80 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 shadow-sm"
        />
      </div>

      {/* Lọc nhanh theo Địa Điểm */}
      {uniqueLocations.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedLocation('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedLocation === 'all'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-600 border border-rose-100 hover:bg-rose-50'
            }`}
          >
            Tất cả địa điểm 🗺️
          </button>
          {uniqueLocations.map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 flex items-center gap-1 transition-all ${
                selectedLocation === loc
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white/80 text-slate-600 border border-rose-100 hover:bg-rose-50'
              }`}
            >
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{loc}</span>
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-rose-200">
          <Camera className="w-10 h-10 text-rose-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Chưa có bức ảnh nào phù hợp.</p>
          <Button size="sm" variant="romantic" onClick={handleOpenAdd} className="mt-3">
            <Plus className="w-4 h-4 mr-1" />
            Tải Ảnh Đầu Tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredMemories.map((mem) => (
            <Card
              key={mem.id}
              variant="glass"
              className="p-3 border border-white/80 shadow-glass-card group hover:border-rose-300 transition-all flex flex-col justify-between"
            >
              {/* Photo Box */}
              <div>
                <div
                  onClick={() => setSelectedPhoto(mem)}
                  className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-100 cursor-pointer mb-2.5"
                >
                  <img
                    src={mem.photoUrl}
                    alt={mem.note}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  {/* Date Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDateVi(mem.date)}</span>
                  </div>
                </div>

                {/* Location */}
                {mem.location && (
                  <p className="text-xs font-bold text-rose-600 flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{mem.location}</span>
                  </p>
                )}

                {/* Caption / Story */}
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-2 font-medium">
                  "{mem.note}"
                </p>
              </div>

              {/* Action Buttons (Edit & Delete) */}
              <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleOpenEdit(mem)}
                  title="Chỉnh sửa kỷ niệm này"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>

                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  title="Xóa ảnh kỷ niệm"
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Lightbox Phóng to ảnh */}
      <Lightbox
        isOpen={Boolean(selectedPhoto)}
        imageUrl={selectedPhoto?.photoUrl || null}
        caption={selectedPhoto?.note}
        date={selectedPhoto?.date}
        location={selectedPhoto?.location}
        onClose={() => setSelectedPhoto(null)}
      />

      {/* Modal Thêm / Chỉnh Sửa Kỷ Niệm */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMemoryId ? '✏️ Chỉnh Sửa Kỷ Niệm' : '📸 Lưu Giữ Kỷ Niệm Mới'}
      >
        <div className="space-y-3.5">
          {/* Chọn ảnh */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">1. Tải ảnh lên hoặc chụp thật:</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            {isUploading ? (
              <div className="w-full py-8 border-2 border-dashed border-rose-300 rounded-2xl flex flex-col items-center justify-center bg-rose-50/50">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
                <span className="text-xs font-bold text-rose-600">Đang tải ảnh lên Cloudinary... ✨</span>
              </div>
            ) : photoUrl ? (
              <div className="relative rounded-2xl overflow-hidden h-44 border border-rose-200">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white rounded-full text-xs font-bold hover:bg-black"
                >
                  Đổi ảnh khác
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-rose-300 rounded-2xl flex flex-col items-center justify-center bg-rose-50/50 hover:bg-rose-50 transition-colors"
              >
                <Camera className="w-8 h-8 text-rose-400 mb-1" />
                <span className="text-xs font-bold text-rose-600">Bấm để chọn ảnh từ điện thoại</span>
              </button>
            )}
          </div>

          {/* Ngày chụp */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">2. Ngày kỷ niệm:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Địa điểm */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">3. Địa điểm:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Đà Lạt, Phố đi bộ Hà Nội, Quán MayCha..."
            />
          </div>

          {/* Ghi chú / Cảm xúc */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">4. Ghi chú câu chuyện / Cảm xúc lúc đó:</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Kể lại khoảnh khắc đáng nhớ lúc chụp ảnh này..."
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="romantic" fullWidth onClick={handleSave} disabled={!photoUrl || !note.trim()}>
              {editingMemoryId ? 'Lưu Thay Đổi' : 'Lưu Kỷ Niệm'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
