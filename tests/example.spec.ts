import { expect } from "@playwright/test";
import { test } from "../fixtures/main.fixture";

test("should retrieve available departure airports and select a random one", async ({ homePage }) => {
    await homePage.goto();

    // Select a random departure airport
    const selectedAirport = await homePage.searchPanel.selectRandomDepartureAirport();
    console.log("Selected Airport:", selectedAirport);

    // Assert that the input field's placeholder matches the selected airport
    // TUI has a massive ARIA violation: they set the selection into the "placeholder" attribute instead of "value"!
    await expect(homePage.searchPanel.departureAirportInput).toHaveAttribute("placeholder", selectedAirport);
});

test("should select a random country and check a random child region from the destination list", async ({
    homePage
}) => {
    await homePage.goto();

    // 1. Select a random parent country (e.g. "Egypte")
    const selectedCountry = await homePage.searchPanel.selectRandomCountry();
    console.log("Selected Parent Country:", selectedCountry);

    // 2. Select a random child region within that country and click save
    const selectedRegion = await homePage.searchPanel.selectRandomRegion();
    console.log("Selected Region:", selectedRegion);

    // 3. Verify placeholder or selection value displays the chosen destination
    await expect(homePage.searchPanel.destinationInput).toHaveAttribute("placeholder", new RegExp(selectedRegion, "i"));
});

test("should select first available departure date", async ({ homePage }) => {
    await homePage.goto();

    await homePage.searchPanel.selectFirstAvailableDate();

    const selectedDate = await homePage.searchPanel.departureDateInput.inputValue();
    console.log("Selected Date:", selectedDate);

    await expect(homePage.searchPanel.departureDateInput).toHaveValue(selectedDate);
});

test("should configure 2 adults and 1 child with a random age", async ({ homePage, generate }) => {
    await homePage.goto();

    const childAge = generate.getRandomChildAge();
    await homePage.searchPanel.addGuests(2, [childAge]);
    console.log("Child Age:", childAge);

    await expect(homePage.searchPanel.roomsGuestsInput).toHaveValue(/2 Volwassenen 1/);
});

test("should select specific destinations using the fixture generator", async ({ homePage, generate }) => {
    await homePage.goto();

    // 1. Open destination list and fetch all available parent options
    const availableDestinations = await homePage.searchPanel.getAvailableDestinations();

    // 2. Pick a random one using our generate fixture (Dependency Injection showcase!)
    const targetCountry = generate.getRandomArrayElement(availableDestinations);
    console.log("Target Country picked by fixture:", targetCountry);

    // 3. Navigate into it
    await homePage.searchPanel.selectCountry(targetCountry);

    // 4. Select the first child region option
    const activeRegion = await homePage.searchPanel.selectRandomRegion();
    console.log("Active region saved:", activeRegion);

    await expect(homePage.searchPanel.destinationInput).toHaveAttribute("placeholder", new RegExp(activeRegion, "i"));
});
