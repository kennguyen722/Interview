# Development Environment Setup

## 📋 Prerequisites

### System Requirements
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory:** Minimum 8GB RAM (16GB recommended)
- **Storage:** 10GB free space
- **Internet:** Stable connection for downloading dependencies

## ☕ Java Development Kit (JDK)

### Recommended JDK Versions
1. **Primary:** OpenJDK 17 LTS (Long Term Support)
2. **Alternative:** OpenJDK 21 LTS (Latest LTS)
3. **Legacy:** OpenJDK 11 LTS (for older projects)

### Installation Options

#### Option 1: OpenJDK (Recommended)
```bash
# Windows (using Chocolatey)
choco install openjdk17

# macOS (using Homebrew)
brew install openjdk@17

# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# CentOS/RHEL
sudo yum install java-17-openjdk-devel
```

#### Option 2: SDKMAN (Multi-version management)
```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# List available Java versions
sdk list java

# Install Java 17
sdk install java 17.0.9-tem

# Set as default
sdk default java 17.0.9-tem
```

### Verification
```bash
# Check Java version
java -version
javac -version

# Check JAVA_HOME
echo $JAVA_HOME
```

## 🛠️ Integrated Development Environment (IDE)

### Primary Choice: IntelliJ IDEA

#### Installation
1. Download from [JetBrains website](https://www.jetbrains.com/idea/)
2. Choose **Community Edition** (free) or **Ultimate Edition** (paid)
3. Install with default settings

#### Essential Plugins
```
- Spring Boot
- Spring Security
- Maven Helper
- Gradle
- Docker
- AWS Toolkit
- SonarLint
- CheckStyle-IDEA
- SpotBugs
```

#### Configuration
```
1. File → Settings → Build → Build Tools → Maven
   - Set Maven home directory
   - Configure settings.xml location

2. File → Settings → Build → Build Tools → Gradle
   - Use Gradle wrapper
   - Set Gradle JVM to Project JDK

3. File → Settings → Editor → Code Style → Java
   - Set tab size: 4 spaces
   - Enable "Use tab character": false
```

### Alternative: Visual Studio Code

#### Installation
1. Download from [VS Code website](https://code.visualstudio.com/)
2. Install **Extension Pack for Java**

#### Essential Extensions
```
- Extension Pack for Java
- Spring Boot Extension Pack
- Docker
- AWS Toolkit
- SonarLint
- GitLens
```

## 🏗️ Build Tools

### Maven

#### Installation
```bash
# Windows (Chocolatey)
choco install maven

# macOS (Homebrew)
brew install maven

# Ubuntu/Debian
sudo apt install maven

# Manual installation
# Download from https://maven.apache.org/download.cgi
# Extract and add to PATH
```

#### Configuration (~/.m2/settings.xml)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 
          http://maven.apache.org/xsd/settings-1.2.0.xsd">
  
  <localRepository>${user.home}/.m2/repository</localRepository>
  
  <profiles>
    <profile>
      <id>java17</id>
      <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
      </properties>
    </profile>
  </profiles>
  
  <activeProfiles>
    <activeProfile>java17</activeProfile>
  </activeProfiles>
  
</settings>
```

### Gradle

#### Installation
```bash
# Using SDKMAN
sdk install gradle

# Windows (Chocolatey)
choco install gradle

# macOS (Homebrew)
brew install gradle
```

#### Verification
```bash
mvn --version
gradle --version
```

## 🗄️ Database Setup

### H2 Database (Embedded)
- No installation required
- Used for development and testing
- In-memory and file-based options

### PostgreSQL (Production-like)

#### Installation
```bash
# Windows (Chocolatey)
choco install postgresql

# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Docker (Recommended for development)
docker run --name postgres-dev \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=testdb \
  -p 5432:5432 \
  -d postgres:15
```

## 🐳 Docker Setup

### Installation
1. Download [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install with default settings
3. Start Docker Desktop

### Verification
```bash
docker --version
docker-compose --version

# Test installation
docker run hello-world
```

### Useful Images for Course
```bash
# Pull commonly used images
docker pull openjdk:17-jdk-alpine
docker pull postgres:15
docker pull redis:7-alpine
docker pull nginx:alpine
docker pull rabbitmq:3-management
```

## 🌐 Web Browser Setup

### Required Browser Extensions

#### Chrome/Edge
- **JSON Formatter** - Format JSON responses
- **Postman Interceptor** - API testing
- **React Developer Tools** - Frontend debugging
- **Redux DevTools** - State management debugging

#### Firefox
- **JSONView** - JSON formatting
- **RESTClient** - API testing

## 📡 API Testing Tools

### Postman
1. Download from [Postman website](https://www.postman.com/downloads/)
2. Create account (free)
3. Install desktop application

### Alternative: HTTPie
```bash
# Installation
pip install httpie

# Usage example
http GET https://api.github.com/users/octocat
```

## 🔧 Additional Tools

### Git Configuration
```bash
# Set global configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main

# Enable credential helper
git config --global credential.helper store
```

### Terminal Enhancement

#### Windows: PowerShell 7
```powershell
# Install PowerShell 7
winget install Microsoft.PowerShell

# Install Oh My Posh (optional)
winget install JanDeDobbeleer.OhMyPosh
```

#### macOS/Linux: Oh My Zsh
```bash
# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Install useful plugins
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

## ☁️ Cloud Account Setup (Optional)

### AWS Free Tier
1. Create AWS account at [aws.amazon.com](https://aws.amazon.com/)
2. Enable MFA for root account
3. Create IAM user for development
4. Install AWS CLI:
   ```bash
   # Windows
   choco install awscli
   
   # macOS
   brew install awscli
   
   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

### Configure AWS CLI
```bash
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Default region: us-east-1
# Default output format: json
```

## 📚 Documentation Access

### Bookmark These Resources
- [Java SE Documentation](https://docs.oracle.com/javase/17/)
- [Spring Framework Reference](https://docs.spring.io/spring-framework/docs/current/reference/html/)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Docker Documentation](https://docs.docker.com/)

## ✅ Verification Checklist

Before starting the course, verify your setup:

```bash
# Java
□ java -version (shows Java 17+)
□ javac -version (shows Java 17+)
□ echo $JAVA_HOME (shows JDK path)

# Build Tools
□ mvn --version (shows Maven 3.6+)
□ gradle --version (shows Gradle 7+)

# IDE
□ IntelliJ IDEA or VS Code installed
□ Java extensions/plugins installed
□ Spring Boot plugins installed

# Database
□ PostgreSQL running (if installed)
□ H2 database accessible

# Container
□ docker --version (shows Docker 20+)
□ docker run hello-world (executes successfully)

# Version Control
□ git --version (shows Git 2.30+)
□ git config user.name (shows your name)
□ git config user.email (shows your email)

# Optional
□ aws --version (if using AWS)
□ Postman installed and working
```

## 🆘 Troubleshooting

### Common Issues

#### JAVA_HOME not set
```bash
# Windows
setx JAVA_HOME "C:\Program Files\OpenJDK\jdk-17"

# macOS/Linux (add to ~/.bashrc or ~/.zshrc)
export JAVA_HOME="$(/usr/libexec/java_home -v 17)"
```

#### Maven/Gradle not found
```bash
# Add to PATH
# Windows: Add Maven/Gradle bin directory to PATH in System Environment Variables
# macOS/Linux: Add to ~/.bashrc or ~/.zshrc
export PATH="$PATH:/opt/maven/bin:/opt/gradle/bin"
```

#### Docker permission denied (Linux)
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Logout and login again
```

### Getting Help

If you encounter setup issues:

1. **Check course discussions** in the repository issues
2. **Search Stack Overflow** for specific error messages
3. **Consult official documentation** for the tool you're having trouble with
4. **Ask in the course community** (provide full error messages and system details)

---

## 🎯 Next Steps

Once your environment is set up:

1. Clone this repository
2. Navigate to [01-java/](01-java/) to start the course
3. Follow the [CHECKLIST-STUDENT.md](CHECKLIST-STUDENT.md) for progress tracking

**Happy coding! 🚀**