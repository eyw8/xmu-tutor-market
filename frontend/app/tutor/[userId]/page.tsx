'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import Card from '@/components/Card';
import ChatBox from '@/components/ChatBox';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

interface TutorProfile {
  college: string;
  major: string;
  grade: number;
  subjects: string[];
  pricePerHour: number;
  availableTimes: TimeSlot[];
}

export default function TutorDetailPage() {
  const params = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/profiles/${params.userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('加载失败');
        return (await res.json()) as TutorProfile;
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [params.userId]);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">家教详情</h1>
        {loading ? (
          <p className="text-gray-500">加载中…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : profile ? (
          <>
            <Card title={`${profile.college} · ${profile.major} · ${profile.grade} 级`}>
              <dl className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <dt className="w-24 shrink-0 text-gray-500">科目</dt>
                  <dd className="text-gray-900">{profile.subjects.join('、')}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-24 shrink-0 text-gray-500">价格</dt>
                  <dd className="text-gray-900">{profile.pricePerHour} 元/小时</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-24 shrink-0 text-gray-500">可授课时间</dt>
                  <dd className="text-gray-900">
                    {profile.availableTimes.map((t) => `${t.day} ${t.start}-${t.end}`).join('、')}
                  </dd>
                </div>
              </dl>
            </Card>
            <ChatBox otherUserId={params.userId} />
          </>
        ) : null}
      </main>
    </div>
  );
}
