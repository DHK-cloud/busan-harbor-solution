# 부산항 해양 스마트 출장 솔루션

## 📦 배포 방법 (Vercel)

### 1단계: GitHub 리포지토리 생성
1. GitHub에 새 리포지토리 생성 (https://github.com/new)
2. 리포지토리 이름: `busan-harbor-solution`
3. Public 선택
4. Create repository 클릭

### 2단계: 파일 업로드
1. "Add file" → "Upload files" 클릭
2. 이 ZIP 파일의 모든 파일을 드래그 앤 드롭
3. Commit changes 클릭

### 3단계: Vercel 배포
1. https://vercel.com 접속 (GitHub 계정으로 로그인)
2. "New Project" 클릭
3. GitHub 리포지토리 선택
4. "Import" 클릭

### 4단계: 환경 변수 설정 ⚡ 중요!
1. Vercel 프로젝트 → Settings → Environment Variables
2. 변수 추가:
   - Name: `GEMINI_API_KEY`
   - Value: `AIzaSyANBmgEZCbtH5ZUWZtjjulKCGtTFsHBymw`
3. Save 클릭

### 5단계: 재배포
1. Deployments 탭으로 이동
2. 가장 최근 배포의 "..." 클릭
3. "Redeploy" 선택
4. ✅ 완료!

## 🎉 완성!
배포된 URL로 접속하면 모든 기능이 정상 작동합니다.

## 📞 문제 발생 시
F12 콘솔을 열어 에러 메시지를 확인하세요.
