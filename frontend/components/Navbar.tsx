'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-gray-900">
          XMU Tutor Market
        </Link>
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <Link href="/messages" className="text-sm text-gray-700 hover:text-blue-600">
                我的消息
              </Link>
              <button type="button" onClick={logout} className="text-sm text-gray-700 hover:text-blue-600">
                退出登录
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600">
                登录
              </Link>
              <Link href="/register/student" className="text-sm text-gray-700 hover:text-blue-600">
                学生注册
              </Link>
              <Link href="/register/parent" className="text-sm text-gray-700 hover:text-blue-600">
                家长注册
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
