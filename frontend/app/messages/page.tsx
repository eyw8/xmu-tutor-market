'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import Card from '@/components/Card';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Conversation {
  otherId: string;
  lastContent: string;
  lastAt: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('加载失败');
        return (await res.json()) as Conversation[];
      })
      .then((data) => setConversations(data))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">我的消息</h1>
        {loading ? (
          <p className="text-gray-500">加载中…</p>
        ) : conversations.length === 0 ? (
          <Card>
            <p className="text-sm text-gray-600">暂无消息</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {conversations.map((c) => (
              <li key={c.otherId}>
                <Link href={`/chat/${c.otherId}`} className="block">
                  <Card className="transition-colors hover:border-blue-300">
                    <p className="truncate text-sm font-medium text-gray-900">与 {c.otherId} 的对话</p>
                    <p className="mt-1 truncate text-sm text-gray-600">{c.lastContent}</p>
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
