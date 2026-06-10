param(
  [string]$Root = "d:\GitHub_Src\Interview\complete_java_prep"
)

$planPath = Join-Path $Root "PLAN.md"
$lessonsRoot = Join-Path $Root "lessons"

if (-not (Test-Path $planPath)) {
  throw "PLAN.md not found at $planPath"
}

if (-not (Test-Path $lessonsRoot)) {
  throw "Lessons root not found at $lessonsRoot"
}

$plan = Get-Content $planPath

function Get-LessonDirectories([string]$lessonId) {
  Get-ChildItem -Path $lessonsRoot -Directory -Filter "lesson-$lessonId-*" -ErrorAction SilentlyContinue
}

function Has-PlaceholderContent([string]$filePath, [string[]]$patterns) {
  if (-not (Test-Path $filePath)) {
    return $false
  }

  $content = Get-Content $filePath -Raw
  foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
      return $true
    }
  }
  return $false
}

$requiredFiles = @(
  "README.md",
  "lecture-notes.md",
  "exercises.md",
  "glossary.md",
  "checklist.md",
  "exercises-answers.md",
  "answer-code-sample.md",
  "rubric.md",
  "sample-project\\README.md",
  "sample-project\\src\\main\\java\\App.java",
  "sample-project\\src\\main\\java\\AnswerApp.java"
)

$expectedLessons = @()
foreach ($line in $plan) {
  if ($line -match "^### Lesson\s+([0-9]+\.[0-9]+)\s+-\s+(.+)$") {
    $expectedLessons += [PSCustomObject]@{
      Id = $matches[1]
      Title = $matches[2].Trim()
    }
  }
}

$missingDirs = @()
$missingFiles = @()
$placeholderHits = @()

foreach ($lesson in $expectedLessons) {
  $lessonDirs = Get-LessonDirectories -lessonId $lesson.Id
  if (-not $lessonDirs -or $lessonDirs.Count -eq 0) {
    $missingDirs += "lesson-$($lesson.Id)-* (from PLAN: $($lesson.Title))"
    continue
  }

  foreach ($dir in $lessonDirs) {
    foreach ($required in $requiredFiles) {
      $path = Join-Path $dir.FullName $required
      if (-not (Test-Path $path)) {
        $missingFiles += $path
      }
    }

    $answerCodeSample = Join-Path $dir.FullName "answer-code-sample.md"
    if (Has-PlaceholderContent -filePath $answerCodeSample -patterns @(
      "Step 1: Build minimal working behavior",
      "Provide a direct answer implementation reference",
      "intentionally plain Java to keep compilation simple"
    )) {
      $placeholderHits += "$($dir.Name): answer-code-sample.md contains placeholder/template content"
    }

    $answerApp = Join-Path $dir.FullName "sample-project\\src\\main\\java\\AnswerApp.java"
    if (Has-PlaceholderContent -filePath $answerApp -patterns @(
      "cannot run standalone",
      "representative patterns",
      "Replace the body with the actual implementation"
    )) {
      $placeholderHits += "$($dir.Name): sample-project/src/main/java/AnswerApp.java contains conceptual placeholder content"
    }

    $app = Join-Path $dir.FullName "sample-project\\src\\main\\java\\App.java"
    if (Has-PlaceholderContent -filePath $app -patterns @(
      "Step 1: Add baseline implementation",
      "Step 2: Add validation and edge-case handling",
      "Step 3: Refactor for readability"
    )) {
      $placeholderHits += "$($dir.Name): sample-project/src/main/java/App.java still contains starter TODO placeholders"
    }
  }
}

Write-Output "Expected lessons from PLAN: $($expectedLessons.Count)"
Write-Output "Missing lesson directories: $($missingDirs.Count)"
Write-Output "Missing required files: $($missingFiles.Count)"
Write-Output "Placeholder/template quality hits: $($placeholderHits.Count)"

if ($missingDirs.Count -gt 0) {
  Write-Output ""
  Write-Output "Missing lesson directories (first 20):"
  $missingDirs | Select-Object -First 20 | ForEach-Object { Write-Output "  - $_" }
}

if ($missingFiles.Count -gt 0) {
  Write-Output ""
  Write-Output "Missing files (first 30):"
  $missingFiles | Select-Object -First 30 | ForEach-Object { Write-Output "  - $_" }
}

if ($placeholderHits.Count -gt 0) {
  Write-Output ""
  Write-Output "Placeholder/template findings (first 40):"
  $placeholderHits | Select-Object -First 40 | ForEach-Object { Write-Output "  - $_" }
}

if ($missingDirs.Count -eq 0 -and $missingFiles.Count -eq 0 -and $placeholderHits.Count -eq 0) {
  Write-Output ""
  Write-Output "PASS: lesson assets and quality checks are complete."
} else {
  exit 1
}
