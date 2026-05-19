import { faker } from "@faker-js/faker";
import { logger } from "../system/logger";

const LOG_GENERATED = process.env.LOG_TEST_DATA !== "false";

function logged<T>(label: string, value: T): T {
    if (LOG_GENERATED) {
        const display = typeof value === "object" ? JSON.stringify(value) : `"${value}"`;
        logger.info(`Generated ${label}: ${display}`);
    }
    return value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Valid data generators — used for precondition setup (filling forms correctly)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a random element from the provided array.
 */
export function getRandomArrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
}

/**
 * Generates a random child age within the specified limits.
 * @param min - Minimum age (default: 0).
 * @param max - Maximum age (default: 17).
 */
export function getRandomChildAge(min = 0, max = 17): number {
    return faker.number.int({ min, max });
}

/**
 * Generates a random number of adults within the specified limits.
 */
export function getRandomAdultsNum(min = 1, max = 9): number {
    return faker.number.int({ min, max });
}

/**
 * Generates a random valid month (1–12).
 */
export function getRandomMonth(): number {
    return faker.number.int({ min: 1, max: 12 });
}

/**
 * Generates a random valid day for a given month, respecting month limits.
 */
export function getRandomDayOfMonth(month: number, year: number = new Date().getFullYear()): number {
    const daysInMonth = new Date(year, month, 0).getDate();
    return faker.number.int({ min: 1, max: daysInMonth });
}

/**
 * Generates a random year safely within the adult age range.
 */
export function getRandomValidAdultYear(): number {
    return faker.number.int({ min: 1920, max: 2010 });
}

// ─────────────────────────────────────────────────────────────────────────────
// Invalid data generators — controlled invalid values for validation tests.
// Each function grouped by field type, configurable by violation kind.
// ─────────────────────────────────────────────────────────────────────────────

export type NameViolation = "belowMin" | "aboveMax" | "withDigit";

/**
 * Generates an invalid name value for the given violation type.
 * - belowMin: 1 char (below min 2)
 * - aboveMax: 33 chars (above max 32)
 * - withDigit: embedded digit, length within valid range
 */
export function getInvalidName(violation: NameViolation): string {
    const log = (v: string) => logged(`invalidName (${violation})`, v);
    switch (violation) {
        case "belowMin":
            return log(faker.string.alpha({ length: 1 }));
        case "aboveMax":
            return log(faker.string.alpha({ length: 33 }));
        case "withDigit":
            return log(
                faker.string.alpha({ length: 3 }) +
                    faker.string.numeric({ length: 1 }) +
                    faker.string.alpha({ length: 3 })
            );
    }
}

export type EmailViolation = "noAt" | "noDomain" | "doubleAt";

/**
 * Generates an invalid email for the given violation type.
 * - noAt: username without @ symbol
 * - noDomain: user@ with nothing after
 * - doubleAt: user@@domain.nl
 */
export function getInvalidEmail(violation: EmailViolation): string {
    const log = (v: string) => logged(`invalidEmail (${violation})`, v);
    switch (violation) {
        case "noAt":
            return log(faker.internet.username());
        case "noDomain":
            return log(faker.internet.username() + "@");
        case "doubleAt":
            return log(faker.internet.username() + "@@domain.nl");
    }
}

export type PhoneViolation = "tooShort" | "tooLong" | "withLetters";

/**
 * Generates an invalid phone number for the given violation type.
 * TUI accepts 7–15 digits (ITU international standard).
 * - tooShort: 1–6 digits (below minimum)
 * - tooLong: 16–20 digits (above ITU maximum of 15)
 * - withLetters: alphabetic string (non-numeric)
 */
export function getInvalidPhone(violation: PhoneViolation): string {
    const log = (v: string) => logged(`invalidPhone (${violation})`, v);
    switch (violation) {
        case "tooShort":
            return log(faker.string.numeric({ length: { min: 1, max: 6 } }));
        case "tooLong":
            return log(faker.string.numeric({ length: { min: 16, max: 20 } }));
        case "withLetters":
            return log(faker.string.alpha({ length: 8 }));
    }
}

export type PostcodeViolation = "lettersOnly" | "digitsOnly" | "partial";

/**
 * Generates an invalid Dutch postcode for the given violation type.
 * Valid format: 4 digits + 2 uppercase letters (e.g. "1017 CT").
 * - lettersOnly: all letters, no digits
 * - digitsOnly: all digits, no letters
 * - partial: only 4 digits, missing letter suffix
 */
export function getInvalidPostcode(violation: PostcodeViolation): string {
    const log = (v: string) => logged(`invalidPostcode (${violation})`, v);
    switch (violation) {
        case "lettersOnly":
            return log(faker.string.alpha({ length: 6, casing: "upper" }));
        case "digitsOnly":
            return log(faker.string.numeric({ length: 6 }));
        case "partial":
            return log(faker.string.numeric({ length: 4 }));
    }
}

export type DobViolation = "dayOutOfRange" | "monthOutOfRange" | "futureYear";

export interface DobValue {
    day: string;
    month: string;
    year: string;
}

/**
 * Generates an invalid date of birth for the given violation type.
 * Returns all 3 fields — only one is invalid per call, others are valid.
 */
export function getInvalidDob(violation: DobViolation): DobValue {
    const validMonth = getRandomMonth();
    const validDay = getRandomDayOfMonth(validMonth).toString().padStart(2, "0");
    const validMonthStr = validMonth.toString().padStart(2, "0");
    const validYear = faker.number.int({ min: 1940, max: new Date().getFullYear() - 18 }).toString();

    const log = (v: DobValue) => logged(`invalidDob (${violation})`, v);
    switch (violation) {
        case "dayOutOfRange":
            return log({
                day: faker.number.int({ min: 32, max: 99 }).toString().padStart(2, "0"),
                month: validMonthStr,
                year: validYear
            });
        case "monthOutOfRange":
            return log({
                day: validDay,
                month: faker.number.int({ min: 13, max: 99 }).toString().padStart(2, "0"),
                year: validYear
            });
        case "futureYear":
            return log({
                day: validDay,
                month: validMonthStr,
                year: faker.number.int({ min: new Date().getFullYear() + 1, max: 2099 }).toString()
            });
    }
}
