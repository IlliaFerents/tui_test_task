import type { HomePage } from "../../pages/home.page";
import type { SearchResultsPage } from "../../pages/search-results.page";
import type { AccommodationDetailsPage } from "../../pages/accommodation-details.page";
import type { BookFlowSummaryPage } from "../../pages/book-flow-summary.page";
import type { PassengerDetailsPage } from "../../pages/passenger-details.page";
import type * as generator from "../data/generator";
import { NoAvailabilityError } from "../api/errors";
import { parseDutchDate } from "../data/date-utils";

export interface BookingContext {
    departureAirport: string;
    destinationCountry: string;
    destinationRegion: string;
    departureDate: string;
    returnDate: Date;
    adults: number;
    childAge: number[];
    hotelName: string;
}

const MAX_ATTEMPTS = 3;

export class BookingJourneyActor {
    constructor(
        private readonly homePage: HomePage,
        private readonly searchResultsPage: SearchResultsPage,
        private readonly accommodationDetailsPage: AccommodationDetailsPage,
        private readonly bookFlowSummaryPage: BookFlowSummaryPage,
        private readonly passengerDetailsPage: PassengerDetailsPage,
        private readonly generate: typeof generator
    ) {}

    /**
     * Drives the full booking journey (steps 1–11) from the homepage to the
     * passenger details page. Always books exactly 1 child alongside the configured
     * adults per task spec.
     *
     * Retries up to MAX_ATTEMPTS times only when the selected airport/destination combo
     * yields no available items (NoAvailabilityError). All other errors fail fast.
     *
     * @param adults - Number of adult guests. Defaults to 2 per task spec.
     * @param children - Number of children guests. Defaults to 1 per task spec.
     * @returns BookingContext with all selected values for logging and assertions.
     */
    async navigateToPassengerDetails(adults: number = 2, children: number = 1): Promise<BookingContext> {
        let lastError: NoAvailabilityError | undefined;

        for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                return await this.runBookingJourney(adults, children);
            } catch (error) {
                if (!(error instanceof NoAvailabilityError)) throw error;
                lastError = error;
                console.warn(`[BookingJourneyActor] Attempt ${attempt}/${MAX_ATTEMPTS} failed: ${error.message}`);
            }
        }

        throw new Error(
            `[BookingJourneyActor] Failed to complete booking journey after ${MAX_ATTEMPTS} attempts. ` +
                `Last error: ${lastError?.message}`
        );
    }

    /**
     * Executes a single navigation attempt from homepage to passenger details.
     */
    private async runBookingJourney(adults: number, children: number): Promise<BookingContext> {
        await this.homePage.goto();

        const departureAirport = await this.homePage.searchPanel.selectRandomDepartureAirport();
        const destinationCountry = await this.homePage.searchPanel.selectRandomCountry();
        const destinationRegion = await this.homePage.searchPanel.selectRandomRegion();

        await this.homePage.searchPanel.selectFirstAvailableDate();
        const departureDate = await this.homePage.searchPanel.departureDateInput.inputValue();

        const childAges = Array.from({ length: children }, () => this.generate.getRandomChildAge(1, 17));
        await this.homePage.searchPanel.addGuests(adults, childAges);

        const resultsLoadPromise = this.searchResultsPage.waitForResultsToLoad();
        await this.homePage.searchPanel.search();
        await resultsLoadPromise;

        const hotelName = await this.searchResultsPage.resultsList.selectFirstHotel();

        await this.accommodationDetailsPage.proceedToSummary();
        await this.bookFlowSummaryPage.proceedToPassengerDetails();

        // Read actual return date from passenger details page — booked date may differ from searched date
        const returnDateText = await this.passengerDetailsPage.returnDateLabel.innerText();
        const returnDate = parseDutchDate(returnDateText.trim());

        return {
            departureAirport,
            destinationCountry,
            destinationRegion,
            departureDate,
            returnDate,
            adults,
            childAge: childAges,
            hotelName
        };
    }
}
