# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.5] - 2026-03-27

### Added

- GitHub-flavored markdown → Telegram HTML 자동 변환 (`reply`, `edit_message`의 기본 format을 `markdown`으로 변경)
- 권한 요청에 '✅ 세션 허용' (`allow_always`) 선택지 추가 (인라인 버튼 + 텍스트 응답 `a`/`always`)
- MCP 도구 이름을 가독성 높은 형태로 포맷팅하여 권한 요청 메시지에 표시
- Apache 2.0 라이선스 준수를 위한 변경 고지 (LICENSE) 추가

### Changed

- 미디어 핸들러를 데이터 기반으로 리팩토링
- 권한 버튼 및 응답 텍스트 한글화 (Allow→허용, Deny→거부, See more→상세)
- 플러그인 설명 및 설치 명령어를 `manuel71sj-plugins`로 업데이트

## [0.0.4] - 2026-03-26

### Added

- anthropics/claude-plugins-official 기반 초기 포크
- Telegram Bot API 메시징 브릿지 (reply, react, edit_message, download_attachment)
- 접근 제어 (페어링, 허용 목록, 그룹/DM 정책)
