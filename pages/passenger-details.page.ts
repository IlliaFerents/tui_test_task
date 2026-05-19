import type { Page, Locator } from "@playwright/test";
import { LeadPassengerSection } from "../page-components/lead-passenger-section.component";
import { PassengerSection } from "../page-components/passenger-section.component";
import { EmergencySection } from "../page-components/emergency-section.component";
import { PromoCodeSection } from "../page-components/promo-code-section.component";

export class PassengerDetailsPage {
    readonly lead: LeadPassengerSection;
    readonly companion: PassengerSection;
    readonly child: PassengerSection;
    readonly emergency: EmergencySection;
    readonly promoCode: PromoCodeSection;

    readonly submitButton: Locator;
    readonly termsCheckbox: Locator;
    readonly termsError: Locator;
    readonly summaryError: Locator;
    readonly returnDateLabel: Locator;

    constructor(page: Page) {
        const containers = page.locator(".PassengerFormV2__passengerContainer");

        // Containers have no identifying attributes; order is fixed by paxInfoFormBean index
        this.lead = new LeadPassengerSection(containers.nth(0));
        this.companion = new PassengerSection(containers.nth(1));
        this.child = new PassengerSection(containers.nth(2));
        this.emergency = new EmergencySection(page.locator(".EmergencyContact__passengerContainer"));
        this.promoCode = new PromoCodeSection(page);

        this.submitButton = page.getByText("Verder naar betalen", { exact: true });
        this.termsCheckbox = page
            .locator("#importantInformationV2__component")
            .getByRole("checkbox", { name: "checkbox" });
        this.termsError = page.locator("#importantInformationV2__component").locator("p.UI__error_message_red");
        this.summaryError = page.locator("#PaxPageScrollToError__component").getByLabel("error text");
        this.returnDateLabel = page.getByLabel("DeparturerData").last();
    }

    /**
     * Submits the form to trigger validation.
     */
    async submit(): Promise<void> {
        await this.submitButton.click();
    }
}
