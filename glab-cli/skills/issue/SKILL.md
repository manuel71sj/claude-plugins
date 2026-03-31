---
name: issue
description: GitLab Issue and Incident management guide using glab CLI. Use for creating, tracking, and managing issues and incidents from the terminal. Trigger on glab issue, glab incident, issue create, issue list, issue close, issue tracking.
user-invocable: true
---

# GitLab Issue & Incident Management (glab issue)

Complete guide for managing Issues and Incidents from the terminal using glab CLI.

> **Related skills:** Setup/auth → `/glab-cli`, MR → `/glab-cli:mr`, CI/CD → `/glab-cli:ci`

## Creating Issues

```bash
# Interactive (prompts for title, description, labels)
glab issue create

# Non-interactive with title and description
glab issue create -t "Title" -d "Description"

# With labels and assignee
glab issue create -t "Bug: login broken" -l bug,critical -a @me

# Open in browser after creation
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

# Add comment
glab issue note 123 -m "Comment text"

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
