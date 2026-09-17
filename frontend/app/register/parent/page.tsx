'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Form, { Field } from '@/components/Form';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export default function RegisterParentPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [childGrade, setChildGrade] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register/parent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, childGrade: Number(childGrade) }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(Array.isArray(data.message) ? data.message.join('; ') : (data.message ?? '注册失败'));
      }
      localStorage.setItem('token', data.accessToken);
      router.push('/parent/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12">
        <Card title="家长注册">
          <Form onSubmit={handleSubmit}>
            <Field label="手机号" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Field label="密码" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Field label="孩子年级" name="childGrade" type="number" value={childGrade} onChange={(e) => setChildGrade(e.target.value)} required hint="如：7 表示初一" />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '注册中…' : '注册'}
            </Button>
          </Form>
        </Card>
      </main>
    </div>
  );
}
