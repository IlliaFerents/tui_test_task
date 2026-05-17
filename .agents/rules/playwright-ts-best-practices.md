# Playwright + TypeScript best practices

> **Guidance, not law.** Use judgment. Spirit over letter. When the rule helps, apply it. When the context overrides it, say why.

---

## Page objects

- Page objects expose **actions and locators**. They never call `expect()`.
- Specs own all assertions. If a page method returns data, the spec asserts on it.
- Use a `BasePage` abstract class for shared logic (navigation, wait-for-ready, common locators). Subclasses add page-specific behavior.
- Constructor takes `Page` (or `Locator` for components). Store it as `protected readonly page`.
- Expose key locators as `readonly` class properties, initialized in the constructor.
- TSDoc every public method. One line: what it does. Include timeout behavior if relevant.

```typescript
/** Wait for the page to be fully interactive. */
async waitForReady(timeout = 15_000): Promise<void> { ... }
```

## Page components (composition over inheritance)

- Extract reusable UI fragments (modals, dropdowns, autocomplete, date pickers) into standalone component classes.
- Components accept `Page | Locator` as scope, so they work both page-wide and inside a container.
- Page objects compose components as `readonly` properties:

```typescript
export class BookingPage extends BasePage {
    readonly datePicker: DatePickerComponent;
    readonly guestSelector: GuestSelectorComponent;

    constructor(page: Page) {
        super(page);
        this.datePicker = new DatePickerComponent(page);
        this.guestSelector = new GuestSelectorComponent(page);
    }
}
```

- Components own their locators and actions. They do not assert.

## Fixtures

- Use Playwright's `test.extend<T>()` to inject page objects and utilities. Specs receive them as test arguments.
- Split fixtures by concern into separate files: `fixtures_pages.ts`, `fixtures_hooks.ts`, `fixtures_api.ts`.
- Merge them into a single `test` export via `mergeTests()`:

```typescript
export const test = mergeTests(pageFixtures, hookFixtures, apiFixtures);
export { expect };
```

- Specs import `{ test, expect }` from the fixtures barrel, never from `@playwright/test` directly.
- Use `{ auto: true }` fixtures for environment setup (cookies, route interception, consent banners).

## Specs

- One `test.describe` block per file. Focused scope (5-15 tests max).
- `beforeEach` handles navigation and ready-state. Each test starts clean.
- Tests are independent. No shared mutable state between tests.
- Use descriptive test names that read as behavior: `"displays error when name field is empty"`.
- All `expect()` calls live in the spec. Page objects return values; specs judge them.
- Print selected test data to console for traceability:

```typescript
console.log(`Selected: departure=${departure}, destination=${destination}, date=${date}`);
```

## Locator strategy

> **TBD.** Strategy to be defined based on the target app. Will be updated once the task is shared.

## Assertions

- Use Playwright's auto-retrying assertions: `toBeVisible()`, `toHaveText()`, `toHaveValue()`, `toHaveCount()`.
- Avoid `waitForTimeout()`. Wait for state instead: `waitFor({ state: "visible" })`.
- For negative assertions, use `toBeHidden()` or `not.toBeVisible()` with a reasonable timeout.
- Group related assertions in the same test. Split unrelated assertions into separate tests.

## Error handling in page methods

- Use `Promise.race()` for branching UI (autocomplete that might show results or "no results"):

```typescript
async selectFirstOrDismiss(field: Locator): Promise<void> {
    await Promise.race([
        this.result.waitFor({ state: "visible" }),
        this.noResults.waitFor({ state: "visible" }),
    ]);
    // branch based on which appeared
}
```

- Use `Promise.all()` for parallel waits during page transitions (URL change + element visible + hydration).

## Project structure

```
e2e/
├── fixtures/           # test.extend fixtures (pages, hooks, api)
├── pages/              # page objects (one per distinct page)
├── page-components/    # reusable UI fragment classes
├── tests/              # spec files organized by feature area
│   └── feature-area/
├── test-data/          # generators, factories, static data
├── util/               # shared helpers (selectors, conversions, etc.)
├── playwright.config.ts
└── tsconfig.json
```

## TypeScript conventions

- `consistent-type-imports`: always use `import type` for type-only imports.
- Explicit return types on all public page object methods.
- Use `readonly` for locator properties that don't change.
- Prefer `string[]` over `Array<string>`.
- Use template literals for dynamic test IDs:

```typescript
const testId = `add-event-${relation}-${eventType}`;
return this.scope.getByTestId(testId);
```

## Misc

- Keep timeouts configurable with sensible defaults (e.g., `timeout = 15_000`).
- Use `config` or env vars for environment-specific values (URLs, credentials). Never hardcode.
- Cookie/consent banner suppression belongs in an auto-fixture, not in each test.
- Use `for` loops over `Array.forEach` when doing sequential async operations on locator lists.
