# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-04-06

### Fixed

- 임시파일 경로를 `/tmp/gl-body.md`에서 프로젝트 루트 `.gl-body.md`로 전면 교체 (6개 파일)
  - `/tmp` 경로에서 생성 시 ANSI 오염이 발생하는 문제 해결
  - 사용 후 `rm .gl-body.md` 삭제 규칙 명시
  - glab-cli 정식 정의에 `/tmp` 경로 사용 금지 규칙 추가

## [0.2.0] - 2026-04-04

### Added

- `work` 스킬 추가 — GitLab 이슈 수명주기 워크플로우 (시작→진행→완료)
  - 키워드 자동 트리거 + 단계별 사용자 확인 방식
  - `add_labels`/`remove_labels` 안전 라벨 전환 패턴
  - Issue Links API, 마일스톤 조회, 사용자 ID 조회 패턴 포함
  - ANSI 코드 검증 절차 포함

## [0.1.0] - 2026-04-03

### Changed

- 4개 스킬(glab-cli, mr, issue, ci) 전면 재작성 — 명령어 레퍼런스 나열에서 워크플로우 중심 구조로 전환
- 각 스킬에 `references/` 하위 디렉토리 추가하여 상세 명령어를 분리 (progressive disclosure)
- ANSI 코드 방지 규칙을 glab-cli 메인 스킬에 중앙 집중 정의, 나머지 스킬은 간결한 참조 블록으로 교체
- 실제 업무 시나리오 기반 워크플로우 섹션 추가 (버그 수정, 코드 리뷰, 파이프라인 디버그 등)

## [0.0.7] - 2026-04-03

### Changed

- ANSI-safe 패턴을 `--input JSON` 방식에서 `-F field=@file` 방식으로 전면 교체
- 본문 파일은 반드시 Claude Code의 Write 도구로 작성 (Bash echo/printf/cat heredoc 금지 강화)
- 이슈/MR 생성, 수정, 코멘트 예제 모두 `-F "body=@/tmp/gl-body.md"` 패턴으로 통일

## [0.0.6] - 2026-04-03

### Fixed

- `glab issue note -m`/`glab mr note -m`도 ANSI 오염 — `glab api --input` 방식으로 교체

## [0.0.5] - 2026-04-03

### Fixed

- `cat <<heredoc` 등 Bash 경유 파일 생성도 ANSI 오염 확인 — Write 도구 전용 명시 (`echo/printf/cat heredoc` 금지)

## [0.0.4] - 2026-04-03

### Fixed

- `glab api -f` (--field/--raw-field) 방식도 ANSI 오염 확인 — `glab api --input` + JSON 파일 방식으로 전면 교체
- 이슈/MR 생성·수정 예제를 모두 `--input` 방식으로 변경

## [0.0.3] - 2026-04-03

### Fixed

- `NO_COLOR=1`이 glab v1.91+에서 무시되는 문제 대응 — sed 파이프 방식으로 ANSI 제거 패턴 전면 교체
- `glab issue create -d`/`glab mr create -d`가 description에 ANSI를 포함시켜 저장하는 버그 발견
- 4개 스킬 문서(glab-cli, issue, mr, ci)의 ANSI 방지 지침을 조회/생성 구분으로 전면 개편
- sed 패턴을 `[a-zA-Z]`로 확장하여 SGR 외 ANSI 시퀀스도 제거

## [0.0.2] - 2026-04-02

### Fixed

- 모든 glab 실행 명령에 `NO_COLOR=1` 접두사 추가하여 ANSI 이스케이프 코드가 이슈/MR 설명에 포함되는 문제 수정
- 메인 스킬에 ANSI 코드 방지 섹션 신규 추가
- 외부 명령 출력의 ANSI 코드 `sed` 스트리핑 가이드 포함

## [0.0.1] - 2026-03-28

### Added

- GitLab CLI (glab) 레퍼런스 플러그인 초기 릴리스
- Self-Managed 환경 설정, 인증, 인증서 가이드
- Issue, MR, CI/CD, Release 등 주요 명령 레퍼런스
