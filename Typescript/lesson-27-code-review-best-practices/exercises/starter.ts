// ============================================================================
// CODE REVIEW EXERCISES
// ============================================================================

/**
 * EXERCISE 1: Identify Code Review Issues
 * 
 * Review the following code and identify at least 10 issues:
 * - Type safety problems
 * - Logic errors
 * - Performance issues
 * - Missing error handling
 * - Poor readability
 * - Security concerns
 */

function processUserData(data: any) {
  const users = JSON.parse(data);
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const email = user.email.toLowerCase();
    
    // TODO: send email
    const result = fetch(`/api/users/${email}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        users[i].verified = true;
        users[i].lastCheck = new Date();
      });
  }
  
  return users;
}

// TODO: Write a code review commenting on:
// - What's wrong with error handling
// - Type safety issues
// - Performance problems
// - Logic errors
// - Security concerns
// - How to improve it

/**
 * EXERCISE 2: Provide Constructive Feedback
 * 
 * For the code above, write:
 * 1. A specific issue identification
 * 2. An explanation of why it's a problem
 * 3. A suggested solution with code example
 */

// TODO: Write feedback following the template:
// "I noticed that [specific issue]. This is problematic because [explanation].
// I'd suggest [solution]. Here's how it might look:
// [code example]"

/**
 * EXERCISE 3: Review PRs Checklist
 * 
 * Create a custom code review checklist for your team covering:
 * - Architecture decisions
 * - Type safety requirements
 * - Error handling standards
 * - Testing requirements
 * - Performance expectations
 * - Security concerns
 * - Documentation standards
 */

// TODO: Create checklist for:
// 1. Your team's specific tech stack
// 2. Your project's architecture
// 3. Your team's coding standards
// 4. Performance requirements
// 5. Security requirements

/**
 * EXERCISE 4: Anti-Pattern Recognition
 * 
 * Identify which code review anti-pattern is being exhibited:
 */

// Scenario 1: Reviewer comments "Remove trailing whitespace"
// Anti-pattern: ________________

// Scenario 2: Reviewer blocks PR because they prefer a different algorithm
// even though current one is correct and performant
// Anti-pattern: ________________

// Scenario 3: Reviewer never leaves feedback on any PRs
// Anti-pattern: ________________

// Scenario 4: Reviewer approves any PR that technically works
// Anti-pattern: ________________

/**
 * EXERCISE 5: Respond to Feedback
 * 
 * You received this feedback on your PR:
 * "This function has too many responsibilities. The database query, 
 * validation, and email sending should be separated."
 * 
 * Write a response that:
 * - Acknowledges the feedback
 * - Asks clarifying questions (if needed)
 * - Commits to improving it
 * - Thanks the reviewer
 */

// TODO: Write your response here

/**
 * EXERCISE 6: Review & Refactor
 * 
 * The following code passed review but could be better.
 * Suggest improvements:
 */

class UserService {
  getUser(id: string) {
    const user = database.query(`SELECT * FROM users WHERE id = '${id}'`);
    if (user) {
      user.lastAccess = new Date();
      database.query(`UPDATE users SET lastAccess = '${user.lastAccess}' WHERE id = '${id}'`);
    }
    return user;
  }

  deleteUser(id: string) {
    try {
      database.query(`DELETE FROM users WHERE id = '${id}'`);
    } catch (e) {
      console.log("Error deleting user");
    }
  }
}

// TODO: Identify issues and suggest improvements:
// 1. _________________
// 2. _________________
// 3. _________________
// 4. _________________
// 5. _________________

/**
 * EXERCISE 7: Code Review Simulation
 * 
 * Partner exercise: Swap code with a peer
 * 1. Review each other's code using the checklist
 * 2. Provide constructive feedback
 * 3. Respond to feedback
 * 4. Implement improvements
 * 5. Re-review improved code
 */

// TODO: Follow this process with a peer

/**
 * EXERCISE 8: Recognize Good Code
 * 
 * What makes this code review-worthy?
 */

async function fetchUserSafely(id: string): Promise<Result<User>> {
  if (!id || typeof id !== "string") {
    return Err(new Error("Invalid user ID"));
  }

  try {
    const response = await fetch(`/api/users/${id}`, {
      timeout: 5000,
    });

    if (!response.ok) {
      return Err(new Error(`HTTP ${response.status}: ${response.statusText}`));
    }

    const data = await response.json();
    const user = User.parse(data); // Validates schema

    return Ok(user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Err(new Error(`Failed to fetch user: ${message}`));
  }
}

// TODO: List 5 things this code does well:
// 1. _________________
// 2. _________________
// 3. _________________
// 4. _________________
// 5. _________________

/**
 * EXERCISE 9: Mentor Feedback
 * 
 * A junior developer submitted this function.
 * Write feedback that is:
 * - Kind and encouraging
 * - Specific about what needs improvement
 * - Provides actionable suggestions
 * - Acknowledges good decisions
 */

function calculateTotal(items: any[]) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].quantity && items[i].price) {
      total = total + (items[i].quantity * items[i].price);
    }
  }
  return total;
}

// TODO: Write mentoring feedback

/**
 * EXERCISE 10: Create Team Standards
 * 
 * Document your team's code review standards:
 * 1. What is reviewed (architecture, types, tests, performance)
 * 2. How feedback is given (tone, specificity, actionability)
 * 3. How feedback is received (openness, questions, implementation)
 * 4. What can be auto-checked (linters, formatters)
 * 5. What requires human review (architecture, design)
 * 6. Turnaround time expectations
 * 7. When to block vs request changes
 */

// TODO: Create this document for your team
