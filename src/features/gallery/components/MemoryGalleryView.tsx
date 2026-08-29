import React, { useState, useRef } from 'react';
import { MemoryPhoto, UserRole } from '../../../types/common.types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Lightbox } from '../../../components/ui/Lightbox';
import {
  Images,
  Plus,
  Search,
  MapPin,
  Calendar,
  Camera,
  Edit3,
  Trash2,
  Loader2,
  Link as LinkIcon,
  Navigation,
  Sparkles,
  Heart,
  UtensilsCrossed,
  ExternalLink,
} from 'lucide-react';
import { formatDateVi } from '../../../utils/dateUtils';
import { uploadImageToCloudinary } from '../../../services/cloudinaryService';
import { fetchCurrentGPSAddress } from '../../../services/gpsService';

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
  // 2 Mục chính: "Ảnh Chung Kỷ Niệm" vs "Điểm Hẹn Ăn Chơi"
  const [mainTab, setMainTab] = useState<'couple_photo' | 'places_dating'>('couple_photo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  // Lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);

  // Modal Thêm / Chỉnh Sửa Ảnh
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);

  // Form State
  const [photoUrl, setPhotoUrl] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [memoryType, setMemoryType] = useState<'couple_photo' | 'places_dating'>('couple_photo');

  // Refs for Camera and Gallery File Inputs
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Danh sách địa điểm duy nhất để lọc
  const uniqueLocations = Array.from(
    new Set(
      memories
        .filter((m) => (m.type || 'couple_photo') === mainTab)
        .map((m) => m.location)
        .filter(Boolean)
    )
  );

  // Lọc theo Mục chính, từ khóa tìm kiếm và địa điểm
  const filteredMemories = memories.filter((mem) => {
    const itemType = mem.type || 'couple_photo';
    if (itemType !== mainTab) return false;

    const matchesSearch =
      !searchQuery.trim() ||
      mem.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mem.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mem.tags && mem.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesLocation =
      selectedLocation === 'all' || mem.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  // 1. Chụp ảnh camera trực tiếp
  const handleSnapCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // 2. Chọn ảnh từ thư viện
  const handlePickGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  // 3. Xử lý khi ảnh được chụp/chọn
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setIsLocatingGPS(true);

    // Mở modal ngay với thông tin mặc định
    setEditingMemoryId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setLinkUrl('');
    setMemoryType(mainTab);
    setIsModalOpen(true);

    // Chạy song song: Upload ảnh lên Cloudinary & Lấy GPS location
    const [uploadedUrl, gpsResult] = await Promise.all([
      uploadImageToCloudinary(file),
      fetchCurrentGPSAddress(),
    ]);

    setIsUploading(false);
    setIsLocatingGPS(false);

    if (uploadedUrl) {
      setPhotoUrl(uploadedUrl);
    } else {
      // Fallback base64 nếu upload lỗi
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (gpsResult.address) {
      setLocation(gpsResult.address);
    }
  };

  // 4. Mở modal thêm thủ công / dán link
  const handleOpenManualAdd = () => {
    setEditingMemoryId(null);
    setPhotoUrl('');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('');
    setNote('');
    setLinkUrl('');
    setMemoryType(mainTab);
    setIsModalOpen(true);
  };

  // 5. Mở modal chỉnh sửa kỷ niệm
  const handleOpenEdit = (mem: MemoryPhoto) => {
    setEditingMemoryId(mem.id);
    setPhotoUrl(mem.photoUrl);
    setDate(mem.date);
    setLocation(mem.location || '');
    setNote(mem.note);
    setLinkUrl(mem.linkUrl || '');
    setMemoryType(mem.type || 'couple_photo');
    setIsModalOpen(true);
  };

  // 6. Lưu kỷ niệm
  const handleSaveMemory = () => {
    if (!photoUrl.trim() || !note.trim()) return;

    if (editingMemoryId) {
      onUpdateMemory(editingMemoryId, {
        photoUrl: photoUrl.trim(),
        date,
        location: location.trim() || 'Không rõ địa điểm',
        note: note.trim(),
        linkUrl: linkUrl.trim() || undefined,
        type: memoryType,
      });
    } else {
      onAddMemory({
        photoUrl: photoUrl.trim(),
        date,
        location: location.trim() || 'Địa điểm ngọt ngào',
        note: note.trim(),
        linkUrl: linkUrl.trim() || undefined,
        type: memoryType,
        tags: [memoryType === 'couple_photo' ? 'Ảnh Đôi' : 'Điểm Hẹn'],
      });
    }

    setIsModalOpen(false);
  };

  // 7. Lấy lại GPS khi đang mở modal
  const handleRefreshGPS = async () => {
    setIsLocatingGPS(true);
    const res = await fetchCurrentGPSAddress();
    setIsLocatingGPS(false);
    if (res.address) {
      setLocation(res.address);
    } else {
      alert('Không thể lấy vị trí GPS. Vui lòng bật định vị trên thiết bị hoặc gõ tay địa chỉ nhé!');
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-fade-in">
      {/* Hidden File Inputs for Camera & Gallery */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* 1. Header & Quick Camera Snap Action */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white/80 backdrop-blur-md border border-rose-200/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-glow">
            <Images className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
              Kho Kỷ Niệm & Điểm Hẹn
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Chụp ảnh tức thì, tự động lưu địa chỉ GPS & link kỷ niệm 💕
            </p>
          </div>
        </div>

        {/* Nút Chụp Ảnh Liền 1-Chạm & Chọn Ảnh */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="romantic"
            size="md"
            onClick={handleSnapCamera}
            className="flex-1 sm:flex-initial shadow-glow"
          >
            <Camera className="w-4 h-4 mr-1.5 animate-pulse" />
            <span>Chụp Ảnh Ngay 📸</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handlePickGallery}
            className="px-3"
            title="Chọn ảnh từ thư viện"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 2. TAB CHUYỂN ĐỔI: "ẢNH CHUNG KỶ NIỆM" VS "ĐỊA ĐIỂM ĂN CHƠI" */}
      <div className="flex items-center p-1.5 bg-rose-50/90 rounded-2xl border border-rose-100 shadow-sm">
        <button
          onClick={() => {
            setMainTab('couple_photo');
            setSelectedLocation('all');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            mainTab === 'couple_photo'
              ? 'bg-rose-500 text-white shadow-md scale-101'
              : 'text-slate-600 hover:text-rose-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${mainTab === 'couple_photo' ? 'fill-white' : 'text-rose-500'}`} />
          <span>Ảnh Kỷ Niệm Đôi 💕</span>
        </button>

        <button
          onClick={() => {
            setMainTab('places_dating');
            setSelectedLocation('all');
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            mainTab === 'places_dating'
              ? 'bg-rose-500 text-white shadow-md scale-101'
              : 'text-slate-600 hover:text-rose-600'
          }`}
        >
          <UtensilsCrossed className={`w-4 h-4 ${mainTab === 'places_dating' ? 'text-white' : 'text-amber-500'}`} />
          <span>Điểm Hẹn & Ăn Chơi 🌴</span>
        </button>
      </div>

      {/* 3. Thanh Tìm Kiếm & Lọc Địa Điểm */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              mainTab === 'couple_photo'
                ? 'Tìm kiếm câu chuyện kỷ niệm, ngày tháng...'
                : 'Tìm kiếm quán ăn, địa điểm check-in...'
            }
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/90 border border-rose-100 text-xs font-semibold text-slate-800 focus:outline-none focus:border-rose-400 shadow-sm"
          />
        </div>

        {/* Lọc theo Địa điểm */}
        {uniqueLocations.length > 0 && (
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2.5 rounded-2xl bg-white/90 border border-rose-100 text-xs font-bold text-slate-700 focus:outline-none focus:border-rose-400 shadow-sm shrink-0"
          >
            <option value="all">📍 Tất cả địa điểm</option>
            {uniqueLocations.map((loc, idx) => (
              <option key={idx} value={loc}>
                📍 {loc}
              </option>
            ))}
          </select>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenManualAdd}
          className="shrink-0 text-xs font-bold"
        >
          <LinkIcon className="w-3.5 h-3.5 mr-1 text-rose-500" />
          <span>Dán Link Ảnh</span>
        </Button>
      </div>

      {/* 4. Grid Danh Sách Ảnh Kỷ Niệm */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/60 border border-dashed border-rose-200">
          <div className="inline-flex p-3 rounded-full bg-rose-100 text-rose-500 mb-2">
            {mainTab === 'couple_photo' ? <Heart className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
          </div>
          <p className="text-sm font-bold text-slate-700">
            {mainTab === 'couple_photo'
              ? 'Chưa có tấm ảnh kỷ niệm đôi nào!'
              : 'Chưa có địa điểm ăn chơi check-in nào!'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Bấm <strong>"Chụp Ảnh Ngay 📸"</strong> để bắt đầu lưu giữ khoảnh khắc nhé!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredMemories.map((mem) => (
            <Card
              key={mem.id}
              variant="polaroid"
              className="p-3.5 pb-2.5 overflow-hidden group flex flex-col justify-between relative rounded-3xl"
            >
              {/* Cute Washi Tape Sticker at Top Center */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-pink-200/70 backdrop-blur-sm rounded-sm shadow-sm rotate-1 z-10 pointer-events-none" />

              <div>
                {/* Photo Image with Click to Lightbox */}
                <div
                  onClick={() => setSelectedPhoto(mem)}
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer bg-slate-100 shadow-inner group/img border border-black/5"
                >
                  <img
                    src={mem.photoUrl}
                    alt={mem.note}
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-[11px] font-bold text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-rose-300" />
                      <span>Xem ảnh phóng to</span>
                    </span>
                  </div>

                  {/* Badge Date */}
                  <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                    <Calendar className="w-3 h-3 text-rose-300" />
                    <span>{formatDateVi(mem.date)}</span>
                  </span>
                </div>

                {/* Info & Story Note */}
                <div className="mt-3 space-y-1.5 px-0.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-rose-600 font-black truncate" title={mem.location}>
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{mem.location || 'Địa điểm ngọt ngào'}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 leading-relaxed">
                    {mem.note}
                  </p>

                  {/* Link Url if present */}
                  {mem.linkUrl && (
                    <a
                      href={mem.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Mở link địa điểm / bài viết</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons: Sửa & Xóa */}
              <div className="flex items-center justify-end gap-1 pt-2.5 mt-2 border-t border-rose-50">
                <button
                  onClick={() => handleOpenEdit(mem)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => onDeleteMemory(mem.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL THÊM / SỬA KỶ NIỆM (VỚI CAMERA, GPS, DÁN LINK) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMemoryId ? 'Chỉnh Sửa Kỷ Niệm ✏️' : 'Lưu Khoảnh Khắc Kỷ Niệm 💕'}
      >
        <div className="space-y-4 py-1">
          {/* Mục phân loại */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Phân loại kỷ niệm:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMemoryType('couple_photo')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  memoryType === 'couple_photo'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Ảnh Đôi 💕</span>
              </button>

              <button
                type="button"
                onClick={() => setMemoryType('places_dating')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  memoryType === 'places_dating'
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Ăn Chơi / Check-in 🌴</span>
              </button>
            </div>
          </div>

          {/* Photo Preview or Link Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hình ảnh:</label>
            {isUploading ? (
              <div className="h-36 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center gap-2 text-rose-600">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-bold">Đang tải ảnh lên đám mây...</span>
              </div>
            ) : photoUrl ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-rose-200 bg-slate-100 shadow-sm">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                  title="Xóa ảnh để chọn lại"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="romantic"
                    fullWidth
                    size="sm"
                    onClick={handleSnapCamera}
                  >
                    <Camera className="w-4 h-4 mr-1.5" />
                    Chụp Ảnh
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    size="sm"
                    onClick={handlePickGallery}
                  >
                    <Images className="w-4 h-4 mr-1.5" />
                    Thư Viện
                  </Button>
                </div>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Hoặc dán đường link ảnh trực tiếp (https://...)"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Ngày chụp / Ngày kỷ niệm */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ngày kỷ niệm:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Địa chỉ GPS tự động */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Địa điểm (Tự động định vị GPS):</span>
              </label>
              <button
                type="button"
                onClick={handleRefreshGPS}
                disabled={isLocatingGPS}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                {isLocatingGPS ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                <span>{isLocatingGPS ? 'Đang định vị...' : 'Lấy GPS lại'}</span>
              </button>
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Tiệm Cà Phê Mùa Thu, Quận 1, TP.HCM..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Câu chuyện / Ghi chú */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Câu chuyện / Cảm xúc lúc đó:</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi lại những lời yêu thương, kỷ niệm đáng nhớ của hai đứa..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          {/* Link liên quan (Google Maps, TikTok, Facebook) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              <span>Link liên quan (Google Maps / Link quán - Không bắt buộc):</span>
            </label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://maps.google.com/..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-slate-100 sticky bottom-0 bg-white/95 backdrop-blur-md -mx-4 -mb-4 p-4 sm:-mx-5 sm:-mb-5 sm:p-5">
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="romantic"
              fullWidth
              onClick={handleSaveMemory}
              disabled={!photoUrl || !note.trim() || isUploading}
            >
              {editingMemoryId ? 'Lưu Thay Đổi' : 'Lưu Kỷ Niệm 💕'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lightbox Preview */}
      <Lightbox
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        imageUrl={selectedPhoto?.photoUrl || null}
        caption={selectedPhoto?.note}
        date={selectedPhoto?.date}
        location={selectedPhoto?.location}
      />
    </div>
  );
};
