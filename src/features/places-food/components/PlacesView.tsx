import React, { useState } from 'react';
import { PlaceFoodItem, UserRole } from '../../../types/common.types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { UtensilsCrossed, Plus, MapPin, ExternalLink, Compass, CheckCircle2, RotateCw, Edit3, Trash2 } from 'lucide-react';
import { triggerLoveConfetti } from '../../../components/ui/ConfettiEffect';

interface PlacesViewProps {
  currentRole: UserRole;
  places: PlaceFoodItem[];
  onAddPlace: (place: Omit<PlaceFoodItem, 'id' | 'createdAt' | 'addedBy'>) => void;
  onUpdatePlace: (placeId: string, updated: Partial<PlaceFoodItem>) => void;
  onToggleVisited: (placeId: string) => void;
  onDeletePlace: (placeId: string) => void;
}

export const PlacesView: React.FC<PlacesViewProps> = ({
  currentRole,
  places,
  onAddPlace,
  onUpdatePlace,
  onToggleVisited,
  onDeletePlace,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unvisited' | 'visited'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal Thêm / Sửa Quán
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<PlaceFoodItem['category']>('restaurant');
  const [address, setAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [mustTryDishes, setMustTryDishes] = useState('');
  const [notes, setNotes] = useState('');

  // Vòng Quay May Mắn "Hôm Nay Ăn Gì"
  const [isWheelModalOpen, setIsWheelModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<PlaceFoodItem | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả 🌟' },
    { id: 'restaurant', label: 'Quán Ăn 🍲' },
    { id: 'cafe', label: 'Cà Phê / Trà Sữa ☕' },
    { id: 'street_food', label: 'Ăn Vặt 🍢' },
    { id: 'travel', label: 'Du Lịch 🌴' },
  ];

  const filteredPlaces = places.filter((p) => {
    if (filterTab === 'unvisited' && p.isVisited) return false;
    if (filterTab === 'visited' && !p.isVisited) return false;
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setEditingPlaceId(null);
    setName('');
    setCategory('restaurant');
    setAddress('');
    setGoogleMapsUrl('');
    setEstimatedPrice('');
    setMustTryDishes('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (place: PlaceFoodItem) => {
    setEditingPlaceId(place.id);
    setName(place.name);
    setCategory(place.category);
    setAddress(place.address || '');
    setGoogleMapsUrl(place.googleMapsUrl || '');
    setEstimatedPrice(place.estimatedPrice || '');
    setMustTryDishes(place.mustTryDishes || '');
    setNotes(place.notes || '');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingPlaceId) {
      onUpdatePlace(editingPlaceId, {
        name: name.trim(),
        category,
        address: address.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        estimatedPrice: estimatedPrice.trim(),
        mustTryDishes: mustTryDishes.trim(),
        notes: notes.trim(),
      });
    } else {
      onAddPlace({
        name: name.trim(),
        category,
        address: address.trim(),
        googleMapsUrl: googleMapsUrl.trim(),
        estimatedPrice: estimatedPrice.trim(),
        mustTryDishes: mustTryDishes.trim(),
        notes: notes.trim(),
        rating: 5,
        isVisited: false,
      });
    }

    setIsModalOpen(false);
  };

  // Logic Quay Thưởng Chọn Quán Ngẫu Nhiên
  const handleSpinWheel = () => {
    const candidates = places.filter((p) => !p.isVisited);
    const pool = candidates.length > 0 ? candidates : places;
    if (pool.length === 0) return;

    setIsSpinning(true);
    setSelectedWinner(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomPlace = pool[Math.floor(Math.random() * pool.length)];
      setSelectedWinner(randomPlace);
      counter++;
      if (counter > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        triggerLoveConfetti();
      }
    }, 100);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header & Random Wheel Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-rose-500" />
            <span>Điểm Đến & Quán Ăn Ngon</span>
          </h2>
          <p className="text-xs text-slate-500">Wishlist quán ruột & địa điểm muốn cùng đi</p>
        </div>

        <Button
          size="sm"
          variant="romantic"
          onClick={() => {
            setIsWheelModalOpen(true);
            handleSpinWheel();
          }}
          className="shadow-glow"
        >
          <Compass className="w-4 h-4 mr-1 animate-spin-slow" />
          Hôm Nay Ăn Gì?
        </Button>
      </div>

      {/* Filter Tabs (Chưa đi vs Đã trải nghiệm) */}
      <div className="flex items-center justify-between bg-white/70 p-1 rounded-2xl border border-rose-100 shadow-sm">
        <div className="flex gap-1">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'all' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Tất cả ({places.length})
          </button>
          <button
            onClick={() => setFilterTab('unvisited')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'unvisited' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Chưa đi 📍
          </button>
          <button
            onClick={() => setFilterTab('visited')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterTab === 'visited' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600'
            }`}
          >
            Đã check-in ✨
          </button>
        </div>

        <Button size="sm" variant="outline" onClick={handleOpenAdd}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Thêm Quán
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === c.id
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 text-slate-600 border border-rose-100 hover:bg-rose-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Place List Cards */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-rose-200">
          <UtensilsCrossed className="w-10 h-10 text-rose-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-500">Chưa có địa điểm nào trong mục này.</p>
          <Button size="sm" variant="romantic" onClick={handleOpenAdd} className="mt-3">
            <Plus className="w-4 h-4 mr-1" />
            Thêm Ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              variant="glass"
              className="p-4 border border-white/80 shadow-glass-card flex flex-col justify-between hover:border-rose-300 transition-all"
            >
              <div>
                {/* Title & Visited Status */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3
                    onClick={() => handleOpenEdit(place)}
                    className="font-bold text-sm text-slate-800 leading-snug cursor-pointer hover:text-rose-600 transition-colors"
                  >
                    {place.name}
                  </h3>
                  <button
                    onClick={() => onToggleVisited(place.id)}
                    className={`shrink-0 p-1.5 rounded-full text-xs transition-colors ${
                      place.isVisited
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-400 hover:text-emerald-600'
                    }`}
                    title={place.isVisited ? 'Đã check-in' : 'Đánh dấu đã đi'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Address */}
                {place.address && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{place.address}</span>
                  </p>
                )}

                {/* Must try dishes & price */}
                {place.mustTryDishes && (
                  <div className="p-2 bg-rose-50/70 rounded-xl border border-rose-100 text-xs text-slate-700 mb-2">
                    <strong className="text-rose-600">Món nên gọi:</strong> {place.mustTryDishes}
                  </div>
                )}

                {place.notes && (
                  <p className="text-[11px] text-slate-500 italic mb-2">
                    Note: {place.notes}
                  </p>
                )}
              </div>

              {/* Footer card */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-amber-600">{place.estimatedPrice || 'Giá hợp lý'}</span>

                <div className="flex items-center gap-2">
                  {place.googleMapsUrl && (
                    <a
                      href={place.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold text-[11px]"
                    >
                      <span>Mở Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {/* Nút Chỉnh sửa */}
                  <button
                    onClick={() => handleOpenEdit(place)}
                    title="Chỉnh sửa quán này"
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Nút Xóa */}
                  <button
                    onClick={() => onDeletePlace(place.id)}
                    title="Xóa quán"
                    className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Thêm / Chỉnh Sửa Quán */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlaceId ? '✏️ Chỉnh Sửa Quán Ăn / Điểm Đến' : '🍲 Thêm Quán Ăn / Điểm Đến Mới'}
      >
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tên quán / Địa điểm *:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Lẩu Gà Lá É Tao Ngộ, MayCha..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phân loại:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
            >
              <option value="restaurant">Quán Ăn / Nhà Hàng 🍲</option>
              <option value="cafe">Cà Phê / Trà Sữa ☕</option>
              <option value="street_food">Ăn Vặt Vỉa Hè 🍢</option>
              <option value="travel">Địa Điểm Du Lịch 🌴</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ:</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: 26 Lê Thị Riêng, Quận 1..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Món ngon nhất nên gọi:</label>
            <input
              type="text"
              value={mustTryDishes}
              onChange={(e) => setMustTryDishes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Trà sữa nướng trân châu phô mai..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mức giá dự kiến & Link Maps (nếu có):</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
                placeholder="Giá: 30k - 50k..."
              />
              <input
                type="text"
                value={googleMapsUrl}
                onChange={(e) => setGoogleMapsUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-rose-400"
                placeholder="Link Google Maps..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú thêm:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-400"
              placeholder="Ví dụ: Đi trước 18h cho đỡ đông..."
            />
          </div>

          <div className="flex gap-2 pt-2 border-t">
            <Button variant="secondary" fullWidth onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="romantic" fullWidth onClick={handleSave}>
              {editingPlaceId ? 'Lưu Cập Nhật' : 'Thêm Vào Danh Sách'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Vòng Quay "Hôm Nay Ăn Gì" */}
      <Modal isOpen={isWheelModalOpen} onClose={() => setIsWheelModalOpen(false)} title="🎡 Vòng Quay: Hôm Nay Ăn Gì?">
        <div className="text-center py-4 space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Giải quyết câu trả lời <strong>"Ăn gì cũng được"</strong> của người yêu! 🎯
          </p>

          {places.length === 0 ? (
            <div className="p-6 rounded-3xl bg-rose-50 border border-dashed border-rose-200 text-slate-600 flex flex-col items-center justify-center space-y-3">
              <UtensilsCrossed className="w-8 h-8 text-rose-400" />
              <p className="text-xs font-semibold">Chưa có quán ăn nào trong danh sách để quay thưởng.</p>
              <Button
                size="sm"
                variant="romantic"
                onClick={() => {
                  setIsWheelModalOpen(false);
                  handleOpenAdd();
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm Quán Đầu Tiên
              </Button>
            </div>
          ) : (
            <>
              {/* Winner Display Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-glow flex flex-col items-center justify-center min-h-[160px]">
                {selectedWinner ? (
                  <div className="animate-fade-in space-y-1">
                    <span className="text-xs uppercase font-bold text-rose-200 tracking-wider">
                      🎉 Quán được chọn hôm nay là:
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black">{selectedWinner.name}</h3>
                    {selectedWinner.mustTryDishes && (
                      <p className="text-xs text-rose-100 font-medium mt-1">
                        Gợi ý món: {selectedWinner.mustTryDishes}
                      </p>
                    )}
                    {selectedWinner.address && (
                      <p className="text-[11px] text-rose-200 mt-1">{selectedWinner.address}</p>
                    )}
                  </div>
                ) : (
                  <span className="text-sm font-semibold">Đang chuẩn bị quay...</span>
                )}
              </div>

              {/* Spin Button */}
              <Button
                variant="romantic"
                size="lg"
                fullWidth
                onClick={handleSpinWheel}
                disabled={isSpinning}
                className="shadow-md"
              >
                <RotateCw className={`w-4 h-4 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? 'Đang quay ngẫu nhiên...' : 'Quay Lại Lần Nữa 🎲'}
              </Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
