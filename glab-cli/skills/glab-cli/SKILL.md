---
name: glab-cli
description: GitLab CLI (glab) usage guide for GitLab Self-Managed environments. Use this skill for glab setup, authentication, configuration, releases, repository operations, variables, API access, aliases, and troubleshooting. Trigger on glab, gitlab cli, glab auth, glab config, glab release, glab repo, glab variable, glab api, glab alias, glab setup, glab install, glab certificate, x509 error.
user-invocable: true
---

# GitLab CLI (glab) — Self-Managed 환경 가이드

glab은 GitLab 공식 CLI 도구다. GitLab.com, Dedicated, Self-Managed(v16.0+)를 지원한다.
이 스킬은 Self-Managed 환경에서 필요한 호스트명, 인증서, 토큰 설정에 초점을 맞춘다.

> **도메인 스킬:** MR 워크플로우 → `/glab-cli:mr` | CI/CD → `/glab-cli:ci` | 이슈 → `/glab-cli:issue`

---

## ANSI 코드 방지 (정식 정의)

glab v1.91+는 `NO_COLOR=1`, `CLICOLOR=0`, `TERM=dumb` 환경 변수를 **모두 무시한다.**
아래 규칙은 이 플러그인의 모든 스킬에 적용되는 정식 정의다.

### 조회 명령 (list, view, diff 등)

모든 glab 조회 출력에 sed 파이프를 추가하여 ANSI 이스케이프를 제거한다:

```bash
glab <command> 2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'
```

### 생성/수정 명령 — Write 도구 + glab api 필수

`glab issue create -d`, `glab mr create -d`, 인라인 `glab api -f "key=value"` 등은 description에 ANSI 코드를 삽입하여 **GitLab DB에 오염된 데이터를 저장하는 버그**가 있다.

**올바른 패턴:**
1. Claude Code의 **Write 도구**로 프로젝트 루트 `.gl-body.md` 파일을 작성한다
2. `glab api -F "field=@.gl-body.md"` 로 파일 내용을 전달한다
3. 완료 후 `rm .gl-body.md`로 삭제한다

> **`/tmp` 경로 사용 금지** — `/tmp`에서 생성하면 ANSI 오염이 발생할 수 있다. 반드시 프로젝트 루트에 생성하고 사용 후 삭제한다.

```bash
# 이슈 생성
glab api projects/:fullpath/issues -X POST \
  -F "title=이슈 제목" \
  -F "description=@.gl-body.md" \
  2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'

# MR 생성
glab api projects/:fullpath/merge_requests -X POST \
  -F "source_branch=feature" -F "target_branch=main" \
  -F "title=MR 제목" \
  -F "description=@.gl-body.md" \
  2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'

# 코멘트 추가 (이슈/MR 공통)
glab api projects/:fullpath/issues/<id>/notes -X POST \
  -F "body=@.gl-body.md" \
  2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'
```

### 금지 패턴

| 금지 | 이유 |
|------|------|
| `glab issue create -d "..."` | description에 ANSI 삽입 |
| `glab mr create -d "..."` | description에 ANSI 삽입 |
| `glab issue note -m "..."` | 코멘트에 ANSI 삽입 |
| `glab mr note -m "..."` | 코멘트에 ANSI 삽입 |
| `glab api -f "key=value"` | 인라인 값에 ANSI 삽입 |
| `echo "..." > .gl-body.md` | Bash가 ANSI 삽입 |
| `printf "..." > .gl-body.md` | Bash가 ANSI 삽입 |
| `cat <<'EOF' > .gl-body.md` | heredoc이 ANSI 삽입 |

### git 작업

```bash
# 커밋: Write 도구로 /tmp/commit-msg.txt 작성 후
git commit -F /tmp/commit-msg.txt

# diff: 항상 --no-color
git diff --no-color
```

### 빠른 참조

| 작업 유형 | 패턴 |
|-----------|------|
| **조회** (list, view, diff) | `glab <cmd> 2>&1 \| sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` |
| **생성/수정** (description, comment) | Write 도구 → `.gl-body.md` → `glab api -F "field=@.gl-body.md"` → `rm .gl-body.md` |
| **간단 생성** (description 없음) | `glab issue create -t "Title" --no-editor` 또는 `glab mr create --fill --yes` |
| **git commit** | Write 도구 → `/tmp/commit-msg.txt` → `git commit -F /tmp/commit-msg.txt` |
| **git diff** | `git diff --no-color` |

