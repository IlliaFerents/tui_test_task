import type { Page, Response } from "@playwright/test";
import { NoAvailabilityError } from "./errors";

type AvailabilityEndpoint = "departures" | "countries" | "destinations" | "check-ins";

/**
 * Maps each availability endpoint to its data key in the response body.
 * Note: the "destinations" endpoint confusingly returns data under "countries" key.
 */
const ENDPOINT_DATA_KEYS: Record<AvailabilityEndpoint, string> = {
    departures: "airports",
    countries: "countries",
    destinations: "countries",
    "check-ins": "checkIns"
};

interface AvailableItem {
    available: boolean;
    children?: AvailableItem[];
}

/**
 * Encapsulates waiting for TUI availability API responses.
 * Start listening before triggering the action to avoid missing fast responses.
 */
export class AvailabilityApi {
    private static readonly BASE = "/searchpanel/v1/packages/availability/";

    constructor(private readonly page: Page) {}

    /**
     * Waits for the given availability endpoint to respond with 200, then validates
     * that the response contains at least one available item. Throws if none are available.
     * @param endpoint - The availability endpoint to wait for.
     */
    waitFor(endpoint: AvailabilityEndpoint): Promise<Response> {
        return this.page.waitForResponse(async (r) => {
            if (!r.url().includes(`${AvailabilityApi.BASE}${endpoint}`) || r.status() !== 200) {
                return false;
            }

            const dataKey = ENDPOINT_DATA_KEYS[endpoint];
            const body = await r.json().catch(() => null);
            const items: unknown[] = body?.data?.[dataKey] ?? [];

            if (!this.hasAvailableItems(endpoint, items)) {
                throw new NoAvailabilityError(
                    endpoint,
                    `Availability API returned no available items for "${endpoint}". `
                );
            }

            return true;
        });
    }

    /**
     * Determines whether the response contains available items based on endpoint type.
     * - check-ins: non-empty array (items have no `available` flag, just a date)
     * - destinations: checks children arrays or the parent country itself
     * - departures/countries: checks `available` field on each item
     */
    private hasAvailableItems(endpoint: AvailabilityEndpoint, items: unknown[]): boolean {
        if (items.length === 0) return false;

        if (endpoint === "check-ins") {
            return true; // non-empty means dates exist
        }

        const typedItems = items as AvailableItem[];

        if (endpoint === "destinations") {
            // destinations response wraps regions in children[]; if no children, the country itself is selectable
            return typedItems.some(
                (item) =>
                    (item.children && item.children.length > 0 && item.children.some((child) => child.available)) ||
                    item.available
            );
        }

        return typedItems.some((item) => item.available);
    }
}
