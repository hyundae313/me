// ─────────────────────────────────────────────────────────────
//  이 파일만 수정하면 사이트 전체 내용이 바뀝니다.
//  텍스트는 t('한국어', 'English') 형태 — 언어 토글에 함께 반영됩니다.
//  이미지는 public/images/ 안의 파일을 교체하면 됩니다.
//
//  ── 사실 확인이 필요한 곳 ────────────────────────────────
//  · experience[0]  h3networks CTO 시작 시점
//  · profile.socials  GitHub / LinkedIn 주소
//                     (비어 있으면 화면에 안 나옵니다)
//  · projects[].links  공개 가능한 링크가 있다면
// ─────────────────────────────────────────────────────────────

const t = (ko, en) => ({ ko, en })

export const profile = {
  handle: 'hyundae',
  name: t('김현대', 'Hyundae Kim'),
  role: t('CTO · 겸임교수 · 앱 개발자', 'CTO · Adjunct Professor · App Developer'),
  // 히어로에서 순환하며 타이핑되는 문구
  roles: [
    t('h3networks CTO', 'CTO at h3networks'),
    t('동양미래대학교 겸임교수', 'Adjunct Professor, Dongyang Mirae Univ.'),
    t('React Native 앱 개발자', 'React Native Developer'),
    t('딥러닝을 공부하는 사람', 'Deep Learning Learner'),
  ],
  location: t('서울, 대한민국', 'Seoul, South Korea'),
  years: 7,
  available: true,
  availableLabel: t('협업 · 프로젝트 문의 환영', 'Open to collaboration'),
  tagline: t(
    '의료 데이터 연구실에서 표준화와 시각화를 다루다가, 직접 앱을 만들어 운영해왔습니다. 지금은 국제물류 IT 기업 h3networks의 CTO로 일하며, 동양미래대학교에서 여섯 학기째 강의도 하고 있습니다.',
    'I came from biomedical informatics research — data standards and visualization — then built and ran my own apps. Today I am CTO at h3networks, a global logistics IT company, and have taught at Dongyang Mirae University for six semesters.',
  ),

  email: 'hyundae313@gmail.com',
  // ⚠️ 공개 사이트에 전화번호를 노출하면 스팸이 올 수 있어 기본은 숨김입니다.
  //    화면에 표시하려면 showPhone 을 true 로 바꾸세요.
  phone: '010-2757-2963',
  showPhone: false,

  avatar: '/images/avatar.svg',
  ogImage: '/images/og.svg',
  resumeUrl: '', // 이력서 PDF 를 public/ 에 넣고 '/resume.pdf' 처럼 지정

  socials: [
    { id: 'github', label: 'GitHub', url: '' },
    { id: 'linkedin', label: 'LinkedIn', url: '' },
    { id: 'kakao', label: '카카오톡 오픈프로필', url: 'https://open.kakao.com/o/sWo8fNKi' },
    { id: 'instagram', label: 'Instagram', url: 'https://instagram.com/hyundae313' },
    { id: 'facebook', label: 'Facebook', url: 'https://facebook.com/hyun313' },
    { id: 'mail', label: 'Email', url: 'mailto:hyundae313@gmail.com' },
  ],
}

export const about = {
  body: [
    t(
      '컴퓨터공학(학사)을 전공하고, 서울대학교 의과대학 의료정보학과에서 석·박사통합과정을 밟으며 데이터의 관리·분석·시각화를 연구했습니다.',
      'I studied Computer Science, then researched data management, analysis, and visualization in the combined MS/PhD program at Seoul National University College of Medicine.',
    ),
    t(
      '미국 UCSD Biomedical Informatics 에서는 임상 데이터 표준화와 인공지능을 연구했습니다. 의료 데이터 표준 문서(CDE, ASTM CCR)를 설계하고 검증 시스템을 만들었습니다.',
      'At UC San Diego’s Biomedical Informatics department I worked on clinical data standardization and AI — designing medical data standards (CDE, ASTM CCR) and building validation systems for them.',
    ),
    t(
      '가치관의 변화로 연구실을 나와 직접 회사를 만들고, 앱을 기획부터 개발·운영까지 혼자 해왔습니다.',
      'A shift in priorities took me out of the lab. I started my own company and built apps end to end, alone.',
    ),
    t(
      '지금은 국제물류 IT 기업 h3networks의 CTO로 기술 조직과 제품 전반을 맡고 있고, 동양미래대학교 겸임교수로 여섯 학기째 학생들을 가르치고 있습니다. React Native 앱 개발과 딥러닝에 여전히 관심이 많습니다.',
      'Now I serve as CTO at h3networks, a global logistics IT company, leading its engineering and product, and I have taught at Dongyang Mirae University as an adjunct professor for six semesters. React Native and deep learning still hold my attention.',
    ),
  ],
  stats: [
    { value: '7+', label: t('년 경력', 'Years') },
    { value: '6+', label: t('출시 프로젝트', 'Shipped') },
    { value: '1', label: t('등록 특허', 'Patent') },
  ],
}

