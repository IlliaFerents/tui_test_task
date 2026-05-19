/**
 * Expected error messages for passenger details form validation.
 * Single source of truth — specs import from here, never hardcode strings.
 * Messages verified against live TUI.nl DOM (May 2026).
 */
export const ERROR_MESSAGES = {
    firstName: {
        required: "Vul de voornaam in (volgens paspoort)",
        invalid: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens."
    },
    lastName: {
        required: "Vul de achternaam in (volgens paspoort)",
        invalid: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens."
    },
    gender: {
        required: "Selecteer een geslacht"
    },
    dateOfBirth: {
        invalid: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
        ageInvalid: "Voer een geldige geboortedatum in",
        childAgeMismatch:
            "Vul bij het zoeken de leeftijd van het kind op de dag van terugkomst in. Keer terug naar zoeken om dit aan te passen."
    },
    street: {
        required: "Vul de straatnaam in"
    },
    houseNumber: {
        required: "Vul het huisnummer in"
    },
    postcode: {
        required: "Vul de postcode in",
        invalid: "Vul een geldige postcode in."
    },
    city: {
        required: "Vul de woonplaats in"
    },
    phone: {
        required: "Vul het telefoonnummer in",
        invalid: "Vul het juiste telefoonnummer in"
    },
    email: {
        required: "Vul het e-mailadres in",
        invalid: "Vul een geldig e-mailadres in"
    },
    terms: {
        required: "Bevestig dat je akkoord gaat met de algemene voorwaarden om je reservering af te ronden."
    },
    promoCode: {
        invalid: "Kortingscode niet geldig",
        validationFailed: "Validatie mislukt."
    }
} as const;

/**
 * Summary error regex. Captures field count as group 1.
 */
export const SUMMARY_ERROR_PATTERN = /Oeps, wijzig bovenstaand\(e\) (\d+) veld\(en\) nogmaals/;
