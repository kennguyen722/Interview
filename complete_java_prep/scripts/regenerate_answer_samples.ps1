param(
  [string]$LessonsRoot = "d:\GitHub_Src\Interview\complete_java_prep\lessons"
)

Get-ChildItem -Path $LessonsRoot -Directory -Filter "lesson-*" | ForEach-Object {
  $lessonDir = $_.FullName
  $readmePath = Join-Path $lessonDir "README.md"
  $answerAppPath = Join-Path $lessonDir "sample-project\src\main\java\AnswerApp.java"
  $targetPath = Join-Path $lessonDir "answer-code-sample.md"

  if (-not (Test-Path $answerAppPath)) {
    return
  }

  $lessonTitle = $_.Name
  if (Test-Path $readmePath) {
    $headline = Get-Content $readmePath | Select-Object -First 1
    if ($headline -match "^#\s+(.+)$") {
      $lessonTitle = $matches[1]
    }
  }

  $java = Get-Content $answerAppPath -Raw
  $content = @"
# Answer Code Sample - $lessonTitle

## Java Answer (Complete Runnable)

~~~java
$java
~~~
"@

  Set-Content -Path $targetPath -Value $content -Encoding UTF8
}

Write-Output "Regenerated answer-code-sample.md files from sample-project AnswerApp.java"
