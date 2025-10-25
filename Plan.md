# 학급 중고마켓 앱 개발 계획 (1일 완성)

## 프로젝트 개요
- **프로젝트명**: Vibe (학급 중고마켓)
- **기술 스택**: React + Firebase
- **Firebase 프로젝트**: class-carrot
- **목표**: 당일 완성 가능한 MVP

---

## 핵심 기능 (MVP)

### 1. 사용자 인증
- [ ] Google 소셜 로그인 (Firebase Authentication)
- [ ] 학급 인증 (특정 도메인 이메일만 허용 가능)
- [ ] 로그인/로그아웃 기능

### 2. 상품 관리
- [ ] 상품 목록 조회 (카드 그리드 레이아웃)
- [ ] 상품 상세 보기
- [ ] 상품 등록 (제목, 설명, 가격, 이미지 1장)
- [ ] 내가 등록한 상품 수정/삭제

### 3. 이미지 처리
- [ ] Firebase Storage에 이미지 업로드
- [ ] 이미지 미리보기
- [ ] 썸네일 생성 (선택사항)

### 4. 기본 UI
- [ ] 반응형 디자인 (모바일 우선)
- [ ] 네비게이션 바
- [ ] 검색 기능 (제목/설명 기반)

---

## 기술 구성

### Frontend
- **React** (Create React App 또는 Vite)
- **React Router** (페이지 라우팅)
- **CSS Framework**: Tailwind CSS 또는 Material-UI (빠른 개발)
- **상태 관리**: React Context API (간단한 전역 상태)

### Backend (Firebase)
- **Authentication**: Google 로그인
- **Firestore Database**: 상품 데이터 저장
  ```
  products/
    - id (자동생성)
    - title (string)
    - description (string)
    - price (number)
    - imageUrl (string)
    - sellerId (string)
    - sellerName (string)
    - status (string: available, sold)
    - createdAt (timestamp)
    - updatedAt (timestamp)
  ```
- **Storage**: 상품 이미지 저장
- **Security Rules**: 본인만 수정/삭제 가능

---

## 시간별 개발 일정 (8시간 기준)

### Phase 1: 프로젝트 셋업 (1시간)
- [ ] React 프로젝트 생성 (Vite 추천)
- [ ] Firebase SDK 설치 및 설정
- [ ] Firebase 프로젝트 초기화 (Firestore, Storage, Auth)
- [ ] 기본 폴더 구조 생성
- [ ] Tailwind CSS 또는 UI 라이브러리 설정

### Phase 2: Firebase 연동 (1시간)
- [ ] Firebase config 설정
- [ ] Authentication 설정 (Google 로그인)
- [ ] Firestore 초기 설정
- [ ] Storage 설정

### Phase 3: 인증 구현 (1.5시간)
- [ ] 로그인 페이지 UI
- [ ] Google 로그인 기능
- [ ] 사용자 상태 관리 (Context API)
- [ ] 로그아웃 기능
- [ ] Protected Routes

### Phase 4: 상품 목록 및 조회 (1.5시간)
- [ ] 상품 목록 페이지 UI (카드 레이아웃)
- [ ] Firestore에서 상품 데이터 가져오기
- [ ] 실시간 업데이트 (onSnapshot)
- [ ] 상품 상세 페이지 UI 및 기능

### Phase 5: 상품 등록 (2시간)
- [ ] 상품 등록 폼 UI
- [ ] 이미지 업로드 기능 (Storage)
- [ ] Firestore에 상품 데이터 저장
- [ ] 폼 유효성 검사
- [ ] 로딩 상태 및 에러 처리

### Phase 6: 상품 수정/삭제 (1시간)
- [ ] 본인 상품 확인 로직
- [ ] 수정 기능 (기존 데이터 로드)
- [ ] 삭제 기능 (Storage 이미지도 삭제)

### Phase 7: 마무리 및 테스트 (1시간)
- [ ] 검색 기능 구현
- [ ] 상품 상태 변경 (판매완료 처리)
- [ ] 반응형 디자인 최적화
- [ ] Security Rules 작성 및 배포
- [ ] 기본 테스트 및 버그 수정

---

## 폴더 구조 (예시)

```
vibe/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── CreateProduct.jsx
│   │   └── MyProducts.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── firebase/
│   │   └── config.js
│   ├── hooks/
│   │   └── useProducts.js
│   ├── utils/
│   │   └── imageUpload.js
│   ├── App.jsx
│   └── main.jsx
├── firebase.json
├── firestore.rules
├── storage.rules
└── package.json
```

---

## Firestore Security Rules (초안)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      // 모든 사람이 읽을 수 있음
      allow read: if true;

      // 로그인한 사용자만 생성 가능
      allow create: if request.auth != null;

      // 본인만 수정/삭제 가능
      allow update, delete: if request.auth != null
        && request.auth.uid == resource.data.sellerId;
    }
  }
}
```

---

## Storage Security Rules (초안)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{userId}/{allPaths=**} {
      // 모든 사람이 읽을 수 있음
      allow read: if true;

      // 본인 폴더에만 쓰기 가능
      allow write: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

---

## 후속 개선 사항 (2차 개발)

- [ ] 댓글/채팅 기능
- [ ] 찜하기 기능
- [ ] 카테고리 분류
- [ ] 가격 협상 기능
- [ ] 알림 기능 (FCM)
- [ ] 이미지 다중 업로드
- [ ] 사용자 프로필 페이지
- [ ] 거래 후기/평점 시스템
- [ ] PWA 변환 (모바일 앱처럼 사용)

---

## 시작하기

1. **React 프로젝트 생성**
   ```bash
   npm create vite@latest . -- --template react
   npm install
   ```

2. **Firebase SDK 설치**
   ```bash
   npm install firebase
   ```

3. **UI 라이브러리 설치 (선택)**
   ```bash
   # Tailwind CSS
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

   # 또는 Material-UI
   npm install @mui/material @emotion/react @emotion/styled
   ```

4. **라우터 설치**
   ```bash
   npm install react-router-dom
   ```

5. **Firebase 초기화**
   - Firebase Console에서 Web 앱 추가
   - Config 정보 복사하여 설정
   - Firestore, Storage, Authentication 활성화

---

## 성공 기준

✅ 사용자가 로그인할 수 있다
✅ 상품을 등록할 수 있다 (이미지 포함)
✅ 전체 상품 목록을 볼 수 있다
✅ 상품 상세 정보를 볼 수 있다
✅ 본인이 등록한 상품을 수정/삭제할 수 있다
✅ 모바일에서도 정상적으로 작동한다

---

**시작 시간**: ___________
**완료 목표 시간**: ___________
**실제 완료 시간**: ___________
