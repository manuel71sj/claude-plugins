# glab 상세 명령어 레퍼런스

> 이 파일은 glab-cli 메인 스킬에서 다루지 않는 상세 명령어를 정리한다.
> ANSI 방지 규칙은 메인 스킬(`/glab-cli`)의 정식 정의를 따른다.

## 목차

1. [Releases & Changelog](#releases--changelog)
2. [Repository Operations](#repository-operations)
3. [Variables & Secrets](#variables--secrets)
4. [Snippets](#snippets)
5. [Labels, Milestones & Iterations](#labels-milestones--iterations)
6. [Stacked Diffs](#stacked-diffs)
7. [Project Access Tokens](#project-access-tokens)
8. [User & Work Items](#user--work-items)
9. [Aliases](#aliases)
10. [Shell Completion](#shell-completion)

---

## Releases & Changelog

```bash
# 릴리스 생성
glab release create v1.0.0 --notes "Release notes here"

# 에셋 포함 릴리스
glab release create v1.0.0 ./build.tar.gz --notes "With binary"

# 파일에서 노트 읽기
glab release create v1.0.0 --notes-file CHANGELOG.md

# 마일스톤 연결
glab release create v1.0.0 --milestone "v1.0"

# 릴리스 목록
glab release list

# 릴리스 상세
glab release view v1.0.0

# 릴리스 삭제
glab release delete v1.0.0

# 기존 릴리스에 에셋 업로드
glab release upload v1.0.0 ./new.tar.gz

# 변경 로그 자동 생성
glab changelog generate
```

## Repository Operations

```bash
# 저장소 클론 (Self-Managed)
GITLAB_HOST=gitlab.example.com glab repo clone group/project

# 그룹 전체 클론
GITLAB_HOST=gitlab.example.com glab repo clone -g my-group

# 저장소 정보 보기
glab repo view

# 브라우저에서 열기
glab repo view --web

# 아카이브 다운로드
glab repo archive

# 포크
glab repo fork

# 저장소 검색
glab repo search "query"
```

### Deploy Keys

```bash
glab deploy-key list                   # 목록
glab deploy-key create                 # 추가
glab deploy-key delete <key-id>        # 삭제
```

### SSH & GPG Keys

```bash
glab ssh-key list                      # SSH 키 목록
glab ssh-key add                       # SSH 키 추가
glab gpg-key list                      # GPG 키 목록
```

## Variables & Secrets

```bash
# CI/CD 변수 목록
glab variable list

# 변수 설정
glab variable set MY_VAR "my_value"

# 환경 범위 지정
glab variable set MY_VAR "my_value" --scope production

# 변수 조회
glab variable get MY_VAR

# 변수 삭제
glab variable delete MY_VAR
```

### Secure Files

```bash
glab securefile list                   # 목록
glab securefile upload ./cert.pem      # 업로드
```

## Snippets

```bash
glab snippet create                    # 대화형 생성
glab snippet create -t "Title" -f file.py  # 파일에서 생성
glab snippet list                      # 목록
glab snippet view <id>                 # 보기
```

## Labels, Milestones & Iterations

```bash
# 라벨
glab label list
glab label create -n "label-name" -c "#ff0000"

# 마일스톤
glab milestone list

# 이터레이션
glab iteration list
```

## Stacked Diffs

```bash
glab stack create                      # 새 스택 시작
glab stack list                        # 스택 목록
glab stack sync                        # 리모트와 동기화
```

## Project Access Tokens

```bash
glab token create -n "token-name" -S api  # 프로젝트 토큰 생성
glab token list                            # 목록
glab token revoke <token-id>               # 폐기
```

## User & Work Items

```bash
glab user events                       # 사용자 활동 이벤트
glab work-items list                   # 작업 항목 목록
glab work-items view <id>              # 작업 항목 보기
```

## Aliases

```bash
# 별칭 설정
glab alias set mrs 'mr list --assignee=@me'
glab alias set pipelines 'ci list'
glab alias set schedule_list 'api projects/:fullpath/pipeline_schedules/'

# 별칭 사용
glab mrs
glab pipelines

# 별칭 삭제
glab alias delete mrs
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
