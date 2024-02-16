const { test, expect } = require("@playwright/test");
const axios = require("axios");

// Asynchronously fetch data from an API sheet
async function fetchDataFromSheet() {
  try {
    // Make an HTTP GET request to the API endpoint
    const response = await axios.get(
      "https://app.apisheet.io/v1/x2OagYQ0/gunner_estimator4",
      {
        headers: {
          Authorization: `Bearer 3g7h3ke6qb8-dr506kc6cwp`,
        },
      }
    );
    console.log("Data fetched successfully:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data from sheet:", error);
    return []; // Return an empty array in case of an error
  }
}


// -----------------PRESS PLAY BUTTON----------------------



test("Register accounts from sheet data", async ({ page, browser }) => {
  // Make sure to include 'browser' here
  const sheetData = await fetchDataFromSheet(); // Fetch data to be used in the test
  // If no data is fetched, log an error and return early
  if (sheetData.length === 0) {
    console.error("Failed to fetch data from the sheet or no data available");
    return;
  }

  test.setTimeout(60000); // global timeout for the test to 3 minutes

  // Iterate over each user data entry
  for (const {
    userEmail,
    firstName,
    lastName,
    password,
    streetAddress,
    city,
    state,
    zip,
    phone,
  } of sheetData) {
    console.log(`Registering account for email: ${userEmail}`);
    // Navigate to the registration page
    await page.
    goto("https://estimatorstg.gunnerroofing.com/register");
    console.log("Page loaded.");

    try {
      // Fill in the registration form with user data
      await page.fill("#mui-2", userEmail);
      await page.fill("#login_firstNameInput__83jKa", firstName);
      await page.fill("#mui-1", lastName);
      await page.fill("#mui-3", password);
      await page.fill("#mui-4", password);
      await page.click('button:has-text("NEXT STEP")');
      await page.fill("#mui-5", streetAddress);
      await page.fill("#mui-7", city);
      await page.click("#login_state__00tza");
      await page.waitForSelector('ul[role="listbox"] >> text="' + state + '"');
      await page.click('ul[role="listbox"] >> text="' + state + '"');
      await page.fill("#mui-8", zip);
      await page.fill("#mui-9", phone);

      await page.waitForLoadState("networkidle");

      const windowSidingQuestionVisible = await page.isVisible(
        'text="Would you also like information on window or siding installation?"'
      );
      if (windowSidingQuestionVisible) {
        const yesButtonForWindowSiding = await page.waitForSelector(
          'text="Would you also like information on window or siding installation?" >> ../.. >> button[value="YES"]'
        );
        await yesButtonForWindowSiding.waitForElementState("stable");
        await yesButtonForWindowSiding.click({ force: true });
        console.log("Clicked YES for window/siding installation information.");
      }

      // Handle dynamic questions, clicking "YES" or "NO" as appropriate
      const yesButtons = await page.$$(`button[value="YES"]`);
      for (const button of yesButtons) {
        await button.waitForElementState("stable");
        await button.click({ force: true });
      }

      const callButtonSelector = 'button[value="Call"]:has-text("CALL")';
      await page.waitForSelector(callButtonSelector, { state: "attached" });
      const callButton = await page.$(callButtonSelector);
      // Handle the call button visibility and click it if it's visible
      if (callButton && (await callButton.isVisible())) {
        await callButton.waitForElementState("stable");
        await callButton.click();
      }
      // Check if the insurance question is visible and handle it if it is
      const insuranceQuestionVisible = await page.isVisible(
        'text="Will this project be covered by insurance?"'
      );
      if (insuranceQuestionVisible) {
        // If the question is visible, click the "NO" button
        const insuranceNoButton = await page.waitForSelector(
          'text="Will this project be covered by insurance?" >> ../.. >> button[value="NO"]'
        );
        await insuranceNoButton.click({ force: true });
        console.log("Clicked insurance NO button.");
      }
      // Submit the form and wait for the confirmation that the quote is being generated
      await page.click('button:has-text("submit")');
      await page.waitForSelector('text="Your quote is being generated."');

      console.log("Form submitted, waiting for confirmation page.");

      // Log out from the session to start anew for the next registration
      await page.click('li#logOutNavBtn >> text="Log Out"');

      // After submitting the form, open a new context to check Gmail
      const context = await browser.newContext();
      const gmailPage = await context.newPage();

      // Go to Gmail login page
      await gmailPage.goto("https://mail.google.com/");

      // Fill in the username and password
      await gmailPage.fill('input[type="email"]', "playwright021224@gmail.com");
      await gmailPage.click("#identifierNext");
      await gmailPage.waitForNavigation();
      await gmailPage.fill('input[type="password"]', "Playwright24!"); // It's better to use environment variables for passwords
      await gmailPage.click("#passwordNext");
      await gmailPage.waitForNavigation();

      // Wait for the inbox to load and search for the email
      await gmailPage.waitForSelector('input[aria-label="Search mail"]', {
        state: "visible",
      });
      await gmailPage.fill(
        'input[aria-label="Search mail"]',
        'subject:"Your quote is being generated"'
      );
      await gmailPage.press('input[aria-label="Search mail"]', "Enter");

      // Wait for the email to appear based on the text within a table row with class 'zA'
      await gmailPage.waitForSelector(
        'tr.zA:has-text("Your quote is being generated")'
      );

      // Click on the email based on the specified class and text
      await gmailPage.click('tr.zA:has-text("Your quote is being generated")');

      // After the email has been opened
      await gmailPage.waitForSelector("div.aeJ"); // Wait for the email content container to load

      // Smoothly scroll to the bottom of the email content
      await gmailPage.evaluate(() => {
        return new Promise((resolve) => {
          const element = document.querySelector("div.aeJ");
          let totalHeight = 0;
          const distance = element.scrollHeight - element.clientHeight;
          const step = distance / 100; // smaller step for a smoother scroll

          const scrollInterval = setInterval(() => {
            element.scrollTop += step;
            totalHeight += step;

            if (totalHeight >= distance) {
              clearInterval(scrollInterval);
              resolve();
            }
          }, 50); // interval time in milliseconds
        });
      });
      // Wait for 5 seconds to observe the action
      await gmailPage.waitForTimeout(5000); // For demonstration purposes only

      await gmailPage.close();
      await context.close();

      await context.clearCookies();
      await context.clearPermissions();
      await page.evaluate(() => localStorage.clear());
      console.log("Session data cleared.");

      // Navigate back to the registration page for the next user
      await page.goto("https://estimatorstg.gunnerroofing.com/register");

      console.log("Returned to the registration page.");
    } catch (error) {
      // If an error occurs, log it and continue with the next user
      console.error(`Error with data for email ${userEmail}:`, error);
      continue;
    }
  }

  // Remove the event listener after the test
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });
});

// Export the configuration for Playwright
module.exports = {
  timeout: 360000, // Global timeout for all actions set to 3 minutes
};
