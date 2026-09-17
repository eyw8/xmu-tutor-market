'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Card from '@/components/Card';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Breakdown {
  price: number;
  subject: number;
  time: number;
  distance: number;
  rating: number;
}

interface MatchItem {
  tutorProfileId: string;
  userId: string;
  college: string;
  major: string;
  grade: number;
  subjects: string[];
  pricePerHour: number;
  score: number;
  breakdown: Breakdown;
}

export default function MatchesPage() {
  const params = useParams<{ id: string }>();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/requests/${params.id}/matches`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('加载失败');
        return (await res.json()) as MatchItem[];
      })
      .then((data) => setMatches(data))
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">匹配结果</h1>
        {loading ? (
          <p className="text-gray-500">计算匹配中…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : matches.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-600">暂无匹配的家教，请稍后再试。</p>
          </Card>
        ) : (
          <ul className="space-y-4">
            {matches.map((m) => (
              <li key={m.tutorProfileId}>
                <Link href={`/tutor/${m.userId}`} className="block">
                  <Card className="transition-colors hover:border-blue-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {m.college} · {m.major} · {m.grade} 级
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          科目：{m.subjects.join('、')} · {m.pricePerHour} 元/小时
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          价格 {m.breakdown.price} / 科目 {m.breakdown.subject} / 时间 {m.breakdown.time} / 距离 {m.breakdown.distance} / 评价 {m.breakdown.rating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">{m.score}</p>
                        <p className="text-xs text-gray-400">匹配分</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
