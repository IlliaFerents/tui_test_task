import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { SearchResultsPage } from "../pages/search-results.page";
import { AccommodationDetailsPage } from "../pages/accommodation-details.page";
import { BookFlowSummaryPage } from "../pages/book-flow-summary.page";
import { PassengerDetailsPage } from "../pages/passenger-details.page";
import { BookingJourneyActor, type BookingContext } from "../util/actors/booking-journey.actor";
import { logBookingData } from "../util/data/booking-context.formatter";
import * as generator from "../util/data/generator";

export const pageFixtures = base.extend<{
    homePage: HomePage;
    searchResultsPage: SearchResultsPage;
    accommodationDetailsPage: AccommodationDetailsPage;
    bookFlowSummaryPage: BookFlowSummaryPage;
    passengerDetailsPage: PassengerDetailsPage;
    bookingJourneyActor: BookingJourneyActor;
    passengerDetailsSetup: BookingContext;
}>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    accommodationDetailsPage: async ({ page }, use) => {
        await use(new AccommodationDetailsPage(page));
    },
    bookFlowSummaryPage: async ({ page }, use) => {
        await use(new BookFlowSummaryPage(page));
    },
    passengerDetailsPage: async ({ page }, use) => {
        await use(new PassengerDetailsPage(page));
    },
    bookingJourneyActor: async (
        { homePage, searchResultsPage, accommodationDetailsPage, bookFlowSummaryPage, passengerDetailsPage },
        use
    ) => {
        await use(
            new BookingJourneyActor(
                homePage,
                searchResultsPage,
                accommodationDetailsPage,
                bookFlowSummaryPage,
                passengerDetailsPage,
                generator
            )
        );
    },
    passengerDetailsSetup: async ({ bookingJourneyActor }, use, testInfo) => {
        const ctx = await bookingJourneyActor.navigateToPassengerDetails();
        logBookingData(ctx, testInfo);
        await use(ctx);
    }
});
