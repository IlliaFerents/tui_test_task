/**
 * Thrown when the TUI availability API returns no available items for a given endpoint.
 * Used to discriminate retryable failures (no airports/destinations/dates available)
 * from non-retryable bugs.
 */
export class NoAvailabilityError extends Error {
    constructor(
        public readonly endpoint: string,
        message: string
    ) {
        super(message);
        this.name = "NoAvailabilityError";
    }
}
