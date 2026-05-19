import type { Page, Locator } from "@playwright/test";
import { getRandomArrayElement } from "../util/data/generator";
import { AvailabilityApi } from "../util/api/availability-api";
import { CheckboxList } from "../util/helpers/checkbox-list";

type SearchPanel = "airports" | "destinations" | "Departure date" | "room and guest";

export class SearchPanelComponent {
    private readonly page: Page;
    private readonly api: AvailabilityApi;
    readonly container: Locator;

    readonly departureAirportInput: Locator;
    readonly destinationInput: Locator;
    readonly destinationListButton: Locator;
    readonly destinationListContainer: Locator;
    readonly destinationsGroup: Locator;
    readonly calendarWrapper: Locator;
    readonly availableDepartureDayCell: Locator;
    readonly departureDateInput: Locator;
    readonly durationSelect: Locator;
    readonly roomsGuestsInput: Locator;
    readonly adultsSelect: Locator;
    readonly childrenSelect: Locator;
    readonly childAgeSelects: Locator;
    readonly searchButton: Locator;
    readonly airportListSection: Locator;

    constructor(page: Page) {
        this.page = page;
        this.api = new AvailabilityApi(page);
        this.container = page.getByLabel("search panel container");

        // Search panel triggers
        this.departureAirportInput = this.container.getByTestId("airport-input");
        this.destinationInput = this.container.getByTestId("destination-input");
        this.destinationListButton = this.container.getByText("Lijst");
        this.destinationListContainer = this.page.locator("div.DestinationsList__destinationListContainer");
        this.destinationsGroup = this.page.locator("div.DestinationsList__destinationsGroup");
        this.calendarWrapper = this.page.locator("div.SelectLegacyDate__datesOverlayWrapper");
        this.availableDepartureDayCell = this.calendarWrapper.locator("td.SelectLegacyDate__available").first();
        this.departureDateInput = this.container.getByTestId("departure-date-input");
        this.durationSelect = this.container.getByTestId("duration-input");
        this.roomsGuestsInput = this.container.getByTestId("rooms-and-guest-input");
        this.adultsSelect = this.page.getByLabel("adult select").locator("select");
        this.childrenSelect = this.page.getByLabel("child select").locator("select");
        this.childAgeSelects = this.page.getByLabel("age select").locator("select");
        this.searchButton = this.container.getByTestId("search-button");
        this.airportListSection = this.page.getByRole("region", { name: "airports" }).locator("section");
    }

    // ==========================================
    // Airports Block
    // ==========================================

    /**
     * Opens the departure airport panel and waits for available airports to load.
     */
    async openDepartureAirportPanel(): Promise<void> {
        const firstCheckbox = this.airportListSection.getByRole("checkbox").first();

        if (await firstCheckbox.isVisible()) {
            return;
        }

        // Start listening before the click to avoid missing a fast response
        const departuresResponse = this.api.waitFor("departures");

        await this.departureAirportInput.click();
        await Promise.race([departuresResponse, firstCheckbox.waitFor({ state: "visible" })]);
        await firstCheckbox.waitFor({ state: "visible" });
    }

    /**
     * Retrieves all available departure airport names that are not disabled.
     * @returns An array of available airport names.
     */
    async getAvailableDepartureAirports(): Promise<string[]> {
        await this.openDepartureAirportPanel();

        const airports = new CheckboxList(this.airportListSection.getByRole("checkbox"));
        const availableAirports = await airports.getEnabledTexts();

        // await this.save("airports");
        return availableAirports;
    }

    /**
     * Selects one or more departure airports in the panel.
     * @param airports - An airport name or an array of airport names to select.
     */
    async selectDepartureAirport(airports: string | string[]): Promise<void> {
        await this.openDepartureAirportPanel();

        const targetAirports = Array.isArray(airports) ? airports : [airports];
        const airportList = new CheckboxList(this.airportListSection.getByRole("checkbox"));

        for (const airport of targetAirports) {
            await airportList.toggle(airport);
        }

        await this.save("airports");
    }

    /**
     * Randomly selects an available departure airport.
     * @returns The name of the selected airport.
     */
    async selectRandomDepartureAirport(): Promise<string> {
        const airports = await this.getAvailableDepartureAirports();
        if (airports.length === 0) {
            throw new Error("No available departure airports found.");
        }

        const randomAirport = getRandomArrayElement(airports);
        await this.selectDepartureAirport(randomAirport);
        return randomAirport;
    }

    // ==========================================
    // Destination Block
    // ==========================================

    /**
     * Opens the destination list overlay and waits for the items to load.
     */
    async openDestinationList(): Promise<void> {
        const firstLink = this.destinationListContainer.locator("a").first();

        if (await firstLink.isVisible()) {
            return;
        }

        // Start listening before the click to avoid missing a fast response
        const countriesResponse = this.api.waitFor("countries");

        await this.destinationListButton.click();
        await Promise.race([countriesResponse, firstLink.waitFor({ state: "visible" })]);
        await firstLink.waitFor({ state: "visible" });
    }

