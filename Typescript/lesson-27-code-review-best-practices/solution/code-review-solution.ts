// ============================================================================
// LESSON 27: CODE REVIEW BEST PRACTICES - SOLUTION
// ============================================================================

/**
 * EXERCISE 1 SOLUTION: Common Issues Checklist
 */

const codeReviewChecklist = {
  correctness: [
    "Logic handles all cases",
    "Edge cases considered",
    "No off-by-one errors",
    "Return values are correct",
  ],
  typeSafety: [
    "All variables have types",
    "No implicit 'any' types",
    "Null/undefined handled",
    "Type casting avoided",
  ],
  errorHandling: [
    "All errors caught",
    "Errors provide context",
    "Fallbacks implemented",
    "No silent failures",
  ],
  performance: [
    "No obvious inefficiencies",
    "Algorithms are appropriate",
    "No unnecessary loops",
    "Memory usage reasonable",
  ],
  testing: [
    "Unit tests present",
    "Edge cases tested",
    "Happy path covered",
    "Error paths tested",
  ],
};

/**
 * EXERCISE 2 SOLUTION: Code Review Feedback Template
 */

interface CodeReviewFeedback {
  type: "issue" | "suggestion" | "compliment";
  severity: "critical" | "major" | "minor" | "nit";
  line: number;
  message: string;
  explanation: string;
  suggestion: string;
}

const exampleFeedback: CodeReviewFeedback[] = [
  {
    type: "issue",
    severity: "critical",
    line: 45,
    message: "Missing null check before accessing property",
    explanation:
      "user.profile could be null, causing runtime error if accessed without checking",
    suggestion: "Add: if (!user.profile) return error; OR user.profile?.name",
  },
  {
    type: "suggestion",
    severity: "minor",
    line: 78,
    message: "Consider using Map instead of object",
    explanation: "Using object for dynamic keys can cause prototype pollution issues",
    suggestion: "Change to: const cache = new Map<string, CachedValue>()",
  },
  {
    type: "compliment",
    severity: "nit",
    line: 12,
    message: "Nice error handling!",
    explanation: "Error message is clear and provides context for debugging",
    suggestion: "Keep it as is - this is a good pattern to follow elsewhere",
  },
];

/**
 * EXERCISE 3 SOLUTION: Anti-Pattern Recognition
 */

// Anti-pattern 1: The Nitpicker
class NitpickerReview {
  // ❌ "Why didn't you use const instead of let?"
  // ❌ "This variable name could be more descriptive"
  // ❌ "Missing semicolon on line 45"
  // Impact: Author feels discouraged, unproductive feedback

  // ✅ Better: Focus on logic, functionality, maintainability
  // ✅ Only mention style if it affects readability
  // ✅ Use linter for formatting issues
}

// Anti-pattern 2: The Perfectionist
class PerfectionistReview {
  // ❌ "This should be refactored to use a design pattern"
  // ❌ "This could be more generic/reusable"
  // ❌ Requesting major rewrites for minor improvements
  // Impact: Delays shipping, demoralizes team

  // ✅ Better: Perfect is enemy of good
  // ✅ Suggest improvements for future PRs
  // ✅ Accept "good enough" if it works
}

// Anti-pattern 3: The Gatekeeper
class GatekeeperReview {
  // ❌ "I don't understand this, so I'm rejecting it"
  // ❌ "This is not how I would write it"
  // ❌ Using authority to block instead of collaborate
  // Impact: Creates friction, kills collaboration

  // ✅ Better: Ask questions to understand
  // ✅ Request documentation if unclear
  // ✅ Collaborate on solution
}

// Anti-pattern 4: The Ghost
class GhostReview {
  // ❌ No feedback for days
  // ❌ Blocking reviews without explanation
  // ❌ No communication
  // Impact: Kills momentum, blocks team

  // ✅ Better: Review promptly (same day)
  // ✅ Approve if no issues
  // ✅ Communicate delays upfront
}

