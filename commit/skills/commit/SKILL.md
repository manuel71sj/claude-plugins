---
name: commit
description: |
  코드 수정 완료 후 가이드라인(Conventional Commits, 한글, 범위 포함)에 맞춘 커밋 메시지를 자동 생성하고 사용자 확인 후 커밋합니다.
  Trigger on: commit, 커밋, conventional commit, git commit, /commit
arguments:
  - name: message
    description: 커밋 메시지 직접 지정 (미지정 시 자동 생성)
    required: false
  - name: all
    description: 모든 변경사항 자동 스테이징 (-a 옵션)
    required: false
  - name: amend
    description: 직전 커밋 수정 (--amend)
    required: false
user-invocable: true
---

# 커밋 스킬

변경사항을 분석하여 프로젝트의 **커밋 메시지 작성 가이드라인**을 준수하는 메시지를 자동 생성하고, 사용자 확인 후 커밋합니다.

## 사용법

```
/commit                        # 가이드라인에 따른 자동 메시지 생성 후 확인
/commit --all                  # 모든 변경사항 스테이징 후 커밋
/commit --message "feat(auth): 로그인 기능 추가" # 메시지 직접 지정
/commit --amend                # 직전 커밋 수정
/commit --amend --message "fix(api): 수정된 메시지"  # 메시지 지정하여 amend
```

## CRITICAL CONSTRAINTS (모든 Step 이전에 반드시 숙지)

### ANSI/특수문자 삽입 방지 프로토콜

- **MANDATORY**: 모든 커밋은 반드시 `git commit -F /tmp/.git-commit-msg`를 사용해야 합니다. **예외 없음.**
- **BANNED COMMAND**: `git commit -m`은 **영구적으로 금지**됩니다. 이 명령을 절대 구성하지 마십시오.
  - 이유: 쉘 보간(Shell interpolation)이 메시지에 ANSI 이스케이프 시퀀스를 삽입합니다.
  - `-m`을 타이핑하려는 자신을 발견하면, **즉시 중단**하고 `-F` 파이프라인을 사용하십시오.
- **BANNED PATTERN**: `Co-Authored-By:` 트레일러는 **영구적으로 금지**됩니다.
- **Write 도구 전용**: 임시 파일 `/tmp/.git-commit-msg`는 반드시 Write 도구로 작성해야 합니다. echo/printf/cat을 절대 사용하지 마십시오.
- **Diff 플래그**: git diff 실행 시 항상 `--no-color`를 사용하십시오.

## 워크플로우

### Step 1: 변경사항 분석

1. **스테이징 상태 확인**: `git status --porcelain`
   - 변경사항 없으면: "커밋할 변경사항이 없습니다" 안내 후 중단

2. **staged 변경사항 확인**: `git diff --no-color --cached --stat`
   - staged 파일 없고 --all 미지정 시: unstaged 파일 목록 보여주고 스테이징 여부 확인

3. **변경 내용 분석**: `git diff --no-color --cached` (또는 --all 시 `git diff --no-color`)
   - 변경된 파일들과 내용 파악 (스코프 파악을 위해 파일 경로 주의 깊게 분석)
   - **주의**: diff 분석 시 색상 코드가 보이더라도, 이는 터미널 출력용이므로 커밋 메시지에는 절대 포함하지 마십시오.

### Step 2: 커밋 메시지 생성

--message 미지정 시, 아래 **[커밋 메시지 작성 가이드라인]**을 엄격히 준수하여 메시지를 생성합니다.
**중요**: 생성 결과물은 반드시 **순수 텍스트(Plain Text)**여야 합니다. 마크다운 스타일링이나 터미널 색상 코드를 포함하지 마십시오.

#### [커밋 메시지 작성 가이드라인]

**1. 기본 구조**

```
<타입>[적용 범위(선택 사항)]: <설명>

[본문(선택 사항)]

[꼬리말(선택 사항)]
```

**2. 필수 커밋 타입**
| 타입 | 설명 | 버전 |
|------|------|------|
| `feat` | 새로운 기능 추가 | MINOR |
| `fix` | 버그 수정 | PATCH |
| `docs` | 문서 수정 | - |
| `style` | 코드 포맷팅, 세미콜론 누락, 코드 변경 없는 경우 | - |
| `refactor` | 코드 리팩토링 | - |
| `test` | 테스트 코드 추가/수정 | - |
| `chore` | 빌드 프로세스 변경, 패키지 매니저 설정 등 | - |
| `perf` | 성능 개선 | - |
| `ci` | CI 설정 변경 | - |
| `build` | 빌드 시스템 또는 외부 종속성 변경 | - |

**3. 적용 범위(Scope) 예시**
- 파일 경로 및 모듈을 기반으로 적절한 영문 스코프 선정
- 예: `feat(ui)`, `fix(api)`, `docs(readme)`, `refactor(components)`, `chore(deps)`

**4. 작성 규칙**
1. **한글로 작성**: 설명과 본문은 반드시 한글로 작성
2. **명령형 사용**: "수정함" 대신 "수정", "추가함" 대신 "추가" (예: "로그인 기능 구현")
3. **대문자/마침표 금지**: 제목의 첫 글자는 소문자로(타입), 끝에 마침표 사용 금지
4. **본문 내용**: 단순한 변경 사항 나열보다는 "무엇을", "왜" 변경했는지 설명
5. **AI 생성 표시 금지**: `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` 형식 사용 금지
6. **ANSI 및 특수문자 원천 차단 (Critical)**:
   - 커밋 메시지에 `\033`, `\x1b`, `[38;5;...m`, `^[` 와 같은 ANSI 이스케이프 시퀀스나 색상 제어 문자가 **절대** 포함되어서는 안 됩니다.
   - diff 결과에서 색상 코드를 보았더라도, 커밋 메시지에는 오직 **순수 텍스트(Plain text)**만 작성하십시오.
   - 굵게(bold), 이탤릭 등 마크다운 서식 문자도 제목(Subject Line)에는 사용하지 마십시오.

