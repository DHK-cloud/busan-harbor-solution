export default function handler(req, res) {
  // CORS 허용
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // 환경 변수에서 API 키 가져오기
  const apiKey = process.env.GEMINI_API_KEY || '';

  res.status(200).json({
    apiKey: apiKey
  });
}
