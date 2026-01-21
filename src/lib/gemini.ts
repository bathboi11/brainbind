import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function transcribeAudio(base64Audio: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([
    'Transcribe this audio exactly. Keep all filler words and pauses natural.',
    {
      inlineData: {
        data: base64Audio,
        mimeType: 'audio/webm',
      },
    },
  ]);
  return result.response.text();
}

export async function summarizeWithGemini(text: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const result = await model.generateContent(
    `Summarize these notes in clear bullet points with emojis and hierarchy:\n\n${text}`
  );
  return result.response.text();
}
