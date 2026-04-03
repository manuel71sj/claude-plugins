---
name: issue
description: GitLab Issue and Incident management guide using glab CLI. Use for creating, tracking, and managing issues and incidents from the terminal. Trigger on glab issue, glab incident, issue create, issue list, issue close, issue tracking.
user-invocable: true
---

# GitLab Issue & Incident Management (glab issue)

Complete guide for managing Issues and Incidents from the terminal using glab CLI.

> **Related skills:** Setup/auth → `/glab-cli`, MR → `/glab-cli:mr`, CI/CD → `/glab-cli:ci`
>
> **필수 — ANSI 코드 방지:**
> - **조회** (`list`, `view` 등): `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프 추가
> - **생성/수정** (`create`, `update`, `note` 등): `glab issue create -d` 및 `glab api -f`는 ANSI를 포함시켜 저장하는 버그가 있음 (v1.91+). **반드시 `glab api --input` 방식으로 생성/수정한다.**
>
> 아래 예제에는 간결성을 위해 sed가 생략되어 있으나, **조회 시 반드시 적용한다.**

## Creating Issues

> **주의:** `glab issue create -d`는 ANSI 오염 버그가 있으므로 `glab api`를 사용한다.

```bash
# 1. Write 도구로 JSON 파일 작성 (echo/printf/cat heredoc 금지)
#    /tmp/gl-payload.json: {"title":"Bug: login broken","description":"설명 내용"}

# 2. --input으로 이슈 생성 (ANSI-safe)
glab api projects/:fullpath/issues -X POST \
  --input /tmp/gl-payload.json \
  -H "Content-Type: application/json"

# 라벨, 담당자 포함
# /tmp/gl-payload.json: {"title":"Bug: login broken","description":"설명","labels":"bug,critical","assignee_ids":[123]}
glab api projects/:fullpath/issues -X POST \
  --input /tmp/gl-payload.json \
  -H "Content-Type: application/json"

# 간단한 이슈 (description 없음) — glab issue create 사용 가능
glab issue create -t "Title" --no-editor

# 브라우저에서 생성 (ANSI 문제 없음)
glab issue create --web
```

## Listing & Viewing

```bash
# List open issues
glab issue list

# Issues assigned to me
glab issue list --assignee=@me

# Filter by label
glab issue list -l bug

# Filter by milestone
glab issue list --milestone "v1.0"

# Search issues by keyword
glab issue list --search "keyword"

# View issue details
glab issue view 123

# Open in browser
glab issue view 123 --web
```

## Managing Issues

```bash
# Close issue
glab issue close 123

# Reopen issue
glab issue reopen 123

# Add comment (glab api --input 사용, -m은 ANSI 오염)
# Write 도구로 /tmp/gl-payload.json 작성: {"body":"Comment text"}
glab api projects/:fullpath/issues/123/notes -X POST \
  --input /tmp/gl-payload.json -H "Content-Type: application/json"

# Subscribe to notifications
glab issue subscribe 123

# Unsubscribe
glab issue unsubscribe 123
```

## Incidents

```bash
# List incidents
glab incident list

# View incident details
glab incident view 456
```

## Common Workflows

### Bug Report → Fix → Close
```bash
# 1. Create the issue
glab issue create -t "Bug: API returns 500 on empty input" -l bug,high-priority

# 2. Create a branch and MR referencing the issue
glab mr create -i 123 --copy-issue-labels -b main

# 3. After merge, close the issue
glab issue close 123
```

### Cross-Repository Operations
```bash
# List issues in another project
glab issue list --repo group/other-project

# View issue in another project
glab issue view 123 -R namespace/group/project
```
