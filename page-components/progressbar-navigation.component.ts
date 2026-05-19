import type { Page, Locator } from "@playwright/test";

export class ProgressbarNavigationComponent {
    private readonly page: Page;
    readonly container: Locator;
    readonly verderButton: Locator;
    readonly boekNuButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = page.locator("div.ProgressbarNavigation__pricePanelWrapper"); //ugly selector, needs replacement
        this.verderButton = this.container.getByRole("button").filter({ hasText: /verder/i });
        this.boekNuButton = this.container.getByRole("button").filter({ hasText: /boek nu/i });
    }
}
