'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Button from '@/components/Button';
import Card from '@/components/Card';
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

export default function StudentDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 404) {
          return null;
        }
        if (!res.ok) {
          throw new Error('加载失败');
        }
        return (await res.json()) as TutorProfile;
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">学生工作台</h1>
          <div className="flex items-center gap-3">
            <Link href="/messages" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              我的消息
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              退出登录
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">加载中…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : profile ? (
          <Card title="我的家教主页">
            <dl className="space-y-3 text-sm">
              <Row label="学院" value={profile.college} />
              <Row label="专业" value={profile.major} />
              <Row label="年级" value={String(profile.grade)} />
              <Row label="科目" value={profile.subjects.join('、')} />
              <Row label="价格" value={`${profile.pricePerHour} 元/小时`} />
              <Row
                label="可授课时间"
                value={profile.availableTimes.map((t) => `${t.day} ${t.start}-${t.end}`).join('、')}
              />
            </dl>
          </Card>
        ) : (
          <Card>
            <p className="text-sm text-gray-600">你还没有创建家教主页。</p>
            <div className="mt-4">
              <Button disabled>创建主页（即将上线）</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-24 shrink-0 text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}
