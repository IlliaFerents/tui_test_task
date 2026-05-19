import { test, expect } from "../../../fixtures/main.fixture";
import { ERROR_MESSAGES } from "./constants";
import { getInvalidName, type NameViolation } from "../../../util/data/generator";

const cases: Array<{ description: string; violation: NameViolation }> = [
    { description: "below min length (BVA)", violation: "belowMin" },
    { description: "above max length (BVA)", violation: "aboveMax" },
    { description: "contains digit (EP)", violation: "withDigit" }
];

test.describe(
    "Passenger details: name field validation",
    {
        tag: ["@passenger_details", "@field_validation", "@regression"]
    },
    () => {
        test.beforeEach(async ({ passengerDetailsSetup: _ }) => {});

        test("firstName shows format error for invalid inputs", async ({ passengerDetailsPage }) => {
            for (const { description, violation } of cases) {
                await passengerDetailsPage.lead.firstNameInput.clear();
                await passengerDetailsPage.lead.firstNameInput.fill(getInvalidName(violation));
                await passengerDetailsPage.lead.firstNameInput.press("Tab");

                await expect
                    .soft(passengerDetailsPage.lead.firstNameError, description)
                    .toHaveText(ERROR_MESSAGES.firstName.invalid);
            }
        });
    }
);
