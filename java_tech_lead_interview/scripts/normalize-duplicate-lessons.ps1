# Script: normalize-duplicate-lessons.ps1
# Purpose: Propose and optionally execute normalization (renaming) of duplicate lesson slugs.
# Usage:
#   powershell.exe -ExecutionPolicy Bypass -File scripts/normalize-duplicate-lessons.ps1            # Show plan only
#   powershell.exe -ExecutionPolicy Bypass -File scripts/normalize-duplicate-lessons.ps1 -Apply     # Execute renames
#
param(
  [switch]$Apply
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent

Write-Host "Scanning for duplicate lesson slugs..." -ForegroundColor Cyan
$lessonDirs = Get-ChildItem -Path $root -Recurse -Directory -Filter 'lesson-*'
$data = foreach($d in $lessonDirs){
  $slug = ($d.Name -replace '^lesson-\d+-','')
  [PSCustomObject]@{Dir=$d;Slug=$slug;Path=$d.FullName}
}
$duplicates = $data | Group-Object Slug | Where-Object { $_.Count -gt 1 }
if(-not $duplicates){ Write-Host "No duplicates detected." -ForegroundColor Green; exit }

# Manual domain-specific canonical mapping for clearer taxonomy
$domainMap = @{
  'api-gateway'            = 'ms-api-gateway'
  'service-discovery'      = 'ms-service-discovery'
  'load-balancing'         = 'ms-load-balancing'
  'health-checks'          = 'ms-health-checks'
  'event-sourcing'         = 'ms-event-sourcing'
  'saga-pattern'           = 'ms-saga-pattern'
  'cqrs'                   = 'ms-cqrs'
  'circuit-breakers'       = 'ms-circuit-breakers'
  'distributed-tracing'    = 'obs-distributed-tracing'
  'monitoring'             = 'obs-monitoring'
  'performance-tuning'     = 'jvm-performance-tuning'
  'caching'                = 'spring-caching'               # Spring Data caching primary
  'transactions'           = 'spring-data-transactions'
  'repositories'           = 'spring-data-repositories'
  'jpa-hibernate'          = 'spring-data-jpa-hibernate'
  'auto-configuration'     = 'spring-boot-auto-configuration'
  'production-deployment'  = 'spring-boot-production-deployment'
  'security-best-practices'= 'spring-security-best-practices'
  'dependency-injection'   = 'spring-di'
  'bean-lifecycle'         = 'spring-bean-lifecycle'
  'unit-testing'           = 'spring-unit-testing'
  'integration-testing'    = 'spring-integration-testing'
}

# Build planned renames: keep first occurrence (canonical) optionally mapping to domainMap value; subsequent occurrences get suffix -advanced-N unless domainMap used.
$planned = @()
foreach($group in $duplicates){
  $slug = $group.Name
  $instances = $group.Group | Sort-Object { $_.Dir.FullName }
  $i = 0
  foreach($inst in $instances){
    $oldDir = $inst.Dir
    $numberPart = ($oldDir.Name -replace '^lesson-(\d+)-.*$','$1')
    $newSlug = $slug
    if($i -eq 0){
      if($domainMap.ContainsKey($slug)){ $newSlug = $domainMap[$slug] }
    } else {
      if($domainMap.ContainsKey($slug)){
        # Additional duplicates get domain slug plus qualifier
        $newSlug = $domainMap[$slug] + "-advanced-$i"
      } else {
        $newSlug = $slug + "-advanced-$i"
      }
    }
    if($newSlug -ne $slug){
      $newName = "lesson-$numberPart-$newSlug"
    } else {
      # slug unchanged (first occurrence w/out mapping)
      $newName = $oldDir.Name
    }
    $planned += [PSCustomObject]@{Original=$oldDir.FullName;PlannedName=$newName;PlannedPath=(Join-Path ($oldDir.Parent.FullName) $newName);Slug=$slug;NewSlug=$newSlug;Index=$i}
    $i++
  }
}

Write-Host "Duplicate groups: $($duplicates.Count)" -ForegroundColor Yellow
$planned | Format-Table Slug,Index,Original,PlannedPath -AutoSize

if(-not $Apply){
  Write-Host "Review the plan above. Re-run with -Apply to perform renames." -ForegroundColor Magenta
  exit
}

Write-Host "Applying renames..." -ForegroundColor Cyan
foreach($p in $planned){
  if($p.Original -ne $p.PlannedPath){
    if(Test-Path $p.PlannedPath){
      Write-Warning "Target exists, skipping: $($p.PlannedPath)"
      continue
    }
    try {
      Move-Item -Path $p.Original -Destination $p.PlannedPath
      Write-Host "Renamed: $($p.Original) -> $($p.PlannedPath)" -ForegroundColor Green
      # Update README title if exists
      $readme = Join-Path $p.PlannedPath 'README.md'
      if(Test-Path $readme){
        $raw = Get-Content -Raw $readme
        $titleLine = ($p.NewSlug -split '-') | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) } | ForEach-Object { $_ } -join ' '
        $raw = $raw -replace '^# .*', "# $titleLine"
        Set-Content -Path $readme -Value $raw
      }
    } catch {
      Write-Warning "Failed rename: $($p.Original) -> $($p.PlannedPath) :: $($_.Exception.Message)"
    }
  }
}
Write-Host "Normalization pass complete." -ForegroundColor Green
