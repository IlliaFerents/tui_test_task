import { expect } from "@playwright/test";
import { test } from "../fixtures/main.fixture";

test("should navigate from homepage to passenger details page by completing steps 1-11", async ({
    homePage,
    searchResultsPage,
    accommodationDetailsPage,
    bookFlowSummaryPage,
    generate,
    page
}) => {
    // Step 1: Open the homepage.
    await homePage.goto();

    // Step 2: Accept the cookies pop-up.
    // (Handled automatically by the global `cookieConsentHandler` fixture via `page.addLocatorHandler`)

    // Step 3: Select a random available departure airport.
    const selectedAirport = await homePage.searchPanel.selectRandomDepartureAirport();
    console.log(`[Step 3] Selected Departure Airport: ${selectedAirport}`);

    // Step 4: Select a random available destination airport.
    // In TUI's structure, we choose a country first, then check a random region within that country.
    const selectedCountry = await homePage.searchPanel.selectRandomCountry();
    console.log(`[Step 4] Selected Destination Country: ${selectedCountry}`);

    const selectedRegion = await homePage.searchPanel.selectRandomRegion();
    console.log(`[Step 4] Selected Destination Region: ${selectedRegion}`);

    // Step 5: Select an available departure date.
    await homePage.searchPanel.selectFirstAvailableDate();
    const selectedDate = await homePage.searchPanel.departureDateInput.inputValue();
    console.log(`[Step 5] Selected Departure Date: ${selectedDate}`);

    // Step 6: In “Rooms & Guests”, choose 2 adults and 1 child (child age should be random from available values).
    const childAge = generate.getRandomChildAge(5, 12);
    await homePage.searchPanel.addGuests(2, [childAge]);
    console.log(`[Step 6] Guests Configured: 2 Adults, 1 Child (Age: ${childAge})`);

    // Step 7: Search for holidays.
    console.log("[Step 7] Launching holiday search...");
    const resultsLoadPromise = searchResultsPage.waitForResultsToLoad();
    await homePage.searchPanel.search();
    await resultsLoadPromise;

    // Step 8: From results, pick the first available hotel.
    console.log("[Step 8] Picking the first available hotel...");
    const hotelName = await searchResultsPage.resultsList.selectFirstHotel();
    console.log(`[Step 8] Selected Hotel Name: ${hotelName}`);

    // Step 9: On the hotel details page, click Continue.
    console.log("[Step 9] Clicking continue on Accommodation Details page...");
    await accommodationDetailsPage.proceedToSummary();

    // Step 10 & 11: Select available flights (default pre-selected on summary page) and continue to Passenger details.
    console.log("[Steps 10 & 11] Booking pre-selected flights and proceeding to Passenger Details page...");
    await bookFlowSummaryPage.proceedToPassengerDetails();

    // Goal: verify all precondition steps are built - we can reach passenger details page.
    console.log("[Verify] Asserting that we have successfully reached the Passenger Details page...");
    await expect(page).toHaveURL(/.*\/book\/passengerdetails.*/);
});
