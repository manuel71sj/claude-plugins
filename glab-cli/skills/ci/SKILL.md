---
name: ci
description: GitLab CI/CD pipeline management guide using glab CLI. Use for viewing pipelines, tracing jobs, managing schedules, and downloading artifacts. Trigger on glab ci, pipeline, CI/CD, glab ci view, glab ci status, glab ci lint, glab job, glab schedule, glab runner.
user-invocable: true
---

# GitLab CI/CD 파이프라인 관리 (glab ci)

파이프라인, 잡, 스케줄, 러너를 터미널에서 관리하는 가이드.

> **관련 스킬:** 설정/인증 → `/glab-cli` | MR → `/glab-cli:mr` | 이슈 → `/glab-cli:issue`
>
> **ANSI 방지 (필수):** 모든 조회 출력에 `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프.
> 상세 규칙: `/glab-cli`의 "ANSI 코드 방지" 섹션 참조.
>
> 아래 예제에는 간결성을 위해 sed가 생략되어 있으나, **실제 Bash 실행 시 반드시 적용한다.**

---

## 워크플로우

### 파이프라인 실패 → 디버그 → 수정

```bash
# 1. 현재 파이프라인 상태 확인
glab ci status

# 2. 실패한 잡 로그 추적
glab ci trace

# 3-a. 일시적 실패라면 재시도
glab ci retry <pipeline-id>

# 3-b. 코드 문제라면 수정 후 재푸시
git add -A && git commit -F /tmp/commit-msg.txt
git push

# 4. 파이프라인 재확인
glab ci status --live
```

### CI 설정 검증 후 Push

```bash
# 1. .gitlab-ci.yml 검증
glab ci lint

# 2. 문제 없으면 커밋 & 푸시
git add .gitlab-ci.yml
git commit -F /tmp/commit-msg.txt
git push
```

### 수동 파이프라인 트리거

```bash
# 현재 브랜치에서 트리거
glab ci run

# 특정 브랜치에서 트리거
glab ci run -b main
```

### 아티팩트 다운로드

```bash
# 마지막 파이프라인에서
glab ci artifact

# 특정 잡에서
glab job artifact <job-id>
```

---

## 주요 명령어

### 파이프라인

```bash
glab ci view                         # 인터랙티브 TUI
glab ci list                         # 최근 파이프라인 목록
glab ci status                       # 현재 브랜치 상태
glab ci status --live                # 실시간 상태
glab ci get                          # 현재 파이프라인 JSON
glab ci get -b feature               # 특정 브랜치
glab ci run                          # 파이프라인 트리거
glab ci run -b main                  # 특정 브랜치 트리거
glab ci retry <pipeline-id>          # 실패 파이프라인 재시도
glab ci delete <pipeline-id>         # 파이프라인 삭제
```

### 잡

```bash
glab ci trace                        # 현재 잡 로그 추적
glab ci trace <job-id>               # 특정 잡 로그
glab job list                        # 잡 목록
glab job artifact <job-id>           # 잡 아티팩트 다운로드
glab ci artifact                     # 마지막 파이프라인 아티팩트
```

### CI 설정

```bash
glab ci lint                         # .gitlab-ci.yml 검증
```

> git 저장소 루트에서 `.gitlab-ci.yml`이 있어야 동작한다.

### 스케줄

```bash
glab schedule list                   # 스케줄 목록
glab schedule create                 # 새 스케줄 (대화형)
glab schedule run <id>               # 즉시 트리거
glab schedule delete <id>            # 스케줄 삭제
```

### 러너

```bash
glab runner list                     # 프로젝트 러너 목록
```

---

## CI Job 연동

GitLab CI 잡 내부에서 glab을 실행할 때.

### CI Job Token (권장)

```yaml
# .gitlab-ci.yml
release_job:
  script:
    - glab auth login --job-token $CI_JOB_TOKEN \
        --hostname $CI_SERVER_HOST \
        --api-protocol $CI_SERVER_PROTOCOL
    - GITLAB_HOST=$CI_SERVER_URL glab release create $CI_COMMIT_TAG \
        --notes "Auto release"
```

### Auto-Login (실험적)

```yaml
release_job:
  variables:
    GLAB_ENABLE_CI_AUTOLOGIN: "true"
  script:
    - glab release list -R $CI_PROJECT_PATH
```

`GITLAB_CI`, `CI_SERVER_FQDN`, `CI_JOB_TOKEN`을 자동 감지. `CI_JOB_TOKEN` 호환 명령만 사용 가능.

### 자체 서명 인증서 in CI

```yaml
before_script:
  - echo "$CUSTOM_CA_CERT" > /tmp/ca.pem
  - glab config set ca_cert /tmp/ca.pem --host $CI_SERVER_FQDN
```

---

## 상세 레퍼런스

전체 플래그, 옵션: `references/commands.md` 참조
트러블슈팅, CI 연동 상세: `/glab-cli`의 `references/troubleshooting.md` 참조
