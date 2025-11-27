# Script: find-duplicate-lessons.ps1
# Purpose: List duplicate lesson slugs (same concept appearing multiple times) to aid normalization.

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$dirs = Get-ChildItem -Path $root -Recurse -Directory -Filter 'lesson-*'
$data = foreach($d in $dirs){
  $slug = ($d.Name -replace '^lesson-\d+-','')
  [PSCustomObject]@{Slug=$slug;Path=$d.FullName}
}
$groups = $data | Group-Object -Property Slug | Where-Object { $_.Count -gt 1 }
if(-not $groups){ Write-Host "No duplicate slugs found."; exit }
$groups | ForEach-Object {
  [PSCustomObject]@{Slug=$_.Name;Count=$_.Count;Paths=($_.Group.Path -join '; ')}
} | Sort-Object Count -Descending | Format-Table -AutoSize
