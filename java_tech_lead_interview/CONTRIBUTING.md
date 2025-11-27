# Contributing to Java Tech Lead Interview Course

<!-- @copilot:generate
Goal: Automatically scaffold missing folders and lesson files.
Behavior: When encountering a missing lesson folder, generate full structure using LESSON-TEMPLATE.md.
-->

<!-- @copilot:expand
Goal: Expand any partial outline into full detailed lesson content.
-->

<!-- @copilot:lesson-auto
Goal: When adding a new topic, automatically:
  1. Create new lesson directory
  2. Generate README.md, LESSON.md, QUIZ.md, ANSWERS.md, EXERCISES.md
  3. Populate code/starter and code/solution with relevant scaffolding.
-->

We welcome contributions from the community! This guide will help you contribute effectively to improve the course for everyone.

## 🎯 Types of Contributions

### 1. Content Improvements
- Fix typos, grammar, or technical errors
- Add missing explanations or examples
- Update outdated information
- Improve code quality and best practices

### 2. New Content
- Add new lessons or exercises
- Create additional quiz questions
- Develop practice scenarios
- Add real-world case studies

### 3. Structure & Organization
- Improve lesson organization
- Enhance navigation
- Add cross-references
- Update templates

### 4. Code Examples
- Add working code examples
- Improve existing implementations
- Add test cases
- Fix compilation issues

## 📋 Contribution Guidelines

### Before Contributing

1. **Check existing issues** to avoid duplicate work
2. **Review the course structure** in [COURSE-OVERVIEW.md](COURSE-OVERVIEW.md)
3. **Follow the templates** defined in this repository
4. **Test your code** before submitting

### Coding Standards

#### Java Code
- Use **Java 17+ features** where appropriate
- Follow **Google Java Style Guide**
- Add **comprehensive comments** and JavaDoc
- Include **unit tests** for complex logic
- Ensure code **compiles and runs** successfully

```java
/**
 * Example of properly documented code
 * 
 * @param input The input parameter description
 * @return Description of what is returned
 * @throws IllegalArgumentException when input is invalid
 */
public String processInput(String input) {
    if (input == null || input.trim().isEmpty()) {
        throw new IllegalArgumentException("Input cannot be null or empty");
    }
    
    // Processing logic with clear comments
    return input.trim().toLowerCase();
}
```

#### Documentation
- Use **Markdown** for all documentation
- Follow **consistent formatting**
- Add **clear headings** and structure
- Include **practical examples**
- Use **proper grammar** and spelling

### File Naming Conventions

```
# Lessons
lesson-{number}-{descriptive-name}/

# Code files
Example_{Topic}_{Concept}.java
Exercise_{Topic}_{Number}.java
Solution_{Topic}_{Number}.java

# Test files
{ClassName}Test.java
```

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/java_tech_lead_interview.git
cd java_tech_lead_interview

# Add upstream remote
git remote add upstream https://github.com/original-owner/java_tech_lead_interview.git
```

### 2. Create a Branch

```bash
# Create a feature branch
git checkout -b feature/add-new-lesson

# Or bug fix branch
git checkout -b fix/correct-typo
```

### 3. Make Changes

Follow the appropriate template for your contribution:

#### Adding a New Lesson

1. **Create lesson directory** using the proper structure
2. **Copy from template** or existing lesson
3. **Fill in all required files:**
   - `README.md`
   - `LESSON.md`
   - `QUIZ.md`
   - `ANSWERS.md`
   - `EXERCISES.md`
   - `code/starter/`, `code/solution/`, `code/tests/`

#### Improving Existing Content

1. **Identify the issue** clearly
2. **Make targeted changes**
3. **Preserve existing structure**
4. **Update related files** if necessary

### 4. Test Your Changes

```bash
# Compile Java code
find . -name "*.java" -exec javac {} \;

# Run specific examples
cd path/to/lesson/code
javac *.java
java ExampleClassName

# Check markdown links
# Use a markdown linter if available
```

### 5. Commit and Push

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "Add lesson on Java concurrency fundamentals

- Add comprehensive explanation of thread safety
- Include practical examples with ExecutorService
- Add exercises with starter and solution code
- Create quiz with 8 questions covering key concepts"

# Push to your fork
git push origin feature/add-new-lesson
```

