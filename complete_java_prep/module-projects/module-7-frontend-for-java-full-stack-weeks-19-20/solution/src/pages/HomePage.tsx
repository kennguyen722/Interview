export const HomePage = (): JSX.Element => {
  return (
    <section className="panel">
      <h2>Overview</h2>
      <p>
        This frontend demonstrates the module objectives: TypeScript-first domain models,
        resilient API integration, JWT-authenticated routes, and test-ready UI flows.
      </p>
      <div className="grid2">
        <article>
          <h3>7.1 TypeScript Fundamentals</h3>
          <p>Strongly typed DTOs and API contracts in src/types and src/api.</p>
        </article>
        <article>
          <h3>7.2 React Fundamentals</h3>
          <p>Composable pages with route layout, context-based auth state, and reusable shell.</p>
        </article>
        <article>
          <h3>7.3 API Integration</h3>
          <p>Axios client with authenticated requests and token refresh-on-load behavior.</p>
        </article>
        <article>
          <h3>7.4 UI Quality</h3>
          <p>Accessible labels, mobile-first responsiveness, and deterministic component testing setup.</p>
        </article>
      </div>
    </section>
  );
};
