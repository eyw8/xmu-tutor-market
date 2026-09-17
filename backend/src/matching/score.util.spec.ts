import {
  computeMatchScore,
  distanceScore,
  priceScore,
  ratingScore,
  RequestForMatch,
  StudentForMatch,
  subjectScore,
  timeScore,
} from './score.util';

describe('priceScore', () => {
  it('价格在预算内返回 100', () => {
    expect(priceScore(80, 100)).toBe(100);
  });

  it('超预算 50% 时线性衰减到 50', () => {
    expect(priceScore(150, 100)).toBe(50);
  });

  it('超预算 100% 时归 0', () => {
    expect(priceScore(200, 100)).toBe(0);
  });
});

describe('subjectScore', () => {
  it('科目命中返回 100', () => {
    expect(subjectScore(['数学', '英语'], '数学')).toBe(100);
  });

  it('科目未命中返回 0', () => {
    expect(subjectScore(['数学'], '物理')).toBe(0);
  });

  it('大小写不敏感', () => {
    expect(subjectScore(['Math'], 'math')).toBe(100);
  });
});

describe('timeScore', () => {
  it('时段有重叠返回 100', () => {
    expect(
      timeScore(
        [{ day: '周一', start: '18:00', end: '20:00' }],
        [{ day: '周一', start: '19:00', end: '21:00' }],
      ),
    ).toBe(100);
  });

  it('不同天返回 0', () => {
    expect(
      timeScore(
        [{ day: '周一', start: '18:00', end: '20:00' }],
        [{ day: '周二', start: '19:00', end: '21:00' }],
      ),
    ).toBe(0);
  });

  it('空偏好返回 100', () => {
    expect(timeScore([{ day: '周一', start: '18:00', end: '20:00' }], [])).toBe(100);
  });
});

describe('distanceScore', () => {
  it('同区域 100', () => {
    expect(distanceScore('思明区', '思明区')).toBe(100);
  });

  it('异区域 0', () => {
    expect(distanceScore('思明区', '湖里区')).toBe(0);
  });

  it('未知区域中性 60', () => {
    expect(distanceScore(undefined, '思明区')).toBe(60);
  });
});

describe('ratingScore', () => {
  it('4.5 分 -> 90', () => {
    expect(ratingScore(4.5)).toBe(90);
  });

  it('无评价 -> 中性 60', () => {
    expect(ratingScore(undefined)).toBe(60);
  });
});

describe('computeMatchScore', () => {
  it('综合示例总分 99', () => {
    const student: StudentForMatch = {
      subjects: ['数学', '英语'],
      pricePerHour: 80,
      availableTimes: [{ day: '周一', start: '18:00', end: '20:00' }],
      region: '思明区',
      rating: 4.5,
    };
    const request: RequestForMatch = {
      subject: '数学',
      budgetMax: 100,
      timePreference: [{ day: '周一', start: '19:00', end: '21:00' }],
      region: '思明区',
    };

    const result = computeMatchScore(student, request);
    expect(result.total).toBe(99);
    expect(result.breakdown).toEqual({
      price: 100,
      subject: 100,
      time: 100,
      distance: 100,
      rating: 90,
    });
  });
});
