---
name: glab-cli
description: GitLab CLI (glab) usage guide for GitLab Self-Managed environments. Use this skill for glab setup, authentication, configuration, releases, repository operations, variables, API access, aliases, and troubleshooting. Trigger on glab, gitlab cli, glab auth, glab config, glab release, glab repo, glab variable, glab api, glab alias, glab setup, glab install, glab certificate, x509 error.
user-invocable: true
---

# GitLab CLI (glab) for Self-Managed Environments

glab is the official open-source GitLab CLI tool. It supports GitLab.com, GitLab Dedicated, and GitLab Self-Managed (v16.0+). This skill focuses on Self-Managed usage patterns where additional configuration (hostname, certificates, tokens) is typically required.

> **Domain-specific skills:** MR workflow → `/glab-cli:mr`, CI/CD pipelines → `/glab-cli:ci`, Issues → `/glab-cli:issue`

## ANSI 코드 방지 (필수)

glab은 기본적으로 ANSI 이스케이프 코드(색상, 볼드 등)를 출력한다. 이 코드가 이슈/MR 설명에 포함되면 `\x1b[31m` 같은 깨진 문자가 나타난다. **모든 glab 명령 실행 시 반드시 `NO_COLOR=1`을 접두사로 사용한다:**

```bash
# 올바른 사용법
NO_COLOR=1 glab issue list
NO_COLOR=1 glab mr view 42

# 잘못된 사용법 (ANSI 코드 포함됨)
glab issue list
```

또한, 다른 명령(빌드 로그, 테스트 결과 등)의 출력을 이슈/MR 설명으로 사용할 때도 ANSI 코드를 반드시 제거한다:
```bash
# sed로 ANSI 코드 제거
<command> 2>&1 | sed 's/\x1b\[[0-9;]*m//g'
```

## Initial Setup for Self-Managed

### 1. Installation

Refer to the official installation guide: https://gitlab.com/gitlab-org/cli/#installation

Common methods:
- **macOS**: `brew install glab`
- **Linux (apt)**: Available via GitLab's official APT repository
- **Linux (snap)**: `snap install glab`
- **Windows**: `winget install glab` or `scoop install glab`
- **Go**: `go install gitlab.com/gitlab-org/cli/cmd/glab@latest`

### 2. Authentication (Self-Managed)

Self-Managed instances require specifying the hostname explicitly.

#### Interactive Login (Recommended for first-time setup)
```bash
glab auth login --hostname gitlab.example.com
```
Choose between:
- **Web (OAuth)**: Opens browser for OAuth flow
- **Token**: Paste a Personal Access Token (PAT)

#### Token-based Login (Non-interactive, good for automation)
```bash
# From file
glab auth login --hostname gitlab.example.com --stdin < mytoken.txt

# Inline (not recommended for shared environments — stored in config file)
glab auth login --hostname gitlab.example.com --token glpat-xxxxxxxxxxxx
```

**Required PAT scopes**: `api` and `write_repository` at minimum.

Generate a PAT at: `https://<your-gitlab-host>/-/user_settings/personal_access_tokens?scopes=api,write_repository`

#### OAuth Application Setup (Optional, for org-wide deployment)
If your org prefers OAuth over PAT:
1. Create an OAuth application in GitLab (user, group, or instance level)
   - Redirect URI: `http://localhost:7171/auth/redirect`
   - Confidential: unchecked
   - Scopes: `openid`, `profile`, `read_user`, `write_repository`, `api`
2. Configure glab with the Client ID:
   ```bash
   glab config set client_id <APPLICATION_ID> --host gitlab.example.com
   ```
3. Then run `glab auth login --hostname gitlab.example.com` and choose Web login

#### Verify Authentication
```bash
glab auth status
```

### 3. Self-Signed Certificate Handling

Self-Managed instances often use self-signed or internal CA certificates. Two approaches:

#### Option A: Configure CA cert in glab (Per-host)
```bash
glab config set ca_cert /path/to/ca-bundle.crt --host gitlab.example.com
```

#### Option B: System-level trust (Recommended)
Add the CA certificate to the OS trust store so all tools (git, curl, glab) benefit:

**Ubuntu/Debian:**
```bash
sudo cp your-ca.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates
```

**macOS:**
```bash
sudo security add-trusted-cert -d -r trustRoot \
  -k /Library/Keychains/System.keychain your-ca.crt
```

