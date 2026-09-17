'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Form, { Field } from '@/components/Form';
import Navbar from '@/components/Navbar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

const DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

interface TimeSlot {
  day: string;
  start: string;
  end: string;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [childGrade, setChildGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [region, setRegion] = useState('');
  const [slots, setSlots] = useState<TimeSlot[]>([{ day: DAYS[0], start: '', end: '' }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateSlot = (index: number, field: keyof TimeSlot, value: string) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const addSlot = () => setSlots((prev) => [...prev, { day: DAYS[0], start: '', end: '' }]);
  const removeSlot = (index: number) => setSlots((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const response = await fetch(`${API_BASE}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          childGrade: Number(childGrade),
          subject,
          budgetMin: Number(budgetMin),
          budgetMax: Number(budgetMax),
          timePreference: slots,
          region,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(Array.isArray(data.message) ? data.message.join('; ') : (data.message ?? '发布失败'));
      }
      router.push(`/parent/request/${data.id}/matches`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发布失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-10">
        <Card title="发布辅导需求">
          <Form onSubmit={handleSubmit}>
            <Field label="孩子年级" name="childGrade" type="number" value={childGrade} onChange={(e) => setChildGrade(e.target.value)} required />
            <Field label="科目" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="如：数学" />
            <div className="flex gap-3">
              <Field label="预算下限（元/小时）" name="budgetMin" type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} required />
              <Field label="预算上限（元/小时）" name="budgetMax" type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} required />
            </div>
            <Field label="区域" name="region" value={region} onChange={(e) => setRegion(e.target.value)} required placeholder="如：思明区" />

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">期望时间</p>
              {slots.map((slot, index) => (
                <div key={index} className="mb-2 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500">星期</label>
                    <select
                      value={slot.day}
                      onChange={(e) => updateSlot(index, 'day', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                      {DAYS.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500">开始</label>
                    <input type="time" value={slot.start} onChange={(e) => updateSlot(index, 'start', e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500">结束</label>
                    <input type="time" value={slot.end} onChange={(e) => updateSlot(index, 'end', e.target.value)} className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSlot(index)} disabled={slots.length === 1}>
                    删除
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={addSlot}>
                + 添加时段
              </Button>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '发布中…' : '发布并查看匹配'}
            </Button>
          </Form>
        </Card>
      </main>
    </div>
  );
}
