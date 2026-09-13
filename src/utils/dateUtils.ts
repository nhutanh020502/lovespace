import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

export interface LoveDuration {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function calculateLoveDuration(startDateStr: string): LoveDuration {
  const start = new Date(startDateStr);
  const now = new Date();

  const totalDays = Math.max(0, differenceInDays(now, start));
  const totalHours = Math.max(0, differenceInHours(now, start));
  const totalMinutes = Math.max(0, differenceInMinutes(now, start));
  const totalSeconds = Math.max(0, differenceInSeconds(now, start));

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = (totalDays % 365) % 30;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;

  return {
    totalDays,
    years,
    months,
    days,
    hours,
    minutes,
    seconds
  };
}

export function formatDateVi(dateStr: string | Date, pattern = 'dd/MM/yyyy'): string {
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(d, pattern, { locale: vi });
  } catch {
    return String(dateStr);
  }
}

export function formatTimeVi(dateStr: string | Date): string {
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return format(d, 'HH:mm', { locale: vi });
  } catch {
    return '';
  }
}

export function formatMoodUpdateTime(dateStr?: string | Date | null): string {
  if (!dateStr) return 'Vừa cập nhật';
  try {
    const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    if (isNaN(d.getTime())) return 'Vừa cập nhật';

    const now = new Date();
    const diffMinutes = differenceInMinutes(now, d);

    if (diffMinutes < 1) {
      return 'Vừa mới cập nhật';
    }
    if (diffMinutes < 60) {
      return `Cập nhật ${diffMinutes} phút trước`;
    }

    const timeStr = format(d, 'HH:mm', { locale: vi });

    if (isToday(d)) {
      return `Cập nhật lúc ${timeStr} hôm nay`;
    }

    if (isYesterday(d)) {
      return `Cập nhật lúc ${timeStr} hôm qua`;
    }

    const diffDays = differenceInDays(now, d);
    if (diffDays <= 7) {
      return `Cập nhật lúc ${timeStr} (${diffDays} ngày trước)`;
    }

    const isSameYear = d.getFullYear() === now.getFullYear();
    const dateFormatted = format(d, isSameYear ? 'dd/MM' : 'dd/MM/yyyy', { locale: vi });
    return `Cập nhật ngày ${dateFormatted} lúc ${timeStr}`;
  } catch {
    return 'Vừa cập nhật';
  }
}