### 6. Create Pull Request

1. **Go to GitHub** and create a pull request
2. **Use the PR template** (see below)
3. **Provide clear description** of changes
4. **Reference any issues** being addressed
5. **Request review** from maintainers

## 📝 Pull Request Template

```markdown
## Description

Brief description of what this PR accomplishes.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made

- List specific changes
- Include file modifications
- Mention new additions

## Testing

- [ ] Code compiles without errors
- [ ] Examples run successfully
- [ ] Tests pass (if applicable)
- [ ] Documentation is accurate

## Checklist

- [ ] I have read the CONTRIBUTING guidelines
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## 🏗️ Repository Structure Rules

### Module Organization

```
XX-module-name/
├── MODULE-README.md          # Module overview and learning objectives
├── XX-submodule-name/        # Submodule grouping related lessons
│   ├── lesson-XX-topic/      # Individual lesson
│   │   ├── README.md         # Lesson metadata
│   │   ├── LESSON.md         # Main teaching content
│   │   ├── QUIZ.md          # Assessment questions
│   │   ├── ANSWERS.md       # Quiz answer key
│   │   ├── EXERCISES.md     # Hands-on practice
│   │   └── code/           # All code examples
│   │       ├── starter/    # Exercise starting points
│   │       ├── solution/   # Complete solutions
│   │       └── tests/      # Unit tests
│   └── ...
└── ...
```

### Content Standards

#### Lesson Content (LESSON.md)

1. **Learning Objectives** - Clear, measurable goals
2. **Why This Matters** - Context for tech leads
3. **Core Theory** - Fundamental concepts
4. **Code Examples** - Working, tested code
5. **Best Practices** - Industry standards
6. **Common Pitfalls** - What to avoid
7. **Interview Prep** - Quick reference
8. **Further Reading** - Additional resources

#### Quiz Standards (QUIZ.md)

- **5-10 questions** per lesson
- **Mix of question types:**
  - Multiple choice (concept understanding)
  - Short answer (practical application)
  - Code analysis (debugging skills)
  - Scenario-based (real-world application)

#### Exercise Standards (EXERCISES.md)

- **Progressive difficulty** - Start simple, build complexity
- **Clear requirements** - Specific outcomes expected
- **Starter code** - Scaffolding to reduce friction
- **Complete solutions** - Working reference implementations
- **Test cases** - Verify correctness

## 🔍 Review Process

### What Reviewers Look For

1. **Technical Accuracy** - Is the content correct?
2. **Code Quality** - Does it follow best practices?
3. **Clarity** - Is it easy to understand?
4. **Completeness** - Are all required files present?
5. **Consistency** - Does it match existing style?
6. **Relevance** - Is it appropriate for tech leads?

### Review Timeline

- **Initial review:** Within 3-5 business days
- **Follow-up reviews:** Within 2 business days
- **Merge:** After approval from 2+ maintainers

## 🏷️ Issue Labels

We use labels to organize issues and PRs:

- `good first issue` - Great for new contributors
- `enhancement` - New features or improvements
- `bug` - Something isn't working
- `documentation` - Documentation improvements
- `help wanted` - Extra attention needed
- `question` - Further information requested
- `duplicate` - Similar issue exists
- `wontfix` - Not planned for implementation

## 🎖️ Recognition

Contributors are recognized in several ways:

1. **Contributors list** in README
2. **Commit attribution** in Git history
3. **Special mentions** for significant contributions
4. **Maintainer status** for consistent, high-quality contributions

## 📞 Getting Help

### Questions About Contributing

1. **Check existing issues** and discussions first
2. **Create a new issue** with the `question` label
3. **Join community discussions** in the repository
4. **Contact maintainers** directly for urgent matters

### Contribution Ideas

Not sure what to contribute? Look for:

- Issues labeled `good first issue`
- Issues labeled `help wanted`
- Missing lessons in [COURSE-OVERVIEW.md](COURSE-OVERVIEW.md)
- Outdated content or broken links
- Areas where you have expertise

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for helping make this course better for everyone! 🚀**