const DUTCH_MONTHS: Record<string, number> = {
    jan: 0,
    feb: 1,
    mrt: 2,
    apr: 3,
    mei: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    okt: 9,
    nov: 10,
    dec: 11
};

/**
 * Parses TUI's Dutch date strings into a Date object.
 * Handles formats:
 *   - "22 mei 2026" (search panel input value)
 *   - "ma 01 jun. 2026" (booking summary, with day-of-week prefix)
 * Month names may have trailing dots.
 */
export function parseDutchDate(raw: string): Date {
    const parts = raw.trim().toLowerCase().split(/\s+/);

    // If first part is non-numeric (day-of-week like "ma", "di", "zo"), skip it
    let idx = 0;
    if (isNaN(parseInt(parts[0], 10))) {
        idx = 1;
    }

    const day = parseInt(parts[idx], 10);
    const month = DUTCH_MONTHS[parts[idx + 1].replace(".", "")];
    const year = parseInt(parts[idx + 2], 10);

    if (isNaN(day) || month === undefined || isNaN(year)) {
        throw new Error(`Failed to parse TUI date: "${raw}"`);
    }

    return new Date(year, month, day);
}

// ─────────────────────────────────────────────────────────────────────────────
// Adult DOB boundaries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the boundary birth date for the adult minimum age check (MIN_DATE=18).
 *
 * TUI rule: age on return date must be > 18 (strictly older).
 * - Born on this date = exactly 18 on return = INVALID
 * - Born 1 day earlier = 18y 1d = VALID
 * - Born 1 day later = 17y 364d = INVALID
 */
export function getAdultMinAgeBoundary(returnDate: Date): Date {
    return new Date(returnDate.getFullYear() - 18, returnDate.getMonth(), returnDate.getDate());
}

/**
 * Returns the boundary birth date for the adult maximum age check (MAX_DATE=118).
 *
 * TUI rule: age on return date must be <= 118.
 * - Born on this date = exactly 118 on return = VALID (boundary inclusive)
 * - Born 1 day earlier = 118y 1d = INVALID
 * - Born 1 day later = 117y 364d = VALID
 *
 * Verified: return June 7, 2026 → 07/06/1908 (exactly 118) = valid, 06/06/1908 (118y 1d) = invalid.
 */
export function getAdultMaxAgeBoundary(returnDate: Date): Date {
    return new Date(returnDate.getFullYear() - 118, returnDate.getMonth(), returnDate.getDate());
}

// ─────────────────────────────────────────────────────────────────────────────
// Child DOB boundaries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the exact birth date for a child to be the correct age on the return date.
 * Born on this date = exactly childAge years old on return = VALID.
 */
export function getChildExactBirthDate(returnDate: Date, childAge: number): Date {
    return new Date(returnDate.getFullYear() - childAge, returnDate.getMonth(), returnDate.getDate());
}

/**
 * Returns a birth date 1 day after the valid boundary — child is too young (childAge - 1 on return).
 */
export function getChildTooYoungBirthDate(returnDate: Date, childAge: number): Date {
    const boundary = getChildExactBirthDate(returnDate, childAge);
    return new Date(boundary.getFullYear(), boundary.getMonth(), boundary.getDate() + 1);
}

/**
 * Returns a birth date 1 day before the child would turn childAge+1 on the return date.
 * This child is already childAge+1 on return → age mismatch error expected.
 *
 * Example: childAge=3, return=23/06/2026
 *   - exact boundary for age 4: 23/06/2022
 *   - too old BVA: 22/06/2022 (turns 4 on return → mismatch)
 */
export function getChildTooOldBirthDate(returnDate: Date, childAge: number): Date {
    const nextAgeBoundary = getChildExactBirthDate(returnDate, childAge + 1);
    return new Date(nextAgeBoundary.getFullYear(), nextAgeBoundary.getMonth(), nextAgeBoundary.getDate() - 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a Date as zero-padded DD/MM/YYYY strings for DOB input fields.
 */
export function formatDobFields(date: Date): { day: string; month: string; year: string } {
    return {
        day: date.getDate().toString().padStart(2, "0"),
        month: (date.getMonth() + 1).toString().padStart(2, "0"),
        year: date.getFullYear().toString()
    };
}
