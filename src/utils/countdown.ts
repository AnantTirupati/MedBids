export interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isUrgent: boolean;
  hasEnded: boolean;
}

export function calculateTimeLeft(endTimeString: string | Date, urgentMinutes = 15): TimeLeft {
  const end = new Date(endTimeString).getTime();
  const now = new Date().getTime();
  const diff = end - now;

  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, totalMs: 0, isUrgent: false, hasEnded: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours,
    minutes,
    seconds,
    totalMs: diff,
    isUrgent: diff < urgentMinutes * 60 * 1000,
    hasEnded: false,
  };
}
export default calculateTimeLeft;
