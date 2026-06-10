/**
 * Lesson 7.4 - UI Quality and Frontend Testing
 *
 * Covers the testing pyramid, React Testing Library, and accessibility.
 *
 * KEY TERMS:
 *   RTL          - React Testing Library: tests from the user's perspective.
 *   Playwright   - E2E browser automation tool.
 *   a11y         - accessibility: making apps usable by all people.
 *   ARIA         - Accessible Rich Internet Applications attributes.
 *   test id      - a data-testid attribute used as a last-resort selector.
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 7.4: UI Quality and Frontend Testing ===\n");

        System.out.println("--- Frontend Testing Pyramid ---");
        System.out.println("  Unit tests    (Vitest / Jest)           -- fast, isolated, component logic");
        System.out.println("  Integration   (React Testing Library)   -- component render + interactions");
        System.out.println("  E2E           (Playwright)              -- full browser, real user flows");
        System.out.println("  Visual reg.   (Chromatic / Percy)       -- catch unintended style changes");

        System.out.println("\n--- React Testing Library pattern ---");
        System.out.println("  // Query by what the USER sees, not by implementation details");
        System.out.println("  const input = screen.getByLabelText(/email address/i);");
        System.out.println("  await userEvent.type(input, 'alice@example.com');");
        System.out.println("  await userEvent.click(screen.getByRole('button', { name: /submit/i }));");
        System.out.println("  expect(await screen.findByText('Welcome, Alice')).toBeInTheDocument();");
        System.out.println("\n  // AVOID: querying by CSS class or data-testid (couples to implementation)");
        System.out.println("  // BAD: container.querySelector('.submit-btn')");

        System.out.println("\n--- Accessibility checklist ---");
        String[] checks = {
            "All images have descriptive alt attributes",
            "Form inputs are associated with <label> via htmlFor",
            "Color contrast ratio >= 4.5:1 for normal text (WCAG AA)",
            "All interactive elements are keyboard-reachable",
            "Focus indicator is clearly visible",
            "ARIA roles used only when semantic HTML is insufficient",
            "Screen reader tested with VoiceOver or NVDA"
        };
        for (String c : checks) System.out.println("  [ ] " + c);

        System.out.println("\n--- Playwright E2E example ---");
        System.out.println("  test('user can log in and view dashboard', async ({ page }) => {");
        System.out.println("    await page.goto('/login');");
        System.out.println("    await page.fill('[name=email]', 'alice@example.com');");
        System.out.println("    await page.fill('[name=password]', 'secret');");
        System.out.println("    await page.click('button[type=submit]');");
        System.out.println("    await expect(page).toHaveURL('/dashboard');");
        System.out.println("    await expect(page.locator('h1')).toContainText('Welcome');");
        System.out.println("  });");
    }
}