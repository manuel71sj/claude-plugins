# Claude Plugins Marketplace

Claude Code 플러그인을 모아둔 개인 마켓플레이스입니다. Claude Code의 [플러그인 시스템](https://code.claude.com/docs/en/plugins)을 통해 설치할 수 있습니다.

## 빠른 시작

### 1. 마켓플레이스 등록

Claude Code 세션에서 다음 명령어를 실행합니다:

```
/plugin marketplace add manuel71sj/claude-plugins
```

### 2. 플러그인 설치

원하는 플러그인을 설치합니다:

```
/plugin install <plugin-name>@manuel71sj-plugins
```

### 3. 플러그인 활성화

설치 후 플러그인을 즉시 로드하려면:

```
/reload-plugins
```

## 플러그인 목록

### telegram

Telegram 봇을 Claude Code에 연결하는 메시징 브릿지 플러그인입니다. 접근 제어(페어링, 허용 목록, 정책)를 내장하고 있습니다.

> **원본**: [anthropics/claude-plugins-official/telegram](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/telegram)의 포크입니다. 한글화 및 표시 개선을 적용했습니다.

```
/plugin install telegram@manuel71sj-plugins
```

**설치 후 설정:**

```
# 봇 토큰 설정 (BotFather에서 발급)
/telegram:configure <bot-token>

# 채널 플래그와 함께 Claude Code 재시작
claude --channels plugin:telegram@manuel71sj-plugins

# Telegram에서 봇에게 DM → 페어링 코드 발급 → 승인
/telegram:access pair <code>

# 보안을 위해 allowlist 정책으로 전환
/telegram:access policy allowlist
```

**주요 기능:**

- **Markdown 렌더링**: GitHub-flavored markdown을 Telegram HTML로 자동 변환 (코드 블록, 볼드, 이탤릭, 링크, 인용 등)
- **권한 요청 표시 개선**: MCP 도구 이름을 가독성 높은 형태로 포맷팅, 한글 인라인 버튼 (상세/허용/거부)
- **접근 제어**: 페어링, 허용 목록, 그룹 정책 내장

**제공 스킬:**

| 스킬 | 설명 |
|------|------|
| `/telegram:configure` | 봇 토큰 설정 및 채널 상태 확인 |
| `/telegram:access` | 접근 제어 관리 — 페어링 승인, 허용 목록, DM/그룹 정책 설정 |

**제공 도구:**

| 도구 | 설명 |
|------|------|
| `reply` | 메시지 전송 (텍스트, 파일 첨부, markdown 자동 변환) |
| `react` | 메시지에 이모지 반응 추가 |
| `edit_message` | 봇이 보낸 메시지 수정 (markdown 지원) |
| `download_attachment` | 첨부 파일 다운로드 |

자세한 내용은 [telegram/README.md](./telegram/README.md)를 참조하세요.

### glab-cli

GitLab Self-Managed 환경을 위한 glab CLI 레퍼런스 가이드 플러그인입니다. 설정, 인증, MR, CI/CD, 이슈 관리 등을 포함합니다. glab v1.91+의 ANSI 오염 버그를 우회하는 `--input` 기반 ANSI-safe 패턴을 내장하고 있습니다.

```
/plugin install glab-cli@manuel71sj-plugins
```

**제공 스킬:**

| 스킬 | 설명 |
|------|------|
| `/glab-cli:glab-cli` | glab 설치, 인증, 설정, 릴리스, 저장소 운영, 변수, API, 별칭, 문제 해결 |
| `/glab-cli:mr` | Merge Request 워크플로우 — 생성, 리뷰, 승인, 병합 |
| `/glab-cli:ci` | CI/CD 파이프라인 관리 — 조회, 추적, 스케줄, 아티팩트 |
| `/glab-cli:issue` | 이슈 및 인시던트 관리 — 생성, 추적, 종료 |

자세한 내용은 [glab-cli/README.md](./glab-cli/README.md)를 참조하세요.

### commit

Conventional Commits 가이드라인에 맞춘 한글 커밋 메시지를 자동 생성하는 플러그인입니다. ANSI-safe 파이프라인과 `--amend` 지원을 포함합니다.

```
/plugin install commit@manuel71sj-plugins
```

**제공 스킬:**

| 스킬 | 설명 |
|------|------|
| `/commit:commit` | 코드 수정 완료 후 Conventional Commits(한글, 범위 포함) 커밋 메시지 자동 생성 및 커밋 |

자세한 내용은 [commit/README.md](./commit/README.md)를 참조하세요.

## 플러그인 관리

```
# 설치된 플러그인 확인
/plugin

# 플러그인 비활성화
/plugin disable telegram@manuel71sj-plugins

# 플러그인 재활성화
/plugin enable telegram@manuel71sj-plugins

# 플러그인 제거
/plugin uninstall telegram@manuel71sj-plugins

# 마켓플레이스 업데이트 (새 플러그인/버전 반영)
/plugin marketplace update manuel71sj-plugins
```

## 웹 카탈로그

플러그인 카탈로그를 웹 브라우저에서 확인할 수 있습니다:

```sh
cd web
pnpm install
pnpm dev
```

`http://localhost:3000`에서 플러그인 목록과 상세 정보를 확인할 수 있습니다.

## 기여하기

### 새 플러그인 추가

1. 저장소 루트에 플러그인 디렉토리를 생성합니다
2. `.claude-plugin/plugin.json` 매니페스트를 작성합니다
3. 스킬, MCP 서버, 훅 등을 추가합니다
4. 루트의 `.claude-plugin/marketplace.json`에 플러그인 항목을 등록합니다
5. PR을 제출합니다

### 플러그인 디렉토리 구조

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json          # 필수: name, description, version
├── skills/                  # 선택: 스킬 정의
│   └── my-skill/
│       └── SKILL.md
├── .mcp.json                # 선택: MCP 서버 설정
├── hooks/                   # 선택: 훅 정의
│   └── hooks.json
├── agents/                  # 선택: 에이전트 정의
├── README.md
└── LICENSE
```

### 매니페스트 형식 (`plugin.json`)

```json
{
  "name": "my-plugin",
  "description": "플러그인 설명",
  "version": "1.0.0",
  "author": { "name": "Your Name" },
  "license": "Apache-2.0",
  "keywords": ["keyword1", "keyword2"]
}
```

자세한 스펙은 [Claude Code 플러그인 문서](https://code.claude.com/docs/en/plugins-reference)를 참조하세요.

## 라이선스

Apache-2.0
