import { test, expect } from "../../../fixtures/main.fixture";
import { ERROR_MESSAGES } from "./constants";
import { getAdultMinAgeBoundary, getAdultMaxAgeBoundary, formatDobFields } from "../../../util/data/date-utils";
import { getRandomValidAdultYear } from "../../../util/data/generator";

/**
 * Adult DOB age boundary validation.
 *
 * TUI rules (from embedded validation JSON):
 *   MIN_DATE = 18  → age on return date must be >= 18 (boundary exclusive: exactly 18 = invalid)
 *   MAX_DATE = 118 → age on return date must be <= 118 (boundary inclusive: exactly 118 = valid)
 *
 * Verified: return June 7, 2026 → 07/06/1908 (exactly 118) = valid, 06/06/1908 (118y 1d) = invalid.
 */
test.describe(
    "Passenger details: adult DOB age boundary validation",
    {
        tag: ["@passenger_details", "@field_validation", "@adult_passenger", "@dob", "@regression"]
    },
    () => {
        test("too young: born exactly 18 years before return date shows age error (BVA)", async ({
            passengerDetailsSetup,
            passengerDetailsPage,
            logger
        }) => {
            const boundary = getAdultMinAgeBoundary(passengerDetailsSetup.returnDate);
            const { day, month, year } = formatDobFields(boundary);
            logger.info(`[DOB test] Too young boundary: ${day}/${month}/${year}`);

            await passengerDetailsPage.lead.dobDay.fill(day);
            await passengerDetailsPage.lead.dobMonth.fill(month);
            await passengerDetailsPage.lead.dobYear.fill(year);
            await passengerDetailsPage.lead.dobYear.press("Tab");

            await expect(passengerDetailsPage.lead.dobError).toHaveText(ERROR_MESSAGES.dateOfBirth.ageInvalid);
        });

        test("too old: born 1 day before max age boundary shows age error (BVA)", async ({
            passengerDetailsSetup,
            passengerDetailsPage,
            logger
        }) => {
            const maxBoundary = getAdultMaxAgeBoundary(passengerDetailsSetup.returnDate);
            const oneDayBefore = new Date(maxBoundary);
            oneDayBefore.setDate(maxBoundary.getDate() - 1);
            const { day, month, year } = formatDobFields(oneDayBefore);
            logger.info(`[DOB test] Too old boundary: ${day}/${month}/${year}`);

            await passengerDetailsPage.lead.dobDay.fill(day);
            await passengerDetailsPage.lead.dobMonth.fill(month);
            await passengerDetailsPage.lead.dobYear.fill(year);
            await passengerDetailsPage.lead.dobYear.press("Tab");

            await expect(passengerDetailsPage.lead.dobError).toHaveText(ERROR_MESSAGES.dateOfBirth.ageInvalid);
        });

        test("valid: born exactly at max age boundary (118 years) shows no error (BVA)", async ({
            passengerDetailsSetup,
            passengerDetailsPage,
            logger
        }) => {
            const { day, month, year } = formatDobFields(getAdultMaxAgeBoundary(passengerDetailsSetup.returnDate));
            logger.info(`[DOB test] Max age boundary (valid): ${day}/${month}/${year}`);

            await passengerDetailsPage.lead.dobDay.fill(day);
            await passengerDetailsPage.lead.dobMonth.fill(month);
            await passengerDetailsPage.lead.dobYear.fill(year);
            await passengerDetailsPage.lead.dobYear.press("Tab");

            await expect(passengerDetailsPage.lead.dobError).toBeHidden();
        });

        test("valid: safely within adult age range shows no error", async ({
            passengerDetailsSetup,
            passengerDetailsPage,
            logger
        }) => {
            const safeYear = getRandomValidAdultYear();
            const { month, day } = formatDobFields(passengerDetailsSetup.returnDate);
            logger.info(`[DOB test] Safe adult year: ${day}/${month}/${safeYear}`);

            await passengerDetailsPage.lead.dobDay.fill(day);
            await passengerDetailsPage.lead.dobMonth.fill(month);
            await passengerDetailsPage.lead.dobYear.fill(safeYear.toString());
            await passengerDetailsPage.lead.dobYear.press("Tab");

            await expect(passengerDetailsPage.lead.dobError).toBeHidden();
        });
    }
);
