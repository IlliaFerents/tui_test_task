# TUI passenger details: TypeScript validation types

Intended use: spec tests that validate passenger form errors.

## Core types

```typescript
type PassengerType = "adult" | "child";
type PassengerRole = "lead" | "companion";
type Gender = "MAN" | "VROUW";
type ValidationTrigger = "blur" | "submit";

interface DateOfBirth {
    day: string; // 2-digit DD
    month: string; // 2-digit MM
    year: string; // 4-digit YYYY
}

interface PhoneNumber {
    prefix: string; // e.g. "+31"
    number: string;
}

interface PassengerFields {
    firstName: string;
    lastName: string;
    gender: Gender | null; // null = "Selecteer" (unselected)
    dateOfBirth: DateOfBirth;
}

interface LeadPassengerFields extends PassengerFields {
    nationality: string;
    country: string;
    street: string;
    houseNumber: string;
    postcode: string;
    city: string;
    phone: PhoneNumber;
    email: string;
}

interface EmergencyContact {
    lastName: string;
    phone: PhoneNumber;
}

interface PassengerDetailsForm {
    passengers: Array<{
        type: PassengerType;
        role: PassengerRole;
        fields: PassengerFields | LeadPassengerFields;
        childAge?: number;
    }>;
    emergencyContact: EmergencyContact;
    termsAccepted: boolean;
}
```

## Validation rules

```typescript
type ValidationRuleType = "required" | "minLength" | "maxLength" | "pattern" | "format" | "range" | "checkbox";

interface ValidationRule {
    type: ValidationRuleType;
    constraint?: string | number | RegExp;
}

type FieldId =
    | "firstName"
    | "lastName"
    | "gender"
    | "dateOfBirth"
    | "street"
    | "houseNumber"
    | "postcode"
    | "city"
    | "phone"
    | "email"
    | "terms"
    | "emergencyLastName"
    | "emergencyPhone";

interface FieldValidation {
    fieldId: FieldId;
    rules: ValidationRule[];
    errorMessages: Record<string, string>; // ruleType -> message
}

const VALIDATIONS: FieldValidation[] = [
    {
        fieldId: "firstName",
        rules: [
            { type: "required" },
            { type: "minLength", constraint: 2 },
            { type: "maxLength", constraint: 32 },
            { type: "pattern", constraint: /^[a-zA-ZÀ-ÿ\s\-']+$/ }
        ],
        errorMessages: {
            required: "Vul de voornaam in (volgens paspoort)",
            minLength: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
            maxLength: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
            pattern: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens."
        }
    },
    {
        fieldId: "lastName",
        rules: [
            { type: "required" },
            { type: "minLength", constraint: 2 },
            { type: "maxLength", constraint: 32 },
            { type: "pattern", constraint: /^[a-zA-ZÀ-ÿ\s\-']+$/ }
        ],
        errorMessages: {
            required: "Vul de achternaam in (volgens paspoort)",
            minLength: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
            maxLength: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
            pattern: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens."
        }
    },
    {
        fieldId: "gender",
        rules: [{ type: "required" }],
        errorMessages: {
            required: "Selecteer een geslacht"
        }
    },
    {
        fieldId: "dateOfBirth",
        rules: [
            { type: "required" },
            { type: "format" }, // DD/MM/YYYY composite
            { type: "range" } // must be valid date, not future
        ],
        errorMessages: {
            required: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
            format: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
            range: "Voer de geboortedatum als volgt in: DD/MM/JJJJ"
        }
    },
    {
        fieldId: "street",
        rules: [{ type: "required" }],
        errorMessages: {
            required: "Vul de straatnaam in"
        }
    },
    {
        fieldId: "houseNumber",
        rules: [{ type: "required" }],
        errorMessages: {
            required: "Vul het huisnummer in"
        }
    },
    {
        fieldId: "postcode",
        rules: [{ type: "required" }, { type: "pattern", constraint: /^\d{4}\s?[A-Z]{2}$/ }],
        errorMessages: {
            required: "Vul de postcode in",
            pattern: "Vul een geldige postcode in."
        }
    },
    {
        fieldId: "city",
        rules: [{ type: "required" }],
        errorMessages: {
            required: "Vul de woonplaats in"
        }
    },
    {
        fieldId: "phone",
        rules: [{ type: "required" }, { type: "pattern", constraint: /^\d{9,10}$/ }],
        errorMessages: {
            required: "Vul het telefoonnummer in",
            pattern: "Vul het juiste telefoonnummer in"
        }
    },
    {
        fieldId: "email",
        rules: [{ type: "required" }, { type: "format" }],
        errorMessages: {
            required: "Vul het e-mailadres in",
            format: "Vul een geldig e-mailadres in"
        }
    },
    {
        fieldId: "terms",
        rules: [{ type: "checkbox" }],
        errorMessages: {
            checkbox: "Bevestig dat je akkoord gaat met de algemene voorwaarden om je reservering af te ronden."
        }
    },
    {
        fieldId: "emergencyLastName",
        rules: [{ type: "required" }],
        errorMessages: {
            required: "Vul de achternaam in (volgens paspoort)"
        }
    },
    {
        fieldId: "emergencyPhone",
        rules: [{ type: "required" }, { type: "pattern", constraint: /^\d{9,10}$/ }],
        errorMessages: {
            required: "Vul het telefoonnummer in",
            pattern: "Vul het juiste telefoonnummer in"
        }
    }
];
```

