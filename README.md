# Helpie - 해외 생활자들의 글로벌 커뮤니티 플랫폼
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/29f916f0-e8ad-4634-851a-3f805d65f364" />

> SWYP Web 11기 프로젝트 1팀 <br>
> **기획 및 개발 기간** : 25.10 ~ 25.11 <br>
> **유지보수 및 고도화** : 25.11 ~ 25.11

<br>

## 프로젝트 소개
HELPie는 전 세계 해외 생활자들이 서로의 경험과 정보를 나누며,
더 쉽고 따뜻하게 정착할 수 있도록 돕는 글로벌 커뮤니티 플랫폼입니다.


> 내가 원하는 소모임을 개설할 수 있습니다.
>
> 소모임 가입을 통해 소모임원들과 실시간 채팅을 할 수 있습니다.
>
> 소모임 진행 후 후기를 남길 수 있습니다.
>

**Heplie**는 **해외 생활자들이 따뜻한 정착**을 목표로, 소모임을 창설하고 서로 정보를 공유할 수 있도록 돕습니다.

[⭐ [Helpie] 이용하기](https://helpie-main.vercel.app/)

<br>

## 👥 팀원 소개

| 이름 | 역할 | 주요 담당 기능 |
|------|------|----------------|
| **김민희** | Frontend Developer | 소모임 시스템, 서비스 소개 페이지, 커뮤니티 게시판, 고객센터 |
| **박지원** | Frontend Developer | 실시간 채팅, 알림 시스템, 로그인/회원가입, 마이페이지 |

<br>

## 🚀 주요 기능

### 💬 실시간 채팅
- **WebSocket 기반 실시간 통신**: STOMP 프로토콜과 SockJS를 활용한 안정적인 실시간 메시징
- **소모임별 채팅방**: 참여한 소모임마다 전용 채팅방 제공
- **자동 재연결**: 네트워크 끊김 시 자동으로 연결 복구 (최대 5회 재시도)
- **Optimistic UI**: 메시지 전송 즉시 화면에 반영하여 빠른 사용자 경험 제공
- **무한 스크롤**: 이전 채팅 기록을 페이징으로 불러오는 성능 최적화
- **중복 방지**: 네트워크 오류로 인한 중복 메시지 자동 필터링

### 👥 소모임 생성 및 관리
- **18개 관심사 카테고리**: 영화, 스포츠, 음악, 미술, 요리, 여행, 독서, 게임, 피트니스, 사진, 언어, 공부, 봉사 등
- **소모임 생성**: 멀티 이미지 업로드 지원으로 매력적인 소모임 홍보
- **맞춤 추천 시스템**: 사용자 관심사 및 위치 기반 개인화 추천
- **실시간 가입 관리**: 소모임 신청, 취소 확인
- **북마크 기능**: 관심 소모임 저장 및 관리

### 🔐 사용자 인증 및 프로필 관리
- **다양한 로그인 방식**: 소셜 로그인 (Google, Kakao) 및 이메일 인증 로그인
- **안전한 인증**: 이메일 인증번호 검증 및 토큰 기반 보안
- **개인화 프로필**: 프로필 이미지, 별명, 나이대, 성별, 언어, 관심사 설정
- **중복 방지**: 별명(Username) 실시간 중복 체크

### 🚪 사용자 여정 및 접근 제어
- **3단계 접근 권한 시스템**: 비로그인 → 로그인 → 설문완료 단계별 페이지 접근 제어
- **스마트 온보딩**: 신규 사용자는 5단계 설문조사를 통한 맞춤형 프로필 구성
- **보안 강화된 인증**: 미들웨어 기반 토큰 검증 + 30분 주기 자동 토큰 갱신
- **개인화된 사용자 경험**: 설문조사 데이터 기반 AI 추천 시스템 활성화

#### 📋 사용자 상태별 접근 권한
| 사용자 상태 | 접근 가능 페이지 | 제한 기능 |
|------------|-----------------|-------------|
| **비로그인** | 홈, 소개, 커뮤니티 (읽기), 고객센터 | 채팅, 소모임 생성, 마이페이지, 알림 |
| **로그인 (설문 전)** | 모든 페이지 접근 가능 | **맞춤 추천 캐러셀만 잠금** (일반 소모임 목록은 이용 가능) |
| **로그인 (설문 후)** | 모든 페이지 및 기능 | 제한 없음 |

### 🌍 위치 기반 서비스
- **글로벌 대응**: 전 세계 국가 및 도시 데이터베이스
- **지역별 소모임**: 거주 지역 기반 소모임 필터링 및 추천

### ⭐ 후기 및 평점 시스템
- **상세한 후기 작성**: 텍스트 + 이미지로 생생한 소모임 경험 공유
- **익명 후기 옵션**: 솔직한 피드백을 위한 익명 작성 선택
- **평점 시스템**: 소모임 만족도를 별점으로 평가
- **공개 열람**: 비로그인 사용자도 후기 확인 가능

### 🔔 실시간 알림 시스템
- **WebSocket 기반 실시간 알림**: STOMP 프로토콜 활용한 즉시 알림 전달
- **다양한 알림 타입**: 소모임 승인, 채팅 메시지, 커뮤니티 반응 등
- **알림 설정 관리**: 개인 맞춤형 알림 on/off 설정
- **읽음 상태 관리**: 읽지 않은 알림 개수 실시간 표시

### 📝 커뮤니티 게시판
- **카테고리별 게시판**: 정보공유, 자유게시판으로 구분된 커뮤니티
- **멀티미디어 지원**: 최대 4개 이미지와 함께 풍부한 게시글 작성
- **실시간 인기글**: 좋아요 기반 실시간 인기 콘텐츠 노출
- **검색 및 필터링**: 키워드 및 카테고리별 게시글 검색

### 🔍 스마트 검색 및 필터링
- **통합 검색**: 소모임, 커뮤니티 게시글 통합 검색
- **다중 필터링**: 국가, 카테고리, 키워드 조합 검색
- **페이징 최적화**: 대량 데이터 효율적 로딩

### 📱 마이페이지 및 활동 관리
- **내 활동 한눈에**: 참여 소모임, 작성 후기, 커뮤니티 글 통합 관리
- **소모임 상태별 정리**: 가입중, 신청중, 완료된 소모임 분류 조회
- **북마크 관리**: 관심 소모임 및 게시글 저장 및 관리



<br>

## 🛠 기술스택

<table>
<tr>
 <td align="center">프레임워크</td>
 <td>
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">언어</td>
 <td>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">스타일링</td>
 <td>
  <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">상태관리</td>
 <td>
  <img src="https://img.shields.io/badge/TanStack%20Query-FF4154?style=for-the-badge&logo=ReactQuery&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Zustand-EA5A47?style=for-the-badge&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">API 통신</td>
 <td>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">실시간 통신</td>
 <td>
  <img src="https://img.shields.io/badge/STOMP-FF6600?style=for-the-badge&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/SockJS-FF6600?style=for-the-badge&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/WebSocket-FF6600?style=for-the-badge&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">패키지 매니저</td>
 <td>
  <img src="https://img.shields.io/badge/npm-cb3837?style=for-the-badge&logo=npm&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">배포</td>
 <td>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"/>&nbsp
 </td>
</tr>
<tr>
 <td align="center">협업 도구</td>
 <td>
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>&nbsp
  <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"/>&nbsp
 </td>
</tr>
</table>

<br>



## 🏗 프로젝트 구조

```
helpie-frontend/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (private)/                # 인증 필요 페이지 그룹
│   │   ├── chat/                    # 💬 채팅 페이지
│   │   ├── my-page/                 # 📱 마이페이지
│   │   ├── new-user-info/           # 📝 설문조사 페이지
│   │   └── alert/                   # 🔔 알림 페이지
│   │
│   ├── 📁 (public)/                 # 공개 페이지 그룹
│   │   ├── auth/callback/           # 🔐 소셜 로그인 콜백
│   │   └── login-error/             # ❌ 로그인 오류 페이지
│   │
│   ├── 📁 api/                      # API 레이어
│   │   ├── auth/                    # 인증 API
│   │   ├── chat/                    # 채팅 API
│   │   ├── matching/                # 소모임 API
│   │   ├── community/               # 커뮤니티 API
│   │   ├── notification/            # 알림 API
│   │   └── types/                   # TypeScript 타입 정의
│   │
│   ├── 📁 components/               # 컴포넌트
│   │   ├── common/                  # 공통 컴포넌트
│   │   ├── chat/                    # 채팅 컴포넌트
│   │   ├── matching/                # 소모임 관련 컴포넌트
│   │   ├── my-page/                 # 마이페이지 컴포넌트
│   │   └── domain/                  # 도메인별 컴포넌트
│   │
│   ├── 📁 hooks/                    # Custom Hooks
│   │   ├── auth/                    # 인증 관련 훅
│   │   ├── chat/                    # 채팅 관련 훅
│   │   ├── matching/                # 소모임 관련 훅
│   │   └── notification/            # 알림 관련 훅
│   │
│   ├── 📁 lib/                      # 유틸리티 & 설정
│   │   ├── config/                  # 환경 설정
│   │   ├── stores/                  # Zustand 상태 관리
│   │   ├── utils/                   # 유틸리티 함수
│   │   └── websocket/               # WebSocket 클래스
│   │
│   ├── 📁 fonts/                    # 폰트 파일
│   ├── layout.tsx                   # 루트 레이아웃
│   ├── page.tsx                     # 홈 페이지
│   └── globals.css                  # 전역 스타일
│
├── 📁 .storybook/                   # Storybook 설정
├── 📄 middleware.ts                 # Next.js 미들웨어
├── 📄 package.json                  # 프로젝트 설정
├── 📄 tailwind.config.ts            # Tailwind CSS 설정
├── 📄 next.config.mjs               # Next.js 설정
├── 📄 ENV_SETUP.md                  # 환경변수 설정 가이드
└── 📄 README.md                     # 프로젝트 문서
```




