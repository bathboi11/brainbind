import vision from '@google-cloud/vision';
const client = new vision.ImageAnnotatorClient({ apiKey: process.env.GOOGLE_AI_API_KEY });

export async function extractTextFromImage(buffer: Buffer) {
  const [result] = await client.textDetection(buffer);
  return result.textAnnotations?.[0]?.description || '';
}