export const stacks = [
  {
    group: t('앱 · 프론트엔드', 'App & Frontend'),
    items: ['React Native', 'React', 'JavaScript', 'HTML5 / CSS3', 'jQuery', 'PhoneGap'],
  },
  {
    group: t('백엔드 · 데이터베이스', 'Backend & Database'),
    items: ['Node.js', 'Socket.io', 'PHP', 'Laravel', 'MySQL', 'MS SQL'],
  },
  {
    group: t('데이터 · AI', 'Data & AI'),
    items: ['Python', 'R', 'Deep Learning', 'Data Visualization', 'Big Data Analysis'],
  },
  {
    group: t('도메인 · 기타', 'Domain & Etc'),
    items: [
      '의료 데이터 표준 (CDE)',
      'ASTM CCR / CCR+',
      'Genomic Analysis',
      'Java (Android)',
    ],
  },
]

export const projects = [
  {
    id: 'trito',
    image: '/images/projects/trito.svg',
    title: 'TriTo',
    org: t('느낌있는 사람들', 'Neukkim'),
    year: '2018.6 — 2020.2',
    tag: t('앱 · Android / iOS', 'App · Android / iOS'),
    summary: t(
      '여행 일정을 공유하고 여행 동반자를 매칭해주는 애플리케이션. 기획부터 앱, API 서버, 실시간 채팅 서버까지 혼자 만들고 운영했습니다.',
      'An app for sharing travel itineraries and matching travel companions. I built and ran the whole thing solo — app, API server, and realtime chat server.',
    ),
    stack: ['React Native', 'PHP', 'MySQL', 'Node.js'],
    accent: '#8b5cf6',
    links: { live: '', repo: '' },
    featured: true,
  },
  {
    id: 'bamnat',
    image: '/images/projects/bamnat.svg',
    title: t('밤낮화물', 'Bamnat Freight'),
    org: t('느낌있는 사람들', 'Neukkim'),
    year: '2017.10 — 2018.6',
    tag: t('앱 · 웹앱 하이브리드', 'App · Hybrid'),
    summary: t(
      '빅데이터를 활용한 자동 배차 시스템 애플리케이션. 매칭 알고리즘은 특허로 등록했습니다. (현재 서비스 종료)',
      'A freight dispatch app with big-data-driven automatic matching. The matching module is a registered patent. (Service now closed.)',
    ),
    stack: ['Java (Android)', 'PHP', 'MySQL'],
    accent: '#22d3ee',
    links: { live: '', repo: '' },
    featured: true,
    badge: t('특허 등록', 'Patented'),
  },
  {
    id: 'dialysisnet',
    image: '/images/projects/dialysisnet.svg',
    title: 'DialysisNet',
    org: t('국가핵심연구소 (NCRC)', 'NCRC'),
    year: '2013.10 — 2016.2',
    tag: t('연구 · 의료 데이터 표준', 'Research · Data Standards'),
    summary: t(
      '혈액투석 정보를 통합·관리하는 애플리케이션. 표준 문서 CDE(Common Data Element)를 직접 설계하고, 이를 검증하는 시스템까지 만들었습니다.',
      'An application unifying hemodialysis records. I designed the Common Data Element (CDE) document standard and built the system that validates against it.',
    ),
    stack: ['CDE', 'PHP', 'MySQL'],
    accent: '#f43f5e',
    links: { live: '', repo: '' },
    featured: true,
  },
  {
    id: 'healthavatar',
    image: '/images/projects/healthavatar.svg',
    title: 'Health Avatar',
    org: t('국가핵심연구소 (NCRC)', 'NCRC'),
    year: '2013.10 — 2016.2',
    tag: t('연구 · 환자용 앱', 'Research · Patient App'),
    summary: t(
      '투석, 소아암, 유방암 환자를 위한 애플리케이션과 자가설문 폼(우울증, 삶의 질, CVA 위험도 평가)을 개발했습니다.',
      'Patient-facing apps for dialysis, childhood cancer, and breast cancer, plus self-assessment forms (depression, quality of life, CVA risk).',
    ),
    stack: ['PhoneGap', 'PHP', 'MySQL'],
    accent: '#f59e0b',
    links: { live: '', repo: '' },
    featured: false,
  },
  {
    id: 'drugtarget',
    image: '/images/projects/drugtarget.svg',
    title: t('Drug–Target 시각화', 'Drug–Target Visualization'),
    org: 'UC San Diego',
    year: '2016.2 — 2016.11',
    tag: t('연구 · 데이터 시각화', 'Research · Visualization'),
    summary: t(
      'Biomedical Linked Data 를 딥마이닝해 약물과 타깃의 연관성을 예측하는 연구에서, 데이터 시각화를 담당했습니다.',
      'On a project deep-mining biomedical linked data to predict drug–target associations, I owned the visualization layer.',
    ),
    stack: ['PHP', 'HTML5', 'jQuery'],
    accent: '#34d399',
    links: { live: '', repo: '' },
    featured: false,
  },
  {
    id: 'iconcur',
    image: '/images/projects/iconcur.svg',
    title: 'iCONCUR',
    org: 'UC San Diego',
    year: '2016.2 — 2016.11',
    tag: t('연구 · 임상 시스템', 'Research · Clinical System'),
    summary: t(
      '연구 목적의 임상 데이터·검체 사용에 대한 환자 동의(Informed Consent) 시스템. 환자용 웹 입력 폼을 개발했습니다.',
      'A patient informed-consent system for research use of clinical data and biosamples. I developed the patient-facing web forms.',
    ),
    stack: ['PHP', 'Laravel'],
    accent: '#60a5fa',
    links: { live: '', repo: '' },
    featured: false,
  },
]

