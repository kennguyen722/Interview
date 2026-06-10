# Module 7 Solution - Frontend for Java Full Stack

Production frontend baseline for lessons 7.1 through 7.4.

## Lesson Coverage

- 7.1 TypeScript Fundamentals
  - Strongly typed API contracts and domain models.
- 7.2 React Fundamentals
  - Route-based SPA with context-driven auth state.
- 7.3 API Integration with Java Backend
  - Axios client with JWT token injection and refresh-on-load session rehydration.
- 7.4 UI Quality and Frontend Testing
  - Responsive CSS architecture and component test setup with Vitest + RTL.

## Tech Stack

- React 18 + TypeScript + Vite
- React Router
- Axios
- Vitest + Testing Library
- ESLint

## Run

```bash
npm install
npm run dev
```

Set backend URL if needed:

```bash
VITE_API_BASE_URL=http://localhost:8080 npm run dev
```

## Backend Compatibility

- Login and refresh use Module 6 endpoints.
- Order and report screens use Module 5 endpoints.

## Quality Notes

- Form labels and keyboard interaction are preserved.
- Mobile responsive layout at widths below 900px.
- Deterministic typed models reduce runtime contract drift.
