import { faker } from "@faker-js/faker";

/**
 * Returns a random element from the provided array.
 * @param array - The array to pick from.
 * @returns A randomly selected element from the array.
 */
export function getRandomArrayElement<T>(array: T[]): T {
    return faker.helpers.arrayElement(array);
}

/**
 * Generates a random child age within the specified limits.
 * Default method parameters are used over external constants for flexibility and to keep the generator self-contained.
 * @param min - Minimum age (default: 0).
 * @param max - Maximum age (default: 17).
 * @returns A random child age.
 */
export function getRandomChildAge(min = 0, max = 17): number {
    return faker.number.int({ min, max });
}

/**
 * Generates a random number of adults within the specified limits.
 * @param min - Minimum number of adults (default: 1).
 * @param max - Maximum number of adults (default: 9).
 * @returns A random number of adults.
 */
export function getRandomAdultsNum(min = 1, max = 9): number {
    return faker.number.int({ min, max });
}

/**
 * Generates a random valid month.
 * @returns A random month integer between 1 and 12.
 */
export function getRandomMonth(): number {
    return faker.number.int({ min: 1, max: 12 });
}

/**
 * Generates a random valid day for a given month, respecting month limits.
 * @param month - The month number (1-12).
 * @param year - Optional year to account for leap years (defaults to current year).
 * @returns A valid random day of the given month.
 */
export function getRandomDayOfMonth(month: number, year: number = new Date().getFullYear()): number {
    const daysInMonth = new Date(year, month, 0).getDate();
    return faker.number.int({ min: 1, max: daysInMonth });
}
