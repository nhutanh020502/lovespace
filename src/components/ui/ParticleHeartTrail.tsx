import React, { useEffect, useState, useCallback } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  angle: number;
  velocity: number;
  opacity: number;
  color: string;
}

const ROMANTIC_SYMBOLS = ['💖', '✨', '🌸', '💕', '⭐', '🌷'];

export const ParticleHeartTrail: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawnParticle = useCallback((clientX: number, clientY: number) => {
    const randomSymbol = ROMANTIC_SYMBOLS[Math.floor(Math.random() * ROMANTIC_SYMBOLS.length)];
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      size: Math.floor(Math.random() * 12) + 12, // 12px to 24px
      emoji: randomSymbol,
      angle: (Math.random() * Math.PI) - Math.PI / 2, // Upward spread
      velocity: Math.random() * 2 + 1.5,
      opacity: 1,
      color: `hsl(${Math.floor(Math.random() * 30 + 340)}, 90%, 65%)`,
    };

    setParticles((prev) => [...prev.slice(-16), newParticle]); // Limit to 16 particles at a time for optimal performance
  }, []);

  useEffect(() => {
    let lastSpawn = 0;

    const handlePointerDown = (e: PointerEvent) => {
      spawnParticle(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const now = Date.now();
      if (now - lastSpawn > 80) {
        // Throttle to 80ms for smooth trail without lag
        lastSpawn = now;
        spawnParticle(e.clientX, e.clientY);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [spawnParticle]);

  // Animate particles upwards and fade out
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y - p.velocity,
            x: p.x + Math.sin(p.angle) * 1.2,
            opacity: p.opacity - 0.05,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 25);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            textShadow: '0 0 10px rgba(244, 63, 94, 0.6)',
            transform: `scale(${p.opacity})`,
            transition: 'opacity 0.05s linear',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};
