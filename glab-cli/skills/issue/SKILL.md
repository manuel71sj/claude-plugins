---
name: issue
description: GitLab Issue and Incident management guide using glab CLI. Use for creating, tracking, and managing issues and incidents from the terminal. Trigger on glab issue, glab incident, issue create, issue list, issue close, issue tracking.
user-invocable: true
---

# GitLab 이슈 & 인시던트 관리 (glab issue)

이슈와 인시던트의 전체 수명 주기를 터미널에서 관리하는 가이드.

> **관련 스킬:** 설정/인증 → `/glab-cli` | MR → `/glab-cli:mr` | CI/CD → `/glab-cli:ci`
>
> **ANSI 방지 (필수):** 조회 → `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프.
> 생성/수정 → Write 도구로 `/tmp/gl-body.md` 작성 → `glab api -F "field=@/tmp/gl-body.md"`.
> `glab issue create -d`, `glab issue note -m`, 인라인 `-f`, Bash heredoc **금지**.
> 상세 규칙: `/glab-cli`의 "ANSI 코드 방지" 섹션 참조.
>
> 아래 예제에는 간결성을 위해 sed가 생략되어 있으나, **조회 시 반드시 적용한다.**

---

## 워크플로우

### 버그 리포트 → 수정 → 종료

```bash
# 1. 버그 이슈 생성 (description 포함 — glab api 사용)
#    Write 도구로 /tmp/gl-body.md에 버그 상세 내용 작성 후:
glab api projects/:fullpath/issues -X POST \
  -F "title=Bug: API가 빈 입력에 500 반환" \
  -F "description=@/tmp/gl-body.md" \
  -F "labels=bug,high-priority"

# 2. 이슈 번호 확인 후 브랜치 생성
git checkout -b fix/issue-123

# 3. 수정 커밋 & 푸시
git add -A && git commit -F /tmp/commit-msg.txt
git push -u origin fix/issue-123

# 4. 이슈 연결 MR 생성
glab mr create -i 123 --copy-issue-labels -b main --fill --yes

# 5. 머지 후 이슈 닫기
glab issue close 123
```

### 기능 요청 추적

```bash
# 1. 기능 요청 이슈 생성
#    Write 도구로 /tmp/gl-body.md에 요구사항 작성 후:
glab api projects/:fullpath/issues -X POST \
  -F "title=feat: 대시보드에 차트 추가" \
  -F "description=@/tmp/gl-body.md" \
  -F "labels=feature,enhancement"

# 2. 마일스톤/담당자 지정 (API)
glab api projects/:fullpath/issues/<id> -X PUT \
  -F "milestone_id=1" \
  -F "assignee_ids[]=123"

# 3. 진행 상황 코멘트
#    Write 도구로 /tmp/gl-body.md 작성 후:
glab api projects/:fullpath/issues/<id>/notes -X POST \
  -F "body=@/tmp/gl-body.md"

# 4. 완료 후 닫기
glab issue close <id>
```

### 인시던트 대응

```bash
# 1. 인시던트 목록 확인
glab incident list

# 2. 인시던트 상세 확인
glab incident view <id>

# 3. 대응 코멘트 기록
#    Write 도구로 /tmp/gl-body.md 작성 후:
glab api projects/:fullpath/issues/<id>/notes -X POST \
  -F "body=@/tmp/gl-body.md"
```

---

## 주요 명령어

### 생성

> description이 포함된 이슈는 반드시 `glab api` 방식을 사용한다.

```bash
# glab api로 생성 (description 포함, ANSI-safe)
# Write 도구로 /tmp/gl-body.md 작성 후:
glab api projects/:fullpath/issues -X POST \
  -F "title=Bug: login broken" \
  -F "description=@/tmp/gl-body.md"

# 라벨, 담당자 포함
glab api projects/:fullpath/issues -X POST \
  -F "title=Bug: login broken" \
  -F "description=@/tmp/gl-body.md" \
  -F "labels=bug,critical" \
  -F "assignee_ids[]=123"

# 간단한 이슈 (description 없음)
glab issue create -t "Title" --no-editor

# 브라우저에서 생성
glab issue create --web
```

### 조회

```bash
glab issue list                      # 열린 이슈 목록
glab issue list --assignee=@me       # 내게 할당된 이슈
glab issue list -l bug               # 라벨 필터
glab issue list --milestone "v1.0"   # 마일스톤 필터
glab issue list --search "keyword"   # 키워드 검색
glab issue view <id>                 # 상세 보기
glab issue view <id> --web           # 브라우저에서 열기
```

### 관리

```bash
glab issue close <id>                # 닫기
glab issue reopen <id>               # 재오픈
glab issue subscribe <id>            # 알림 구독
glab issue unsubscribe <id>          # 구독 해제

# 코멘트 추가 (Write 도구로 /tmp/gl-body.md 작성 후)
glab api projects/:fullpath/issues/<id>/notes -X POST \
  -F "body=@/tmp/gl-body.md"

# description 수정 (Write 도구로 /tmp/gl-body.md 작성 후)
glab api projects/:fullpath/issues/<id> -X PUT \
  -F "description=@/tmp/gl-body.md"
```

### 인시던트

```bash
glab incident list                   # 인시던트 목록
glab incident view <id>              # 인시던트 상세
```

### 다른 프로젝트 조작

```bash
glab issue list --repo group/other-project
glab issue view <id> -R namespace/group/project
```

---

## 상세 레퍼런스

전체 플래그, 옵션, glab api 예제: `references/commands.md` 참조