**RHEL/CentOS:**
```bash
sudo cp your-ca.crt /etc/pki/ca-trust/source/anchors/
sudo update-ca-trust
```

If you see `x509: certificate signed by unknown authority`, one of the above approaches is needed.

## Key Configuration

Configuration is stored in `~/.config/glab-cli/config.yml` (XDG compliant). Configurable at system, global, local (per-repo), or per-host level.

### Important Config Options
```bash
# Set default protocol
glab config set git_protocol ssh --host gitlab.example.com
glab config set api_protocol https --host gitlab.example.com

# Set default editor
glab config set editor vim

# Set default browser
glab config set browser firefox

# Set default remote alias
glab config set remote_alias origin

# Set CA certificate for self-signed instances
glab config set ca_cert /path/to/cert.pem --host gitlab.example.com

# Disable telemetry
glab config set telemetry false
```

### Environment Variables
Key variables for Self-Managed usage:
- `GITLAB_HOST` (or `GL_HOST`): Default GitLab server URL (e.g., `https://gitlab.example.com`)
- `GITLAB_TOKEN`: Override authentication token for all requests
- `NO_PROMPT=true`: Disable interactive prompts (useful in scripts/CI)

## Releases & Changelog

```bash
# Create a release
NO_COLOR=1 glab release create v1.0.0 --notes "Release notes here"

# Create release with assets
NO_COLOR=1 glab release create v1.0.0 ./build.tar.gz --notes "With binary"

# Create release with notes from file
NO_COLOR=1 glab release create v1.0.0 --notes-file CHANGELOG.md

# Create release linked to milestone
NO_COLOR=1 glab release create v1.0.0 --milestone "v1.0"

# List releases
NO_COLOR=1 glab release list

# View release details
NO_COLOR=1 glab release view v1.0.0

# Delete release
NO_COLOR=1 glab release delete v1.0.0

# Upload asset to existing release
NO_COLOR=1 glab release upload v1.0.0 ./new.tar.gz

# Generate changelog
NO_COLOR=1 glab changelog generate
```

## Repository Operations

```bash
# Clone a repo (with GITLAB_HOST for self-managed)
NO_COLOR=1 GITLAB_HOST=gitlab.example.com glab repo clone group/project

# Clone all repos in a group
NO_COLOR=1 GITLAB_HOST=gitlab.example.com glab repo clone -g my-group

# View repo info
NO_COLOR=1 glab repo view

# Open in browser
NO_COLOR=1 glab repo view --web

# Download repo archive
NO_COLOR=1 glab repo archive

# Fork current repo
NO_COLOR=1 glab repo fork

# Search repositories
NO_COLOR=1 glab repo search "query"
```

### Deploy Keys
```bash
NO_COLOR=1 glab deploy-key list                   # List deploy keys
NO_COLOR=1 glab deploy-key create                 # Add a deploy key
NO_COLOR=1 glab deploy-key delete <key-id>        # Remove a deploy key
```

### SSH & GPG Keys
```bash
NO_COLOR=1 glab ssh-key list                      # List SSH keys
NO_COLOR=1 glab ssh-key add                       # Add SSH key
NO_COLOR=1 glab gpg-key list                      # List GPG keys
```

## Variables & Secrets

```bash
# List project CI/CD variables
NO_COLOR=1 glab variable list

# Set a variable
NO_COLOR=1 glab variable set MY_VAR "my_value"

# Set with environment scope
NO_COLOR=1 glab variable set MY_VAR "my_value" --scope production

# Get a variable
NO_COLOR=1 glab variable get MY_VAR

# Delete a variable
NO_COLOR=1 glab variable delete MY_VAR
```

### Secure Files
```bash
NO_COLOR=1 glab securefile list                   # List secure files
NO_COLOR=1 glab securefile upload ./cert.pem      # Upload secure file
```

## Snippets

```bash
NO_COLOR=1 glab snippet create                    # Interactive snippet creation
NO_COLOR=1 glab snippet create -t "Title" -f file.py  # From file
NO_COLOR=1 glab snippet list                      # List snippets
NO_COLOR=1 glab snippet view <id>                 # View snippet
```

## Labels, Milestones & Iterations

