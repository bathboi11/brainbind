import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { extractTextFromImage } from '@/lib/ocr';
import { summarizeWithGemini } from '@/lib/gemini';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file');
  const type = formData.get('type') as string;

  let text = '';
  if (type === 'image') {
    const buffer = Buffer.from(await (file as File).arrayBuffer());
    text = await extractTextFromImage(buffer);
  } else {
    text = await transcribeAudio(file as string);
  }

  const summary = await summarizeWithGemini(text);

  const { data } = await supabase
    .from('notes')
    .insert({
      user_id: (session.user as any).id,
      raw_text: text,
      summary,
      is_premium: (session.user as any).isPro,
    })
    .select()
    .select()
    .single();

  return NextResponse.json(data);
}