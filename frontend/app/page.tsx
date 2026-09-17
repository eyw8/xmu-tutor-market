import Link from 'next/link';

import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900">XMU Tutor Market</h1>
        <p className="mt-4 text-lg text-gray-600">厦门大学校园教育服务撮合平台</p>
        <p className="mt-1 text-sm text-gray-500">连接厦大学子与小学、初中、高中家庭 · 不收取中介费</p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register/student"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700"
          >
            我是学生 · 注册
          </Link>
          <Link
            href="/register/parent"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-gray-700"
          >
            我是家长 · 注册
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          已有账号？{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            去登录
          </Link>
        </p>
      </main>
    </div>
  );
}
