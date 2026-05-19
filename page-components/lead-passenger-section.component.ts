import type { Locator } from "@playwright/test";
import { PassengerSection } from "./passenger-section.component";
import { fieldLocators } from "../util/helpers/field-locators";

export class LeadPassengerSection extends PassengerSection {
    readonly streetInput: Locator;
    readonly houseNumberInput: Locator;
    readonly postcodeInput: Locator;
    readonly cityInput: Locator;
    readonly phoneInput: Locator;
    readonly emailInput: Locator;

    readonly streetError: Locator;
    readonly houseNumberError: Locator;
    readonly postcodeError: Locator;
    readonly cityError: Locator;
    readonly phoneError: Locator;
    readonly emailError: Locator;

    constructor(container: Locator) {
        super(container);

        const street = fieldLocators(container.getByLabel("Straatnaam"));
        const houseNumber = fieldLocators(container.getByLabel("Huisnummer"));
        const postcode = fieldLocators(container.getByLabel("Postcode"));
        const city = fieldLocators(container.getByLabel("Woonplaats"));
        const phone = fieldLocators(
            container.getByLabel("Mobiel telefoonnummer").filter({ has: container.page().locator("input") })
        );
        const email = fieldLocators(container.getByLabel("E-mailadres"));

        this.streetInput = street.input;
        this.houseNumberInput = houseNumber.input;
        this.postcodeInput = postcode.input;
        this.cityInput = city.input;
        this.phoneInput = phone.input;
        this.emailInput = email.input;

        this.streetError = street.error;
        this.houseNumberError = houseNumber.error;
        this.postcodeError = postcode.error;
        this.cityError = city.error;
        this.phoneError = phone.error;
        this.emailError = email.error;
    }
}
