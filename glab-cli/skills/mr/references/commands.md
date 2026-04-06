# MR 상세 명령어 레퍼런스

> ANSI 방지 규칙은 메인 스킬(`/glab-cli`)의 정식 정의를 따른다.
> 조회 시 `2>&1 | sed 's/\x1b\[[0-9;]*[a-zA-Z]//g'` 파이프 필수.

## 목차

1. [glab mr create](#glab-mr-create)
2. [glab mr list](#glab-mr-list)
3. [glab mr view / diff](#glab-mr-view--diff)
4. [glab mr update](#glab-mr-update)
5. [glab mr merge](#glab-mr-merge)
6. [기타 명령어](#기타-명령어)
7. [glab api로 MR 조작](#glab-api로-mr-조작)

---

## glab mr create

> description이 포함된 MR 생성은 반드시 `glab api` 방식을 사용한다 (ANSI 오염 방지).

description 없이 사용 가능한 플래그:

| 플래그 | 설명 |
|--------|------|
| `--fill` | 커밋에서 제목/설명 자동 채움 |
| `--yes` | 확인 프롬프트 건너뛰기 |
| `-t, --title` | MR 제목 |
| `-b, --target-branch` | 대상 브랜치 (기본: 프로젝트 기본 브랜치) |
| `--draft` | 드래프트 MR로 생성 |
| `-a, --assignee` | 담당자 (쉼표 구분) |
| `--reviewer` | 리뷰어 (반복 사용 가능) |
| `-l, --label` | 라벨 (쉼표 구분) |
| `-i, --related-issue` | 관련 이슈 번호 |
| `--copy-issue-labels` | 관련 이슈의 라벨 복사 |
| `--remove-source-branch` | 머지 후 소스 브랜치 삭제 |
| `--squash-before-merge` | 머지 시 스쿼시 |
| `--push` | 변경사항 push 후 생성 |
| `--web` | 브라우저에서 생성 |
| `-R, --repo` | 대상 저장소 |

## glab mr list

| 플래그 | 설명 |
|--------|------|
| `--state` | `opened`, `closed`, `merged`, `all` |
| `--assignee` | 담당자 필터 (`@me` 가능) |
| `--reviewer` | 리뷰어 필터 (`@me` 가능) |
| `--author` | 작성자 필터 |
| `-l, --label` | 라벨 필터 |
| `--milestone` | 마일스톤 필터 |
| `--search` | 키워드 검색 |
| `--source-branch` | 소스 브랜치 필터 |
| `--target-branch` | 대상 브랜치 필터 |
| `--draft` | 드래프트만 |
| `-p, --per-page` | 페이지당 결과 수 |
| `-R, --repo` | 대상 저장소 |

## glab mr view / diff

```bash
glab mr view <id>          # 상세 보기
glab mr view <id> --web    # 브라우저에서 열기
glab mr diff <id>          # 변경 내용 보기
```

## glab mr update

| 플래그 | 설명 |
|--------|------|
| `--title` | 제목 변경 |
| `--draft` | 드래프트 상태 변경 (`true`/`false`) |
| `--assignee` | 담당자 변경 |
| `--reviewer` | 리뷰어 변경 |
| `--label` | 라벨 변경 |
| `--milestone` | 마일스톤 변경 |
| `--target-branch` | 대상 브랜치 변경 |
| `--remove-source-branch` | 머지 후 브랜치 삭제 설정 |
| `--squash-before-merge` | 스쿼시 설정 |

> description 변경 시 `glab api`를 사용한다:
> ```bash
> glab api projects/:fullpath/merge_requests/<id> -X PUT \
>   -F "description=@.gl-body.md"
> ```

## glab mr merge

| 플래그 | 설명 |
|--------|------|
| `--squash` | 스쿼시 머지 |
| `--rebase` | 리베이스 후 머지 |
| `--when-pipeline-succeeds` | 파이프라인 성공 시 자동 머지 |
| `--remove-source-branch` | 머지 후 소스 브랜치 삭제 |
| `-m, --message` | 머지 커밋 메시지 |
| `--sha` | 특정 커밋 SHA에서만 머지 허용 |

## 기타 명령어

```bash
glab mr checkout <id>      # MR 브랜치 체크아웃
glab mr approve <id>       # 승인
glab mr revoke <id>        # 승인 철회
glab mr close <id>         # 닫기
glab mr reopen <id>        # 재오픈
glab mr rebase <id>        # 리베이스
glab mr todo <id>          # TODO 목록에 추가
glab mr subscribe <id>     # 알림 구독
glab mr unsubscribe <id>   # 구독 해제
```

## glab api로 MR 조작

Write 도구로 `.gl-body.md`에 본문을 작성한 뒤 사용한다.

```bash
# MR 생성
glab api projects/:fullpath/merge_requests -X POST \
  -F "source_branch=feature" -F "target_branch=main" \
  -F "title=feat: new feature" \
  -F "description=@.gl-body.md"

# MR 설명 수정
glab api projects/:fullpath/merge_requests/<id> -X PUT \
  -F "description=@.gl-body.md"

# MR 코멘트 추가
glab api projects/:fullpath/merge_requests/<id>/notes -X POST \
  -F "body=@.gl-body.md"
```
