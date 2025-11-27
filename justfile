# Use PowerShell as the shell so this works well on Windows
set shell := ["powershell.exe", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command"]

# Defaults (override by invoking like: just protect owner=foo repo=bar branch=main)
owner := "kennguyen722"
repo := "Interview"
branch := "master"

# Helper function to resolve an absolute path (Windows-friendly)
path dir:
    (Resolve-Path {{dir}}).Path

# Run auth-service tests with Dockerized Maven
@test-auth:
    $vol = "$(just path 'identity_management_platform/auth-service'):/ws"; docker run --rm -v $vol -w /ws maven:3.9.9-eclipse-temurin-17 mvn -B test

# Run user-service tests with Dockerized Maven
@test-user:
    $vol = "$(just path 'identity_management_platform/user-service'):/ws"; docker run --rm -v $vol -w /ws maven:3.9.9-eclipse-temurin-17 mvn -B test

# Run scim-service tests with npm
@test-scim:
    Push-Location "identity_management_platform/scim-service"; try { npm test } finally { Pop-Location }

# Run all tests
@test-all: test-auth test-user test-scim

# Protect branch using GitHub API via PowerShell script
# Requires GITHUB_TOKEN in env or pass token=...
@protect token="":
    if (-not $env:GITHUB_TOKEN -and -not "{{token}}") { throw "Set GITHUB_TOKEN or pass token=..." }
    $tok = if ("{{token}}") { "{{token}}" } else { $env:GITHUB_TOKEN }
    .\scripts\protect-branch.ps1 -Owner "{{owner}}" -Repo "{{repo}}" -Branch "{{branch}}" -Token $tok

# Remove branch protection
@unprotect token="":
    if (-not $env:GITHUB_TOKEN -and -not "{{token}}") { throw "Set GITHUB_TOKEN or pass token=..." }
    $tok = if ("{{token}}") { "{{token}}" } else { $env:GITHUB_TOKEN }
    .\scripts\unprotect-branch.ps1 -Owner "{{owner}}" -Repo "{{repo}}" -Branch "{{branch}}" -Token $tok