**5. 단절적 변경 (Breaking Change)**
- 타입 뒤에 느낌표(!) 사용: `feat!: 호환되지 않는 API 변경`
- 꼬리말에 `BREAKING CHANGE:` 명시

#### [생성 예시]

* **기능 추가**:
    ```
    feat(auth): 사용자 로그인 기능 구현

    JWT 토큰 기반 인증 시스템 구현
    - 로그인 폼 컴포넌트 추가
    - 인증 상태 관리 로직 구현
    ```
* **버그 수정**:
    ```
    fix(ui): 모바일에서 네비게이션 메뉴 깨지는 현상 수정
    ```
* **의존성 관리**:
    ```
    chore(deps): React Query를 TanStack Query로 업데이트
    ```

### Step 3: 사용자 확인

AskUserQuestion으로 확인 요청:

```
커밋 메시지를 확인해주세요:

***

feat(user): 회원가입 유효성 검사 로직 추가

* 이메일 형식 검증 정규식 적용
* 비밀번호 강도 체크 함수 구현

***

이 메시지로 커밋할까요?
```

**선택지**:
- 커밋 진행
- 메시지 수정 (사용자가 직접 입력)
- 취소

### Step 4: 커밋 실행

1. **스테이징** (필요 시):
   - --all 옵션: `git add -A`
   - 특정 파일만: `git add <files>`

2. **커밋 메시지 임시 파일 작성** (반드시 Write 도구 사용):
   - 경로: `/tmp/.git-commit-msg`
   - Write 도구를 사용하여 쉘 해석을 완전히 우회합니다.

3. **ANSI 검증 게이트**:
   임시 파일 작성 후, 커밋 전에 반드시 ANSI 코드 존재 여부를 검증합니다:
   ```bash
   LC_ALL=C grep -l "$(printf '\033')" /tmp/.git-commit-msg && echo "ANSI_DETECTED" || echo "CLEAN"
   ```
   - `ANSI_DETECTED` 출력 시: 임시 파일을 다시 작성합니다. `git commit`을 진행하지 마십시오.
   - `CLEAN` 출력 시: 다음 단계로 진행합니다.

4. **커밋 실행**:
   ```bash
   # NEVER use `git commit -m`. ALWAYS use -F.
   git commit -F /tmp/.git-commit-msg
   ```

5. **임시 파일 삭제**:
   ```bash
   rm -f /tmp/.git-commit-msg
   ```

6. **결과 확인 및 출력**:
   - `git log -1 --format="%H %s"` 로 커밋 해시와 제목을 확인합니다.
   ```
   커밋 완료: <commit-hash>
   <commit-message 첫 줄>
   ```

## --amend 모드 (직전 커밋 수정)

--amend 옵션이 지정된 경우, 일반 커밋 워크플로우 대신 아래 플로우를 따릅니다.

### Amend Step 1: 직전 커밋 확인

1. `git log -1 --format="%H%n%s%n%n%b"` 로 직전 커밋의 해시, 제목, 본문 확인
2. `git diff --no-color --cached --stat` 로 추가로 staged된 변경사항 확인
3. --all 옵션이 함께 지정된 경우: `git add -A` 로 모든 변경사항 스테이징
4. 사용자에게 직전 커밋 정보를 보여줌

### Amend Step 2: 새 커밋 메시지 생성

- --message 지정 시: 해당 메시지 사용
- 미지정 시: 직전 커밋 메시지 + 새로 staged된 변경사항을 종합 분석하여 새 메시지 생성
- 동일한 [커밋 메시지 작성 가이드라인] 적용

### Amend Step 3: 사용자 확인

AskUserQuestion으로 변경 전/후 메시지를 함께 표시:

```
직전 커밋을 수정합니다:

***

변경 전:
fix(api): 인증 토큰 만료 처리 수정

변경 후:
fix(api): 인증 토큰 만료 처리 및 갱신 로직 수정

***

이 메시지로 amend할까요?
```

**선택지**:
- amend 진행
- 메시지 수정 (사용자가 직접 입력)
- 취소

### Amend Step 4: Amend 실행

1. **커밋 메시지 임시 파일 작성** (반드시 Write 도구 사용):
   - 경로: `/tmp/.git-commit-msg`

2. **ANSI 검증 게이트**:
   ```bash
   LC_ALL=C grep -l "$(printf '\033')" /tmp/.git-commit-msg && echo "ANSI_DETECTED" || echo "CLEAN"
   ```
   - `ANSI_DETECTED` 출력 시: 임시 파일을 다시 작성합니다.

3. **Amend 실행**:
   ```bash
   # NEVER use `git commit --amend -m`. ALWAYS use -F.
   git commit --amend -F /tmp/.git-commit-msg
   ```

4. **임시 파일 삭제**:
   ```bash
   rm -f /tmp/.git-commit-msg
   ```

5. **결과 확인 및 출력**:
   ```bash
   git log -1 --format="%H %s"
   ```
   ```
   amend 완료: <commit-hash>
   <commit-message 첫 줄>
   ```

## 에러 처리

| 상황 | 메시지 |
| --- | --- |
| 변경사항 없음 | 커밋할 변경사항이 없습니다 |
| git 저장소 아님 | git 저장소가 아닙니다 |
| 사용자 취소 | 커밋이 취소되었습니다 |
| amend 시 staged 변경 없고 메시지도 동일 | 변경할 내용이 없습니다 |
| ANSI 코드 감지 | ANSI 코드가 감지되어 임시 파일을 재작성합니다 |
