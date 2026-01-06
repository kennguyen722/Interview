# Lesson 27: Code Review Best Practices & Guidelines

## Objective
Master the art of giving and receiving code reviews. Learn what makes a great reviewer, how to provide constructive feedback, and what to look for when reviewing TypeScript code.

## Topics Covered

### 1. The Purpose of Code Reviews
- **Knowledge Transfer**: Share patterns and best practices
- **Quality Gate**: Catch bugs and potential issues early
- **Architecture Validation**: Ensure adherence to design principles
- **Learning Opportunity**: Improve reviewer and author skills
- **Collective Ownership**: Distribute knowledge across team

### 2. What to Look For in Code Reviews

#### 2.1 Correctness & Logic
```typescript
// ❌ PROBLEM: Logic error
function getUserAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear; // Off by one on birthday
}

// ✅ SOLUTION: Handle birthday calculation
function getUserAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
```

#### 2.2 Type Safety
```typescript
// ❌ PROBLEM: Loose typing
function processUser(user: any) {
  return user.name.toUpperCase(); // Can crash if name is null
}

// ✅ SOLUTION: Proper typing with non-null assertions
function processUser(user: User): string {
  if (!user.name) throw new Error("User name is required");
  return user.name.toUpperCase();
}
```

#### 2.3 Error Handling
```typescript
// ❌ PROBLEM: Unhandled promise rejection
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`); // May throw
  return response.json();
}

// ✅ SOLUTION: Proper error handling
async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return Err(new Error(`HTTP ${response.status}`));
    }
    const data = await response.json();
    return Ok(User.parse(data)); // Validate schema
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}
```

#### 2.4 Performance Issues
```typescript
// ❌ PROBLEM: Inefficient algorithm O(n²)
function removeDuplicates(items: string[]): string[] {
  return items.filter((item, index) =>
    items.indexOf(item) === index
  );
}

// ✅ SOLUTION: O(n) with Set
function removeDuplicates(items: string[]): string[] {
  return Array.from(new Set(items));
}

// ❌ PROBLEM: Creating new objects in loops
function processLargeArray(items: Item[]): Result[] {
  return items.map(item => ({
    ...item, // Object spread in loop
    processed: true
  }));
}

// ✅ SOLUTION: Reuse where possible
function processLargeArray(items: Item[]): Result[] {
  return items.map(item => ({ ...item, processed: true }));
}
```

#### 2.5 Complexity & Readability
```typescript
// ❌ PROBLEM: Too complex, hard to follow
function validateAndProcess(data: any, rules: any[]) {
  if (!data) return null;
  const processed = rules.reduce((acc, rule) => {
    if (rule.condition(acc)) return rule.transform(acc);
    return acc;
  }, data);
  if (!processed) return null;
  return processed.map(x => x.value).filter(x => x > 0);
}

// ✅ SOLUTION: Break into smaller functions
function isValidData(data: unknown): data is Record<string, unknown> {
  return data !== null && typeof data === 'object';
}

function applyRules(data: Data, rules: Rule[]): Data {
  return rules.reduce((acc, rule) => 
    rule.condition(acc) ? rule.transform(acc) : acc,
    data
  );
}

function extractAndFilterValues(data: Data): number[] {
  return data
    .map(x => x.value)
    .filter(x => x > 0);
}

function validateAndProcess(data: unknown, rules: Rule[]): number[] | null {
  if (!isValidData(data)) return null;
  const processed = applyRules(data, rules);
  if (!processed) return null;
  return extractAndFilterValues(processed);
}
```

#### 2.6 Testing
```typescript
// ❌ PROBLEM: No tests
function calculateDiscount(price: number, quantity: number): number {
  return price * quantity * (quantity > 10 ? 0.9 : 1);
}

