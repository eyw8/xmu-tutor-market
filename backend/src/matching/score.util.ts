export interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

export interface StudentForMatch {
  subjects: string[];
  pricePerHour: number;
  availableTimes: TimeSlot[];
  region?: string;
  rating?: number;
}

export interface RequestForMatch {
  subject: string;
  budgetMax: number;
  budgetMin?: number;
  timePreference: TimeSlot[];
  region?: string;
}

export interface ScoreBreakdown {
  price: number;
  subject: number;
  time: number;
  distance: number;
  rating: number;
}

export interface MatchScore {
  total: number;
  breakdown: ScoreBreakdown;
}

export const MATCH_WEIGHTS = {
  price: 0.3,
  subject: 0.25,
  time: 0.2,
  distance: 0.15,
  rating: 0.1,
} as const;

export function priceScore(pricePerHour: number, budgetMax: number): number {
  if (pricePerHour <= budgetMax) {
    return 100;
  }
  const overage = (pricePerHour - budgetMax) / budgetMax;
  return Math.max(0, Math.round(100 * (1 - overage)));
}

export function subjectScore(studentSubjects: string[], requestSubject: string): number {
  const normalize = (value: string): string => value.trim().toLowerCase();
  const target = normalize(requestSubject);
  return studentSubjects.some((subject) => normalize(subject) === target) ? 100 : 0;
}

export function timeScore(available: TimeSlot[], preferred: TimeSlot[]): number {
  if (preferred.length === 0) {
    return 100;
  }
  const matched = preferred.filter((slot) =>
    available.some((availableSlot) => slotsOverlap(availableSlot, slot)),
  ).length;
  return Math.round((matched / preferred.length) * 100);
}

export function distanceScore(studentRegion?: string, requestRegion?: string): number {
  if (!studentRegion || !requestRegion) {
    return 60;
  }
  const normalize = (value: string): string => value.trim().toLowerCase();
  return normalize(studentRegion) === normalize(requestRegion) ? 100 : 0;
}

export function ratingScore(rating?: number): number {
  if (rating === undefined || rating === null || rating <= 0) {
    return 60;
  }
  const clamped = Math.min(5, Math.max(1, rating));
  return Math.round((clamped / 5) * 100);
}

export function computeMatchScore(student: StudentForMatch, request: RequestForMatch): MatchScore {
  const breakdown: ScoreBreakdown = {
    price: priceScore(student.pricePerHour, request.budgetMax),
    subject: subjectScore(student.subjects, request.subject),
    time: timeScore(student.availableTimes, request.timePreference),
    distance: distanceScore(student.region, request.region),
    rating: ratingScore(student.rating),
  };

  const total =
    MATCH_WEIGHTS.price * breakdown.price +
    MATCH_WEIGHTS.subject * breakdown.subject +
    MATCH_WEIGHTS.time * breakdown.time +
    MATCH_WEIGHTS.distance * breakdown.distance +
    MATCH_WEIGHTS.rating * breakdown.rating;

  return { total: Math.round(total), breakdown };
}

function slotsOverlap(a: TimeSlot, b: TimeSlot): boolean {
  if (a.day.trim().toLowerCase() !== b.day.trim().toLowerCase()) {
    return false;
  }
  const aStart = toMinutes(a.start);
  const aEnd = toMinutes(a.end);
  const bStart = toMinutes(b.start);
  const bEnd = toMinutes(b.end);
  return aStart < bEnd && bStart < aEnd;
}

function toMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(':').map((part) => Number(part));
  return (hours || 0) * 60 + (minutes || 0);
}
