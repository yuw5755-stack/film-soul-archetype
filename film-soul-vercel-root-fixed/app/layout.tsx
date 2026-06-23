import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: '寻找你的影视原型',
  description: '36题找到你的影视人格原型',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
