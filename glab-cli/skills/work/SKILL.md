---
name: work
description: GitLab Issue lifecycle workflow — automates start/progress/done stages with label transitions and milestone tracking. Trigger on 작업 시작, 이슈 등록, 구현 진행, 작업 진행, 구현 완료, 작업 완료, issue workflow, work start, work progress, work done.
user-invocable: true
---

# GitLab 이슈 수명주기 워크플로우 (glab-cli:work)

GitLab 이슈의 작업 수명주기를 3단계(시작→진행→완료)로 관리하는 워크플로우 가이드.
각 단계에서 수행할 작업을 사용자에게 제안하고, 확인 후 실행한다.

> **관련 스킬:** 설정/인증 → `/glab-cli` | MR → `/glab-cli:mr` | CI/CD → `/glab-cli:ci` | 이슈 레퍼런스 → `/glab-cli:issue`
>
> **ANSI 방지 (필수):** 조회 → `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프.
> 생성/수정 → Write 도구로 프로젝트 루트 `.gl-body.md` 작성 → `glab api -F "field=@.gl-body.md"` → 완료 후 `rm .gl-body.md`로 삭제.
> **`/tmp` 경로 사용 금지** — `/tmp`에서 생성하면 ANSI 오염이 발생할 수 있다. 반드시 프로젝트 루트에 생성하고 사용 후 삭제한다.
> 상세 규칙: `/glab-cli`의 "ANSI 코드 방지" 섹션 참조.
>
> `:fullpath` 플레이스홀더는 현재 저장소 컨텍스트에서 자동 해석된다.
> 아래 예제에는 간결성을 위해 sed가 생략되어 있으나, **조회 시 반드시 적용한다.**

---

## 1단계: 작업 시작

### 트리거 키워드

작업 시작, 이슈 등록, work start, 새 작업

### 절차

1. **기존 라벨 조회** — 프로젝트에서 사용 가능한 라벨과 `상태::*` scoped labels 존재 여부를 확인한다.

   ```bash
   glab label list
   ```

2. **마일스톤 조회** — `2차 개발` 마일스톤 ID를 확인한다. 특별한 지시가 없으면 기본값으로 사용한다.

   ```bash
   glab api projects/:fullpath/milestones --field "search=2차 개발"
   ```

   > 마일스톤이 없으면 사용자에게 대체 마일스톤을 확인한다.

3. **기존 이슈 검색** — 사용자의 작업 컨텍스트에서 키워드를 추출하여 관련 이슈를 검색한다.

   ```bash
   glab issue list --search "키워드"
   ```

4. **[확인] 이슈 선택/생성** — 검색 결과를 사용자에게 제안한다:
   - 관련 이슈가 있으면: "이슈 #N '제목'을 발견했습니다. 이 이슈로 진행할까요?"
   - 없으면: "관련 이슈를 찾지 못했습니다. 신규 이슈를 생성할까요?"
   - 사용자가 거부하면 대안 검색 또는 수동 이슈 번호 입력을 받는다.

5. **신규 이슈 생성** (사용자가 신규 선택 시):
   - 이슈 목적, 배경, 작업 범위를 포함하여 Write 도구로 `.gl-body.md`를 작성한다.
   - **[확인]** "다음 내용으로 이슈를 생성합니다: 제목='...', 라벨=[상태::할일, 적절한-라벨], 마일스톤=2차 개발. 진행할까요?"

   ```bash
   glab api projects/:fullpath/issues -X POST \
     -F "title=이슈 제목" \
     -F "description=@.gl-body.md" \
     -F "labels=상태::할일,적절한-라벨" \
     -F "milestone_id=<조회한_ID>"
   rm .gl-body.md
   ```

6. **연관 이슈 관계 설정** (관련 이슈가 있는 경우):
   - **[확인]** "이슈 #N과 관계를 설정합니다 (relates_to). 진행할까요?"

   ```bash
   glab api projects/:fullpath/issues/<id>/links -X POST \
     -F "target_project_id=<target_project_id>" \
     -F "target_issue_iid=<target_iid>" \
     -F "link_type=relates_to"
   ```

   > `link_type`: `relates_to`, `blocks`, `is_blocked_by` 중 상황에 맞게 선택한다.

---

## 2단계: 구현 진행

### 트리거 키워드

구현 진행, 작업 진행, work progress, 이슈 업데이트

### 절차

1. **현재 이슈 확인** — 이전 단계에서 사용한 이슈 또는 사용자가 지정한 이슈를 확인한다.

   ```bash
   glab issue view <id>
   ```

2. **현재 사용자 ID 확인** — assignee 등록을 위해 사용자 ID를 조회한다.

   ```bash
   glab api user
   ```

   > 응답 JSON에서 `id` 필드를 추출한다.

3. **[확인] 이슈 업데이트 내용 제안** — 다음 변경 사항을 사용자에게 보여준 후 확인한다:
   - "이슈 #N에 다음 변경을 적용합니다:"
   - "1. 본문에 작업내용 추가"
   - "2. assignee를 본인으로 설정"
   - "3. 라벨을 상태::진행중으로 변경"
   - 사용자가 거부하면 수정 요청을 반영한다.

4. **이슈 본문 업데이트** — 기존 description을 조회한 후 작업내용을 추가한다.
   - 현재 description을 GET으로 조회한다.
   - Write 도구로 `.gl-body.md`에 업데이트된 전체 description을 작성한다.

   ```bash
   glab api projects/:fullpath/issues/<id> -X PUT \
     -F "description=@.gl-body.md"
   rm .gl-body.md
   ```

5. **assignee 등록**

   ```bash
   glab api projects/:fullpath/issues/<id> -X PUT \
     -F "assignee_ids[]=<user_id>"
   ```

6. **라벨 변경** — `add_labels`/`remove_labels`로 안전하게 전환한다.

   ```bash
   glab api projects/:fullpath/issues/<id> -X PUT \
     -F "add_labels=상태::진행중" \
     -F "remove_labels=상태::할일"
   ```

   > **주의**: `labels=`는 전체 치환이므로 사용 금지. 기존 라벨이 모두 삭제된다.

---

## 3단계: 구현 완료

### 트리거 키워드

구현 완료, 작업 완료, work done, 이슈 완료

### 절차

1. **현재 이슈 확인**

   ```bash
   glab issue view <id>
   ```

2. **완료보고 작성** — 변경사항 요약, 테스트 결과 등을 포함하여 Write 도구로 `.gl-body.md`를 작성한다.
   - **[확인]** "다음 완료보고를 댓글로 추가합니다: [요약]. 진행할까요?"

   ```bash
   glab api projects/:fullpath/issues/<id>/notes -X POST \
     -F "body=@.gl-body.md"
   rm .gl-body.md
   ```

3. **본문 checkbox 업데이트** (본문에 checkbox가 있는 경우):
   - 현재 description에서 완료된 항목의 `- [ ]`를 `- [x]`로 변경한다.
   - Write 도구로 `.gl-body.md`에 업데이트된 전체 description을 작성한다.
   - **[확인]** "본문의 다음 항목을 체크합니다: [항목 목록]. 진행할까요?"

   ```bash
   glab api projects/:fullpath/issues/<id> -X PUT \
     -F "description=@.gl-body.md"
   rm .gl-body.md
   ```

4. **남은 작업 → 후속 이슈 생성** (남은 작업이 있는 경우):
   - **[확인]** "남은 작업이 있습니다. 후속 이슈를 생성할까요? 제목: [제안]"
   - Write 도구로 `.gl-body.md`에 후속 이슈 description을 작성한다.

   ```bash
   # 후속 이슈 생성
   glab api projects/:fullpath/issues -X POST \
     -F "title=후속: 남은 작업 제목" \
     -F "description=@.gl-body.md" \
     -F "labels=상태::할일"
   rm .gl-body.md

   # 원본 이슈와 관계 설정
   glab api projects/:fullpath/issues/<new_id>/links -X POST \
     -F "target_project_id=<project_id>" \
     -F "target_issue_iid=<original_iid>" \
     -F "link_type=relates_to"
   ```

5. **라벨 변경**

   ```bash
   glab api projects/:fullpath/issues/<id> -X PUT \
     -F "add_labels=상태::완료" \
     -F "remove_labels=상태::진행중"
   ```

6. **ANSI 코드 검증** — 이슈 내용에 ANSI 이스케이프가 포함되지 않았는지 최종 확인한다.

   ```bash
   glab issue view <id> 2>&1 | grep -P '\x1b\[' && echo "ANSI 발견!" || echo "Clean"
   ```

   > ANSI 발견 시: 해당 필드를 Write 도구로 재작성한 후 `glab api PUT`으로 정정한다.

---

## API 패턴 레퍼런스 (참조 전용)

> 이 섹션은 기존 `/glab-cli:issue` 스킬에 없는 API 패턴을 보충한다.
> 기본적인 이슈 생성/조회/관리 명령어는 `/glab-cli:issue` 참조.

### 라벨 안전 변경 (add_labels / remove_labels)

| 작업 | API 패턴 |
|------|---------|
| 라벨 추가 | `-F "add_labels=라벨1,라벨2"` |
| 라벨 제거 | `-F "remove_labels=라벨1,라벨2"` |
| 라벨 전환 | `-F "add_labels=새라벨" -F "remove_labels=기존라벨"` |

> **`labels=`는 전체 치환**이므로 이슈 수정 시 사용 금지. 기존 라벨이 모두 삭제된다.
> 이슈 생성(POST) 시에만 `labels=`를 사용한다.

### 이슈 관계 (Issue Links API)

```bash
# 관계 생성
glab api projects/:fullpath/issues/<id>/links -X POST \
  -F "target_project_id=<pid>" \
  -F "target_issue_iid=<iid>" \
  -F "link_type=relates_to"
```

> `link_type`: `relates_to` | `blocks` | `is_blocked_by`

### 마일스톤 이름→ID 조회

```bash
glab api projects/:fullpath/milestones --field "search=마일스톤명"
```

> 응답 JSON 배열에서 `id` 필드를 추출한다.

### 현재 사용자 ID 조회

```bash
glab api user
```

> 응답 JSON에서 `id` 필드를 추출한다.
