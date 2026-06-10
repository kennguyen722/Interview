param(
    [switch]$FailFast
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$prepRoot = Split-Path -Parent $root
$moduleProjects = Join-Path $prepRoot "module-projects"

if (-not (Get-Command mvn -ErrorAction SilentlyContinue)) {
    Write-Host "WARN: 'mvn' command not found. Install Maven and rerun this smoke script." -ForegroundColor Yellow
    exit 0
}

$moduleDirs = Get-ChildItem -Path $moduleProjects -Directory -Filter "module-*" | Sort-Object Name
$failed = @()

foreach ($moduleDir in $moduleDirs) {
    $solution = Join-Path $moduleDir.FullName "solution"
    $pom = Join-Path $solution "pom.xml"

    if (-not (Test-Path $pom)) {
        continue
    }

    Write-Host "Running smoke tests for $($moduleDir.Name)..." -ForegroundColor Cyan
    Push-Location $solution
    try {
        mvn -q -DskipTests=false test
        if ($LASTEXITCODE -ne 0) {
            throw "mvn test failed"
        }
        Write-Host "PASS $($moduleDir.Name)" -ForegroundColor Green
    } catch {
        Write-Host "FAIL $($moduleDir.Name): $_" -ForegroundColor Red
        $failed += $moduleDir.Name
        if ($FailFast) {
            Pop-Location
            break
        }
    } finally {
        Pop-Location
    }
}

if ($failed.Count -gt 0) {
    Write-Host "\nSmoke failed for modules:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
    exit 1
}

Write-Host "\nAll module smoke tests passed." -ForegroundColor Green