    /**
     * Retrieves all available destination country names that are not disabled.
     * @returns An array of available destination names.
     */
    async getAvailableDestinations(): Promise<string[]> {
        await this.openDestinationList();

        const links = this.destinationListContainer.locator("a");
        const destinations: string[] = [];

        for (const link of await links.all()) {
            const classAttr = await link.getAttribute("class");
            const isLinkDisabled =
                classAttr?.includes("disabled") || (await link.getAttribute("aria-disabled")) === "true";

            if (!isLinkDisabled) {
                const text = (await link.innerText()).trim();
                if (text) {
                    destinations.push(text);
                }
            }
        }

        return destinations;
    }

    /**
     * Selects a country from the destinations list and waits for its sub-regions to load.
     * @param country - The name of the country to select.
     */
    async selectCountry(country: string): Promise<void> {
        await this.openDestinationList();

        const firstCheckbox = this.destinationsGroup.getByRole("checkbox").first();

        // Start listening before the click to avoid missing a fast response
        const destinationsResponse = this.api.waitFor("destinations");

        await this.destinationListContainer.locator("a").filter({ hasText: country }).click();
        await Promise.all([destinationsResponse, firstCheckbox.waitFor({ state: "visible" })]);
    }

    /**
     * Randomly selects an available country from the destination list.
     * @returns The name of the selected country.
     */
    async selectRandomCountry(): Promise<string> {
        const destinations = await this.getAvailableDestinations();
        if (destinations.length === 0) {
            throw new Error("No available destinations found in the list.");
        }

        const randomCountry = getRandomArrayElement(destinations);
        await this.selectCountry(randomCountry);
        return randomCountry;
    }

    /**
     * Selects one or more specific regions or destinations.
     * @param destinations - A region name or an array of region names to select.
     */
    async selectRegion(destinations: string | string[]): Promise<void> {
        const targets = Array.isArray(destinations) ? destinations : [destinations];
        const regionList = new CheckboxList(this.destinationsGroup.getByRole("checkbox"));

        for (const dest of targets) {
            await regionList.toggle(dest);
        }

        await this.save("destinations");
    }

    /**
     * Randomly selects an available region checkbox.
     * @returns The name of the selected region.
     */
    async selectRandomRegion(): Promise<string> {
        const regions = new CheckboxList(this.destinationsGroup.getByRole("checkbox"));
        const availableOptions = await regions.getEnabledTexts();

        if (availableOptions.length === 0) {
            throw new Error("No available child destinations found to check.");
        }

        const randomOptionName = getRandomArrayElement(availableOptions);
        await this.selectRegion(randomOptionName);
        return randomOptionName;
    }

    /**
     * Fills the destination text input with the specified search query.
     * @param destination - The text query or destination name.
     */
    async fillDestinationInput(destination: string): Promise<void> {
        await this.destinationInput.fill(destination);
    }

    // ==========================================
    // Date Block
    // ==========================================

    /**
     * Selects the first available date in the calendar dropdown.
     */
    async selectFirstAvailableDate(): Promise<void> {
        const checkInsResponse = this.api.waitFor("check-ins");
        await this.departureDateInput.click();
        await Promise.all([checkInsResponse, this.calendarWrapper.waitFor({ state: "visible" })]);

        await this.availableDepartureDayCell.click();
        await this.save("Departure date");
    }

    // ==========================================
    // Room and Guests Block
    // ==========================================

    /**
     * Configures the number of adults and children (along with child ages) in the guests panel.
     * @param adults - Number of adult guests.
     * @param childAges - An array representing the age of each child guest.
     */
    async addGuests(adults: number, childAges: number[]): Promise<void> {
        await this.roomsGuestsInput.click();
        await this.adultsSelect.selectOption(`${adults}`);
        await this.childrenSelect.selectOption(`${childAges.length}`);

        for (let i = 0; i < childAges.length; i++) {
            await this.childAgeSelects.nth(i).selectOption(`${childAges[i]}`);
        }

        await this.save("room and guest");
    }

    // ==========================================
    // General Methods Block
    // ==========================================

    /**
     * Returns the selected duration in nights.
     * Maps TUI's duration select option values to their night counts.
     * "Meer dan X nachten" options are not supported — the actor uses the default 7-night option.
     */
    async getDurationNights(): Promise<number> {
        const DURATION_MAP: Record<string, number> = {
            "2115": 2,
            "3115": 3,
            "4115": 4,
            "5115": 5,
            "6115": 6,
            "7115": 7,
            "8115": 8,
            "9115": 9,
            "1015": 10,
            "1115": 11,
            "1215": 12,
            "1315": 13,
            "1415": 14
        };
        const value = await this.durationSelect.inputValue();
        const nights = DURATION_MAP[value];
        if (nights === undefined) {
            throw new Error(`Unsupported duration select value: "${value}". Only exact night counts are supported.`);
        }
        return nights;
    }

    /**
     * Clicks the search button to submit the search panel query.
     */
    async search(): Promise<void> {
        await this.searchButton.click();
    }

    /**
     * Clicks the save/submit button for a given active panel overlay.
     * @param panel - The identifier of the panel overlay to save.
     */
    async save(panel: SearchPanel): Promise<void> {
        await this.page.getByLabel(`Opslaan ${panel}`).locator("button").click();
    }
}
