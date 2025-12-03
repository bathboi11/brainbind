// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Voice → Text (used in upload/route.ts)
export async function transcribeAudio(base64Audio: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent([
    'Transcribe this audio exactly:',
    {
      inlineData: {
        data: base64Audio,
        mimeType: 'audio/webm',
      },
    },
  ]);

  return result.response.text();
}

// Photo/text → AI Summary
export async function summarizeWithGemini(text: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const result = await model.generateContent(
    `You are Brainbind AI. Turn these notes into a beautiful, structured summary with emojis and perfect formatting:\n\n${text}`
  );

  return result.response.text();
}
