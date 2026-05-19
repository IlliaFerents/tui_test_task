import { test, expect } from "../../../fixtures/main.fixture";
import { ERROR_MESSAGES } from "./constants";
import {
    getChildExactBirthDate,
    getChildTooYoungBirthDate,
    getChildTooOldBirthDate,
    formatDobFields
} from "../../../util/data/date-utils";
import { logger } from "../../../util/system/logger";

/**
 * Child DOB age boundary validation.
 *
 * TUI rule: child's age on the return date must match the age selected in the search panel.
 */
test.describe(
    "Passenger details: child DOB age boundary validation",
    {
        tag: ["@passenger_details", "@field_validation", "@child_passenger", "@dob", "@regression"]
    },
    () => {
        test("valid: child born exactly childAge years before return date shows no error", async ({
            passengerDetailsSetup,
            passengerDetailsPage
        }) => {
            const { returnDate, childAge } = passengerDetailsSetup;
            const { day, month, year } = formatDobFields(getChildExactBirthDate(returnDate, childAge[0]));
            logger.info(`[DOB child] Valid: ${day}/${month}/${year} (age ${childAge[0]} on return)`);

            await passengerDetailsPage.child.dobDay.fill(day);
            await passengerDetailsPage.child.dobMonth.fill(month);
            await passengerDetailsPage.child.dobYear.fill(year);
            await passengerDetailsPage.child.dobYear.press("Tab");

            await expect(passengerDetailsPage.child.dobError).toBeHidden();
        });

        test("too young: child born 1 day after valid boundary shows age mismatch error (BVA)", async ({
            passengerDetailsSetup,
            passengerDetailsPage
        }) => {
            const { returnDate, childAge } = passengerDetailsSetup;
            const { day, month, year } = formatDobFields(getChildTooYoungBirthDate(returnDate, childAge[0]));
            logger.info(`[DOB child] Too young: ${day}/${month}/${year}`);

            await passengerDetailsPage.child.dobDay.fill(day);
            await passengerDetailsPage.child.dobMonth.fill(month);
            await passengerDetailsPage.child.dobYear.fill(year);
            await passengerDetailsPage.child.dobYear.press("Tab");

            await expect(passengerDetailsPage.child.dobError).toHaveText(ERROR_MESSAGES.dateOfBirth.childAgeMismatch);
        });

        test("too old: child born 1 day before valid boundary shows age mismatch error (BVA)", async ({
            passengerDetailsSetup,
            passengerDetailsPage
        }) => {
            const { returnDate, childAge } = passengerDetailsSetup;
            const { day, month, year } = formatDobFields(getChildTooOldBirthDate(returnDate, childAge[0]));
            logger.info(`[DOB child] Too old: ${day}/${month}/${year}`);

            await passengerDetailsPage.child.dobDay.fill(day);
            await passengerDetailsPage.child.dobMonth.fill(month);
            await passengerDetailsPage.child.dobYear.fill(year);
            await passengerDetailsPage.child.dobYear.press("Tab");

            await expect(passengerDetailsPage.child.dobError).toHaveText(ERROR_MESSAGES.dateOfBirth.childAgeMismatch);
        });
    }
);
