# commit — Conventional Commits Plugin for Claude Code

Conventional Commits 가이드라인에 맞춘 한글 커밋 메시지를 자동 생성하고, ANSI 안전한 파이프라인으로 커밋하는 플러그인입니다.

## 설치

```bash
# 마켓플레이스 추가 (최초 1회)
/plugin marketplace add manuel71/claude-plugins

# 플러그인 설치
/plugin install commit@manuel71sj-plugins
```

## 포함된 스킬

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| **commit** | `/commit` | 변경사항 분석, 커밋 메시지 자동 생성, 사용자 확인 후 커밋 |

## 사용 방법

### 기본 사용

```
/commit                                         # 자동 메시지 생성 후 확인
/commit --all                                   # 모든 변경사항 스테이징 후 커밋
/commit --message "feat(auth): 로그인 기능 추가"  # 메시지 직접 지정
/commit --amend                                 # 직전 커밋 수정
/commit --amend --message "fix(api): 수정된 메시지" # 메시지 지정하여 amend
```

### 자동 트리거

스킬 명령어 없이도 대화 중 관련 키워드를 사용하면 자동으로 활성화됩니다.

| 키워드 예시 | 활성화 |
|------------|--------|
| `commit`, `커밋`, `conventional commit`, `git commit` | `/commit` |

### 워크플로우

1. **변경사항 분석** — `git status`, `git diff --no-color` 로 변경 내용 파악
2. **메시지 생성** — Conventional Commits + 한글 가이드라인에 따라 자동 생성
3. **사용자 확인** — 생성된 메시지를 보여주고 승인/수정/취소 선택
4. **ANSI 검증** — 임시 파일에 메시지 기록 후 ANSI 코드 부재 확인
5. **커밋 실행** — `git commit -F` 로 안전하게 커밋

### 활용 시나리오

#### 일반 커밋
```
"변경사항 커밋해줘"
→ /commit 스킬이 활성화되어 diff 분석 후 메시지 자동 생성
```

#### 직전 커밋 수정
```
"/commit --amend"
→ 직전 커밋 메시지를 확인하고 수정된 메시지로 amend
```

#### 전체 스테이징 후 커밋
```
"/commit --all"
→ 모든 변경사항을 자동 스테이징한 뒤 커밋
```

## 주요 기능

### ANSI 안전 파이프라인

커밋 메시지에 ANSI 이스케이프 시퀀스가 삽입되는 것을 방지합니다:

- `git commit -m` 사용 금지 — 반드시 `-F` 옵션으로 임시 파일 기반 커밋
- Write 도구로 임시 파일 작성 — 쉘 보간 완전 우회
- grep 검증 게이트 — 커밋 전 ANSI 코드 존재 여부 자동 검사
- `--no-color` 플래그 — 모든 diff 명령에 적용

### Conventional Commits 한글 지원

- **타입**: feat, fix, docs, style, refactor, test, chore, perf, ci, build
- **스코프**: 파일 경로/모듈 기반 자동 선정
- **한글 명령형**: "추가", "수정", "구현" 등

### --amend 지원

직전 커밋을 수정하는 워크플로우:

1. 직전 커밋의 해시, 제목, 본문 확인
2. 새로 staged된 변경사항 분석
3. 변경 전/후 메시지를 함께 표시하여 확인
4. 동일한 ANSI 안전 파이프라인으로 amend 실행

## 기존 로컬 스킬에서 마이그레이션

이전에 `~/.claude/skills/commit/`에 사용자 스킬을 설치했다면, 이 플러그인이 동일한 기능을 제공합니다. 충돌 방지를 위해 기존 스킬을 제거하세요:

```bash
rm -rf ~/.claude/skills/commit
```

## 라이선스

Apache-2.0
