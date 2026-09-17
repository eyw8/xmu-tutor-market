import {
  average,
  computeDemandChange,
  computePriceIndexStats,
  computeTrend,
  median,
} from './calculator';

describe('average', () => {
  it('计算均值', () => {
    expect(average([80, 90, 100])).toBe(90);
  });

  it('空数组返回 0', () => {
    expect(average([])).toBe(0);
  });
});

describe('median', () => {
  it('奇数个取中位', () => {
    expect(median([80, 100, 90])).toBe(90);
  });

  it('偶数个取均值', () => {
    expect(median([100, 120])).toBe(110);
  });
});

describe('computePriceIndexStats', () => {
  it('完整统计', () => {
    const stats = computePriceIndexStats([80, 90, 100]);
    expect(stats.average).toBe(90);
    expect(stats.median).toBe(90);
    expect(stats.min).toBe(80);
    expect(stats.max).toBe(100);
    expect(stats.sampleSize).toBe(3);
  });

  it('空数据返回零值', () => {
    const stats = computePriceIndexStats([]);
    expect(stats.sampleSize).toBe(0);
    expect(stats.average).toBe(0);
  });
});

describe('computeTrend', () => {
  it('均价环比 +20%', () => {
    expect(computeTrend(90, 75)).toBe(20);
  });

  it('无前值返回 null', () => {
    expect(computeTrend(90, null)).toBeNull();
  });
});

describe('computeDemandChange', () => {
  it('数量环比 +50%', () => {
    expect(computeDemandChange(3, 2)).toBe(50);
  });

  it('前值为 0 返回 null', () => {
    expect(computeDemandChange(3, 0)).toBeNull();
  });
});
