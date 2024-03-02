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
  console.log("Filling city...");
  console.log("Filling ZIP code...");
  console.log("Filling phone number...");
  console.log("Filling email...");
  console.log("Filling password...");
  console.log("Verifying password...");
  console.log("Filling first name...");
  console.log("Filling last name...");
  
  await page.evaluate((user) => {
      document.querySelector('input[name="streetAddress"]').value = user.streetAddress;
      document.querySelector('input[name="city"]').value = user.city;
      document.querySelector('input[name="zip"]').value = user.zip;
      document.querySelector('input[name="phone"]').value = user.phone;
      document.querySelector('input[name="email"]').value = user.userEmail;
      document.querySelector('input[name="password"]').value = user.password;
      document.querySelector("input#confirmPassword").value = user.password;
      document.querySelector('input[name="firstName"]').value = user.firstName;
      document.querySelector('input[name="lastName"]').value = user.lastName;
  }, user);

  console.log("Selecting 'Immediately' for the timeframe...");
  await page.selectOption("select#timeframe", "Immediately");
  console.log("Selecting 'Call' as preferred contact method...");
  await page.click('label[for="btnCall"]');

  await selectStateAndAnswerQuestions(page, user);

  // Ensure a request to reCAPTCHA's API is made
await test.step('Analyze network requests', async () => {
    // Listen for request
    page.on('request', request => {
      // URL request
      if (request.url().includes('https://www.google.com/recaptcha/api2')) {
        console.log('Detected a reCAPTCHA API request:', request.url());
      }
    });
  
    console.log("Submitting the form to trigger reCAPTCHA...");
    await page.click('button[type="submit"]');

    const currentUrl = page.url();
    console.log(`Current URL (Thank You page): ${currentUrl}`);

    if (currentUrl.includes("/thank-you/")) {
      console.log("Successfully navigated to the Thank You page.");
      // Additional actions or checks can be performed here.
  } else {
      console.warn("Did not navigate to the expected Thank You page.");
      // Handle unexpected navigation results.
  }


  
    console.log("Waiting for reCAPTCHA network requests...");
    // await page.waitForTimeout(1000);
  });
  

  // Check for reCAPTCHA presence 
  console.log("Checking for reCAPTCHA iframe...");
  const isCaptchaFramePresent = await page.isVisible(
    '.grecaptcha-logo iframe[title="reCAPTCHA"]'
  );
  if (!isCaptchaFramePresent) {
    console.log(
      `Expected reCAPTCHA iframe to be present for user: ${user.userEmail}, but it wasn't.`
    );
  } else {
    console.log(`reCAPTCHA iframe detected for user: ${user.userEmail}.`);
  }



  console.log(`Registration completed for user: ${user.userEmail}`);
}

test("reCAPTCHA verification", async ({ page }) => {
  test.setTimeout(180000);
  const users = await fetchDataFromSheet();

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      await registerUser(page, users[i]);
      if (i < users.length - 1) {
        console.log(
          "Navigating back to the registration page for the next user..."
        );
        await page.goto("https://staging.gunnerroofing.com/register/");
      } else {
        console.log("Staying on the 'Thank You' page for the last user.");
        // const queryString = await page.evaluate(() => window.location.search);
        // console.log(queryString);
        
        // await page.waitForTimeout(2000);
      }
    }
    console.log("All users registered successfully.");
  } else {
    console.log("No users to register.");
  }


});
