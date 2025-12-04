// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Providers from '@/components/providers';  // ← New client wrapper
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);  // ← Fetch on server

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>  // ← Pass session to client wrapper
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
