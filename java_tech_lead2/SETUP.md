# Course Setup

<!-- @copilot:generate -->
This guide ensures environment consistency before working through lessons.

## 1. Prerequisites
- JDK 17 or later
- Maven 3.9+ (or Gradle 8+)
- Git
- Docker Desktop (for Testcontainers / microservices labs)
- IDE: IntelliJ IDEA / VS Code with Java extension

## 2. Quick Install (Windows PowerShell)
```powershell
winget install EclipseAdoptium.Temurin.17.JDK
winget install Apache.Maven
winget install Git.Git
```

## 3. Verify
```powershell
java -version
mvn -v
git --version
docker version
```

## 4. IDE Extensions
- VS Code: Extension Pack for Java, Test Runner, GitLens
- IntelliJ: Lombok plugin, SonarLint (optional)

## 5. Directory Conventions
All lessons use the structure: `lesson-XX-slug/` with code starter & solution folders.

## 6. Build Commands
```powershell
mvn clean test
```

## 7. Docker & Testcontainers
Enable Docker Desktop. Tests auto-pull images (PostgreSQL, Redis) where required.

## 8. Optional Tools
- `httpie` or `curl` for API testing
- `jq` for JSON inspection

## 9. Troubleshooting
| Issue | Cause | Fix |
|-------|-------|-----|
| Tests hang | Docker not running | Start Docker Desktop |
| Class not found | JDK mismatch | Reinstall JDK 17 and reimport project |
| Port conflicts | Previous container | `docker ps` then `docker rm -f` |

## 10. Next Steps
Review `COURSE-OVERVIEW.md` then begin with `01-java/01-basics/lesson-01-jdk-jre-jvm`.

---
*Setup file – extend if additional tooling is introduced.*
