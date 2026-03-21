export function toISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** dateStr (YYYY-MM-DD) に days を加算して Date を返す（Prisma渡し用） */
export function addDays(dateStr: string, days: number): Date {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d;
}

/** dateStr (YYYY-MM-DD) に days を加算して YYYY-MM-DD 文字列を返す（UI用） */
export function addDaysStr(dateStr: string, days: number): string {
  return toISO(addDays(dateStr, days));
}
