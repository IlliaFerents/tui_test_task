import { test as base } from "@playwright/test";
import * as generator from "../util/data/generator";
import { logger } from "../util/system/logger";
import { logBookingData } from "../util/data/booking-context.formatter";
import type { BookingContext } from "../util/actors/booking-journey.actor";

export const utilFixtures = base.extend<{
    generate: typeof generator;
    logger: typeof logger;
    logBookingData: (ctx: BookingContext) => void;
}>({
    // eslint-disable-next-line no-empty-pattern
    generate: async ({}, use) => {
        await use(generator);
    },
    // eslint-disable-next-line no-empty-pattern
    logger: async ({}, use) => {
        await use(logger);
    },
    // eslint-disable-next-line no-empty-pattern
    logBookingData: async ({}, use, testInfo) => {
        await use((ctx) => logBookingData(ctx, testInfo));
    }
});
