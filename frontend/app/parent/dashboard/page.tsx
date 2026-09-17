'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface TutoringRequest {
  id: string;
  subject: string;
  childGrade: number;
  budgetMin: number;
  budgetMax: number;
  region: string;
  status: string;
  createdAt: string;
}

export default function ParentDashboard() {
  const [requests, setRequests] = useState<TutoringRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('加载失败');
        return (await res.json()) as TutoringRequest[];
      })
      .then((data) => setRequests(data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">家长工作台</h1>
          <div className="flex items-center gap-3">
            <Link href="/messages" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              我的消息
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>退出登录</Button>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">我的需求</h2>
          <Link href="/parent/request/new">
            <Button size="sm">+ 发布需求</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">加载中…</p>
        ) : requests.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-600">你还没有发布需求，点击右上角「发布需求」开始。</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{r.subject} · {r.childGrade} 年级</p>
                      <p className="mt-1 text-sm text-gray-600">
                        预算 {r.budgetMin}-{r.budgetMax} 元/小时 · {r.region}
                      </p>
                    </div>
                    <Link href={`/parent/request/${r.id}/matches`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      查看匹配 →
                    </Link>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
