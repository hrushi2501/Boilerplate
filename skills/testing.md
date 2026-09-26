# Skill: Testing

## When to Use

Use when writing or running unit tests, integration tests, or end-to-end (E2E) smoke tests.

## Important Conventions

- **Test Runners**:
  - Unit/Integration tests: **Vitest** (`tests/unit/`).
  - End-to-end smoke tests: **Playwright** (`tests/e2e/`).
- **Config Files**:
  - Vitest: `vitest.config.ts` (configured with `@/*` alias).
  - Playwright: `playwright.config.ts` (configured for automated dev server startup).
- **Target Velocity**: Prioritize smoke tests, critical business logic, and utility functions over brittle 100% snapshot coverage during hackathons.

## Things to Avoid

- Do NOT commit failing tests.
- Do NOT write bloated, slow integration tests that require complex mocks for simple pure functions.
- Do NOT test implementation details of third-party libraries (e.g. testing Clerk internals).

## Relevant Commands

```bash
bun run test         # Run unit tests via Vitest
bun run test:watch   # Run Vitest in interactive watch mode
bun run test:e2e     # Run Playwright E2E test suite
```
