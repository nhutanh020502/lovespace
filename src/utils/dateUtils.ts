import { format, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
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
