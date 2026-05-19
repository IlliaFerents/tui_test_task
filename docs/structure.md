Structure
tests/passenger-details/
├── validation-required-fields.spec.ts
├── validation-format.spec.ts
├── validation-date-of-birth.spec.ts
└── validation-summary.spec.ts

Page Objects & Fixtures (Global)
├── pages/
│ └── passenger-details.page.ts (POM)
└── fixtures/
└── page.fixture.ts (Fixture injection)

Split criteria
By validation type, not by section or passenger. Reasoning: each validation type shares setup patterns, assertion patterns, and failure modes. Splitting by passenger (adult 1, adult 2, child) would duplicate the same test logic 3 times with only selector differences. That's what data-driven parametrization handles.

Spec breakdown

1. validation-required-fields.spec.ts (~1 test suite)
   Trigger required fields validations in batch by clicking "Proceed to payment" / "Boeken" once, then assert all required inline error messages simultaneously. This avoids triggering heavy client-side re-renders on a slow application for 15+ fields individually.

Assert over:
[passenger, field] combos: lead.firstName, lead.lastName, companion.firstName, child.lastName, etc.
Address fields: street, houseNumber, postcode, city
Contact fields: phone, email
Emergency contact: lastName, phone
Terms checkbox (on submit only)

2. validation-format.spec.ts (~15 tests)
   Enter invalid data, trigger blur/change, and assert specific format error messages.

Parametrize over equivalence classes:
firstName/lastName: 1 char, digits, special chars, 33+ chars
postcode: letters only, digits only, partial
phone: too short, letters
email: no @, no domain, double @@
Each test: fill value → blur/change → assert error message matches expected.

3. validation-date-of-birth.spec.ts (~10 tests)
   Separate spec because the field is a 3-input composite (Day, Month, Year) with its own DOM structure and age-boundary validation checks.

Empty all 3 fields
Day out of range (00, 32)
Month out of range (00, 13)
Future date
Valid date (no error)
Feb 30 (invalid calendar date)
Age-relevant boundaries (adult must be 18+, child must match declared age range)
Note: DOB error message is a single shared container under the composite input wrapper.

4. validation-summary.spec.ts (~4 tests)
   Submit-level behavior:
   Submit empty form → summary banner shows correct field count
   Fix 1 field, resubmit → count decreases
   Fix all fields → no summary, form submits
   Verify summary text pattern matches "Oeps, wijzig bovenstaand(e) N veld(en) nogmaals"
