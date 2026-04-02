---
name: mr
description: GitLab Merge Request workflow guide using glab CLI. Use for creating, reviewing, approving, and merging MRs from the terminal. Trigger on glab mr, merge request, MR create, MR review, MR approve, MR merge, glab mr list, glab mr checkout.
user-invocable: true
---

# GitLab Merge Request Workflow (glab mr)

Complete guide for managing Merge Requests from the terminal using glab CLI.

> **Related skills:** Setup/auth → `/glab-cli`, CI/CD → `/glab-cli:ci`, Issues → `/glab-cli:issue`
>
> **필수:** 모든 glab 명령에 `NO_COLOR=1` 접두사를 사용하여 ANSI 이스케이프 코드가 출력/설명에 포함되지 않도록 한다. 다른 명령 출력을 설명에 포함할 때도 `sed 's/\x1b\[[0-9;]*m//g'`로 ANSI 코드를 제거한다.

## Creating Merge Requests

```bash
# Interactive (prompts for title, description, target branch)
NO_COLOR=1 glab mr create

# Auto-fill title/description from commits, auto-push
NO_COLOR=1 glab mr create --fill

# Skip confirmation
NO_COLOR=1 glab mr create --fill --yes

# Include all commit bodies in description
NO_COLOR=1 glab mr create --fill --fill-commit-body

# Create draft MR
NO_COLOR=1 glab mr create --draft -t "WIP: feature"

# Specify target branch, title, and description
NO_COLOR=1 glab mr create -b main -t "Title" -d "Description"

# Assign to users
NO_COLOR=1 glab mr create -a user1,user2

# Request reviews
NO_COLOR=1 glab mr create --reviewer user1 --reviewer user2

# Add labels
NO_COLOR=1 glab mr create -l bug,urgent

# Related issue (copies title if no -t)
NO_COLOR=1 glab mr create -i 42

# Copy labels from related issue
NO_COLOR=1 glab mr create --copy-issue-labels -i 42

# Auto-delete branch on merge
NO_COLOR=1 glab mr create --remove-source-branch

# Squash commits on merge
NO_COLOR=1 glab mr create --squash-before-merge

# Open in browser after creation
NO_COLOR=1 glab mr create --web

# Push changes then create
NO_COLOR=1 glab mr create --push
```

## Listing & Viewing

```bash
# List open MRs
NO_COLOR=1 glab mr list

# List merged MRs
NO_COLOR=1 glab mr list --state=merged

# MRs assigned to me
NO_COLOR=1 glab mr list --assignee=@me

# MRs I need to review
NO_COLOR=1 glab mr list --reviewer=@me

# Filter by label
NO_COLOR=1 glab mr list -l bug

# View MR details
NO_COLOR=1 glab mr view 42

# Open in browser
NO_COLOR=1 glab mr view 42 --web

# Show MR diff
NO_COLOR=1 glab mr diff 42
```

## Review & Approval

```bash
# Checkout MR branch locally
NO_COLOR=1 glab mr checkout 42

# Approve MR
NO_COLOR=1 glab mr approve 42

# Revoke approval
NO_COLOR=1 glab mr revoke 42
```

## Merging

```bash
# Merge MR
NO_COLOR=1 glab mr merge 42

# Squash merge
NO_COLOR=1 glab mr merge 42 --squash

# Rebase MR
NO_COLOR=1 glab mr rebase 42
```

## Updating & Managing

```bash
# Update MR fields
NO_COLOR=1 glab mr update 42 --title "new title"

# Close MR
NO_COLOR=1 glab mr close 42

# Reopen closed MR
NO_COLOR=1 glab mr reopen 42

# Add a comment
NO_COLOR=1 glab mr note 42 -m "Comment text"

# Add MR to your todo list
NO_COLOR=1 glab mr todo 42

# Subscribe to notifications
NO_COLOR=1 glab mr subscribe 42

# Unsubscribe
NO_COLOR=1 glab mr unsubscribe 42
```

## Common Workflows

### Feature Branch MR
```bash
# Create branch, make changes, then:
NO_COLOR=1 glab mr create --fill --yes -b main --remove-source-branch
```

### Draft → Ready → Review → Merge
```bash
# 1. Create as draft
NO_COLOR=1 glab mr create --draft -t "feat: new feature" -b main

# 2. When ready, update to remove draft status
NO_COLOR=1 glab mr update 42 --draft=false

# 3. Request review
NO_COLOR=1 glab mr update 42 --reviewer reviewer1

# 4. After approval, merge
NO_COLOR=1 glab mr merge 42
```

### Cross-Repository Operations
```bash
# List MRs in another project
NO_COLOR=1 glab mr list --repo group/other-project

# View MR in another project
NO_COLOR=1 glab mr view 42 -R namespace/group/project
```
