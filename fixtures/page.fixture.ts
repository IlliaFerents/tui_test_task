import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { SearchResultsPage } from "../pages/search-results.page";
import { AccommodationDetailsPage } from "../pages/accommodation-details.page";
import { BookFlowSummaryPage } from "../pages/book-flow-summary.page";

export const pageFixtures = base.extend<{
    homePage: HomePage;
    searchResultsPage: SearchResultsPage;
    accommodationDetailsPage: AccommodationDetailsPage;
    bookFlowSummaryPage: BookFlowSummaryPage;
}>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    searchResultsPage: async ({ page }, use) => {
        const searchResultsPage = new SearchResultsPage(page);
        await use(searchResultsPage);
    },
    accommodationDetailsPage: async ({ page }, use) => {
        const accommodationDetailsPage = new AccommodationDetailsPage(page);
        await use(accommodationDetailsPage);
    },
    bookFlowSummaryPage: async ({ page }, use) => {
        const bookFlowSummaryPage = new BookFlowSummaryPage(page);
        await use(bookFlowSummaryPage);
    }
});