export const experience = [
  {
    company: 'h3networks',
    role: t('CTO', 'Chief Technology Officer'),
    period: t('현재', 'Present'),
    current: true,
    desc: t(
      '국제물류 도메인에 기술을 붙이는 일을 합니다. 기술 조직과 제품 전반을 맡고 있습니다.',
      'Bringing technology to the global logistics domain — leading the engineering organization and the product as a whole.',
    ),
    bullets: [],
  },
  {
    company: t('동양미래대학교', 'Dongyang Mirae University'),
    role: t('겸임교수', 'Adjunct Professor'),
    period: t('6학기째', '6 semesters'),
    current: true,
    desc: t(
      '여섯 학기째 학생들에게 개발을 가르치고 있습니다.',
      'Teaching software development to students for six semesters now.',
    ),
    bullets: [],
  },
  {
    company: t('느낌있는 사람들', 'Neukkim Inc.'),
    role: t('대표', 'Founder & CEO'),
    period: t('2017.10 — 현재', '2017.10 — Present'),
    current: true,
    desc: t(
      '1인 스타트업으로 앱을 기획·개발·운영하고 있습니다.',
      'Running a one-person startup: I design, build, and operate the apps myself.',
    ),
    bullets: [
      t(
        'TriTo — 여행 동반자 매칭 앱 (React Native, Android · iOS)',
        'TriTo — travel companion matching app (React Native, Android · iOS)',
      ),
      t(
        '밤낮화물 — 빅데이터 자동 배차 시스템 (특허 등록)',
        'Bamnat Freight — big-data dispatch system (patented)',
      ),
    ],
  },
  {
    company: 'UC San Diego',
    role: t('Biomedical Informatics 연구원', 'Researcher, Biomedical Informatics'),
    period: '2016.2 — 2016.11',
    desc: t(
      '임상 데이터 표준화와 인공지능을 연구했습니다.',
      'Researched clinical data standardization and artificial intelligence.',
    ),
    bullets: [
      t(
        'iCONCUR — 임상 데이터·검체 사용 동의 시스템 (PHP Laravel)',
        'iCONCUR — informed consent system for clinical data (PHP Laravel)',
      ),
      t(
        'Biomedical Linked Data 기반 약물–타깃 예측 연구의 시각화',
        'Visualization for drug–target prediction from biomedical linked data',
      ),
    ],
  },
  {
    company: t('국가핵심연구소 (NCRC)', 'National Core Research Center'),
    role: t('연구원', 'Researcher'),
    period: '2013.10 — 2016.2',
    desc: t(
      'Systems Biomedical Informatics 연구센터에서 환자 데이터 표준과 헬스케어 애플리케이션을 다뤘습니다.',
      'Worked on patient data standards and healthcare applications at the Systems Biomedical Informatics NCRC.',
    ),
    bullets: [
      t(
        'Health Avatar — 투석·소아암·유방암 환자용 앱과 자가설문 폼 개발',
        'Health Avatar — patient apps and self-assessment forms',
      ),
      t(
        'DialysisNet — 혈액투석 정보 통합 관리 및 CDE 표준·검증 시스템 개발',
        'DialysisNet — dialysis data platform, CDE standard and validator',
      ),
      t(
        'Healing Platform — 환자 데이터베이스 설계와 ASTM CCR/CCR+ 검증 시스템',
        'Healing Platform — patient DB design, ASTM CCR/CCR+ validator',
      ),
      t(
        '정보의학 인증의 강의 조교 (MS SQL, R, Python, 유전체 분석) · 2014.9 — 2015.2',
        'TA for the Biomedical Informatics certification course (MS SQL, R, Python, genomics) · 2014.9 — 2015.2',
      ),
    ],
  },
]

