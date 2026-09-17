'use client';

import { useParams } from 'next/navigation';

import ChatBox from '@/components/ChatBox';
import Navbar from '@/components/Navbar';

export default function ChatPage() {
  const params = useParams<{ userId: string }>();
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">对话</h1>
        <ChatBox otherUserId={params.userId} />
      </main>
    </div>
  );
}
