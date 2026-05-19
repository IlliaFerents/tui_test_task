import type { Page } from "@playwright/test";
import { ProgressbarNavigationComponent } from "../page-components/progressbar-navigation.component";

export class BookFlowSummaryPage {
    readonly page: Page;
    readonly progressbarNavigation: ProgressbarNavigationComponent;

    constructor(page: Page) {
        this.page = page;
        this.progressbarNavigation = new ProgressbarNavigationComponent(page);
    }

    /**
     * Navigates forward to the passenger details input page.
     */
    async proceedToPassengerDetails(): Promise<void> {
        await this.progressbarNavigation.boekNuButton.click();
    }
}
