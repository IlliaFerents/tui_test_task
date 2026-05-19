import type { Page } from "@playwright/test";
import { SearchPanelComponent } from "../page-components/search-panel.component";

export class HomePage {
    readonly page: Page;
    readonly searchPanel: SearchPanelComponent;

    constructor(page: Page) {
        this.page = page;
        this.searchPanel = new SearchPanelComponent(page);
    }

    /**
     * Navigates to the home page.
     */
    async goto(): Promise<void> {
        await this.page.goto("/h");
    }
}
