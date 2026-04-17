import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, description, targetLang } = await request.json();

    if (!name || (!description && description !== '') || !targetLang) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sourceLang = targetLang === 'en' ? 'ru' : 'en';

    // Helper to translate single string
    const translateString = async (text: string) => {
      if (!text) return text;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.responseData) {
        return data.responseData.translatedText;
      }
      return text;
    };

    const [translatedName, translatedDesc] = await Promise.all([
      translateString(name),
      translateString(description)
    ]);

    return NextResponse.json({ 
      name: translatedName, 
      description: translatedDesc 
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
