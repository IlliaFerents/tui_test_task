import { mergeTests } from "@playwright/test";
import { hookFixtures } from "./hook.fixture";
import { pageFixtures } from "./page.fixture";
import { utilFixtures } from "./util.fixture";

export const test = mergeTests(hookFixtures, pageFixtures, utilFixtures);
export { expect } from "@playwright/test";
