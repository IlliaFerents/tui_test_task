import type { Locator, Page } from "@playwright/test";
import { fieldLocators } from "../util/helpers/field-locators";

export class PromoCodeSection {
    readonly input: Locator;
    readonly applyButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        const container = page.locator("#discount__component");
        const field = fieldLocators(container);

        this.input = field.input;
        this.applyButton = container.getByText("Toepassen", { exact: true });
        this.errorMessage = field.error;
    }
}
