import { NextResponse } from 'next/server';

// In-memory cache for the serverless function lifetime
const memCache = new Map<string, { name: string; description: string }>();

async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text?.trim()) return text;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  const res = await fetch(url, { next: { revalidate: 86400 } }); // cache 24h at CDN level
  const data = await res.json();

  if (data.responseStatus === 200 && data.responseData?.translatedText) {
    return data.responseData.translatedText;
  }
  return text; // fallback to original
}

export async function POST(request: Request) {
  try {
    const { productId, name, description, targetLang } = await request.json();

    if (!name || !targetLang) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sourceLang = targetLang === 'en' ? 'ru' : 'en';
    const cacheKey = `${productId}_${targetLang}`;

    // Server-side memory cache hit
    if (memCache.has(cacheKey)) {
      return NextResponse.json(memCache.get(cacheKey), {
        headers: { 'X-Cache': 'HIT' },
      });
    }

    // Translate name and description in parallel
    const [translatedName, translatedDesc] = await Promise.all([
      translateText(name, sourceLang, targetLang),
      translateText(description || '', sourceLang, targetLang),
    ]);

    const result = { name: translatedName, description: translatedDesc };

    // Store in server memory cache
    memCache.set(cacheKey, result);

    return NextResponse.json(result, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=86400', // browser cache 24h
      },
    });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
