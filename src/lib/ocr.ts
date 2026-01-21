export async function extractTextFromImage(buffer: Buffer) {
  const base64 = buffer.toString('base64');
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_AI_API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [{
        image: { content: base64 },
        features: [{ type: 'TEXT_DETECTION' }]
      }]
    })
  });
  
  const data = await response.json();
  return data.responses?.[0]?.fullTextAnnotation?.text || '';
}
