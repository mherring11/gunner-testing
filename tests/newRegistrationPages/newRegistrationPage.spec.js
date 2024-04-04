const { test, expect } = require("@playwright/test");
const axios = require("axios");
const colors = require("colors");
const fs = require("fs").promises;
const path = require("path");

let projectIds = [];

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
    console.log("Data fetched successfully:".yellow, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from sheet:".yellow, error);
    return [];
  }
}

async function selectStateAndAnswerQuestions(page, formData) {
  console.log(`Selecting state: ${formData.state}`.yellow);
  await page.selectOption('select[name="state"]', formData.state);
  await expect(page.locator('select[name="state"]')).toHaveValue(
    formData.state
  );

  console.log("Setting insurance coverage to 'Yes'...".yellow);
  await page.evaluate(() => {
    const yesRadio = document.querySelector("input#btnYes");
    if (yesRadio) {
      yesRadio.checked = true;
    }
  });

  const isYesChecked = await page.isChecked("input#btnYes");
  if (isYesChecked) {
    console.log("Confirmed: Insurance coverage set to 'Yes'.".yellow);
  } else {
    console.warn(
      "Warning: Unable to confirm 'Yes' selection for insurance coverage."
        .yellow
    );
  }

  console.log("Skipping additional services selection...".yellow);

  console.log("Setting referral answer to 'No'...".yellow);
  await page.evaluate(() => {
    const noRadio = document.querySelector("input#btnRefNo");
    if (noRadio) {
      noRadio.checked = true;
    }
  });

  const isNoChecked = await page.isChecked("input#btnRefNo");
  if (isNoChecked) {
    console.log("Confirmed: Referral answer set to 'No'.".yellow);
  } else {
    console.warn(
      "Warning: Unable to confirm 'No' selection for referral question.".yellow
    );
  }
}

async function registerUser(page, user) {
  console.log(`Registering user: ${user.userEmail}`.yellow);

  await page.goto("https://staging.gunnerroofing.com/register/");

  console.log("Filling street address...".yellow);
  await page.type('input[name="streetAddress"]', user.streetAddress);
  console.log("Filling city...".yellow);
  await page.type('input[name="city"]', user.city);
  console.log("Filling ZIP code...".yellow);
  await page.type('input[name="zip"]', user.zip);
  console.log("Filling phone number...".yellow);
  await page.type('input[name="phone"]', user.phone);
  console.log("Filling email...".yellow);
  await page.type('input[name="email"]', user.userEmail);
  console.log("Filling password...".yellow);
  await page.type('input[name="password"]', user.password);
  console.log("Verifying password...".yellow);
  await page.type("input#confirmPassword", user.password);
  console.log("Filling first name...".yellow);
  await page.type('input[name="firstName"]', user.firstName);
  console.log("Filling last name...".yellow);
  await page.type('input[name="lastName"]', user.lastName);
  console.log("Selecting 'Immediately' for the timeframe...".yellow);
  await page.selectOption("select#timeframe", "Immediately");
  console.log("Selecting 'Call' as preferred contact method...".yellow);
  await page.click('label[for="btnCall"]');

  await selectStateAndAnswerQuestions(page, user);

  console.log("Submitting the form.. .".yellow);
  await page.click('button[type="submit"]');

  console.log("Waiting on the 'Thank You' page...".yellow);
  await page.waitForTimeout(2000);

  await page.waitForNavigation({
    url: "**/register/thank-you/?confirmation=GNR**",
    timeout: 10000,
  });

  const currentPageUrl = page.url();
  console.log(`Current Page URL: ${currentPageUrl}`);

  const projectIdMatch = currentPageUrl.match(/confirmation=GNR(\d+)/);
  const projectId = projectIdMatch ? projectIdMatch[1] : "Unknown";
  const lastFiveDigits = projectId.length > 5 ? projectId.slice(-5) : projectId;

  if (projectId !== "Unknown") {
    console.log(`Project ID: ${lastFiveDigits} for ${user.streetAddress}`);
    projectIds.push({ address: user.streetAddress, projectId: lastFiveDigits });
  } else {
    console.error(
      "Failed to navigate to 'Thank You' page with project ID in URL.".yellow
    );
  }
}

async function saveProjectIdsToFile() {
  const filePath = path.join(__dirname, "projectIds.json");
  await fs.writeFile(filePath, JSON.stringify(projectIds, null, 2));
  console.log("Project IDs saved to file.".yellow);

  const saveProjectIds = async (folderName) => {
    const baseDir = path.join(__dirname, '..', folderName);
    await fs.mkdir(baseDir, { recursive: true }); 
    const filePath = path.join(baseDir, "projectIds.json");
    await fs.writeFile(filePath, JSON.stringify(projectIds, null, 2)); 
    console.log(`Project IDs saved to ${filePath}.`.yellow);
  };
  
  const folderPaths = ["admin", "newRegistrationPages", "fullTest"];
  await Promise.all(
    folderPaths.map((folderPath) => saveProjectIds(folderPath))
  );
}

test("registration with API data", async ({ page }) => {
  test.setTimeout(180000);
  const users = await fetchDataFromSheet();

  if (users.length > 0) {
    for (let i = 0; i < users.length; i++) {
      await registerUser(page, users[i]);

      if (i < users.length - 1) {
        console.log(
          "Navigating back to the registration page for the next user...".yellow
        );
        await page.goto("https://staging.gunnerroofing.com/register/");
      } else {
        console.log(
          "Staying on the 'Thank You' page for the last user.".yellow
        );
      }
    }

    await saveProjectIdsToFile();
    console.log("All users registered successfully.");
  } else {
    console.log("No users to register.");
  }
});
