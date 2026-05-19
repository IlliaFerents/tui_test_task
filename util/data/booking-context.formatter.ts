import type { TestInfo } from "@playwright/test";
import type { BookingContext } from "../actors/booking-journey.actor";
import { logger } from "../system/logger";

/**
 * Logs the booking context to stdout and, when TestInfo is provided,
 * attaches each field as an annotation so it appears in the HTML report.
 */
export function logBookingData(ctx: BookingContext, testInfo?: TestInfo): void {
    const rows: Array<[string, string]> = [
        ["Departure airport", ctx.departureAirport],
        ["Destination", `${ctx.destinationCountry} / ${ctx.destinationRegion}`],
        ["Departure date", ctx.departureDate],
        ["Return date", ctx.returnDate.toLocaleDateString("nl-NL")],
        ["Guests", `${ctx.adults} adults, ${ctx.childAge.length} child (ages: ${ctx.childAge.join(", ")})`],
        ["Hotel", ctx.hotelName]
    ];

    logger.info("Booking journey context:");
    for (const [key, value] of rows) {
        logger.info(`  ${key.padEnd(18)}: ${value}`);
    }

    if (testInfo) {
        for (const [key, value] of rows) {
            testInfo.annotations.push({ type: key, description: value });
        }
    }
}
