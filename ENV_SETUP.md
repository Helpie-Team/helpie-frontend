# 환경 변수 설정 가이드

## .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수들을 설정하세요:

```bash
# API 설정
NEXT_PUBLIC_API_BASE_URL=http://49.50.132.119:8080/api/v1
NEXT_PUBLIC_API_TIMEOUT=10000
NEXT_PUBLIC_API_SOCKET_URL=wss://helpie.duckdns.org/ws/chat

# Google OAuth 설정
NEXT_PUBLIC_GOOGLE_CLIENT_ID=611533793095-9i01qb97imtjetpse05b186qu9f5h46o.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_GOOGLE_SCOPE=openid email profile
NEXT_PUBLIC_GOOGLE_AUTH_URL=https://accounts.google.com/o/oauth2/v2/auth

# Kakao OAuth 설정
NEXT_PUBLIC_KAKAO_CLIENT_ID=your_kakao_client_id
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/auth/callback
NEXT_PUBLIC_KAKAO_AUTH_URL=https://kauth.kakao.com/oauth/authorize

# 환경 설정
NODE_ENV=development
```

## 환경 변수 설명

### API 설정
- `NEXT_PUBLIC_API_BASE_URL`: 백엔드 API 기본 URL
- `NEXT_PUBLIC_API_TIMEOUT`: API 요청 타임아웃 (밀리초)
- `NEXT_PUBLIC_API_SOCKET_URL`: WebSocket 연결 URL (설정하지 않으면 NEXT_PUBLIC_API_BASE_URL 기반으로 자동 생성)

### Google OAuth 설정
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth 클라이언트 ID
- `NEXT_PUBLIC_GOOGLE_REDIRECT_URI`: OAuth 리다이렉트 URI
- `NEXT_PUBLIC_GOOGLE_SCOPE`: OAuth 요청 스코프
- `NEXT_PUBLIC_GOOGLE_AUTH_URL`: Google OAuth 인증 URL

### Kakao OAuth 설정
- `NEXT_PUBLIC_KAKAO_CLIENT_ID`: Kakao OAuth 클라이언트 ID
- `NEXT_PUBLIC_KAKAO_REDIRECT_URI`: OAuth 리다이렉트 URI
- `NEXT_PUBLIC_KAKAO_AUTH_URL`: Kakao OAuth 인증 URL

### 환경 설정
- `NODE_ENV`: 실행 환경 (development, production, test)

## 주의사항

1. `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
2. `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트 사이드에서 사용할 수 있습니다.
3. 환경 변수가 설정되지 않은 경우 기본값이 사용됩니다.
