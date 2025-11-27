param(
  [Parameter(Mandatory = $true)] [string]$Owner,
  [Parameter(Mandatory = $true)] [string]$Repo,
  [Parameter(Mandatory = $false)] [string]$Branch = "master",
  [Parameter(Mandatory = $false)] [string]$Token
)

if (-not $Token) {
  $Token = $env:GITHUB_TOKEN
}

if (-not $Token) {
  Write-Error "GitHub token not provided. Pass -Token or set GITHUB_TOKEN env var."
  exit 1
}

$uri = "https://api.github.com/repos/$Owner/$Repo/branches/$Branch/protection"
$headers = @{
  Authorization = "Bearer $Token"
  Accept       = "application/vnd.github+json"
  "X-GitHub-Api-Version" = "2022-11-28"
}

try {
  Invoke-RestMethod -Method Delete -Uri $uri -Headers $headers | Out-Null
  Write-Host "Branch protection removed for $Owner/$Repo@$Branch" -ForegroundColor Yellow
} catch {
  Write-Error ($_.Exception.Message)
  if ($_.Exception.Response -and $_.Exception.Response.GetResponseStream) {
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.BaseStream.Position = 0
    $reader.DiscardBufferedData()
    $detail = $reader.ReadToEnd()
    Write-Error $detail
  }
  exit 1
}
