# TUI.nl booking journey — TAF

Playwright + TypeScript automation covering the TUI.nl holiday booking flow (homepage through passenger details as setup) and field validation on the passenger details form.

## Setup

```bash
npm install
npx playwright install --with-deps
```

Copy `.env.example` to `.env` (defaults work out of the box):

```bash
cp .env.example .env
```

## Running tests

```bash
# Validation specs only, parallel, Chromium
npm run test:validation:parallel

# Open HTML report
npm run test:report
```

## Environment variables

| Variable        | Default              | Purpose                                      |
| --------------- | -------------------- | -------------------------------------------- |
| `BASE_URL`      | `https://www.tui.nl` | Target site URL                              |
| `LOG_TEST_DATA` | `true`               | Print generated test data to console         |
| `CI`            | —                    | Enables headless, retries (2), single worker |
| `DEBUG`         | —                    | Enables debug-level log output               |

## Project structure

```
├── pages/              Page objects (one per app page)
├── page-components/    Reusable UI components (sections, panels)
├── fixtures/           Playwright fixture layers
├── tests/
│   └── passenger-details/
│       └── validation/ Validation spec files + shared constants
├── util/
│   ├── actors/         High-level journey orchestrators
│   ├── api/            API response interceptors
│   ├── data/           Generators, date utils, formatters
│   ├── helpers/        Generic DOM helpers (checkbox lists, field locators)
│   └── system/         Logger
```

## Architecture decisions

### Page Object Model

Pages represent full app pages (`HomePage`, `PassengerDetailsPage`). Components represent reusable sections within pages (`SearchPanelComponent`, `LeadPassengerSection`). Pages compose components. Locators are class-level properties, never inline in test code.

`fieldLocators()` utility standardizes the input + error locator pair pattern across all form fields.

### Fixtures

Three fixture layers, composed into a single `test` export:

- **hookFixtures** — auto-dismisses the cookie consent dialog via `addLocatorHandler`
- **pageFixtures** — instantiates all page objects + the booking journey actor + provides `passengerDetailsSetup` (navigates to passenger details page before tests)
- **utilFixtures** — exposes data generators, logger, and booking context formatter

### Actor pattern

`BookingJourneyActor` drives the full multi-page booking flow (homepage → search → hotel → summary → passenger details). Serve as setup for validation tests.

The actor is consumed as a fixture dependency. Validation specs declare `passengerDetailsSetup` in their signature, which triggers the full journey as test precondition.

### Test design

Validation specs are split by concern:

- **required-fields** — submits empty form, checks all error messages appear
- **validation-name** — name length and character restrictions (BVA + EP)
- **validation-formats** — email, phone, postcode format rules (BVA + EP)
- **validation-date-of-birth** — partial/invalid date inputs
- **validation-dob-adult** — age boundary validation for adults (18–118 years)
- **validation-dob-child** — age boundary validation matching search panel selection
- **validation-promo-code** — empty and invalid promo code inputs

Boundary Value Analysis tests use dynamically computed dates based on the actual booked return date, so they stay correct regardless of when you run them.

### Pre-commit hooks

Husky + lint-staged runs ESLint and Prettier on staged `.ts`/`.tsx` files before every commit.

## Known challenges with TUI.nl

Anyone picking up this project will hit the same walls. TUI.nl is a difficult automation target.

**The site is slow.** Homepage regularly takes 60+ seconds to fully load. Every page transition (search results, accommodation, booking summary) involves heavy client-side rendering.

**Accessibility is broken across the board.** axe DevTools reports 31 violations on the passenger details page alone. Broken ARIA attributes, invalid heading hierarchy, orphaned list items, deeply nested interactive controls.

**Locator strategy lacks consistency.** TUI pages mix `data-test-id` (sparse), `aria-label` (often duplicated or empty), and plain class names. There's no single reliable approach that works across all elements, so this framework uses a pragmatic combination of all three.

