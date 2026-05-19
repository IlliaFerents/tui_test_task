import type { Locator } from "@playwright/test";

export interface FieldLocators {
    input: Locator;
    error: Locator;
}

/**
 * Given a field wrapper locator (scoped by aria-label), returns the input and
 * its associated error element. Works for TUI's standard text field pattern:
 * wrapper → input + [role="alert"] error span.
 */
export function fieldLocators(wrapper: Locator): FieldLocators {
    return {
        input: wrapper.locator("input").filter({ visible: true }),
        error: wrapper.locator("[role='alert']")
    };
}
