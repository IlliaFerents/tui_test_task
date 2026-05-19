import { test, expect } from "../../../fixtures/main.fixture";
import { ERROR_MESSAGES } from "./constants";
import {
    getInvalidEmail,
    getInvalidPhone,
    getInvalidPostcode,
    type EmailViolation,
    type PhoneViolation,
    type PostcodeViolation
} from "../../../util/data/generator";

const emailCases: Array<{ description: string; violation: EmailViolation }> = [
    { description: "no @ symbol (EP)", violation: "noAt" },
    { description: "no domain (EP)", violation: "noDomain" },
    { description: "double @@ (EP)", violation: "doubleAt" }
];

const phoneCases: Array<{ description: string; violation: PhoneViolation }> = [
    { description: "too short (BVA)", violation: "tooShort" },
    { description: "too long (BVA)", violation: "tooLong" },
    { description: "with letters (EP)", violation: "withLetters" }
];

const postcodeCases: Array<{ description: string; violation: PostcodeViolation }> = [
    { description: "letters only (EP)", violation: "lettersOnly" },
    { description: "digits only (EP)", violation: "digitsOnly" },
    { description: "partial - missing letters (EP)", violation: "partial" }
];

test.describe(
    "Passenger details: format field validation",
    {
        tag: ["@passenger_details", "@field_validation", "@regression"]
    },
    () => {
        test.beforeEach(async ({ passengerDetailsSetup: _ }) => {});

        test("email shows format error for invalid inputs", async ({ passengerDetailsPage }) => {
            for (const { description, violation } of emailCases) {
                await passengerDetailsPage.lead.emailInput.clear();
                await passengerDetailsPage.lead.emailInput.fill(getInvalidEmail(violation));
                await passengerDetailsPage.lead.emailInput.press("Tab");

                await expect
                    .soft(passengerDetailsPage.lead.emailError, description)
                    .toHaveText(ERROR_MESSAGES.email.invalid);
            }
        });

        test("phone shows format error for invalid inputs", async ({ passengerDetailsPage }) => {
            for (const { description, violation } of phoneCases) {
                await passengerDetailsPage.lead.phoneInput.clear();
                await passengerDetailsPage.lead.phoneInput.fill(getInvalidPhone(violation));
                await passengerDetailsPage.lead.phoneInput.press("Tab");

                await expect
                    .soft(passengerDetailsPage.lead.phoneError, description)
                    .toHaveText(ERROR_MESSAGES.phone.invalid);
            }
        });

        test("postcode shows format error for invalid inputs", async ({ passengerDetailsPage }) => {
            for (const { description, violation } of postcodeCases) {
                await passengerDetailsPage.lead.postcodeInput.clear();
                await passengerDetailsPage.lead.postcodeInput.fill(getInvalidPostcode(violation));
                await passengerDetailsPage.lead.postcodeInput.press("Tab");

                await expect
                    .soft(passengerDetailsPage.lead.postcodeError, description)
                    .toHaveText(ERROR_MESSAGES.postcode.invalid);
            }
        });
    }
);
