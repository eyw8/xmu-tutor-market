export interface PriceIndexStats {
  average: number;
  median: number;
  min: number;
  max: number;
  sampleSize: number;
}

export function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function computePriceIndexStats(prices: number[]): PriceIndexStats {
  if (prices.length === 0) {
    return { average: 0, median: 0, min: 0, max: 0, sampleSize: 0 };
  }
  return {
    average: round2(average(prices)),
    median: round2(median(prices)),
    min: round2(Math.min(...prices)),
    max: round2(Math.max(...prices)),
    sampleSize: prices.length,
  };
}

export function computeTrend(currentAvg: number, previousAvg?: number | null): number | null {
  if (previousAvg === undefined || previousAvg === null || previousAvg === 0) {
    return null;
  }
  return round2(((currentAvg - previousAvg) / previousAvg) * 100);
}

export function computeDemandChange(
  currentCount: number,
  previousCount?: number | null,
): number | null {
  if (previousCount === undefined || previousCount === null || previousCount === 0) {
    return null;
  }
  return round2(((currentCount - previousCount) / previousCount) * 100);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
