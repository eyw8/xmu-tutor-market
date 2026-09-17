'use client';

import { FormEvent, useEffect, useState } from 'react';

import Button from '@/components/Button';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ContactStatus {
  status: string;
  requestedByMe?: boolean;
  otherPhone?: string | null;
}

export default function ChatBox({ otherUserId }: { otherUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contact, setContact] = useState<ContactStatus | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myId, setMyId] = useState('');

  function loadConversation() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch(`${API_BASE}/messages/${otherUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('加载失败');
        return (await res.json()) as Message[];
      })
      .then((data) => setMessages(data))
      .catch((err) => setError(err instanceof Error ? err.message : '加载失败'))
      .finally(() => setLoading(false));
  }

  function loadContact() {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE}/contacts/${otherUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as ContactStatus;
      })
      .then((data) => setContact(data))
      .catch(() => {});
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])) as { sub?: string };
        setMyId(payload.sub ?? '');
      } catch {
        /* ignore */
      }
    }
    loadConversation();
    loadContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = text.trim();
    if (!content) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ receiverId: otherUserId, content }),
      });
      if (!res.ok) throw new Error('发送失败');
      const sent = (await res.json()) as Message;
      setMessages((prev) => [...prev, sent]);
      setText('');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败');
    }
  }

  async function requestContact() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/contacts/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: otherUserId }),
      });
      if (!res.ok) throw new Error('请求失败');
      loadContact();
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败');
    }
  }

  async function acceptContact() {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/contacts/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: otherUserId }),
      });
      if (!res.ok) throw new Error('操作失败');
      loadContact();
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    }
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
        {contact?.status === 'ACCEPTED' ? (
          <p className="text-sm text-green-700">已交换联系方式：对方手机号 {contact.otherPhone}</p>
        ) : contact?.status === 'PENDING' && contact.requestedByMe ? (
          <p className="text-sm text-gray-500">已发送交换请求，等待对方同意</p>
        ) : contact?.status === 'PENDING' && !contact.requestedByMe ? (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">对方想和你交换联系方式</p>
            <Button size="sm" onClick={acceptContact}>同意</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">联系方式默认隐藏</p>
            <Button size="sm" variant="secondary" onClick={requestContact}>交换联系方式</Button>
          </div>
        )}
      </div>

      <div className="h-64 overflow-y-auto border-b border-gray-100 p-4">
        {loading ? (
          <p className="text-sm text-gray-400">加载消息中…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400">还没有消息，打个招呼吧</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`mb-2 flex ${m.senderId === myId ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm ${
                  m.senderId === myId ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
      </div>
      {error ? <p className="px-4 pt-2 text-xs text-red-600">{error}</p> : null}
      <form onSubmit={send} className="flex gap-2 p-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入消息…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <Button type="submit">发送</Button>
      </form>
    </div>
  );
}
