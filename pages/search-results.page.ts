import type { Page } from "@playwright/test";
import { SearchResultsListComponent } from "../page-components/search-results-list.component";

export class SearchResultsPage {
    readonly page: Page;
    readonly resultsList: SearchResultsListComponent;

    constructor(page: Page) {
        this.page = page;
        this.resultsList = new SearchResultsListComponent(page);
    }

    /**
     * Waits for the package search results to load completely by checking network response and container visibility.
     */
    async waitForResultsToLoad(): Promise<void> {
        await Promise.all([
            this.page.waitForResponse(
                (r) =>
                    r.url().includes("/packages") &&
                    r.url().includes("searchRequestType") &&
                    r.url().includes("searchType") &&
                    r.status() === 200
            ),
            this.resultsList.container.waitFor({ state: "visible" })
        ]);
    }
}
