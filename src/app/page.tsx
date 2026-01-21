'use client';

import { useState, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Mic, Camera, Sparkles, Lock, Brain } from 'lucide-react';
import toast from 'react-hot-toast';
import { NotePDF } from '@/components/NotePDF';

export default function Home() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading your Brainbind...</div>;
  }

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.current.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const base64 = await blobToBase64(blob);
      await processFile(base64, 'audio');
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result!.toString().split(',')[1]);
      reader.readAsDataURL(blob);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file, 'image');
  };

  const processFile = async (file: File | string, type: 'image' | 'audio') => {
    if (!session) return toast.error("Please sign in first!");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file as any);
    formData.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.error) toast.error(data.error);
    else {
      setResult(data);
      toast.success('Note saved!');
      fetchNotes();
    }
    setLoading(false);
  };

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto p-6 max-w-5xl">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Brainbind
            </h1>
            <p className="text-purple-300">Your second brain, powered by Gemini</p>
          </div>

          <div className="flex gap-4 items-center">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center gap-4">
                {session.user?.isPro ? (
                  <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full font-bold shadow-lg">
                    <Sparkles className="w-5 h-5" />
                    Pro Member
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      const res = await fetch('/api/create-checkout', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: session.user.id }),
                      });
                      const { url } = await res.json();
                      window.location.href = url;
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition transform"
                  >
                    Upgrade to Pro — $9/mo
                  </button>
                )}

                <button onClick={() => signOut()} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">
                  Sign Out
                </button>
              </div>
            ) : (
              <button onClick={() => signIn('google')} className="px-8 py-4 bg-violet-600 rounded-2xl font-bold text-xl hover:scale-105 transition">
                Start Free
              </button>
            )}
          </div>
        </header>

        {!session ? (
          <div className="text-center py-32">
            <h2 className="text-4xl mb-8">Welcome to your AI second brain</h2>
            <button onClick={() => signIn('google')} className="px-8 py-4 bg-violet-600 rounded-2xl text-xl font-bold hover:scale-105 transition">
              Start Free Trial
            </button>
          </div>
        ) : (
          <>
            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <label className="flex flex-col items-center justify-center h-48 bg-white/10 rounded-2xl cursor-pointer hover:bg-white/20 transition">
                <Camera className="w-12 h-12 mb-4" />
                <span className="text-xl">Photo of Notes</span>
                <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
              </label>

              <button
                onClick={recording ? stopRecording : startRecording}
                className={`flex flex-col items-center justify-center h-48 rounded-2xl transition ${recording ? 'bg-red-600 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <Mic className="w-12 h-12 mb-4" />
                <span className="text-xl">{recording ? 'Recording... Tap to Stop' : 'Voice Note'}</span>
              </button>

              {session?.user?.isPro ? (
                <button className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl cursor-pointer hover:scale-105 transition">
                  <Brain className="w-12 h-12 mb-4" />
                  <span className="text-xl font-bold">Auto Mind Map</span>
                  <span className="text-sm mt-2">Click to generate</span>
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
                  <Lock className="w-10 h-10 mb-3 opacity-60" />
                  <p className="font-bold">Auto Mind Maps</p>
                  <p className="text-sm opacity-75">Pro feature</p>
                </div>
              )}
            </div>

            {loading && <p className="text-center text-2xl py-12">AI is thinking...</p>}

            {result && (
              <div className="bg-white/10 backdrop-blur rounded-3xl p-8 mb-12">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-400" /> AI Summary
                </h3>
                <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.summary.replace(/\n/g, '<br>') }} />
              </div>
            )}

            <h2 className="text-3xl font-bold mb-6">Your Notes</h2>
            <div className="grid gap-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition relative group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm opacity-75">{format(new Date(note.created_at), 'MMM d, yyyy • h:mm a')}</p>
                      <p className="mt-3 text-lg leading-relaxed">{note.summary}</p>
                    </div>

                    <PDFDownloadLink
                      document={<NotePDF note={note} />}
                      fileName={`brainbind-note-${format(new Date(note.created_at), 'yyyy-MM-dd').pdf`}
                    >
                      {({ loading }) => (
                        <button
                          className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition ${
                            loading
                              ? 'bg-white/10 text-white/60'
                              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg hover:shadow-violet-500/25'
                          }`}
                          disabled={loading}
                        >
                          {loading ? 'Preparing...' : '↓ Export PDF'}
                        </button>
                      )}
                    </PDFDownloadLink>
                  </div>

                  {!note.is_pro && (
                    <div className="mt-4 text-xs opacity-60">
                      Upgrade to Pro for watermark-free PDFs
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