export const education = [
  {
    school: t('서울대학교 의과대학', 'Seoul National University, College of Medicine'),
    major: t('의료정보학과 석·박사 통합과정', 'Biomedical Informatics, Combined MS/PhD'),
    period: '2014.2 — 2017.2',
    note: t(
      '연구원 인턴 6개월, 통합과정 3년 후 휴학·자퇴',
      '6-month research internship, 3 years in the program, withdrew',
    ),
  },
  {
    school: t('세종대학교', 'Sejong University'),
    major: t('컴퓨터공학 학사', 'B.S. Computer Science'),
    period: '2009.2 — 2014.2',
    note: t('군 휴학 2010 — 2011', 'Military service leave, 2010 — 2011'),
  },
]

export const extras = {
  patents: [
    {
      title: t(
        '인공지능 화물배차매칭 중개모듈을 통한 스마트 화물배차매칭 장치 및 방법',
        'Smart freight dispatch matching device and method via an AI brokerage module',
      ),
      number: '10-2018-0009199',
    },
  ],
  languages: [{ name: t('영어', 'English'), level: t('일상 회화', 'Conversational') }],
}

export const nav = [
  { id: 'home', label: t('홈', 'Home') },
  { id: 'work', label: t('작업', 'Work') },
  { id: 'career', label: t('경력', 'Career') },
  { id: 'stack', label: t('기술', 'Stack') },
  { id: 'contact', label: t('연락', 'Contact') },
]

export const ui = {
  aboutEyebrow: t('소개', 'About'),
  work: t('만든 것들', 'Selected Work'),
  workSub: t(
    '직접 기획하고 만든 앱과 연구 프로젝트',
    'Apps and research projects I built hands-on',
  ),
  career: t('경력', 'Experience'),
  careerSub: t(
    '연구실에서 시작해 1인 스타트업까지',
    'From the research lab to a one-person startup',
  ),
  education: t('학력', 'Education'),
  patent: t('특허 · 기타', 'Patents & Etc'),
  stack: t('기술 스택', 'Tech Stack'),
  stackSub: t('실제 프로젝트에서 써온 것들', 'What I have actually shipped with'),
  contact: t('연락하기', 'Get in touch'),
  contactSub: t(
    '협업, 프로젝트, 무엇이든 편하게 연락 주세요.',
    'Collaborations, projects, or just a hello.',
  ),
  copyEmail: t('이메일 복사', 'Copy email'),
  copied: t('복사했어요', 'Copied'),
  scroll: t('스크롤', 'Scroll'),
  resume: t('이력서', 'Résumé'),
  viewWork: t('작업 보기', 'View work'),
  contactCta: t('연락하기', 'Contact me'),
  live: t('바로가기', 'Live'),
  code: t('코드', 'Code'),
  swipe: t('옆으로 밀어보세요', 'Swipe for more'),
  featured: t('주요 작업', 'Featured'),
  all: t('전체', 'All'),
  present: t('현재', 'Now'),
}