## Error locator strategy (for spec tests)

```typescript
interface ErrorLocator {
    fieldId: FieldId;
    section: "lead" | "companion" | "child" | "emergency" | "terms";
    passengerIndex?: number;
    selector: string; // CSS or aria selector
    ariaRole: "alert" | "text"; // how the error is rendered
    ariaLive: "assertive" | "polite" | null;
}

// Error detection pattern:
// 1. Field-level: [role="alert"][aria-live="assertive"] adjacent to input
// 2. Date composite: [aria-live="polite"] wrapping all 3 date fields
// 3. Gender: plain text (no role)
// 4. Summary: text "Oeps, wijzig bovenstaand(e) N veld(en) nogmaals"
```

## Test data factory

```typescript
interface TestCase {
    description: string;
    field: FieldId;
    value: string | null | DateOfBirth;
    expectedError: string | null; // null = valid
    technique: "BVA" | "EP" | "required";
}

const TEST_CASES: TestCase[] = [
    // firstName BVA
    {
        description: "firstName: 1 char (below min)",
        field: "firstName",
        value: "A",
        expectedError: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
        technique: "BVA"
    },
    {
        description: "firstName: 2 chars (at min)",
        field: "firstName",
        value: "Ab",
        expectedError: null,
        technique: "BVA"
    },
    {
        description: "firstName: 32 chars (at max)",
        field: "firstName",
        value: "A".repeat(32),
        expectedError: null,
        technique: "BVA"
    },
    {
        description: "firstName: 33 chars (above max)",
        field: "firstName",
        value: "A".repeat(33),
        expectedError: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
        technique: "BVA"
    },
    {
        description: "firstName: with digits",
        field: "firstName",
        value: "John123",
        expectedError: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
        technique: "EP"
    },
    {
        description: "firstName: with special chars",
        field: "firstName",
        value: "Jo@n",
        expectedError: "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens.",
        technique: "EP"
    },
    {
        description: "firstName: empty",
        field: "firstName",
        value: "",
        expectedError: "Vul de voornaam in (volgens paspoort)",
        technique: "required"
    },
    {
        description: "firstName: valid with hyphen",
        field: "firstName",
        value: "Anne-Marie",
        expectedError: null,
        technique: "EP"
    },
    {
        description: "firstName: valid with diacritics",
        field: "firstName",
        value: "René",
        expectedError: null,
        technique: "EP"
    },

    // dob BVA
    {
        description: "dob: day 00",
        field: "dateOfBirth",
        value: { day: "00", month: "06", year: "1990" },
        expectedError: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
        technique: "BVA"
    },
    {
        description: "dob: day 32",
        field: "dateOfBirth",
        value: { day: "32", month: "06", year: "1990" },
        expectedError: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
        technique: "BVA"
    },
    {
        description: "dob: month 13",
        field: "dateOfBirth",
        value: { day: "15", month: "13", year: "1990" },
        expectedError: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
        technique: "BVA"
    },
    {
        description: "dob: future year",
        field: "dateOfBirth",
        value: { day: "15", month: "06", year: "2030" },
        expectedError: "Voer de geboortedatum als volgt in: DD/MM/JJJJ",
        technique: "BVA"
    },
    {
        description: "dob: valid",
        field: "dateOfBirth",
        value: { day: "15", month: "06", year: "1990" },
        expectedError: null,
        technique: "EP"
    },

    // postcode EP
    {
        description: "postcode: valid format",
        field: "postcode",
        value: "1017 CT",
        expectedError: null,
        technique: "EP"
    },
    {
        description: "postcode: letters only",
        field: "postcode",
        value: "ABCD EF",
        expectedError: "Vul een geldige postcode in.",
        technique: "EP"
    },
    {
        description: "postcode: digits only",
        field: "postcode",
        value: "123456",
        expectedError: "Vul een geldige postcode in.",
        technique: "EP"
    },
    {
        description: "postcode: empty",
        field: "postcode",
        value: "",
        expectedError: "Vul de postcode in",
        technique: "required"
    },

    // email EP
    { description: "email: valid", field: "email", value: "user@domain.nl", expectedError: null, technique: "EP" },
    {
        description: "email: no @",
        field: "email",
        value: "userdomain.nl",
        expectedError: "Vul een geldig e-mailadres in",
        technique: "EP"
    },
    {
        description: "email: no domain",
        field: "email",
        value: "user@",
        expectedError: "Vul een geldig e-mailadres in",
        technique: "EP"
    },
    {
        description: "email: empty",
        field: "email",
        value: "",
        expectedError: "Vul het e-mailadres in",
        technique: "required"
    },

    // phone EP
    {
        description: "phone: valid NL mobile",
        field: "phone",
        value: "0612345678",
        expectedError: null,
        technique: "EP"
    },
    {
        description: "phone: too short",
        field: "phone",
        value: "123",
        expectedError: "Vul het juiste telefoonnummer in",
        technique: "BVA"
    },
    {
        description: "phone: empty",
        field: "phone",
        value: "",
        expectedError: "Vul het telefoonnummer in",
        technique: "required"
    },

    // gender
    {
        description: "gender: not selected",
        field: "gender",
        value: null,
        expectedError: "Selecteer een geslacht",
        technique: "required"
    },

    // terms
    {
        description: "terms: unchecked",
        field: "terms",
        value: null,
        expectedError: "Bevestig dat je akkoord gaat met de algemene voorwaarden om je reservering af te ronden.",
        technique: "required"
    }
];
```

## Summary error

```typescript
interface FormSummaryError {
    pattern: RegExp; // /Oeps, wijzig bovenstaand\(e\) (\d+) veld\(en\) nogmaals/
    extractCount: (text: string) => number;
}
```

## Key observations for test implementation

- Validation fires on **blur** (leaving a field empty or with invalid data). Errors appear immediately without needing to submit.
- Submit forces all remaining unvisited fields to validate at once and shows the summary count.
- Date uses 3 separate inputs. A single generic error covers all date issues (format, range, empty).
- The name validation message covers multiple failure modes (length + pattern) in one string.
- `aria-live="assertive"` for most field errors, `aria-live="polite"` for date composite hints.
- Gender error is plain text, not wrapped in an alert role. Consider testing via text content rather than role selector.
- Emergency contact reuses same error messages as passenger fields.
- The form has a "same last name" checkbox for passengers 2+ (shares lead's last name).
