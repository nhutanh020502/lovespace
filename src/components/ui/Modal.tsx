import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'full';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const maxWClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    full: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 pb-12 sm:pb-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className={`relative w-full ${maxWClasses[maxWidth]} max-h-[calc(100dvh-56px)] sm:max-h-[88vh] flex flex-col bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-rose-200/80 overflow-hidden z-10`}
          >
            {/* Sticky Header */}
            {title && (
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-rose-100/80 bg-white/80 backdrop-blur-md shrink-0">
                <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight truncate pr-2">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-rose-50 transition-colors shrink-0"
                  title="Đóng modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