// ✅ SOLUTION: Comprehensive tests
describe('calculateDiscount', () => {
  it('returns original price for quantity <= 10', () => {
    expect(calculateDiscount(100, 5)).toBe(500);
    expect(calculateDiscount(100, 10)).toBe(1000);
  });

  it('applies 10% discount for quantity > 10', () => {
    expect(calculateDiscount(100, 11)).toBe(990);
  });

  it('handles edge cases', () => {
    expect(calculateDiscount(0, 5)).toBe(0);
    expect(calculateDiscount(100, 0)).toBe(0);
  });
});
```

### 3. How to Give Effective Feedback

#### 3.1 The Feedback Framework

**1. Be Specific**
```
❌ BAD: "This function is too complex"
✅ GOOD: "This function has 5 nested conditions. Consider extracting 
          validation logic to a separate function to improve readability"
```

**2. Explain the Why**
```
❌ BAD: "Don't use any type"
✅ GOOD: "The any type bypasses type safety. Using a proper interface
          allows TypeScript to catch errors at compile time. Can you
          define the User interface instead?"
```

**3. Suggest Solutions**
```
❌ BAD: "This performance is bad"
✅ GOOD: "This uses Array.indexOf in a loop (O(n²)).
          Consider using a Set for O(n): new Set(items)"
```

**4. Acknowledge Good Work**
```
✅ GREAT: "I like how you separated validation logic. It makes the 
          code easier to test. One suggestion: consider extracting 
          the phone regex to a constant for reusability."
```

### 4. Review Checklist

**Architecture & Design**
- [ ] Follows SOLID principles
- [ ] Appropriate design patterns used
- [ ] Dependencies point in correct direction
- [ ] No tight coupling between modules

**Type Safety**
- [ ] No `any` types (or justified with comment)
- [ ] Proper use of unions/discriminated unions
- [ ] Type guards for narrowing
- [ ] Generics used appropriately

**Error Handling**
- [ ] All error cases handled
- [ ] No silent failures
- [ ] User-friendly error messages
- [ ] Proper error propagation

**Performance**
- [ ] Appropriate algorithms (O(n) not O(n²) without justification)
- [ ] No unnecessary object creation in loops
- [ ] Caching where beneficial
- [ ] Lazy loading for expensive operations

**Testing**
- [ ] Unit tests for business logic
- [ ] Edge cases covered
- [ ] Happy path and error paths tested
- [ ] Mocks used appropriately

**Security**
- [ ] No hardcoded secrets
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention

**Documentation**
- [ ] Complex logic explained
- [ ] API contracts documented
- [ ] Edge cases noted
- [ ] Examples provided for public APIs

### 5. Code Review Anti-Patterns to Avoid

#### The Nitpicker
```
❌ Rejecting PR over trailing whitespace or style inconsistencies
✅ Use linters to enforce style, focus reviews on logic and design
```

#### The Perfectionist
```
❌ Requiring gold-plated code when 80/20 solution works
✅ Balance perfect with pragmatic, allow incremental improvements
```

#### The Gatekeeper
```
❌ Blocking PRs to maintain control/expertise
✅ Facilitate team growth, accept good-enough solutions
```

#### The Ghost
```
❌ Never reviewing anyone else's code
✅ Participate actively in reviews, share knowledge
```

### 6. Receiving Code Review Feedback

**Do**
- ✅ Listen to understand the reviewer's perspective
- ✅ Ask clarifying questions if feedback is unclear
- ✅ Implement suggestions if they improve the code
- ✅ Explain your approach if disagreeing
- ✅ Thank reviewers for their time

**Don't**
- ❌ Argue defensively
- ❌ Dismiss feedback without consideration
- ❌ Blame the reviewer for not understanding
- ❌ Make changes just to get approved
- ❌ Leave unresolved discussions

## Learning Outcomes
- Conduct effective code reviews
- Provide constructive feedback
- Recognize common code issues
- Balance quality with pragmatism
- Build stronger teams through review

## Resources
- [Google Code Review Guide](https://google.github.io/eng-practices/review/)
- [Thoughtbot Code Review Guide](https://github.com/thoughtbot/guides/tree/main/code-review)
- [Microsoft Code Review Best Practices](https://docs.microsoft.com/en-us/azure/devops/repos/git/best-practices-git)
