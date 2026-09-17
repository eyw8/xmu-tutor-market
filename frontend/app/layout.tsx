import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'XMU Tutor Market',
  description: '厦门大学校园教育服务撮合平台',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
