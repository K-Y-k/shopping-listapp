# 🛒 쇼핑 리스트 앱

바닐라 JS로 만든 쇼핑 리스트 웹 앱입니다. Playwright E2E 테스트가 포함되어 있습니다.

## 기능

### 아이템 관리
- **아이템 추가** — 입력창에 텍스트 입력 후 `추가` 버튼 클릭 또는 `Enter` 키로 추가
- **최신순 정렬** — 새로 추가한 아이템이 항상 목록 맨 위에 표시
- **빈 입력 방지** — 공백만 입력한 경우 추가되지 않음

### 체크 / 완료
- **체크박스 클릭** 또는 **아이템 텍스트 클릭**으로 완료 상태 토글
- 완료된 아이템은 취소선과 흐린 색상으로 표시
- 상단 통계 영역에 `총 N개 · 완료 N개` 실시간 표시

### 삭제
- 각 아이템의 `✕` 버튼으로 개별 삭제
- `완료 항목 삭제` 버튼으로 체크된 아이템 일괄 삭제

### 데이터 영속성
- `localStorage`에 자동 저장 — 페이지를 새로고침해도 목록 유지

### 접근성
- 스크린 리더를 위한 `aria-label` 및 `sr-only` 레이블 적용
- 키보드 탐색 및 `focus-visible` 스타일 지원

---

## 테스트

[Playwright](https://playwright.dev/)를 사용한 E2E 테스트 13개가 포함되어 있습니다.

| 카테고리 | 테스트 항목 |
|---|---|
| 초기 상태 | 빈 상태 메시지 표시, 통계 숨김 |
| 추가 | 버튼 클릭 추가, Enter 키 추가, 최신순 정렬, 빈 입력 방지 |
| 체크 | 체크박스 토글, 텍스트 클릭 토글, 완료 카운트 정확성 |
| 삭제 | 개별 삭제, 선택 삭제 후 나머지 유지 |
| 일괄 삭제 | 완료 항목만 삭제 |
| 저장 | 새로고침 후 데이터 유지 |
| 접근성 | 삭제 버튼 aria-label 확인 |

### 테스트 실행

```bash
# 의존성 설치
npm install

# Playwright 브라우저 설치
npx playwright install chromium

# 테스트 실행
npm test
```

---

## 프로젝트 구조

```
shopping-listapp/
├── shopping-list.html      # 앱 본체 (HTML + CSS + JS)
├── shopping-list.test.js   # Playwright E2E 테스트
├── playwright.config.js    # Playwright 설정
└── package.json
```

## 기술 스택

- **Frontend** — HTML5, CSS3, Vanilla JavaScript
- **저장소** — Web Storage API (localStorage)
- **테스트** — Playwright
