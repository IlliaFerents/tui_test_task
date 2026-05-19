import { test as base } from "@playwright/test";
import * as generator from "../util/data/generator";

export const utilFixtures = base.extend<{
    generate: typeof generator;
}>({
    // eslint-disable-next-line no-empty-pattern
    generate: async ({}, use) => {
        await use(generator);
    }
});
