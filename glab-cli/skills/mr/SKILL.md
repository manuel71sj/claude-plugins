---
name: mr
description: GitLab Merge Request workflow guide using glab CLI. Use for creating, reviewing, approving, and merging MRs from the terminal. Trigger on glab mr, merge request, MR create, MR review, MR approve, MR merge, glab mr list, glab mr checkout.
user-invocable: true
---

# GitLab Merge Request 워크플로우 (glab mr)

MR의 전체 수명 주기를 터미널에서 관리하는 가이드.

> **관련 스킬:** 설정/인증 → `/glab-cli` | CI/CD → `/glab-cli:ci` | 이슈 → `/glab-cli:issue`
>
> **ANSI 방지 (필수):** 조회 → `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프.
> 생성/수정 → Write 도구로 `/tmp/gl-body.md` 작성 → `glab api -F "field=@/tmp/gl-body.md"`.
> `glab mr create -d`, `glab mr note -m`, 인라인 `-f`, Bash heredoc **금지**.
> 상세 규칙: `/glab-cli`의 "ANSI 코드 방지" 섹션 참조.
>
> 아래 예제에는 간결성을 위해 sed가 생략되어 있으나, **조회 시 반드시 적용한다.**

---

## 워크플로우

### 버그 수정: Issue → Branch → MR → Review → Merge

```bash
# 1. 이슈 확인
glab issue view 123

# 2. 브랜치 생성 & 코드 수정
git checkout -b fix/issue-123

# 3. 커밋 & 푸시
git add -A && git commit -F /tmp/commit-msg.txt
git push -u origin fix/issue-123

# 4. MR 생성 (description 포함 — glab api 사용)
#    Write 도구로 /tmp/gl-body.md 작성 후:
glab api projects/:fullpath/merge_requests -X POST \
  -F "source_branch=fix/issue-123" -F "target_branch=main" \
  -F "title=fix: issue #123 로그인 오류 수정" \
  -F "description=@/tmp/gl-body.md"

# 5. 리뷰 요청
glab mr update <mr-id> --reviewer reviewer1

# 6. 승인 & 머지
glab mr approve <mr-id>
glab mr merge <mr-id>

# 7. 이슈 닫기
glab issue close 123
```

### Draft → Ready → Review → Merge

```bash
# 1. 드래프트 MR 생성 (description 없이)
glab mr create --draft -t "feat: 새 기능" -b main --fill --yes

# 2. 작업 완료 후 드래프트 해제
glab mr update <id> --draft=false

# 3. 리뷰어 지정
glab mr update <id> --reviewer reviewer1

# 4. 승인 후 머지
glab mr approve <id>
glab mr merge <id>
```

### Quick MR (auto-fill, description 없이)

description이 필요 없는 간단한 변경:

```bash
# 커밋에서 제목/설명 자동 채움
glab mr create --fill --yes

# 머지 후 브랜치 삭제 + 스쿼시
glab mr create --fill --yes --remove-source-branch --squash-before-merge

# 푸시 + MR 동시 생성
glab mr create --fill --yes --push
```

### 코드 리뷰 프로세스

```bash
# 1. MR 브랜치 체크아웃
glab mr checkout <id>

# 2. 변경 내용 확인
glab mr diff <id>

# 3. 리뷰 코멘트 작성 (Write 도구로 /tmp/gl-body.md 작성 후)
glab api projects/:fullpath/merge_requests/<id>/notes -X POST \
  -F "body=@/tmp/gl-body.md"

# 4. 승인 또는 변경 요청
glab mr approve <id>
# 또는 코멘트로 변경 요청
```

---

## 주요 명령어

### 생성

> description이 포함된 MR은 반드시 `glab api` 방식을 사용한다.

```bash
# glab api로 생성 (description 포함, ANSI-safe)
# Write 도구로 /tmp/gl-body.md 작성 후:
glab api projects/:fullpath/merge_requests -X POST \
  -F "source_branch=feature" -F "target_branch=main" \
  -F "title=feat: new feature" \
  -F "description=@/tmp/gl-body.md"

# 커밋에서 auto-fill (description 없이)
glab mr create --fill --yes

# 드래프트
glab mr create --draft -t "WIP: feature" --fill --yes

# 브라우저에서 생성
glab mr create --web

# 관련 이슈 + 라벨 복사
glab mr create -i 42 --copy-issue-labels
```

### 조회

```bash
glab mr list                        # 열린 MR 목록
glab mr list --state=merged         # 머지된 MR
glab mr list --assignee=@me         # 내게 할당된 MR
glab mr list --reviewer=@me         # 내가 리뷰할 MR
glab mr list -l bug                 # 라벨 필터
glab mr view <id>                   # 상세 보기
glab mr view <id> --web             # 브라우저에서 열기
glab mr diff <id>                   # 변경 내용
```

### 리뷰 & 승인

```bash
glab mr checkout <id>               # MR 브랜치 체크아웃
glab mr approve <id>                # 승인
glab mr revoke <id>                 # 승인 철회
```

### 머지

```bash
glab mr merge <id>                  # 머지
glab mr merge <id> --squash         # 스쿼시 머지
glab mr rebase <id>                 # 리베이스
```

### 관리

```bash
glab mr update <id> --title "new"   # 제목 변경
glab mr update <id> --draft=false   # 드래프트 해제
glab mr close <id>                  # 닫기
glab mr reopen <id>                 # 재오픈
glab mr todo <id>                   # TODO에 추가
glab mr subscribe <id>              # 알림 구독

# 코멘트 추가 (Write 도구로 /tmp/gl-body.md 작성 후)
glab api projects/:fullpath/merge_requests/<id>/notes -X POST \
  -F "body=@/tmp/gl-body.md"

# description 수정 (Write 도구로 /tmp/gl-body.md 작성 후)
glab api projects/:fullpath/merge_requests/<id> -X PUT \
  -F "description=@/tmp/gl-body.md"
```

### 다른 프로젝트 조작

```bash
glab mr list --repo group/other-project
glab mr view <id> -R namespace/group/project
```

---

## 상세 레퍼런스

전체 플래그, 옵션, glab api 예제: `references/commands.md` 참조
