export default async function handler(req, res) {
  console.log('=== Gemini API Request ===');
  
  // CORS 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // POST만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // 요청에서 prompt 가져오기
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // 환경 변수에서 API 키 가져오기
    const apiKey = process.env.GEMINI_API_KEY;
    
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not set!');
      return res.status(500).json({ 
        error: 'API key not configured',
        message: 'Please set GEMINI_API_KEY in Vercel Environment Variables'
      });
    }
    
    // Gemini API 호출
    console.log('Calling Gemini API...');
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API failed: ${geminiResponse.status}`);
    }
    
    const data = await geminiResponse.json();
    
    // 결과 추출
    let result = 'No response';
    if (data.candidates && data.candidates[0]) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts[0]) {
        result = content.parts[0].text;
      }
    }
    
    console.log('✅ Success');
    
    return res.status(200).json({ 
      result,
      success: true 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      success: false
    });
  }
}
