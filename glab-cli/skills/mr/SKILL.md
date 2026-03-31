---
name: mr
description: GitLab Merge Request workflow guide using glab CLI. Use for creating, reviewing, approving, and merging MRs from the terminal. Trigger on glab mr, merge request, MR create, MR review, MR approve, MR merge, glab mr list, glab mr checkout.
user-invocable: true
---

# GitLab Merge Request Workflow (glab mr)

Complete guide for managing Merge Requests from the terminal using glab CLI.

> **Related skills:** Setup/auth → `/glab-cli`, CI/CD → `/glab-cli:ci`, Issues → `/glab-cli:issue`

## Creating Merge Requests

```bash
# Interactive (prompts for title, description, target branch)
glab mr create

# Auto-fill title/description from commits, auto-push
glab mr create --fill

# Skip confirmation
glab mr create --fill --yes

# Include all commit bodies in description
glab mr create --fill --fill-commit-body

# Create draft MR
glab mr create --draft -t "WIP: feature"

# Specify target branch, title, and description
glab mr create -b main -t "Title" -d "Description"

# Assign to users
glab mr create -a user1,user2

# Request reviews
glab mr create --reviewer user1 --reviewer user2

# Add labels
glab mr create -l bug,urgent

# Related issue (copies title if no -t)
glab mr create -i 42

# Copy labels from related issue
glab mr create --copy-issue-labels -i 42

# Auto-delete branch on merge
glab mr create --remove-source-branch

# Squash commits on merge
glab mr create --squash-before-merge

# Open in browser after creation
glab mr create --web

# Push changes then create
glab mr create --push
```

## Listing & Viewing

```bash
# List open MRs
glab mr list

# List merged MRs
glab mr list --state=merged

# MRs assigned to me
glab mr list --assignee=@me

# MRs I need to review
glab mr list --reviewer=@me

# Filter by label
glab mr list -l bug

# View MR details
glab mr view 42

# Open in browser
glab mr view 42 --web

# Show MR diff
glab mr diff 42
```

## Review & Approval

```bash
# Checkout MR branch locally
glab mr checkout 42

# Approve MR
glab mr approve 42

# Revoke approval
glab mr revoke 42
```

## Merging

```bash
# Merge MR
glab mr merge 42

# Squash merge
glab mr merge 42 --squash

# Rebase MR
glab mr rebase 42
```

## Updating & Managing

```bash
# Update MR fields
glab mr update 42 --title "new title"

# Close MR
glab mr close 42

# Reopen closed MR
glab mr reopen 42

# Add a comment
glab mr note 42 -m "Comment text"

# Add MR to your todo list
glab mr todo 42

# Subscribe to notifications
glab mr subscribe 42

# Unsubscribe
glab mr unsubscribe 42
```

## Common Workflows

### Feature Branch MR
```bash
# Create branch, make changes, then:
glab mr create --fill --yes -b main --remove-source-branch
```

### Draft → Ready → Review → Merge
```bash
# 1. Create as draft
glab mr create --draft -t "feat: new feature" -b main

# 2. When ready, update to remove draft status
glab mr update 42 --draft=false

# 3. Request review
glab mr update 42 --reviewer reviewer1

# 4. After approval, merge
glab mr merge 42
```

### Cross-Repository Operations
```bash
# List MRs in another project
glab mr list --repo group/other-project

# View MR in another project
glab mr view 42 -R namespace/group/project
```
