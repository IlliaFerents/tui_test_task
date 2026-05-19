import { test, expect } from "../../../fixtures/main.fixture";
import { ERROR_MESSAGES } from "./constants";
import {
    getInvalidDob,
    getRandomMonth,
    getRandomDayOfMonth,
    getRandomValidAdultYear,
    type DobViolation
} from "../../../util/data/generator";

const validMonth = getRandomMonth();
const validDay = getRandomDayOfMonth(validMonth).toString().padStart(2, "0");
const validMonthStr = validMonth.toString().padStart(2, "0");
const validYear = getRandomValidAdultYear().toString();

interface PartialDobCase {
    description: string;
    day?: string;
    month?: string;
    year?: string;
}

const partialFillCases: PartialDobCase[] = [
    { description: "day only filled", day: validDay },
    { description: "month only filled", month: validMonthStr },
    { description: "year only filled", year: validYear },
    { description: "day and month filled, year empty", day: validDay, month: validMonthStr }
];

const invalidInputCases: Array<{ description: string; violation: DobViolation }> = [
    { description: "day out of range (BVA)", violation: "dayOutOfRange" },
    { description: "month out of range (BVA)", violation: "monthOutOfRange" }
];

test.describe(
    "Passenger details: date of birth validation",
    {
        tag: ["@passenger_details", "@field_validation", "@dob", "@regression"]
    },
    () => {
        test.beforeEach(async ({ passengerDetailsSetup: _ }) => {});

        test("DOB error appears when fields are partially filled", async ({ passengerDetailsPage }) => {
            const dob = passengerDetailsPage.lead;

            for (const { description, day, month, year } of partialFillCases) {
                if (day) await dob.dobDay.fill(day);
                if (month) await dob.dobMonth.fill(month);
                if (year) await dob.dobYear.fill(year);
                await dob.dobYear.press("Tab");

                await expect.soft(dob.dobError, description).toHaveText(ERROR_MESSAGES.dateOfBirth.invalid);

                await dob.dobDay.clear();
                await dob.dobMonth.clear();
                await dob.dobYear.clear();
            }
        });

        test("DOB error appears for out-of-range", async ({ passengerDetailsPage }) => {
            const dob = passengerDetailsPage.lead;

            for (const { description, violation } of invalidInputCases) {
                const { day, month } = getInvalidDob(violation);

                await dob.dobDay.fill(day);
                await dob.dobMonth.fill(month);
                await dob.dobYear.press("Tab");

                await expect.soft(dob.dobError, description).toHaveText(ERROR_MESSAGES.dateOfBirth.invalid);

                await dob.dobDay.clear();
                await dob.dobMonth.clear();
            }
        });
    }
);
