import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin } from 'lucide-react';
import { formatDateVi } from '../../utils/dateUtils';

interface LightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  caption?: string;
  date?: string;
  location?: string;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  imageUrl,
  caption,
  date,
  location,
  onClose
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt="Kỷ niệm"
            className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
          />

          {(caption || date || location) && (
            <div className="w-full bg-slate-900/80 backdrop-blur-md text-white p-4 mt-2 rounded-2xl border border-white/10 text-left">
              {caption && <p className="text-sm sm:text-base font-medium leading-relaxed mb-2">{caption}</p>}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                {date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    {formatDateVi(date)}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {location}
                  </span>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
