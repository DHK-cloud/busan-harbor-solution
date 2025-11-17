export default async function handler(req, res) {
  console.log('=== Gemini API Request ===');

  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required', result: null, success: false });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);

    if (!apiKey) {
      return res.status(500).json({
        error: 'API key not configured',
        result: null,
        success: false
      });
    }

    // ❗❗ 여기 URL을 정확히 이렇게 사용해야 합니다
    const url =
      `https://generativelanguage.googleapis.com/` +
      `v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    // 또는 구버전:
    // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

    console.log('Calling Gemini API...');

    const geminiResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    console.log('Gemini status:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini error body:', errorText);

      return res.status(500).json({
        error: 'Gemini API failed',
        status: geminiResponse.status,
        message: errorText,
        result: null,
        success: false
      });
    }

    const data = await geminiResponse.json();
    console.log('Gemini response received');

    let result = 'No response';
    if (
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0]
    ) {
      result = data.candidates[0].content.parts[0].text;
    }

    return res.status(200).json({
      result,
      success: true
    });
  } catch (error) {
    console.error('Internal error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      result: null,
      success: false
    });
  }
}
