# glab-cli — GitLab CLI Reference Plugin for Claude Code

GitLab CLI (glab) 사용 가이드를 Claude Code 스킬로 제공하는 플러그인입니다. GitLab Self-Managed 환경에서의 설치, 인증, MR, CI/CD, Issue 관리 등을 다룹니다.

## 설치

```bash
# 마켓플레이스 추가 (최초 1회)
/plugin marketplace add manuel71/claude-plugins

# 플러그인 설치
/plugin install glab-cli@manuel71sj-plugins
```

## 포함된 스킬

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| **glab-cli** (메인) | `/glab-cli` | 설치, 인증, 설정, ANSI 방지 규칙 정의, API 사용법 |
| **mr** | `/glab-cli:mr` | Merge Request 워크플로우 (생성, 리뷰, 승인, 병합) |
| **ci** | `/glab-cli:ci` | CI/CD 파이프라인, Job, Schedule, Runner 관리 |
| **issue** | `/glab-cli:issue` | Issue 및 Incident 생성, 추적, 관리 |

각 스킬은 **워크플로우 중심**으로 구성되어 있으며, 상세 명령어 레퍼런스는 `references/` 하위 파일에 분리되어 있습니다.

### 디렉토리 구조

```
skills/
├── glab-cli/
│   ├── SKILL.md              # 설정, 인증, ANSI 방지 규칙 (정식 정의)
│   └── references/
│       ├── commands.md        # Release, Repo, Variable, Snippet, Label 등
│       └── troubleshooting.md # 에러 진단, 다중 인스턴스, CI 연동, OAuth
├── mr/
│   ├── SKILL.md              # MR 워크플로우
│   └── references/
│       └── commands.md        # mr 서브커맨드 전체 옵션
├── issue/
│   ├── SKILL.md              # 이슈 워크플로우
│   └── references/
│       └── commands.md        # issue 서브커맨드 전체 옵션
└── ci/
    ├── SKILL.md              # CI/CD 워크플로우
    └── references/
        └── commands.md        # pipeline, job, schedule 전체 옵션
```

## 사용 방법

### 기본 사용

플러그인 설치 후 Claude Code에서 스킬 명령어를 입력하면 해당 도메인의 glab 가이드가 로드됩니다.

```
/glab-cli          # 설치, 인증, 설정 등 기본 가이드
/glab-cli:mr       # Merge Request 워크플로우
/glab-cli:ci       # CI/CD 파이프라인 관리
/glab-cli:issue    # Issue/Incident 관리
```

### 자동 트리거

스킬 명령어 없이도 대화 중 관련 키워드를 사용하면 자동으로 해당 스킬이 활성화됩니다.

| 키워드 예시 | 활성화되는 스킬 |
|------------|---------------|
| `glab`, `gitlab cli`, `glab auth`, `glab config`, `x509 error` | `/glab-cli` |
| `glab mr`, `merge request`, `MR create`, `MR approve` | `/glab-cli:mr` |
| `glab ci`, `pipeline`, `glab ci lint`, `glab job` | `/glab-cli:ci` |
| `glab issue`, `glab incident`, `issue create` | `/glab-cli:issue` |

### 활용 시나리오

#### Self-Managed GitLab 초기 설정
```
"glab으로 우리 GitLab 서버에 인증하는 방법 알려줘"
→ /glab-cli 스킬이 활성화되어 Self-Managed 인증 가이드 제공
```

#### 버그 수정 전체 흐름 (Issue → MR → Merge)
```
"이슈 만들고 수정 브랜치 생성해서 MR까지 올려줘"
→ /glab-cli:issue + /glab-cli:mr 스킬 조합으로 전체 워크플로우 안내
```

#### CI/CD 파이프라인 디버깅
```
"파이프라인이 실패했는데 로그 확인하고 재시도해줘"
→ /glab-cli:ci 스킬이 활성화되어 디버그 워크플로우 안내
```

### ANSI 코드 방지

이 플러그인은 glab v1.91+에서 `NO_COLOR=1`이 무시되는 문제에 대응하여, 이슈/MR/코멘트 생성 시 ANSI 이스케이프 코드가 GitLab에 저장되지 않도록 안전한 패턴을 사용합니다. 자세한 규칙은 `/glab-cli` 메인 스킬의 "ANSI 코드 방지" 섹션에 정의되어 있습니다.

### 기존 사용자 스킬에서 마이그레이션

이전에 `~/.claude/skills/glab-cli/`에 사용자 스킬을 설치했다면, 이 플러그인이 동일한 기능을 제공합니다. 충돌 방지를 위해 기존 스킬을 제거하세요:

```bash
rm -rf ~/.claude/skills/glab-cli
```

## 라이선스

Apache-2.0
