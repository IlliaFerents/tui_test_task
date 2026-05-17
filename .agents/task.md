Exercise:

Automation exercise to demonstrate your skills in TypeScript, Playwright, and testdesign.

Scenario

Automate the following journey on https://www.tui.nl/h/nl:

Open the homepage.
Accept the cookies pop-up.
Select a random available departure airport.
Select a random available destination airport.
Select an available departure date.
In “Rooms & Guests”, choose 2 adults and 1 child (child age should be random from available values).
Search for holidays.
From results, pick the first available hotel.
On the hotel details page, click Continue.
Select available flights.
Continue to Passenger details page.
Add validation checks for error messages in passenger information fields (e.g., missing name, invalid input).
Requirements

Use TypeScript and Playwright.
Apply the Page Object Model (POM).
Print all selected test data and booking details to console/logs (departure, destination, date, child age, hotel name, etc.).
Structure the project as a separate TypeScript Playwright project.
Candidate can optionally publish the project on GitHub or provide as a zipped project folder.
Follow best practices in:
Test organization
Page objects
Assertions
Code readability & maintainability
Deliverables

Source code of the Playwright project.
Instructions to run the tests (README.md).


Task implemenation recommendations:
1. Treat the task as a showcase project
Approach this assignment as something you would confidently present to an interviewer. Aim for clarity, cleanliness, and intentional design rather than “just making it work.”

2. Keep the codebase clean and intentional
Avoid code duplication where logic can be reused or generalized.
Remove unused or dead code, or clearly integrate it if it serves a purpose.
Keep files and responsibilities well defined.
This shows ownership and good engineering hygiene.

3. Be consistent with Page Object design
Define locators as class-level properties rather than inline in methods.
Keep a consistent structure across all page objects.
Consistency improves readability and makes the code easier to maintain and extend.

4. Use configuration over hardcoding
Rely on framework and project-level configuration where possible (e.g. timeouts in Playwright config).
Avoid duplicating configuration values inside tests or page objects unless there is a clear reason.
This demonstrates awareness of tooling best practices.

5. Focus on test scope and structure
Keep tests focused on the core scenarios required by the task.
Avoid long, monolithic tests that try to cover everything at once.
Extract repeated flows into reusable helpers or actors when appropriate.
Clean, well-scoped tests are easier to understand and reason about.

6. Demonstrate a strong testing mindset through assertions
Assertions are one of the most important parts of the task.

Prefer specific, meaningful assertions over generic ones.
Validate that the correct behavior or message appears for a given input, not just that “something happened.”
Avoid assertions that could easily pass even if the application behaves incorrectly.
This is often the clearest signal of testing maturity.

7. Use TypeScript as a safety net
Include an explicit tsconfig.json.
Favor stricter TypeScript settings where possible.
Type safety helps catch real issues early and reflects professional project standards.

