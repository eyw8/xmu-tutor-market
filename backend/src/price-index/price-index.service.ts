import { Injectable } from '@nestjs/common';

import {
  computeDemandChange,
  computePriceIndexStats,
  computeTrend,
  PriceIndexStats,
} from './calculator';

export const XMU_REGION = '厦大区域';

export const PRICE_INDEX_CATEGORIES = ['小学数学', '初中英语', '高中物理'] as const;
export type PriceIndexCategory = (typeof PRICE_INDEX_CATEGORIES)[number];

export interface PriceRecordInput {
  category: PriceIndexCategory;
  price: number;
}

export interface CategoryPriceIndex {
  category: PriceIndexCategory;
  region: string;
  stats: PriceIndexStats;
  trendPercent: number | null;
  demandChangePercent: number | null;
}

@Injectable()
export class PriceIndexService {
  computeRealTimeIndex(
    records: PriceRecordInput[],
    previousRecords: PriceRecordInput[] = [],
  ): CategoryPriceIndex[] {
    const currentByCategory = groupByCategory(records);
    const previousByCategory = groupByCategory(previousRecords);

    return PRICE_INDEX_CATEGORIES.map((category) => {
      const currentPrices = (currentByCategory.get(category) ?? []).map((record) => record.price);
      const previousPrices = (previousByCategory.get(category) ?? []).map((record) => record.price);

      const stats = computePriceIndexStats(currentPrices);
      const previousStats =
        previousPrices.length > 0 ? computePriceIndexStats(previousPrices) : null;

      return {
        category,
        region: XMU_REGION,
        stats,
        trendPercent: computeTrend(stats.average, previousStats?.average),
        demandChangePercent: computeDemandChange(stats.sampleSize, previousStats?.sampleSize),
      };
    });
  }
}

function groupByCategory(records: PriceRecordInput[]): Map<PriceIndexCategory, PriceRecordInput[]> {
  const map = new Map<PriceIndexCategory, PriceRecordInput[]>();
  for (const record of records) {
    const list = map.get(record.category) ?? [];
    list.push(record);
    map.set(record.category, list);
  }
  return map;
}
