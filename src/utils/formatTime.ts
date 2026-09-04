export interface FormattedTimeParts {
  hours: string;
  minutes: string;
  seconds: string;
  hundredths: string;
  hasHours: boolean;
}

export function formatTimeParts(ms: number): FormattedTimeParts {
  const totalSeconds = Math.floor(ms / 1000);
  const hundredthsVal = Math.floor((ms % 1000) / 10);
  const secondsVal = totalSeconds % 60;
  const minutesVal = Math.floor(totalSeconds / 60) % 60;
  const hoursVal = Math.floor(totalSeconds / 3600);

  const hours = String(hoursVal).padStart(2, '0');
  const minutes = String(minutesVal).padStart(2, '0');
  const seconds = String(secondsVal).padStart(2, '0');
  const hundredths = String(hundredthsVal).padStart(2, '0');

  return {
    hours,
    minutes,
    seconds,
    hundredths,
    hasHours: hoursVal > 0,
  };
}

export function formatTime(ms: number, includeHoursAlways = false): string {
  const parts = formatTimeParts(ms);
  if (parts.hasHours || includeHoursAlways) {
    return `${parts.hours}:${parts.minutes}:${parts.seconds}.${parts.hundredths}`;
  }
  return `${parts.minutes}:${parts.seconds}.${parts.hundredths}`;
}
