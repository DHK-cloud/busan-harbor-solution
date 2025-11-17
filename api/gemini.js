export default async function handler(req, res) {
  console.log('=== Gemini API Request ===');
  
  // CORS
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
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured'
      });
    }
    
    // ⚡ 정확한 Gemini API URL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    console.log('Calling Gemini API...');
    console.log('URL:', url.replace(apiKey, 'HIDDEN'));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });
    
    console.log('Gemini response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini error:', errorText);
      return res.status(500).json({ 
        error: 'Gemini API failed',
        status: response.status,
        message: errorText,
        success: false
      });
    }
    
    const data = await response.json();
    console.log('Gemini response received');
    
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
