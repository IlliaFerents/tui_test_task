const eslint = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const playwright = require("eslint-plugin-playwright");
const prettier = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
    // Global ignores
    {
        ignores: ["node_modules/**", "playwright-report/**", "test-results/**", "dist/**"]
    },
    // Base ESLint recommended configuration
    eslint.configs.recommended,
    // Node.js environment globals for config files
    {
        files: ["*.js", "*.config.ts"],
        languageOptions: {
            globals: {
                require: "readonly",
                module: "readonly",
                process: "readonly",
                __dirname: "readonly",
                console: "readonly"
            }
        }
    },
    // TypeScript recommended configurations mapped only to TS files
    ...tseslint.configs["flat/recommended"].map((config) => ({
        ...config,
        files: config.files || ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"]
    })),
    // TypeScript overrides & custom setup
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module"
            }
        },
        rules: {
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    ignoreRestSiblings: true,
                    argsIgnorePattern: "^_"
                }
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "enum",
                    format: ["PascalCase"]
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase"]
                }
            ]
        }
    },
    // Playwright configuration for test files
    {
        files: ["tests/**/*.spec.ts", "tests/**/*.test.ts", "e2e/**/*"],
        ...playwright.configs["flat/recommended"],
        rules: {
            ...playwright.configs["flat/recommended"].rules,
            "playwright/no-wait-for-timeout": "error",
            "playwright/no-focused-test": "error",
            "playwright/no-networkidle": "error",
            "playwright/no-skipped-test": "error",
            "playwright/no-slowed-test": "error",
            "playwright/no-eval": "error",
            "playwright/no-force-option": "warn",
            "playwright/prefer-native-locators": "warn",
            "playwright/prefer-web-first-assertions": "warn",
            "no-await-in-loop": "off",
            "class-methods-use-this": "off",
            "playwright/no-standalone-expect": "off",
            "playwright/no-conditional-in-test": "off",
            "playwright/expect-expect": "off",
            "playwright/valid-test-tags": [
                "error",
                {
                    allowedTags: [
                        "@passenger_details",
                        "@field_validation",
                        "@adult_passenger",
                        "@child_passenger",
                        "@smoke",
                        "@regression",
                        "@dob"
                    ]
                }
            ]
        }
    },
    // Prettier plugin & override integration (must be last)
    {
        plugins: {
            prettier: prettier
        },
        rules: {
            ...prettierConfig.rules,
            "prettier/prettier": "error"
        }
    }
];