> 아래 예제에는 간결성을 위해 sed가 생략되어 있으나, **조회 시 반드시 적용한다.**

---

## 초기 설정

### 1. 설치

공식 가이드: https://gitlab.com/gitlab-org/cli/#installation

```bash
# macOS
brew install glab

# Linux (apt) — GitLab 공식 APT 저장소
# Linux (snap)
snap install glab

# Windows
winget install glab    # 또는 scoop install glab

# Go
go install gitlab.com/gitlab-org/cli/cmd/glab@latest
```

### 2. 인증 (Self-Managed)

Self-Managed 인스턴스는 호스트명을 명시해야 한다.

#### 대화형 로그인 (최초 설정 권장)

```bash
glab auth login --hostname gitlab.example.com
```

- **Web (OAuth)**: 브라우저에서 OAuth 인증
- **Token**: Personal Access Token(PAT) 직접 입력

#### 토큰 기반 로그인 (비대화형, 자동화용)

```bash
# 파일에서
glab auth login --hostname gitlab.example.com --stdin < mytoken.txt

# 인라인 (공유 환경에서 비권장)
glab auth login --hostname gitlab.example.com --token glpat-xxxxxxxxxxxx
```

**필수 PAT 스코프**: `api`, `write_repository`

PAT 생성: `https://<host>/-/user_settings/personal_access_tokens?scopes=api,write_repository`

#### 인증 확인

```bash
glab auth status
```

### 3. 자체 서명 인증서 처리

Self-Managed 인스턴스에서 자체 서명 또는 내부 CA 인증서를 사용할 때.

#### 방법 A: glab per-host 설정

```bash
glab config set ca_cert /path/to/ca-bundle.crt --host gitlab.example.com
```

#### 방법 B: 시스템 신뢰 저장소 (권장)

```bash
# macOS
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain your-ca.crt

# Ubuntu/Debian
sudo cp your-ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

# RHEL/CentOS
sudo cp your-ca.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust
```

`x509: certificate signed by unknown authority` 에러가 발생하면 위 방법 중 하나를 적용한다.

---

## 핵심 설정

설정 파일: `~/.config/glab-cli/config.yml` (XDG). 시스템, 글로벌, 로컬(저장소별), per-host 레벨 지원.

```bash
# 기본 프로토콜
glab config set git_protocol ssh --host gitlab.example.com
glab config set api_protocol https --host gitlab.example.com

# 에디터, 브라우저
glab config set editor vim
glab config set browser firefox

# 기본 리모트 별칭
glab config set remote_alias origin

# 텔레메트리 비활성화
glab config set telemetry false
```

### 환경 변수

| 변수 | 설명 |
|------|------|
| `GITLAB_HOST` (또는 `GL_HOST`) | 기본 GitLab 서버 URL |
| `GITLAB_TOKEN` | 인증 토큰 오버라이드 |
| `NO_PROMPT=true` | 대화형 프롬프트 비활성화 (스크립트/CI용) |

---

## glab api 직접 사용

전용 명령이 없는 엔드포인트에 접근할 때:

```bash
# GET
glab api projects/:id/members

# POST (Write 도구로 .gl-body.md 작성 후)
glab api projects/:id/issues -X POST \
  -F "title=New issue" -F "description=@.gl-body.md"

# PUT
glab api projects/:id/issues/1 -X PUT \
  -F "description=@.gl-body.md"

# 페이지네이션
glab api projects/:id/merge_requests --paginate

# JSON + jq
glab api projects/:id/pipelines | jq '.[0].id'
```

`:fullpath`와 `:id` 플레이스홀더는 현재 저장소 컨텍스트에서 자동 해석된다.

## 전역 플래그

| 플래그 | 설명 |
|------|------|
| `-R, --repo OWNER/REPO` | 다른 저장소 대상 |
| `--help` | 도움말 |

---

## 상세 레퍼런스

- **Release, Repo, Variable, Snippet, Label 등**: `references/commands.md` 참조
- **트러블슈팅, 다중 인스턴스, CI 연동, OAuth 설정**: `references/troubleshooting.md` 참조
