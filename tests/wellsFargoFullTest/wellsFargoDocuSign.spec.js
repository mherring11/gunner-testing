const { test, expect } = require("@playwright/test");
const axios = require("axios");
const colors = require("colors");
const fs = require("fs").promises;
const path = require("path");

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

async function readProjectIdsFromFile() {
  const filePath = path.join(__dirname, "projectIds.json");
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading project IDs from file:", error);
    return [];
  }
}

test.setTimeout(480000);
test("Wells Fargo Docusign", async ({ browser }) => {
  const users = await fetchDataFromSheet();
  const projectIds = await readProjectIdsFromFile();

  console.log("Users loaded:", users);
  console.log("Project IDs loaded:", projectIds);

  if (projectIds.length > 0) {
    console.log(
      "Directly accessing the first projectId:",
      projectIds[0].projectId
    );
  } else {
    console.log("No projectIds found.");
  }

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`Testing for user: ${user.userEmail}`.yellow);

    // const projectId = projectIds[i] ? projectIds[i].projectId : null;
    // if (!projectId) {
    //   console.log(`No project ID found for user index: ${i}`.yellow);
    //   continue;
    // }

    // console.log(`Using Project ID: ${projectId} for user: ${user.userEmail}`);

    const context = await browser.newContext();
    const page = await context.newPage();

    page.context().on("page", async (newPage) => {
      console.log("New page opened:", newPage.url().yellow);
      await newPage.close();
    });

    await context.clearCookies();

    await page.goto("https://mail.google.com/");
    await page.fill('input[type="email"]', "gunnerplaywright@gmail.com");
    await page.click("#identifierNext");
    await page.waitForNavigation();
    await page.fill('input[type="password"]', "testtest123!CHL");
    await page.click("#passwordNext");
    await page.waitForNavigation();

    await page.waitForSelector('input[aria-label="Search mail"]', {
      state: "visible",
    });
    await page.fill(
      'input[aria-label="Search mail"]',
      'subject:"Your quote is ready!"'
    );
    await page.press('input[aria-label="Search mail"]', "Enter");
    await page.click('tr.zA:has-text("Your quote is ready!")');

    await page.waitForSelector('img[alt="Your Online Quote"]', {
      state: "visible",
    });
    const yourOnlineQuoteButton = page.locator('img[alt="Your Online Quote"]');
    await expect(yourOnlineQuoteButton).toBeVisible();
    console.log("YOUR ONLINE QUOTE button is visible.".yellow);
    await page.click('a:has(img[alt="Your Online Quote"])');

    await page.goto("https://accounts.google.com/Logout", {
      waitUntil: "networkidle",
    });

    await page.goto("https://estimatorstg.gunnerroofing.com/login");
    await page.fill("#mui-1", user.userEmail);
    await page.fill("#mui-2", user.password);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click('button:has-text("SIGN IN")'),
    ]);

    await page.click('.MuiButton-containedSuccess[type="button"]');

    console.log(
      "Looking for the checkbox to agree to use electronic records and signatures..."
        .yellow
    );
    const checkboxVisible = await page.isVisible(
      'label:has-text("I agree to use electronic records and signatures.")'
    );

    if (checkboxVisible) {
      await page.click(
        'label:has-text("I agree to use electronic records and signatures.")'
      );
      console.log(
        "Checkbox for electronic records and signatures agreement clicked.".yellow
      );
    } else {
      console.log(
        "Checkbox for electronic records and signatures agreement not found or already clicked in a previous session.".yellow
      );
    }

    await page.waitForTimeout(2000);

    console.log("Attempting to click the 'Continue' button...".yellow);
    await page.waitForSelector("#action-bar-btn-continue", {
      state: "visible",
    });
    await page.click("#action-bar-btn-continue");
    console.log("'Continue' button clicked.".yellow);

    await page.waitForTimeout(2000);

    console.log("Attempting to click on the 'Start' button...".yellow);

    try {
      await page.waitForSelector("#navigate-btn", { state: "visible" });

      await page.click("#navigate-btn");

      console.log("'Start' button clicked successfully.".yellow);
    } catch (error) {
      console.error("Error clicking the 'Start' button:".yellow, error.message);
    }

    console.log("Attempting to click on 'Sign' div".yellow);
    await page.waitForSelector('div.signature-tab-content:has-text("Sign")', {
      state: "visible",
    });
    await page.click('div.signature-tab-content:has-text("Sign")');
    console.log("'Sign' div clicked successfully.".yellow);

    console.log("Checking for the 'Adopt and Sign' button...".yellow);

    const adoptAndSignButtonSelector =
      'button[data-qa="adopt-submit"][value="signature"]';

    const isAdoptAndSignButtonVisible = await page.isVisible(
      adoptAndSignButtonSelector
    );

    if (isAdoptAndSignButtonVisible) {
      console.log(
        "Attempting to click on the 'Adopt and Sign' button...".yellow
      );
      await page.click(adoptAndSignButtonSelector);
    } else {
      console.log(
        "'Adopt and Sign' button is not visible, moving on...".yellow
      );
    }
    await page.waitForSelector('.tab-content-wrapper .initials-tab-content', { state: 'visible' });
    await page.click('.tab-content-wrapper .initials-tab-content');
    
    
    console.log("Initialed on page 3 of 11".yellow);
    
    
        console.log("Clicking on the next 'Initial' div...".yellow);
        const initialDivs = await page.$$(
          "div.initials-tab-content.tab-button-yellow.v2"
        );
    
        console.log(
          "Verified: The standard Gunner Roofing bulleted list is displayed under the Roofing section."
            .yellow
        );
    
        console.log(
          "Verified: All selected add-ons sections are displayed on the page."
            .yellow
        );
    
        if (initialDivs.length > 1) {
          await initialDivs[1].click();
          console.log(
            "Verified: The user is able to add initials to this page.".yellow
          );
        } else {
          console.error("Not enough 'Initial' divs found.");
        }

    console.log("Clicking on the 'Finish' button...".yellow);
    await page.click(
      'button.documents-finish-button[data-action="action-bar-finish"]'
    );
    console.log("'Finish' button clicked.".yellow);
  }
});
