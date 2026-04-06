# Issue 상세 명령어 레퍼런스

> ANSI 방지 규칙은 메인 스킬(`/glab-cli`)의 정식 정의를 따른다.
> 조회 시 `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프 필수.

## 목차

1. [glab issue create](#glab-issue-create)
2. [glab issue list](#glab-issue-list)
3. [glab issue view](#glab-issue-view)
4. [기타 명령어](#기타-명령어)
5. [glab api로 이슈 조작](#glab-api로-이슈-조작)
6. [인시던트](#인시던트)

---

## glab issue create

> description이 포함된 이슈 생성은 반드시 `glab api` 방식을 사용한다 (ANSI 오염 방지).

description 없이 사용 가능한 플래그:

| 플래그 | 설명 |
|--------|------|
| `-t, --title` | 이슈 제목 |
| `-l, --label` | 라벨 (쉼표 구분) |
| `-a, --assignee` | 담당자 |
| `--milestone` | 마일스톤 |
| `--confidential` | 비공개 이슈 |
| `--weight` | 가중치 |
| `--no-editor` | 에디터 건너뛰기 |
| `--web` | 브라우저에서 생성 |
| `-R, --repo` | 대상 저장소 |

## glab issue list

| 플래그 | 설명 |
|--------|------|
| `--state` | `opened`, `closed`, `all` |
| `--assignee` | 담당자 필터 (`@me` 가능) |
| `--author` | 작성자 필터 |
| `-l, --label` | 라벨 필터 |
| `--not-label` | 제외할 라벨 |
| `--milestone` | 마일스톤 필터 |
| `--search` | 키워드 검색 |
| `--confidential` | 비공개 이슈만 |
| `--type` | `issue` 또는 `incident` |
| `-p, --per-page` | 페이지당 결과 수 |
| `-R, --repo` | 대상 저장소 |

## glab issue view

```bash
glab issue view <id>          # 상세 보기
glab issue view <id> --web    # 브라우저에서 열기
glab issue view <id> -c       # 코멘트 포함
```

## 기타 명령어

```bash
glab issue close <id>          # 닫기
glab issue reopen <id>         # 재오픈
glab issue subscribe <id>      # 알림 구독
glab issue unsubscribe <id>    # 구독 해제
glab issue board list          # 보드 목록
glab issue board view <id>     # 보드 보기
```

## glab api로 이슈 조작

Write 도구로 `.gl-body.md`에 본문을 작성한 뒤 사용한다.

```bash
# 이슈 생성
glab api projects/:fullpath/issues -X POST \
  -F "title=Bug: login broken" \
  -F "description=@.gl-body.md"

# 라벨, 담당자, 마일스톤 포함 생성
glab api projects/:fullpath/issues -X POST \
  -F "title=Bug: login broken" \
  -F "description=@.gl-body.md" \
  -F "labels=bug,critical" \
  -F "assignee_ids[]=123" \
  -F "milestone_id=1"

# 이슈 설명 수정
glab api projects/:fullpath/issues/<id> -X PUT \
  -F "description=@.gl-body.md"

# 이슈 코멘트 추가
glab api projects/:fullpath/issues/<id>/notes -X POST \
  -F "body=@.gl-body.md"

# 이슈 닫기 (API)
glab api projects/:fullpath/issues/<id> -X PUT \
  -F "state_event=close"

# 라벨 변경
glab api projects/:fullpath/issues/<id> -X PUT \
  -F "labels=bug,resolved"

# 담당자 변경
glab api projects/:fullpath/issues/<id> -X PUT \
  -F "assignee_ids[]=456"
```

## 인시던트

```bash
glab incident list             # 인시던트 목록
glab incident view <id>        # 인시던트 상세
```
