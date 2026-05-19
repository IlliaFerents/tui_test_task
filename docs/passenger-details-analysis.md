# TUI passenger details page: validation analysis

## Page context

- URL: `tui.nl/h/nl/book/passengerdetails`
- Booking: 2 adults + 1 child (14y), Aruba trip
- Validation trigger: on submit (click "Boeken" button)
- Summary error: "Oeps, wijzig bovenstaand(e) N veld(en) nogmaals" (N = count of invalid fields)

## Form sections

| Section                          | Fields                                                                                                                               | Applies to                        |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| Passenger (adult, lead)          | firstName, lastName, gender, dob (dd/mm/yyyy), nationality, country, street, houseNumber, postcode, city, phonePrefix + phone, email | Only adult 1                      |
| Passenger (adult, co-traveller)  | firstName, lastName, gender, dob                                                                                                     | Adult 2+                          |
| Passenger (child)                | firstName, lastName, gender, dob                                                                                                     | Each child                        |
| Emergency contact (thuisblijver) | lastName, phonePrefix + phone                                                                                                        | Always                            |
| Terms                            | checkbox (agree to T&C)                                                                                                              | Always                            |
| Marketing opt-out                | 4x checkbox                                                                                                                          | Optional, no validation           |
| Promo code                       | text input + apply button                                                                                                            | Optional, no validation on submit |

## Field types

| Field         | HTML type         | Input pattern                                       |
| ------------- | ----------------- | --------------------------------------------------- |
| firstName     | textbox           | Free text, validated                                |
| lastName      | textbox           | Free text, validated                                |
| gender        | combobox (select) | Options: MAN, VROUW. Default: "Selecteer" (invalid) |
| dob.day       | textbox           | Numeric, 2 digits                                   |
| dob.month     | textbox           | Numeric, 2 digits                                   |
| dob.year      | textbox           | Numeric, 4 digits                                   |
| nationality   | combobox (select) | Pre-selected: Nederlandse                           |
| country       | combobox (select) | Pre-selected: Nederland                             |
| street        | textbox           | Free text                                           |
| houseNumber   | textbox           | Free text                                           |
| postcode      | textbox           | Dutch postcode format                               |
| city          | textbox           | Free text                                           |
| phonePrefix   | combobox (select) | Pre-selected: +31                                   |
| phone         | textbox           | Numeric                                             |
| email         | textbox           | Email format                                        |
| termsCheckbox | checkbox          | Must be checked                                     |

## Validation errors observed

| Field                            | Trigger | Error message (NL)                                                                         |
| -------------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| firstName (empty)                | submit  | "Vul de voornaam in (volgens paspoort)"                                                    |
| firstName (invalid chars/length) | submit  | "Gebruik tussen de 2 en 32 letters. Geen cijfers of speciale tekens."                      |
| lastName (empty)                 | submit  | "Vul de achternaam in (volgens paspoort)"                                                  |
| gender (not selected)            | submit  | "Selecteer een geslacht"                                                                   |
| dob (empty or invalid)           | submit  | "Voer de geboortedatum als volgt in: DD/MM/JJJJ"                                           |
| street (empty)                   | submit  | "Vul de straatnaam in"                                                                     |
| houseNumber (empty)              | submit  | "Vul het huisnummer in"                                                                    |
| postcode (empty)                 | submit  | "Vul de postcode in"                                                                       |
| postcode (invalid format)        | submit  | "Vul een geldige postcode in."                                                             |
| city (empty)                     | submit  | "Vul de woonplaats in"                                                                     |
| phone (empty)                    | submit  | "Vul het telefoonnummer in"                                                                |
| phone (invalid)                  | submit  | "Vul het juiste telefoonnummer in"                                                         |
| email (empty)                    | submit  | "Vul het e-mailadres in"                                                                   |
| email (invalid format)           | submit  | "Vul een geldig e-mailadres in"                                                            |
| terms (unchecked)                | submit  | "Bevestig dat je akkoord gaat met de algemene voorwaarden om je reservering af te ronden." |

