---
name: issue
description: GitLab Issue and Incident management guide using glab CLI. Use for creating, tracking, and managing issues and incidents from the terminal. Trigger on glab issue, glab incident, issue create, issue list, issue close, issue tracking.
user-invocable: true
---

# GitLab Issue & Incident Management (glab issue)

Complete guide for managing Issues and Incidents from the terminal using glab CLI.

> **Related skills:** Setup/auth → `/glab-cli`, MR → `/glab-cli:mr`, CI/CD → `/glab-cli:ci`
>
> **필수:** 모든 glab 명령에 `NO_COLOR=1` 접두사를 사용하여 ANSI 이스케이프 코드가 출력/설명에 포함되지 않도록 한다. 다른 명령 출력을 설명에 포함할 때도 `sed 's/\x1b\[[0-9;]*m//g'`로 ANSI 코드를 제거한다.

## Creating Issues

```bash
# Interactive (prompts for title, description, labels)
NO_COLOR=1 glab issue create

# Non-interactive with title and description
NO_COLOR=1 glab issue create -t "Title" -d "Description"

# With labels and assignee
NO_COLOR=1 glab issue create -t "Bug: login broken" -l bug,critical -a @me

# Open in browser after creation
NO_COLOR=1 glab issue create --web
```

## Listing & Viewing

```bash
# List open issues
NO_COLOR=1 glab issue list

# Issues assigned to me
NO_COLOR=1 glab issue list --assignee=@me

# Filter by label
NO_COLOR=1 glab issue list -l bug

# Filter by milestone
NO_COLOR=1 glab issue list --milestone "v1.0"

# Search issues by keyword
NO_COLOR=1 glab issue list --search "keyword"

# View issue details
NO_COLOR=1 glab issue view 123

# Open in browser
NO_COLOR=1 glab issue view 123 --web
```

## Managing Issues

```bash
# Close issue
NO_COLOR=1 glab issue close 123

# Reopen issue
NO_COLOR=1 glab issue reopen 123

# Add comment
NO_COLOR=1 glab issue note 123 -m "Comment text"

# Subscribe to notifications
NO_COLOR=1 glab issue subscribe 123

# Unsubscribe
NO_COLOR=1 glab issue unsubscribe 123
```

## Incidents

```bash
# List incidents
NO_COLOR=1 glab incident list

# View incident details
NO_COLOR=1 glab incident view 456
```

## Common Workflows

### Bug Report → Fix → Close
```bash
# 1. Create the issue
NO_COLOR=1 glab issue create -t "Bug: API returns 500 on empty input" -l bug,high-priority

# 2. Create a branch and MR referencing the issue
NO_COLOR=1 glab mr create -i 123 --copy-issue-labels -b main

# 3. After merge, close the issue
NO_COLOR=1 glab issue close 123
```

### Cross-Repository Operations
```bash
# List issues in another project
NO_COLOR=1 glab issue list --repo group/other-project

# View issue in another project
NO_COLOR=1 glab issue view 123 -R namespace/group/project
```
