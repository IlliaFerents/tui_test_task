import type { Page, Locator } from "@playwright/test";

export class ProgressbarNavigationComponent {
    readonly container: Locator;
    readonly verderButton: Locator;
    readonly boekNuButton: Locator;

    constructor(page: Page) {
        this.container = page.locator("div.ProgressbarNavigation__pricePanelWrapper");
        this.verderButton = this.container.getByRole("button").filter({ hasText: /verder/i });
        this.boekNuButton = this.container.getByRole("button").filter({ hasText: /boek nu/i });
    }
}