## Validation behavior

- **Trigger**: client-side, fires on **blur** (leaving a field empty or with invalid data) AND on submit (forces all fields to validate at once)
- **Timing**: errors appear immediately after user tabs/clicks away from a field with invalid or empty content
- **Display**: inline, via `role="alert" aria-live="assertive"` elements adjacent to each field
- **Date errors**: single generic message regardless of whether day > 31, month > 12, or future year
- **Name validation**: min 2, max 32 chars, letters only (no digits, no special chars)
- **Postcode**: Dutch format enforced (likely `\d{4}\s?[A-Z]{2}`)
- **Phone**: format validation exists (short number like "123" fails)
- **Gender select**: default "Selecteer" is treated as empty
- **Nationality/Country**: pre-populated, no validation error observed
- **Emergency contact**: validated same as regular lastName + phone
- **Submit**: validates all fields simultaneously, shows summary count at bottom

## Error presentation patterns

1. **Field-level**: `<div role="alert" aria-live="assertive">` immediately after the input
2. **Date composite**: single error wrapping all 3 date inputs, `aria-live="polite"`
3. **Gender**: plain text below the select (no alert role)
4. **Summary**: "Oeps, wijzig bovenstaand(e) N veld(en) nogmaals" at page bottom
5. **Terms**: plain text below checkbox

## BVA (boundary value analysis)

| Field     | Min                   | Max                          | Boundary tests                                                  |
| --------- | --------------------- | ---------------------------- | --------------------------------------------------------------- |
| firstName | 2 chars               | 32 chars                     | 1 char (fail), 2 chars (pass), 32 chars (pass), 33 chars (fail) |
| lastName  | 2 chars (assumed)     | 32 chars (assumed)           | Same pattern                                                    |
| dob.day   | 01                    | 31                           | 00, 01, 31, 32                                                  |
| dob.month | 01                    | 12                           | 00, 01, 12, 13                                                  |
| dob.year  | ~1900 (assumed)       | current year                 | future year, way-past year                                      |
| postcode  | 4 digits + 2 letters  | 4 digits + space + 2 letters | Missing letters, extra digits                                   |
| phone     | ~9 digits (NL mobile) | ~10 digits                   | too short, correct, too long                                    |
| email     | x@x.x                 | standard RFC                 | missing @, missing domain, double @@                            |

## Equivalence classes

| Field     | Valid class             | Invalid classes                            |
| --------- | ----------------------- | ------------------------------------------ |
| firstName | "Jan", "Anne-Marie"     | "", "A", "123", "J@n", 33+ chars           |
| dob       | 15/06/1990              | empty, 32/01/1990, 15/13/1990, future date |
| postcode  | "1017 CT" (or "1017CT") | "AAAA", "12345", "1234 C", empty           |
| phone     | "0612345678"            | "123", "abc", empty                        |
| email     | "a@b.nl"                | "notanemail", "@.com", "", "a@"            |
| gender    | "MAN", "VROUW"          | "Selecteer" (default/empty)                |

## Notes

- Child passengers (14y) get same validation as adults for name/gender/dob
- Adult 2+ has a checkbox "Same last name as adult 1" (pre-fill option)
- Child passengers also have this checkbox
- Real-time onBlur validation is active; leaving a field invalid or empty triggers its error message instantly. Batch validation is triggered on submit.
- Date field uses 3 separate text inputs (day, month, year), not a date picker
- Phone has a separate country code selector (combobox) from the number input

### 🎨 Visual validation state anomalies (Known UI Defects)

While not the primary focus of functional specs, be aware that TUI's UI styling engine has two known visual defects:

1. **Name Formatting Visual Bug**: Typing an invalid format (e.g., `John123` containing numbers) triggers the red error message text, but the input border receives a green success highlight (`.inputs__success`) instead of a red error highlight (`.inputs__error`).
2. **DOB Year Visual Bug**: Entering a logically invalid date (e.g., `99/99/9999`) highlights Day and Month as errors, but highlights the Year input as a success (`.inputs__success`).
