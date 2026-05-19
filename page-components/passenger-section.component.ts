import type { Locator } from "@playwright/test";
import { fieldLocators } from "../util/helpers/field-locators";

export class PassengerSection {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly genderSelect: Locator;
    readonly dobDay: Locator;
    readonly dobMonth: Locator;
    readonly dobYear: Locator;

    readonly firstNameError: Locator;
    readonly lastNameError: Locator;
    readonly genderError: Locator;
    readonly dobError: Locator;

    constructor(protected readonly container: Locator) {
        const firstName = fieldLocators(container.getByLabel("Eerste voornaam"));
        const lastName = fieldLocators(container.getByLabel("Achternaam"));

        this.firstNameInput = firstName.input;
        this.lastNameInput = lastName.input;
        this.genderSelect = container.getByLabel("Geslacht").locator("select");
        this.dobDay = container.getByLabel("day");
        this.dobMonth = container.getByLabel("month");
        this.dobYear = container.getByLabel("year");

        this.firstNameError = firstName.error;
        this.lastNameError = lastName.error;
        this.genderError = container.getByLabel("Geslacht").locator("p.inputs__errorMessage");
        this.dobError = container.getByLabel("Geboortedatum").locator("[aria-live='polite']");
    }
}
