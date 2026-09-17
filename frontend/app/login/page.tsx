'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Form, { Field } from '@/components/Form';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

function decodeRole(token: string): string {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload)) as { role?: string };
    return decoded.role ?? '';
  } catch {
    return '';
  }
}


export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? '登录失败');
      }
      localStorage.setItem('token', data.accessToken);
      const role = decodeRole(data.accessToken);
      router.push(role === 'PARENT' ? '/parent/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card title="登录">
          <Form onSubmit={handleSubmit}>
            <Field label="手机号" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Field label="密码" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '登录中…' : '登录'}
            </Button>
          </Form>
        </Card>
      </main>
    </div>
  );
}
