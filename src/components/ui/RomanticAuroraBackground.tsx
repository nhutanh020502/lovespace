import React, { useMemo } from 'react';

export const RomanticAuroraBackground: React.FC = () => {
  // Tính toán sắc thái màu nền dựa trên giờ thực tế trong ngày
  const timeAmbiance = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      // Buổi sáng: Hồng đào ban mai rạng rỡ + ánh vàng kim
      return {
        orb1: 'from-rose-400/35 to-pink-300/30',
        orb2: 'from-amber-300/30 to-orange-200/25',
        orb3: 'from-pink-300/25 to-rose-200/20',
        bg: 'from-rose-50 via-pink-50/80 to-amber-50/60',
      };
    } else if (hour >= 11 && hour < 17) {
      // Buổi chiều: Hồng phấn ngọt ngào, tươi mát
      return {
        orb1: 'from-pink-400/35 to-rose-300/30',
        orb2: 'from-rose-300/30 to-orange-200/25',
        orb3: 'from-purple-300/25 to-pink-200/20',
        bg: 'from-pink-50 via-rose-50 to-orange-50/50',
      };
    } else if (hour >= 17 && hour < 20) {
      // Hoàng hôn: Cam hồng lãng mạn + tím hoàng hôn
      return {
        orb1: 'from-rose-500/40 to-pink-400/35',
        orb2: 'from-orange-400/35 to-amber-300/30',
        orb3: 'from-purple-400/30 to-rose-300/25',
        bg: 'from-rose-100/90 via-pink-50 to-orange-100/70',
      };
    } else {
      // Buổi tối: Tím mộng mơ, hồng ngọc starlight huyền bí
      return {
        orb1: 'from-pink-500/35 to-purple-500/30',
        orb2: 'from-purple-400/30 to-indigo-300/25',
        orb3: 'from-rose-400/35 to-pink-300/25',
        bg: 'from-rose-50 via-purple-50/60 to-pink-50',
      };
    }
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Base Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${timeAmbiance.bg} transition-colors duration-1000`} />

      {/* Floating Aurora Glowing Orbs */}
      <div
        className={`absolute -top-32 -left-24 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-gradient-to-tr ${timeAmbiance.orb1} blur-[90px] sm:blur-[120px] animate-aurora-1 will-change-transform`}
      />

      <div
        className={`absolute top-1/3 -right-28 w-[350px] sm:w-[480px] h-[350px] sm:h-[480px] rounded-full bg-gradient-to-bl ${timeAmbiance.orb2} blur-[80px] sm:blur-[110px] animate-aurora-2 will-change-transform`}
      />

      <div
        className={`absolute -bottom-24 left-1/4 w-[320px] sm:w-[450px] h-[320px] sm:h-[450px] rounded-full bg-gradient-to-tl ${timeAmbiance.orb3} blur-[80px] sm:blur-[100px] animate-aurora-3 will-change-transform`}
      />

      {/* Subtle Noise / Sparkle Texture Overlay for Luxury Depth */}
      <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
};
