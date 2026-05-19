import type { Locator } from "@playwright/test";
import { fieldLocators } from "../util/helpers/field-locators";

export class EmergencySection {
    readonly lastNameInput: Locator;
    readonly phoneInput: Locator;

    readonly lastNameError: Locator;
    readonly phoneError: Locator;

    constructor(container: Locator) {
        const lastName = fieldLocators(container.getByLabel("Achternaam"));
        const phone = fieldLocators(
            container.getByLabel("Mobiel telefoonnummer").filter({ has: container.page().locator("input") })
        );

        this.lastNameInput = lastName.input;
        this.phoneInput = phone.input;

        this.lastNameError = lastName.error;
        this.phoneError = phone.error;
    }
}
