/**
 * Перетворює текстову оцінку у числову (0-1)
 */
export function mapMarkToNumber(mark: string, allMarks: string[]): number {
  const index = allMarks.findIndex(m => m === mark);
  if (index === -1 || allMarks.length < 2) return 0;
  return index / (allMarks.length - 1);
}

/**
 * Перетворює нормалізовану оцінку назад у текстову мітку
 */
export function mapNumberToMark(value: number, allMarks: string[]): string {
  if (!allMarks.length) return '';
  const clamped = Math.max(0, Math.min(value, 1));
  const index = Math.round(clamped * (allMarks.length - 1));
  return allMarks[index];
}