```bash
# Labels
NO_COLOR=1 glab label list                        # List labels
NO_COLOR=1 glab label create -n "label-name" -c "#ff0000"  # Create label

# Milestones
NO_COLOR=1 glab milestone list                    # List milestones

# Iterations
NO_COLOR=1 glab iteration list                    # List iterations
```

## API Direct Access

Use `glab api` for endpoints not covered by dedicated commands:
```bash
# GET request
NO_COLOR=1 glab api projects/:id/members

# POST request
NO_COLOR=1 glab api projects/:id/issues -X POST -f title="New issue" -f description="Details"

# PUT request
NO_COLOR=1 glab api projects/:id/issues/1 -X PUT -f state_event=close

# With pagination
NO_COLOR=1 glab api projects/:id/merge_requests --paginate

# JSON output piped to jq
NO_COLOR=1 glab api projects/:id/pipelines | jq '.[0].id'
```
The `:fullpath` and `:id` placeholders auto-resolve from the current repository context.

## Stacked Diffs Workflow

```bash
NO_COLOR=1 glab stack create                      # Start a new stack
NO_COLOR=1 glab stack list                        # List stacks
NO_COLOR=1 glab stack sync                        # Sync stack with remote
```

## Project Access Tokens

```bash
NO_COLOR=1 glab token create -n "token-name" -S api  # Create a project access token
NO_COLOR=1 glab token list                            # List project access tokens
NO_COLOR=1 glab token revoke <token-id>               # Revoke a token
```

## User & Work Items

```bash
NO_COLOR=1 glab user events                       # View user activity events
NO_COLOR=1 glab work-items list                   # List work items
NO_COLOR=1 glab work-items view <id>              # View work item
```

## Useful Aliases

Save time with custom aliases:
```bash
# Set alias
NO_COLOR=1 glab alias set mrs 'mr list --assignee=@me'
NO_COLOR=1 glab alias set pipelines 'ci list'
NO_COLOR=1 glab alias set schedule_list 'api projects/:fullpath/pipeline_schedules/'

# Use alias
NO_COLOR=1 glab mrs
NO_COLOR=1 glab pipelines

# Delete alias
NO_COLOR=1 glab alias delete mrs
```

## Shell Completion

```bash
# Bash
glab completion -s bash > /etc/bash_completion.d/glab

# Zsh
glab completion -s zsh > "${fpath[1]}/_glab"

# Fish
glab completion -s fish > ~/.config/fish/completions/glab.fish
```

## CI/CD Job Integration

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

Auto-login detects the CI environment automatically using `GITLAB_CI`, `CI_SERVER_FQDN`, and `CI_JOB_TOKEN`. Note: only commands compatible with `CI_JOB_TOKEN` are available in this mode.

### Self-Signed Certs in CI
```yaml
before_script:
  - echo "$CUSTOM_CA_CERT" > /tmp/ca.pem
  - glab config set ca_cert /tmp/ca.pem --host $CI_SERVER_FQDN
```

## Working with Multiple Instances

glab supports multiple authenticated GitLab instances simultaneously.

```bash
# Login to multiple hosts
glab auth login --hostname gitlab.example.com
glab auth login --hostname gitlab.internal.corp

# glab auto-detects from git remote in the current repo
# Or explicitly override:
NO_COLOR=1 GITLAB_HOST=gitlab.internal.corp glab issue list

# Use --repo flag for cross-repo operations
NO_COLOR=1 glab mr list --repo group/other-project
```

## Global Flags

These flags work with most commands:

| Flag | Description |
|------|-------------|
| `-R, --repo OWNER/REPO` | Target a different repository |
| `--help` | Show help for any command |

Use `-R` or `--repo` to operate on a different repository without `cd`-ing:
```bash
NO_COLOR=1 glab mr list --repo group/other-project
NO_COLOR=1 glab issue list -R namespace/group/project
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `x509: certificate signed by unknown authority` | Set CA cert via `glab config set ca_cert` or add to system trust store |
| `401 Unauthorized` | Re-run `glab auth login`, ensure PAT has `api` + `write_repository` scopes |
| Wrong GitLab host detected | Set `GITLAB_HOST` env var or check git remote with `git remote -v` |
| Commands default to gitlab.com | Ensure your repo has a remote pointing to your self-managed instance |
| Token expired | Regenerate PAT and re-run `glab auth login` |
| `glab ci lint` fails | Ensure you're in a git repo root with `.gitlab-ci.yml` present |
