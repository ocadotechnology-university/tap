// Утиліта для роботи з кастомними текстовими оцінками

/**
 * Повертає числову оцінку для кожної текстової мітки.
 * Наприклад: ['Development need', 'Bar', 'Excellent', 'Leading'] =>
 * {
 *   'Development need': 1,
 *   'Bar': 2,
 *   'Excellent': 3,
 *   'Leading': 4
 * }
 */
export const createLabelToValueMap = (labels: string[]): Record<string, number> => {
  return labels.reduce((acc, label, index) => {
    acc[label] = index + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Повертає назву мітки за усередненим числом.
 * Округлює до найближчого і повертає відповідну назву.
 */
export const getLabelFromAverage = (
  labels: string[],
  average: number
): string => {
  const roundedIndex = Math.round(average) - 1;
  if (roundedIndex < 0 || roundedIndex >= labels.length) return 'N/A';
  return labels[roundedIndex];
};

/**
 * Розрахунок середньої оцінки за списком текстових оцінок.
 */
export const calculateAverageMark = (marks: string[], labels: string[]): string => {
  if (marks.length === 0) return 'N/A';
  const labelToValue = createLabelToValueMap(labels);
  const numericMarks = marks
    .map(mark => labelToValue[mark])
    .filter(value => typeof value === 'number');

  const sum = numericMarks.reduce((acc, val) => acc + val, 0);
  const avg = sum / numericMarks.length;

  return getLabelFromAverage(labels, avg);
};
