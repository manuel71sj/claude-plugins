# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
