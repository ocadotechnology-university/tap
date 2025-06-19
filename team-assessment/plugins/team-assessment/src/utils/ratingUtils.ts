/**
 * Створює мапу текстових міток до числових значень.
 * Наприклад: ['Development need', 'Bar', 'Excellent', 'Leading']
 * =>
 * { 'Development need': 1, 'Bar': 2, 'Excellent': 3, 'Leading': 4 }
 */
export const createLabelToValueMap = (labels: string[]): Record<string, number> => {
  return labels.reduce((acc, label, index) => {
    acc[label] = index + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Повертає назву мітки за усередненим числом.
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
 * Розрахунок середньої текстової оцінки з міток.
 */
export const calculateAverageMark = (marks: string[], labels: string[]): string => {
  if (marks.length === 0) return 'N/A';
  const labelToValue = createLabelToValueMap(labels);
  const numericMarks = marks
    .map(mark => labelToValue[mark])
    .filter((value): value is number => typeof value === 'number');

  const sum = numericMarks.reduce((acc, val) => acc + val, 0);
  const avg = sum / numericMarks.length;

  return getLabelFromAverage(labels, avg);
};

/**
 * Розрахунок загального % успішності по Soft + Hard скілам.
 */
export const calculateOverallSkillPercentage = (
  softSkills: Record<string, any>,
  hardSkills: Record<string, any>,
  config: any
): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Soft Skills
  for (const area of Object.values(softSkills)) {
    for (const [key, block] of Object.entries(area)) {
      if (key === '_areaName') continue;

      const { _competencyName, entries } = block as any;
      const labels = config['Soft Skills'].find(
        (q: any) => q.title === _competencyName
      )?.labels || [];

      const labelToValue = createLabelToValueMap(labels);
      const max = labels.length;

      for (const entry of entries) {
        const value = labelToValue[entry.mark];
        if (value) {
          totalScore += value;
          maxPossibleScore += max;
        }
      }
    }
  }

  // Hard Skills
  for (const entries of Object.values(hardSkills)) {
    for (const entry of entries as any[]) {
      const labels = config['Hard Skills'].find(
        (q: any) => q.title === entry._questionText
      )?.labels || [];

      const labelToValue = createLabelToValueMap(labels);
      const max = labels.length;

      const value = labelToValue[entry.mark];
      if (value) {
        totalScore += value;
        maxPossibleScore += max;
      }
    }
  }

  if (maxPossibleScore === 0) return 0;

  return (totalScore / maxPossibleScore) * 100;
};

/**
 * Повертає відсоток успішності для одного запитання.
 */
export const getPercentageScore = (marks: string[], labels: string[]): number => {
  const labelToValue = createLabelToValueMap(labels);
  const maxValue = labels.length;

  const numericMarks = marks
    .map(mark => labelToValue[mark])
    .filter((v): v is number => typeof v === 'number');

  if (numericMarks.length === 0) return 0;

  const sum = numericMarks.reduce((acc, val) => acc + val, 0);
  const maxTotal = maxValue * numericMarks.length;

  return (sum / maxTotal) * 100;
};

/**
 * Повертає колір у залежності від значення 0–100 (від червоного до зеленого).
 */
export const getColorByValue = (value: number): string => {
  const hue = Math.round((value / 100) * 120); // 0 = red, 120 = green
  return `hsl(${hue}, 70%, 60%)`;
};
export const calculateSkillScore = (
  marks: string[],
  getLabelsForMark: (mark: string) => string[] | undefined,
): { scored: number; max: number } => {
  let totalScore = 0;
  let totalMax = 0;

  for (const mark of marks) {
    const labels = getLabelsForMark(mark);
    if (!labels) continue;

    const map = createLabelToValueMap(labels);
    const value = map[mark];
    const max = labels.length;

    if (value) {
      totalScore += value;
      totalMax += max;
    }
  }

  return { scored: totalScore, max: totalMax };
};
// Для Soft Skills
export const calculateSoftSkillsPercentage = (
  softSkills: Record<string, any>,
  config: any,
): number => {
  let totalMax = 0;
  let totalScore = 0;

  for (const area of Object.values(softSkills)) {
    for (const [key, block] of Object.entries(area)) {
      if (key === '_areaName') continue;

      const { _competencyName, entries } = block as any;
      const labels = config['Soft Skills'].find(
        (q: any) => q.title === _competencyName,
      )?.labels || [];

      const labelToValue = createLabelToValueMap(labels);

      for (const entry of entries) {
        const value = labelToValue[entry.mark];
        if (value) {
          totalScore += value;
          totalMax += labels.length;
        }
      }
    }
  }

  if (totalMax === 0) return 0;
  return (totalScore / totalMax) * 100;
};

// Для Hard Skills
export const calculateHardSkillsPercentage = (
  hardSkills: Record<string, any>,
  config: any,
): number => {
  let totalMax = 0;
  let totalScore = 0;

  for (const entries of Object.values(hardSkills)) {
    for (const entry of entries as any[]) {
      const labels = config['Hard Skills'].find(
        (q: any) => q.title === entry._questionText,
      )?.labels || [];

      const labelToValue = createLabelToValueMap(labels);
      const value = labelToValue[entry.mark];
      if (value) {
        totalScore += value;
        totalMax += labels.length;
      }
    }
  }

  if (totalMax === 0) return 0;
  return (totalScore / totalMax) * 100;
};

export function getProgressColor(percent: number) {
  if (percent <= 20) {
    // 0-20%: Gray
    return '#bdbdbd';
  }
  // 20-100%: Red (0) to Green (120) в HSL
  // 20% -> 0deg (red), 100% -> 120deg (green)
  const shiftedPercent = (percent - 20) / 80; // 0 at 20%, 1 at 100%
  const hue = Math.round(shiftedPercent * 120); // 0-120
  return `hsl(${hue}, 70%, 50%)`;
}
