import { GoogleGenerativeAI } from '@google/generative-ai';

let model = null;

function getModel() {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }
  return model;
}

export async function generateWithGemini(prompt, fallback) {
  const m = getModel();
  if (!m) return fallback;
  try {
    const result = await m.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini error:', err.message);
    return fallback;
  }
}

export function parseJsonFromText(text) {
  const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
