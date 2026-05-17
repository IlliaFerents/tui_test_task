[![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/IlliaFerents/tui_test_task?utm_source=oss&utm_medium=github&utm_campaign=IlliaFerents%2Ftui_test_task&labelColor=171717&color=FF570A&label=CodeRabbit+Reviews)](https://coderabbit.ai)

# TUI Test Task 🎭

A highly professional, pre-configured **Playwright** automation framework utilizing **TypeScript**, linted with **ESLint v10**, formatted with **Prettier**, and protected by **Husky** + **lint-staged** hooks.

---

## 🛠️ Tech Stack & Dependencies

The following dependencies have been successfully installed and configured:

| Package | Purpose |
| :--- | :--- |
| **`@playwright/test`** | Core end-to-end browser automation framework. |
| **`@faker-js/faker`** | Generate realistic mockup/fake data (names, emails, addresses, etc.) for testing. |
| **`dotenv`** | Load environment variables from a `.env` file into `process.env`. |
| **`eight-colors`** | High-performance, lightweight terminal text colorization utility. |
| **`eslint`** | JavaScript/TypeScript linter (v10+ with Flat Config). |
| **`prettier`** | Automated code formatter. |
| **`eslint-config-prettier`** | Disables ESLint rules that conflict with Prettier. |
| **`eslint-plugin-playwright`** | Special linting rules and best practices for Playwright tests. |
| **`eslint-plugin-prettier`** | Integrates Prettier checks directly into the ESLint execution. |
| **`husky`** | Git hook manager to prevent bad commits. |
| **`lint-staged`** | Runs linting and formatting only on staged files for super-fast git commits. |
| **`typescript`** | Strongly-typed programming language. |
| **`@typescript-eslint/parser` & `plugin`** | TypeScript parser and rules for ESLint. |

---

## 📁 Repository Structure

```tree
tui_test_task/
├── .github/workflows/    # CI/CD: Playwright GitHub Actions workflow
├── .husky/               # Git hook hooks (pre-commit)
├── node_modules/         # Dependencies
├── tests/                # Test suites folder
│   └── example.spec.ts   # Example test cases
├── .env                  # Private local environment variables (gitignored)
├── .env.example          # Template for environment variables
├── .gitignore            # Git exclusion list
├── .lintstagedrc.json    # Lint-staged rules (runs on pre-commit)
├── .prettierrc           # Prettier styling configuration
├── eslint.config.js      # ESLint v10 Flat Config (TS, Playwright, Prettier)
├── package.json          # Package manifest & scripts
├── playwright.config.ts  # Playwright global settings (Dotenv integrated)
├── tsconfig.json         # TypeScript compiler configurations
└── README.md             # This documentation
```

---

## 🚀 Available NPM Scripts

Run these scripts from the project root:

| Command | Action |
| :--- | :--- |
| **`npm run test`** | Executes Playwright tests headlessly. |
| **`npm run test:ui`** | Launches Playwright's interactive HTML UI mode. |
| **`npm run lint`** | Runs ESLint and Prettier check across the codebase. |
| **`npm run lint:fix`** | Runs ESLint and Prettier check with auto-fixing enabled. |
| **`npm run format`** | Runs Prettier format and writes changes back to all files. |

---

## ⚙️ Configuration Details

### 1. Environment Variables (`.env`)
Environment variables are configured in the `.env` file at the root. The `playwright.config.ts` loads this file automatically on start:
```typescript
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });
```

### 2. ESLint v10 Flat Config (`eslint.config.js`)
Configured to use **ESLint Flat Config** for:
- TypeScript linting using `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin`.
- Playwright-specific rules targeting the `tests/` directory.
- Prettier integration so stylistic concerns are highlighted as error reports and fixed automatically.
- Global node environment configuration for configuration files.

### 3. Git pre-commit hooks (`Husky` + `lint-staged`)
When you run `git commit`, Husky triggers `.husky/pre-commit` which executes `npx lint-staged`.
`lint-staged` checks:
- **`*.{js,ts}` files**: automatically runs `eslint --fix` and `prettier --write` so all code committed is syntactically flawless and perfectly formatted.
- **`*.{json,md,yml}` files**: automatically runs `prettier --write`.

---

## 🧑‍💻 How to Get Started

1. **Clone the repository and install dependencies (if not already done):**
   ```bash
   npm install
   ```

2. **Configure your local environment:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. **Run the example tests:**
   ```bash
   npm run test
   ```

4. **Run the linter to verify code quality:**
   ```bash
   npm run lint
   ```
