# 🔒 보안 배포 가이드

## ✅ 환경 변수 설정 확인
이미 설정하셨습니다:
- Name: `GEMINI_API_KEY`
- Value: `AIzaSyANBmgEZCbtH5ZUWZtjjulKCGtTFsHBymw`
- Environments: All ✅

## 🚀 배포 단계

### 1. GitHub에 파일 업로드
모든 파일을 업로드하세요:
- index.html
- api/gemini.js
- vercel.json
- package.json

### 2. Vercel 재배포 ⚡ 중요!
환경 변수를 설정한 후 **반드시 재배포**해야 합니다:
1. Vercel 대시보드 → Deployments
2. 가장 최근 배포 → ... 메뉴
3. "Redeploy" 클릭
4. 1-2분 대기

### 3. 확인
F12 Console에서:
```
🔒 서버에 AI 분석 요청 중...
✓ 서버로부터 AI 응답 받음
```

## 🔍 디버깅

### Vercel 로그 확인
1. Vercel 대시보드 → Deployments
2. 최근 배포 클릭
3. "Functions" 탭
4. "/api/gemini" 클릭
5. 로그 확인:
   - "API Key 확인: 존재함" ✅
   - "Gemini 응답 받음" ✅

### 에러가 나면
- "API key not configured" → 재배포 필요
- "Method not allowed" → POST 요청 확인
- "Gemini API failed" → API 키 값 확인

## 💡 작동 방식
```
브라우저 → /api/gemini (Vercel) → Gemini API
         (API 키 없음)      (환경 변수 사용)
```

## 🔐 보안
✅ API 키가 코드에 없음
✅ 브라우저에서 확인 불가능
✅ 환경 변수로만 관리
