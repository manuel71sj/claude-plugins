# 트러블슈팅 & 고급 설정

> ANSI 방지 규칙은 메인 스킬(`/glab-cli`)의 정식 정의를 따른다.

## 목차

1. [에러 진단 테이블](#에러-진단-테이블)
2. [다중 인스턴스 설정](#다중-인스턴스-설정)
3. [OAuth Application 설정](#oauth-application-설정)
4. [CI Job 연동](#ci-job-연동)

---

## 에러 진단 테이블

| 에러 메시지 | 원인 | 해결 |
|-------------|------|------|
| `x509: certificate signed by unknown authority` | 자체 서명 인증서 미신뢰 | `glab config set ca_cert /path/cert.pem --host <host>` 또는 시스템 신뢰 저장소에 추가 |
| `401 Unauthorized` | 토큰 만료 또는 권한 부족 | `glab auth login` 재실행, PAT에 `api` + `write_repository` 스코프 확인 |
| Wrong GitLab host detected | git remote가 다른 호스트 가리킴 | `GITLAB_HOST` 환경 변수 설정 또는 `git remote -v`로 확인 |
| Commands default to gitlab.com | 리모트가 Self-Managed가 아닌 gitlab.com 가리킴 | 저장소 리모트를 Self-Managed 인스턴스로 수정 |
| Token expired | PAT 유효기간 만료 | PAT 재생성 후 `glab auth login` |
| `glab ci lint` fails | `.gitlab-ci.yml` 없음 | git 저장소 루트에서 실행, 파일 존재 여부 확인 |

## 다중 인스턴스 설정

glab은 여러 GitLab 인스턴스에 동시 인증을 지원한다.

```bash
# 여러 호스트에 로그인
glab auth login --hostname gitlab.example.com
glab auth login --hostname gitlab.internal.corp

# 현재 저장소의 git remote에서 자동 감지
# 또는 명시적으로 지정:
GITLAB_HOST=gitlab.internal.corp glab issue list

# --repo 플래그로 다른 프로젝트 조작
glab mr list --repo group/other-project
```

## OAuth Application 설정

PAT 대신 조직 전체 OAuth를 사용할 때:

1. GitLab에서 OAuth Application 생성 (사용자, 그룹, 또는 인스턴스 레벨)
   - Redirect URI: `http://localhost:7171/auth/redirect`
   - Confidential: **체크 해제**
   - Scopes: `openid`, `profile`, `read_user`, `write_repository`, `api`

2. glab에 Client ID 설정:
   ```bash
   glab config set client_id <APPLICATION_ID> --host gitlab.example.com
   ```

3. 웹 로그인 실행:
   ```bash
   glab auth login --hostname gitlab.example.com
   # → Web login 선택
   ```

## CI Job 연동

GitLab CI 잡 내부에서 glab을 실행할 때의 설정.

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

`GITLAB_CI`, `CI_SERVER_FQDN`, `CI_JOB_TOKEN`을 자동 감지한다. `CI_JOB_TOKEN` 호환 명령만 사용 가능.

### 자체 서명 인증서 in CI

```yaml
before_script:
  - echo "$CUSTOM_CA_CERT" > /tmp/ca.pem
  - glab config set ca_cert /tmp/ca.pem --host $CI_SERVER_FQDN
```
