# CI/CD 상세 명령어 레퍼런스

> ANSI 방지 규칙은 메인 스킬(`/glab-cli`)의 정식 정의를 따른다.
> 조회 시 `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프 필수.

## 목차

1. [glab ci](#glab-ci)
2. [glab job](#glab-job)
3. [glab schedule](#glab-schedule)
4. [glab runner](#glab-runner)

---

## glab ci

### glab ci view

인터랙티브 TUI로 파이프라인 상태를 확인한다.

```bash
glab ci view                   # 현재 브랜치 파이프라인
glab ci view <branch>          # 특정 브랜치
```

### glab ci list

| 플래그 | 설명 |
|--------|------|
| `--status` | `running`, `pending`, `success`, `failed`, `canceled` 등 |
| `--source` | `push`, `web`, `schedule`, `api` 등 |
| `-p, --per-page` | 페이지당 결과 수 |
| `-R, --repo` | 대상 저장소 |

### glab ci status

```bash
glab ci status                 # 현재 브랜치 파이프라인 상태
glab ci status --live          # 실시간 업데이트
```

### glab ci get

```bash
glab ci get                    # 현재 파이프라인 JSON
glab ci get -b feature         # 특정 브랜치
```

### glab ci run

```bash
glab ci run                    # 현재 브랜치에서 트리거
glab ci run -b main            # 특정 브랜치에서 트리거
```

### glab ci retry

```bash
glab ci retry <pipeline-id>    # 실패한 파이프라인 재시도
```

### glab ci delete

```bash
glab ci delete <pipeline-id>   # 파이프라인 삭제
```

### glab ci lint

```bash
glab ci lint                   # .gitlab-ci.yml 검증
```

> git 저장소 루트에서 `.gitlab-ci.yml`이 있어야 동작한다.

### glab ci artifact

```bash
glab ci artifact               # 마지막 파이프라인 아티팩트 다운로드
```

### glab ci trace

```bash
glab ci trace                  # 현재 잡 로그 추적
glab ci trace <job-id>         # 특정 잡 로그 추적
```

## glab job

```bash
glab job list                  # 현재 파이프라인 잡 목록
glab job artifact <job-id>     # 특정 잡 아티팩트 다운로드
```

## glab schedule

```bash
glab schedule list             # 스케줄 목록
glab schedule create           # 새 스케줄 생성 (대화형)
glab schedule run <id>         # 즉시 트리거
glab schedule delete <id>      # 스케줄 삭제
```

## glab runner

```bash
glab runner list               # 프로젝트 러너 목록
```
