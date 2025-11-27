# Interview

[![CI](https://github.com/kennguyen722/Interview/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/kennguyen722/Interview/actions/workflows/ci.yml)

Interview preparation for all levels

## CI & Branch Protection

- CI runs on push/PR and via manual dispatch. Workflow: `.github/workflows/ci.yml`.
- Status badge above reflects the `master` branch.

### Protection workflow

- Workflow: `.github/workflows/protect-branch.yml` enforces branch protection using `scripts/protect-branch.ps1`.
- Triggers: on push to `master`/`main`, and via manual `workflow_dispatch` (optional `branch` input).
- Secret required: create a repo secret `PROTECT_TOKEN` with enough scope to update branch protection (repo admin).
- Required check: it configures branch protection to require the status check `CI / test` (the `test` job from `ci.yml`).

### Run tests locally

PowerShell-friendly commands:

```powershell
# auth-service
Push-Location "identity_management_platform/auth-service"; mvn -B test; Pop-Location
# user-service
Push-Location "identity_management_platform/user-service"; mvn -B test; Pop-Location
# scim-service
Push-Location "identity_management_platform/scim-service"; npm test; Pop-Location
```

If Maven isn’t on PATH, use Dockerized Maven:

```powershell
# auth-service
$vol = (Resolve-Path 'identity_management_platform/auth-service').Path + ':/ws'
docker run --rm -v $vol -w /ws maven:3.9.9-eclipse-temurin-17 mvn -B test
# user-service
$vol = (Resolve-Path 'identity_management_platform/user-service').Path + ':/ws'
docker run --rm -v $vol -w /ws maven:3.9.9-eclipse-temurin-17 mvn -B test
```

### Justfile helpers (optional)

Install `just` (https://github.com/casey/just) and run:

```powershell
# all tests
just test-all
# individual suites
just test-auth
just test-user
just test-scim
```

### Makefile helpers (optional)

For Unix/macOS developers with Docker installed:

```bash
# all tests
make test-all
# individual suites
make test-auth
make test-user
make test-scim

# protect/unprotect (requires GITHUB_TOKEN)
export GITHUB_TOKEN=<YOUR_TOKEN>
make protect
make unprotect
```

### Branch protection scripts

Set a GitHub token (repo admin rights):

```powershell
$env:GITHUB_TOKEN = "<YOUR_TOKEN>"
```

Protect `master` (require CI and 1 approval):

```powershell
# via PowerShell script
./scripts/protect-branch.ps1 -Owner "kennguyen722" -Repo "Interview" -Branch "master"
# or via just
just protect
```

Remove protection:

```powershell
# via PowerShell script
./scripts/unprotect-branch.ps1 -Owner "kennguyen722" -Repo "Interview" -Branch "master"
# or via just
just unprotect
```
