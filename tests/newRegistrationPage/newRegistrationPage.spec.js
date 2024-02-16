const { test, expect } = require("@playwright/test");
const axios = require("axios");

async function fetchDataFromSheet() {
  try {
    const response = await axios.get(
      "https://app.apisheet.io/v1/x2OagYQ0/gunner_estimator4",
      {
        headers: {
          Authorization: `Bearer 3g7h3ke6qb8-dr506kc6cwp`,
        },
      }
    );
    console.log("Data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from sheet:", error);
    return [];
  }
}

async function selectStateAndAnswerQuestions(page, formData) {
  console.log(`Selecting state: ${formData.state}`);
  await page.selectOption('select[name="state"]', formData.state);
  await expect(page.locator('select[name="state"]')).toHaveValue(
    formData.state
  );

  console.log("Setting insurance coverage to 'Yes'...");
  await page.evaluate(() => {
    const yesRadio = document.querySelector("input#btnYes");
    if (yesRadio) {
      yesRadio.checked = true;
    }
  });

  const isYesChecked = await page.isChecked("input#btnYes");
  if (isYesChecked) {
    console.log("Confirmed: Insurance coverage set to 'Yes'.");
  } else {
    console.warn(
      "Warning: Unable to confirm 'Yes' selection for insurance coverage."
    );
  }

  console.log("Skipping additional services selection...");

  console.log("Setting referral answer to 'No'...");
  await page.evaluate(() => {
    const noRadio = document.querySelector("input#btnRefNo");
    if (noRadio) {
      noRadio.checked = true;
    }
  });

  const isNoChecked = await page.isChecked("input#btnRefNo");
  if (isNoChecked) {
    console.log("Confirmed: Referral answer set to 'No'.");
  } else {
    console.warn(
      "Warning: Unable to confirm 'No' selection for referral question."
    );
  }
}

async function registerUser(page, user) {
  console.log(`Registering user: ${user.userEmail}`);

  await page.goto("https://staging.gunnerroofing.com/register/");

  console.log("Filling street address...");
  await page.type('input[name="streetAddress"]', user.streetAddress);
  console.log("Filling city...");
  await page.type('input[name="city"]', user.city);
  console.log("Filling ZIP code...");
  await page.type('input[name="zip"]', user.zip);
  console.log("Filling phone number...");
  await page.type('input[name="phone"]', user.phone);
  console.log("Filling email...");
  await page.type('input[name="email"]', user.userEmail);
  console.log("Filling password...");
  await page.type('input[name="password"]', user.password);
  console.log("Verifying password...");
  await page.type("input#confirmPassword", user.password);
  console.log("Filling first name...");
  await page.type('input[name="firstName"]', user.firstName);
  console.log("Filling last name...");
  await page.type('input[name="lastName"]', user.lastName);
  console.log("Selecting 'Immediately' for the timeframe...");
  await page.selectOption("select#timeframe", "Immediately");
  console.log("Selecting 'Call' as preferred contact method...");
  await page.click('label[for="btnCall"]');

  await selectStateAndAnswerQuestions(page, user);

  console.log("Submitting the form.. .");
  await page.click('button[type="submit"]');

  console.log("Waiting on the 'Thank You' page...");
  await page.waitForTimeout(2000);

  console.log(`Registration completed for user: ${user.userEmail}`);
}

test("bulk registration with API data", async ({ page }) => {
  const users = await fetchDataFromSheet();

  if (users.length > 0) {
    for (const user of users) {
      await registerUser(page, user);

      await page.goto("https://staging.gunnerroofing.com/register/");
    }
    console.log("All users registered successfully.");
  } else {
    console.log("No users to register.");
  }
});
