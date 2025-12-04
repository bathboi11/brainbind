// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';  // ← ADD THIS
import { ThemeProvider } from '@/components/theme-provider';  // ← If you have this, otherwise remove
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>  // ← WRAP EVERYTHING IN THIS
          <ThemeProvider attribute="class" defaultTheme="dark">  // ← Optional
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
