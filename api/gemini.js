export default async function handler(req, res) {
  console.log('=== Gemini API Proxy 시작 ===');
  console.log('Method:', req.method);

  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS 요청 처리');
    return res.status(200).end();
  }

  // POST만 허용
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed', success: false });
  }

  try {
    // Body 파싱
    const { prompt } = req.body;
    console.log('Prompt 길이:', prompt ? prompt.length : 0);

    if (!prompt) {
      console.error('Prompt가 없음');
      return res.status(400).json({ error: 'Prompt is required', success: false });
    }

    // 환경 변수에서 API 키 가져오기
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key 확인:', apiKey ? '존재함 (길이: ' + apiKey.length + ')' : '없음');

    if (!apiKey) {
      console.error('GEMINI_API_KEY 환경 변수가 설정되지 않음');
      return res.status(500).json({ 
        error: 'API key not configured in environment variables',
        success: false,
        hint: 'Vercel Settings → Environment Variables에서 GEMINI_API_KEY 확인'
      });
    }

    // Gemini API 호출
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    console.log('Gemini API 호출 중...');

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    console.log('Gemini 응답 상태:', geminiResponse.status);

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API 오류:', errorText);
      return res.status(geminiResponse.status).json({ 
        error: 'Gemini API failed',
        details: errorText,
        success: false
      });
    }

    const data = await geminiResponse.json();
    console.log('Gemini 응답 받음');

    // 응답 추출
    let result = null;

    if (data.candidates && data.candidates[0]) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts[0]) {
        result = content.parts[0].text;
        console.log('결과 추출 성공 (길이:', result.length, ')');
      }
    }

    if (!result) {
      console.error('결과를 추출할 수 없음');
      return res.status(500).json({ 
        error: 'No result from Gemini',
        success: false 
      });
    }

    console.log('=== 성공적으로 완료 ===');

    return res.status(200).json({ 
      result: result,
      success: true
    });

  } catch (error) {
    console.error('=== 에러 발생 ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);

    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      success: false
    });
  }
}
