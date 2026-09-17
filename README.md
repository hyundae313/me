# hyundae — 개인 페이지 + 개발자 페이지

React 19 + Vite. 한 프로젝트 안에 성격이 다른 두 페이지가 있습니다.

| 경로 | 성격 | 내용 파일 | 화면 코드 |
| --- | --- | --- | --- |
| `/` | **개인용** — 스토리텔링, 소개 (따뜻한 필름 감성) | `src/data/personal.js` | `src/personal/` |
| `/dev` | **개발자용** — 이력·포트폴리오 (다크 네온) | `src/data/profile.js` | `src/pages/DevPage.jsx`, `src/components/` |

```bash
npm run dev      # http://localhost:5173  (개인) · /dev (개발자)
npm run build
npm run preview
npm run lint
```

라우터는 의존성 없이 `src/lib/useRoute.js` 로 직접 만들었습니다.
정적 호스팅에서 `/dev` 를 새로고침해도 404가 나지 않도록 `public/_redirects`(Netlify)와
`vercel.json`(Vercel)을 넣어뒀습니다. GitHub Pages 는 배포 과정에서
`index.html` 을 `404.html` 로 복사해 같은 역할을 합니다.

**배포·작업 방법은 [`docs/`](docs/) 에 정리해 뒀습니다.**
`main` 에 푸시하면 GitHub Actions 가 빌드해 <https://ryankim.kr/> 에 자동 반영됩니다.

---

## 1. 개인 페이지 (`/`)

`src/data/personal.js` 한 파일이 전부입니다.

| 항목 | 키 |
| --- | --- |
| 이름 · 인사말 · 첫인상 문장 · 명함 정보 | `me` |
| 살아온 이야기 (6개 챕터) | `story.chapters` |
| 요즘의 나 · 일상 + 사진 4장 | `days` |
| 좋아하는 것들 + 짧은 문답 | `likes` |
| 가치관 · 마무리 편지 | `values` |

### ✏️ 채워야 할 곳

파일 안에 `// ✏️` 주석으로 표시해뒀습니다. 지금 상태로도 화면은 완성돼 있지만,
아래는 제가 대신 채운 자리라 **실제 내용으로 바꿔야** 합니다.

- `me.facts` — 나이, MBTI
- `story.chapters[2]` (샌디에이고) — 두 번째 문단은 제 상상입니다
- `story.chapters[4]` — `2017 — 2022` 연도를 실제에 맞게
- `days.body` — 하루 루틴 두 문단
- `days.photos[].caption`
- **`likes` 전체** — 음악·영화·음식·여행·책, 그리고 문답 4개. 취향이 사람을 제일 잘 보여주는 부분이라 여기가 제일 중요합니다
- `values.beliefs[3]` — '오래 가는 것' 문단

살아온 이야기(`story`)의 나머지는 주신 이력을 옮긴 것이라 사실이지만,
문장 톤은 편하게 고치셔도 됩니다.

### 사진

`public/images/personal/` 안의 파일을 같은 이름으로 교체하면 됩니다. (현재는 임시 SVG)

```
portrait.svg        메인 프로필 사진 (세로 3:4 권장)
story-1 ~ story-6   살아온 이야기 챕터별 사진 (가로 4:3)
day-1 ~ day-4       요즘의 나 갤러리 (정사각형)
```

JPG로 바꿀 때는 `src/data/personal.js` 의 경로 확장자도 함께 바꿔주세요.
사진에는 자동으로 필름 톤(채도 -8%, 대비 +2%)과 인화지 프레임, 미세한 기울기가 들어갑니다.

### 폰트

`src/personal/PersonalPage.jsx` 의 `FONTS` 상수 한 줄과
`src/personal/personal.css` 상단의 `--f-title` / `--f-body` / `--f-latin` 토큰에서 바꿉니다.

| 용도 | 폰트 |
| --- | --- |
| 제목 · 이름 | **고운바탕 (Gowun Batang)** — 손편지 같은 따뜻한 국문 명조 |
| 본문 | **Noto Serif KR** — 명조 결을 잇되 길게 읽어도 편함 |
| 연도 · 캡션 | **EB Garamond Italic** — 필름 사진 캡션 느낌 |

색도 같은 파일 맨 위 토큰에서 바꿉니다. (크림 `--bg`, 테라코타 `--accent`, 올리브 `--accent-2`)

---

## 2. 개발자 페이지 (`/dev`)

`src/data/profile.js` 한 파일. 텍스트는 `t('한국어', 'English')` 형태로 KO/EN 토글에 반영됩니다.

| 항목 | 키 |
| --- | --- |
| 이름 · 직함 · 연락처 · SNS | `profile` |
| 자기소개 · 숫자 지표 | `about` |
| 기술 스택 | `stacks` |
| 프로젝트 카드 | `projects` |
| 경력 타임라인 | `experience` |
| 학력 | `education` |
| 특허 · 외국어 | `extras` |

✏️ `experience` 맨 위 두 개(국제물류 IT 기업 CTO, 동양미래대학교 겸임교수)는
**회사명과 시작 시점**이 비어 있습니다. 채워주세요.

전화번호는 스팸 방지를 위해 기본 숨김입니다 (`profile.showPhone`).
프로젝트 이미지는 `public/images/projects/`, 프로필 사진은 `public/images/avatar.svg`.

---

## 3. 유입 출처 추적

`src/lib/analytics.js` 가 **어느 페이지든** 방문자가 어디서 들어왔는지 기록합니다.

