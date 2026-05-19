import type { Page, Locator } from "@playwright/test";

export class SearchResultsListComponent {
    readonly container: Locator;
    readonly resultItems: Locator;
    readonly hotelNameLink: Locator;
    readonly continueButton: Locator;

    constructor(page: Page) {
        this.container = page.getByTestId("search-results-list");
        this.resultItems = page.getByTestId("result-item");
        this.hotelNameLink = page.getByTestId("hotel-name");
        this.continueButton = page.getByTestId("continue-button");
    }

    /**
     * Selects the first hotel from the search results list.
     * @returns The name of the selected hotel.
     */
    async selectFirstHotel(): Promise<string> {
        const firstResult = this.resultItems.first();
        const hotelName = await firstResult.locator(this.hotelNameLink).innerText();
        await firstResult.locator(this.continueButton).getByRole("button").click();
        return hotelName.trim();
    }
}
