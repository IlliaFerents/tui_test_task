import { test, expect } from "../../../fixtures/main.fixture";
import type { Locator } from "@playwright/test";
import { ERROR_MESSAGES, SUMMARY_ERROR_PATTERN } from "./constants";

test.describe(
    "Passenger details: required field validation",
    {
        tag: ["@passenger_details", "@field_validation", "@smoke", "@regression"]
    },
    () => {
        test.beforeEach(async ({ passengerDetailsSetup: _ }) => {});

        test("submitting empty form shows all required field errors and summary count", async ({
            passengerDetailsPage
        }) => {
            await passengerDetailsPage.submit();

            // Passenger fields
            const passengerChecks: {
                label: string;
                errors: [Locator, string | RegExp][];
            }[] = [
                {
                    label: "Lead adult",
                    errors: [
                        [passengerDetailsPage.lead.firstNameError, ERROR_MESSAGES.firstName.required],
                        [passengerDetailsPage.lead.lastNameError, ERROR_MESSAGES.lastName.required],
                        [passengerDetailsPage.lead.genderError, ERROR_MESSAGES.gender.required],
                        [passengerDetailsPage.lead.dobError, ERROR_MESSAGES.dateOfBirth.invalid],
                        [passengerDetailsPage.lead.streetError, ERROR_MESSAGES.street.required],
                        [passengerDetailsPage.lead.houseNumberError, ERROR_MESSAGES.houseNumber.required],
                        [passengerDetailsPage.lead.postcodeError, ERROR_MESSAGES.postcode.required],
                        [passengerDetailsPage.lead.cityError, ERROR_MESSAGES.city.required],
                        [passengerDetailsPage.lead.phoneError, ERROR_MESSAGES.phone.required],
                        [passengerDetailsPage.lead.emailError, ERROR_MESSAGES.email.required]
                    ]
                },
                {
                    label: "Companion",
                    errors: [
                        [passengerDetailsPage.companion.firstNameError, ERROR_MESSAGES.firstName.required],
                        [passengerDetailsPage.companion.lastNameError, ERROR_MESSAGES.lastName.required],
                        [passengerDetailsPage.companion.genderError, ERROR_MESSAGES.gender.required],
                        [passengerDetailsPage.companion.dobError, ERROR_MESSAGES.dateOfBirth.invalid]
                    ]
                },
                {
                    label: "Child",
                    errors: [
                        [passengerDetailsPage.child.firstNameError, ERROR_MESSAGES.firstName.required],
                        [passengerDetailsPage.child.lastNameError, ERROR_MESSAGES.lastName.required],
                        [passengerDetailsPage.child.genderError, ERROR_MESSAGES.gender.required],
                        [passengerDetailsPage.child.dobError, ERROR_MESSAGES.dateOfBirth.invalid]
                    ]
                },
                {
                    label: "Emergency",
                    errors: [
                        [passengerDetailsPage.emergency.lastNameError, ERROR_MESSAGES.lastName.required],
                        [passengerDetailsPage.emergency.phoneError, ERROR_MESSAGES.phone.required]
                    ]
                }
            ];

            for (const { errors } of passengerChecks) {
                for (const [locator, message] of errors) {
                    await expect.soft(locator).toHaveText(message);
                }
            }

            // Terms
            await expect.soft(passengerDetailsPage.termsError).toHaveText(ERROR_MESSAGES.terms.required);

            // Summary count
            await expect.soft(passengerDetailsPage.summaryError).toHaveText(SUMMARY_ERROR_PATTERN);
        });
    }
);
