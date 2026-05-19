import { test, expect } from "../../../fixtures/main.fixture";
import { ERROR_MESSAGES } from "./constants";

type PromoCase = { description: string; input: string };

const promoCases: PromoCase[] = [
    { description: "empty input (EP)", input: "" },
    { description: "invalid code (EP)", input: "INVALIDCODE123" }
];

test.describe(
    "Passenger details: promo code validation",
    {
        tag: ["@passenger_details", "@field_validation", "@regression"]
    },
    () => {
        test.beforeEach(async ({ passengerDetailsSetup: _ }) => {});

        test("promo code shows error for empty and invalid inputs", async ({ passengerDetailsPage }) => {
            for (const { description, input } of promoCases) {
                await passengerDetailsPage.promoCode.input.clear();
                await passengerDetailsPage.promoCode.input.fill(input);
                await passengerDetailsPage.promoCode.applyButton.click();
                const expectedMessage =
                    input === "" ? ERROR_MESSAGES.promoCode.invalid : ERROR_MESSAGES.promoCode.validationFailed;

                await expect
                    .soft(passengerDetailsPage.promoCode.errorMessage, description)
                    .toContainText(expectedMessage);
            }
        });
    }
);
