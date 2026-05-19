import { test as base } from "@playwright/test";

export const hookFixtures = base.extend<{ cookieConsentHandler: void }>({
    cookieConsentHandler: [
        async ({ page }, use) => {
            await page.addLocatorHandler(page.getByRole("dialog", { name: "Cookie Consent Modal" }), async () => {
                await page.locator("#cmCloseBanner").click();
            });
            await use();
        },
        { auto: true }
    ]
});