- **first-touch** — 이 브라우저가 최초로 들어온 경로 (localStorage, 영구)
- **last-touch** — 이번 방문의 유입 경로 (sessionStorage)
- 판별 순서: `utm_*` → `?ref=` / `?from=` / `?src=` → `document.referrer` 도메인
- 구글·네이버·다음은 `organic`, 인스타·카카오·링크드인은 `social`, 그 외 외부 도메인은 `referral`
- 함께 기록: 어느 페이지(`personal` / `dev`), 랜딩 경로, 기기, 화면 크기, 언어, 타임존, 체류 시간, 최대 스크롤 깊이
- 이벤트: `visit`, `leave`, `page_view`, `chapter_jump`, `nav_click`, `cta_click`, `email_copy`, `social_click`, `project_link`

### 확인

주소 뒤에 **`?track=1`** 을 붙이면 우측 하단에 패널이 뜹니다. 방문자에게는 보이지 않습니다.

```
http://localhost:5173/?track=1
http://localhost:5173/?ref=kakao&track=1
http://localhost:5173/?utm_source=instagram&utm_medium=bio&track=1
```

링크를 뿌릴 때 `?ref=` 만 다르게 달아두면 어디서 들어왔는지 자동으로 구분됩니다.

### 서버에 로그 남기기

기본값은 **로컬 저장만** 하고 외부로 아무것도 보내지 않습니다.
서버에 올려서 폴더에 로그를 쌓으려면 `server/collect.js` 를 같이 띄우면 됩니다.

#### 수집기 — `server/collect.js`

외부 의존성 없는 파일 하나입니다. **사이트 서빙과 로그 수집을 한 프로세스에서** 합니다.

```bash
npm run build
echo 'VITE_TRACK_ENDPOINT=/collect' > .env && npm run build   # 엔드포인트를 박고 다시 빌드
npm run serve                                                # http://localhost:8080
```

| 환경변수 | 기본값 | 설명 |
| --- | --- | --- |
| `PORT` | `8080` | 포트 |
| `LOG_DIR` | `./logs` | 로그가 쌓이는 폴더 |
| `DIST_DIR` | `./dist` | 서빙할 빌드 결과 |
| `MASK_IP` | `1` | IP 뒷자리 가리기 (`0` 이면 전체 저장) |
| `ALLOW_ORIGIN` | 없음 | 다른 도메인에서 보낼 때만 지정 |

`/dev` 새로고침 SPA 폴백, 정적 파일 캐시 헤더, 32KB 본문 제한, 경로 탈출 차단,
`/logs` 웹 접근 차단이 들어 있습니다.

#### 로그 형식

날짜별 [JSON Lines](https://jsonlines.org) 파일입니다. 하루가 바뀌면 새 파일이 생깁니다.

```
logs/2026-08-27.jsonl
logs/2026-08-28.jsonl
```

한 줄이 방문 하나입니다.

```json
{"ts":"2026-08-27T05:19:39.465Z","ip":"1.2.3.x","ua":"Mozilla/5.0 ...",
 "event":"visit","visitorId":"...","isNewVisitor":true,
 "attribution":{"source":"instagram","medium":"social","landingPath":"/?ref=insta"},
 "device":{"type":"mobile","viewport":"390x844","tz":"Asia/Seoul"}}
```

IP 는 기본적으로 뒷자리를 가려서 저장하고, 시각은 클라이언트가 아니라 **서버 시계**를 씁니다.

#### 집계 보기

```bash
npm run report            # 최근 30일
npm run report -- 7       # 최근 7일
npm run report -- all     # 전체
```

유입 출처·종류·캠페인·referrer 도메인·랜딩 경로·본 페이지·기기·이벤트 분포와
평균 체류 시간, 평균 스크롤 깊이, 최근 방문 10건을 터미널에 그려줍니다.

`?ref=` 를 붙여 보낸 링크는 **개별 링크** 표로 따로 나옵니다.
링크별 방문 횟수 · 기기 수 · 체류 시간 · 스크롤 깊이 · 마지막 방문 시각을 보여줍니다.

```
  개별 링크 (?ref=)
  ────────────────────────────────────────
  jieun       2회 · 기기 1 · 214초 · 96%  마지막 08-27 05:22
  insta-dm    1회 · 기기 1 ·   9초 · 14%  마지막 08-27 05:22
```

**알 수 없는 것** — 방문자가 누구인지는 브라우저 보안 모델상 알 수 없습니다.
인스타에서 넘어와도 referrer 는 `instagram.com` 도메인까지고 계정은 오지 않습니다
(인앱 브라우저는 referrer 자체를 안 보내는 경우도 많아 `direct` 로 찍힙니다).
`visitorId` 는 우리가 심은 랜덤 값이라 "같은 브라우저가 또 왔다" 까지만 알려줍니다.
누가 봤는지 알고 싶으면 사람마다 `?ref=` 를 다르게 해서 보내는 방법뿐입니다.

#### 외부 서비스를 쓸 경우

`index.html` 에 GA4(`gtag`)나 Plausible 을 넣어두면 같은 이벤트가 그쪽으로도 갑니다.
브라우저 Do Not Track 이 켜져 있으면 외부 전송은 건너뜁니다.

---

## 4. 모바일

**개인 페이지** — 하단에 얇은 알약 하나(현재 챕터 이름 + 점 6개)만 띄웁니다. 앱 같은 탭바 대신
읽기를 방해하지 않는 최소한의 목차입니다. 데스크톱에서는 오른쪽 세로 목차로 바뀝니다.

**개발자 페이지** — 하단 탭바(엄지 위치, safe-area, 슬라이딩 인디케이터, 탭 진동),
프로젝트는 가로 스냅 캐러셀.

공통 — `100dvh` 기준 첫 화면, 터치 타깃 44px 이상, hover 전용 인터랙션 없음,
`prefers-reduced-motion` 존중, 페이지별로 필요한 폰트만 로드(코드 스플리팅).