/**
 * EXERCISE 4 SOLUTION: Type Safety Review
 */

// ❌ Bad: Unsafe types
function processData_Bad(data: any): any {
  return data.field.nested.value; // Could fail at runtime
}

// ✅ Good: Type-safe
interface DataStructure {
  field: {
    nested: {
      value: string;
    };
  };
}

function processData_Good(data: DataStructure): string {
  return data.field.nested.value; // TypeScript guarantees safety
}

/**
 * EXERCISE 5 SOLUTION: Error Handling Review
 */

// ❌ Bad: Silent failure
function fetchUserData_Bad(id: string) {
  const user = database.find(id);
  return user; // Returns undefined silently
}

// ✅ Good: Explicit error handling
function fetchUserData_Good(id: string): { success: boolean; data?: any; error?: string } {
  const user = database.find(id);
  if (!user) {
    return { success: false, error: `User ${id} not found` };
  }
  return { success: true, data: user };
}

/**
 * EXERCISE 6 SOLUTION: Performance Review
 */

// ❌ Bad: O(n²) complexity
function findDuplicates_Bad(arr: number[]): number[] {
  const duplicates: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ Good: O(n) complexity
function findDuplicates_Good(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();

  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }

  return Array.from(duplicates);
}

/**
 * EXERCISE 7 SOLUTION: Security Review
 */

// ❌ Bad: SQL injection vulnerability
function getUserByEmail_Bad(email: string) {
  return database.query(`SELECT * FROM users WHERE email = '${email}'`);
}

// ✅ Good: Parameterized query
function getUserByEmail_Good(email: string) {
  return database.query("SELECT * FROM users WHERE email = ?", [email]);
}

/**
 * EXERCISE 8 SOLUTION: Testing Review
 */

// ❌ Bad: No tests
function calculateTax(amount: number): number {
  return amount * 0.08;
}

// ✅ Good: With tests
function calculateTax_Tested(amount: number): number {
  if (amount < 0) throw new Error("Amount must be positive");
  return amount * 0.08;
}

// Tests:
// test("calculateTax_Tested(100) returns 8", () => {
//   assert.equal(calculateTax_Tested(100), 8);
// });
// test("calculateTax_Tested throws on negative", () => {
//   assert.throws(() => calculateTax_Tested(-100));
// });

/**
 * EXERCISE 9 SOLUTION: Feedback in Practice
 */

const reviewComments = [
  {
    line: 25,
    bad: "Why did you use 'var'?",
    good: "Consider using 'const' or 'let' instead of 'var' to avoid hoisting issues",
  },
  {
    line: 42,
    bad: "This function is too long",
    good: "This function has multiple responsibilities - consider extracting the validation logic into a separate function",
  },
  {
    line: 68,
    bad: "This will be slow",
    good: "This O(n²) loop could be optimized to O(n) by using a Set to track seen values",
  },
];

/**
 * EXERCISE 10 SOLUTION: Team Code Review Standards
 */

const teamStandards = {
  reviews: {
    timeLimit: "Review within 24 hours",
    scope: "Focus on logic and architecture, not style",
    tone: "Be respectful and collaborative",
    blocking: "Only block on critical issues",
  },

  checklist: {
    correctness: "Logic is correct and handles edge cases",
    performance: "No obvious performance issues",
    security: "No security vulnerabilities",
    testing: "Adequate test coverage",
    documentation: "Code is clear or documented",
    style: "Follows coding guidelines (automated by linter)",
  },

  feedback: {
    praise: "Highlight good code",
    questions: "Ask before assuming",
    suggestions: "Offer solutions, not just criticism",
    scope: "Suggest future improvements separately",
  },
};

console.log("Code Review Solutions:");
console.log("Checklist items:", Object.keys(codeReviewChecklist));
console.log("Anti-patterns identified: 4 (Nitpicker, Perfectionist, Gatekeeper, Ghost)");
console.log("Feedback examples provided:", exampleFeedback.length);
