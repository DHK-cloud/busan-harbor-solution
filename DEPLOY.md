# 🚀 배포 가이드

## 1️⃣ GitHub에 업로드
모든 파일을 업로드하세요.

## 2️⃣ Vercel 배포
1. https://vercel.com 접속
2. Import Project
3. GitHub 리포지토리 선택
4. Deploy 클릭

## 3️⃣ 환경 변수 설정 ⚡ 필수!
Settings → Environment Variables:
- Name: `GEMINI_API_KEY`
- Value: `AIzaSyANBmgEZCbtH5ZUWZtjjulKCGtTFsHBymw`
- Environments: 모두 체크

## 4️⃣ 재배포
Deployments → Redeploy

## ✅ 확인
F12 콘솔:
```
✓ 페이지 로드 완료
✓ 초기화 완료
✓ 지도 렌더링 완료
```

## 🆘 문제 해결
- "API key not configured" → 환경 변수 확인
- "renderMap is not defined" → 캐시 삭제 후 새로고침
- 지도 안 나옴 → index.html 파일 확인
