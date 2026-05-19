import type { Page } from "@playwright/test";
import { ProgressbarNavigationComponent } from "../page-components/progressbar-navigation.component";

export class AccommodationDetailsPage {
    readonly page: Page;
    readonly progressbarNavigation: ProgressbarNavigationComponent;

    constructor(page: Page) {
        this.page = page;
        this.progressbarNavigation = new ProgressbarNavigationComponent(page);
    }

    /**
     * Navigates forward to the booking flow summary page.
     */
    async proceedToSummary(): Promise<void> {
        await this.progressbarNavigation.verderButton.click();
    }
}
