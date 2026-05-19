import type { Locator } from "@playwright/test";

/**
 * Dumb utility for a list of Playwright checkbox elements.
 * Knows nothing about airports, destinations, or any domain concept.
 */
export class CheckboxList {
    constructor(private readonly list: Locator) {}

    /**
     * Returns the trimmed inner text of every enabled (non-disabled) checkbox.
     */
    async getEnabledTexts(): Promise<string[]> {
        const texts: string[] = [];

        for (const checkbox of await this.list.all()) {
            const input = checkbox.locator("input");
            if (!(await input.isDisabled())) {
                const text = (await checkbox.innerText()).trim();
                if (text) texts.push(text);
            }
        }

        return texts;
    }

    /**
     * Clicks a checkbox by its text if it is not already checked.
     * @param text - The visible label of the checkbox to toggle on.
     */
    async toggle(text: string): Promise<void> {
        const checkbox = this.list.filter({ hasText: text });
        const input = checkbox.locator("input");

        if (!(await input.isChecked())) {
            await checkbox.click();
        }
    }
}
