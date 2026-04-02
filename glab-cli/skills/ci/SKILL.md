---
name: ci
description: GitLab CI/CD pipeline management guide using glab CLI. Use for viewing pipelines, tracing jobs, managing schedules, and downloading artifacts. Trigger on glab ci, pipeline, CI/CD, glab ci view, glab ci status, glab ci lint, glab job, glab schedule, glab runner.
user-invocable: true
---

# GitLab CI/CD Pipeline Management (glab ci)

Complete guide for managing CI/CD pipelines, jobs, schedules, and runners from the terminal using glab CLI.

> **Related skills:** Setup/auth → `/glab-cli`, MR → `/glab-cli:mr`, Issues → `/glab-cli:issue`
>
> **필수:** 모든 glab 명령에 `NO_COLOR=1` 접두사를 사용하여 ANSI 이스케이프 코드가 출력/설명에 포함되지 않도록 한다. 다른 명령 출력을 설명에 포함할 때도 `sed 's/\x1b\[[0-9;]*m//g'`로 ANSI 코드를 제거한다.

## Pipeline Operations

```bash
# Interactive TUI: view, run, trace, cancel jobs
NO_COLOR=1 glab ci view

# List recent pipelines
NO_COLOR=1 glab ci list

# Current branch pipeline status
NO_COLOR=1 glab ci status

# Get JSON of current pipeline
NO_COLOR=1 glab ci get

# Pipeline for specific branch
NO_COLOR=1 glab ci get -b feature-branch

# Trigger new pipeline on current branch
NO_COLOR=1 glab ci run

# Trigger on specific branch
NO_COLOR=1 glab ci run -b main

# Retry failed pipeline
NO_COLOR=1 glab ci retry <pipeline-id>

# Delete a pipeline
NO_COLOR=1 glab ci delete <pipeline-id>
```

## Job Operations

```bash
# Tail current job log (follow output)
NO_COLOR=1 glab ci trace

# Tail specific job log
NO_COLOR=1 glab ci trace <job-id>

# List jobs in current pipeline
NO_COLOR=1 glab job list

# Download job artifacts
NO_COLOR=1 glab job artifact <job-id>

# Download artifacts from last pipeline
NO_COLOR=1 glab ci artifact
```

## CI Configuration

```bash
# Validate .gitlab-ci.yml
NO_COLOR=1 glab ci lint
```

> Note: `glab ci lint` must be run from a git repo root that contains `.gitlab-ci.yml`.

## Pipeline Schedules

```bash
# List pipeline schedules
NO_COLOR=1 glab schedule list

# Create a new schedule
NO_COLOR=1 glab schedule create

# Trigger a scheduled pipeline immediately
NO_COLOR=1 glab schedule run <schedule-id>

# Delete a schedule
NO_COLOR=1 glab schedule delete <schedule-id>
```

## Runners

```bash
# List project runners
NO_COLOR=1 glab runner list
```

## CI Job Integration

When running glab inside GitLab CI jobs:

### Using CI Job Token (Recommended)
```yaml
# .gitlab-ci.yml
release_job:
  script:
    - glab auth login --job-token $CI_JOB_TOKEN --hostname $CI_SERVER_HOST --api-protocol $CI_SERVER_PROTOCOL
    - GITLAB_HOST=$CI_SERVER_URL glab release create $CI_COMMIT_TAG --notes "Auto release"
```

### Using Auto-Login (Experimental)
```yaml
release_job:
  variables:
    GLAB_ENABLE_CI_AUTOLOGIN: "true"
  script:
    - glab release list -R $CI_PROJECT_PATH
```

Auto-login detects the CI environment automatically using `GITLAB_CI`, `CI_SERVER_FQDN`, and `CI_JOB_TOKEN`. Only commands compatible with `CI_JOB_TOKEN` are available in this mode.

### Self-Signed Certs in CI
```yaml
before_script:
  - echo "$CUSTOM_CA_CERT" > /tmp/ca.pem
  - glab config set ca_cert /tmp/ca.pem --host $CI_SERVER_FQDN
```

## Common Workflows

### Monitor Pipeline Progress
```bash
# Check status
NO_COLOR=1 glab ci status

# If failed, trace the failing job
NO_COLOR=1 glab ci trace

# Retry if transient failure
NO_COLOR=1 glab ci retry <pipeline-id>
```

### Download Build Artifacts
```bash
# From the last pipeline
NO_COLOR=1 glab ci artifact

# From a specific job
NO_COLOR=1 glab job artifact <job-id>
```
