const monthNames = [
  "januar",
  "februar",
  "marec",
  "april",
  "maj",
  "junij",
  "julij",
  "avgust",
  "september",
  "oktober",
  "november",
  "december"
];

export function getTodaySlovenia(): Date {
  return new Date();
}

export function getCurrentMonthNumber(date = getTodaySlovenia()): number {
  return date.getMonth() + 1;
}

export function getMonthName(month: number): string {
  return monthNames[month - 1] ?? "mesec";
}

export function formatDateSl(dateLike: string | Date): string {
  const date = typeof dateLike === "string" ? new Date(`${dateLike}T12:00:00`) : dateLike;
  return new Intl.DateTimeFormat("sl-SI", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date);
}

export function isToday(dateString: string): boolean {
  const today = new Date();
  const d = new Date(`${dateString}T12:00:00`);
  return (
    today.getFullYear() === d.getFullYear() &&
    today.getMonth() === d.getMonth() &&
    today.getDate() === d.getDate()
  );
}
