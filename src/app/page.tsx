'use client';

import { useState, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NotePDF } from '@/components/NotePDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Mic, Camera, Sparkles, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const { data: session, status } = useSession();
if (status === 'loading') {
  return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
}
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => { /* same as before */ };
  const stopRecording = () => { /* same */ };
  const handleImage = async (e: any) => { /* same */ };

  return (
    <main className="min-h-screen text-white">
      <div className="container mx-auto p-6 max-w-5xl">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Brainbind
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            {/* Upgrade / Sign in buttons from previous message */}
          </div>
        </header>

        {/* Rest of UI with PDF export button in notes list */}
      </div>
    </main>
  );
}
