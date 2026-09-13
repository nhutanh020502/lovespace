// Hướng dẫn định dạng cho tính năng Nhập Nhanh Từ Vựng (Bulk Quick Import)
// Không chứa dữ liệu mẫu hardcoded - 100% dữ liệu do người dùng tự tạo

export const BULK_IMPORT_SAMPLE_PLACEHOLDER = `cherish : yêu thương, trân trọng : I cherish every moment with you
serendipity : sự tình cờ may mắn : Meeting you was pure serendipity
breathtaking : đẹp nghẹt thở : You look breathtaking tonight
cuddle : ôm ấp âu yếm : Let's cuddle and watch a movie`;

export const TOPIC_COLOR_THEMES = [
  { id: 'rose', name: 'Hồng Rose', bg: 'bg-rose-500', text: 'text-rose-600', border: 'border-rose-300', lightBg: 'bg-rose-50' },
  { id: 'pink', name: 'Hồng Sen', bg: 'bg-pink-500', text: 'text-pink-600', border: 'border-pink-300', lightBg: 'bg-pink-50' },
  { id: 'purple', name: 'Tím Lavender', bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-300', lightBg: 'bg-purple-50' },
  { id: 'blue', name: 'Xanh Biển', bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-300', lightBg: 'bg-blue-50' },
  { id: 'emerald', name: 'Xanh Ngọc', bg: 'bg-emerald-500', text: 'text-emerald-600', border: 'border-emerald-300', lightBg: 'bg-emerald-50' },
  { id: 'amber', name: 'Cam Nắng', bg: 'bg-amber-500', text: 'text-amber-600', border: 'border-amber-300', lightBg: 'bg-amber-50' },
] as const;

export const COUPLE_REWARDS_POOL = [
  'Được bao 1 ly trà sữa trân châu full topping 🧋',
  '15 phút massage vai gáy vỗ về lưng 💆',
  '1 buổi hẹn hò xem phim do người kia tự chọn vé 🍿',
  'Được miễn rửa chén & dọn phòng 1 ngày 🧹',
  '1 chầu ăn tối lãng mạn tại quán ruột yêu thích 🍲',
  '10 cái ôm ấm áp và nụ hôn bất kỳ lúc nào yêu cầu 🫂💋',
];
