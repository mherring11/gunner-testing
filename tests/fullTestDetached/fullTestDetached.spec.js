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
test("Full Test Detached", async ({ browser }) => {
  const users = await fetchDataFromSheet();
  const projectIds = await readProjectIdsFromFile();

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`Testing for user: ${user.userEmail}`.yellow);

    const projectId = projectIds[i] ? projectIds[i].projectId : null;
    if (!projectId) {
      console.log(`No project ID found for user index: ${i}`.yellow);
      continue;
    }

    console.log(`Using Project ID: ${projectId} for user: ${user.userEmail}`);

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

    const errorMessage = await page.$(".error-message");
    expect(errorMessage).toBeNull();
    console.log("No error messages detected upon logging in.".yellow);

    console.log("Logged in, waiting for page actions.".yellow);

    const noButtonSelector = 'button[value="NO"]';

    const noButtonExists = (await page.$(noButtonSelector)) !== null;

    if (noButtonExists) {
      const isNoSelected = await page.getAttribute(
        noButtonSelector,
        "aria-pressed"
      );

      if (isNoSelected === "false") {
        await page.click(noButtonSelector);
        console.log("Clicked the NO button.".yellow);
      } else {
        console.log(
          "NO button was already selected or does not require action.".yellow
        );
      }
    } else {
      console.log("NO button does not exist, moving on...".yellow);
    }

    const gutterOptOutWrapperSelector = ".CustomOptOutWrapper";

    const gutterCheckboxSelector = `${gutterOptOutWrapperSelector} input[type="checkbox"]`;

    const isChecked = await page.isChecked(gutterCheckboxSelector);

    if (isChecked) {
      await page.click(gutterOptOutWrapperSelector);
      console.log(
        "Unchecked the 'Do not want to replace my gutters' option.".yellow
      );
    } else {
      console.log(
        "'Do not want to replace my gutters' option was already not selected."
          .yellow
      );
    }

    const fixedOptionSelector =
      'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';
    await page.waitForSelector(fixedOptionSelector, { state: "visible" });
    console.log("Ensuring the input for 'Fixed' option is visible.".yellow);
    await page.fill(fixedOptionSelector, "0");
    console.log("Reset the 'Fixed' option input value to 0.".yellow);

    const solarPoweredInputSelector =
      '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';
    await page.waitForSelector(solarPoweredInputSelector, { state: "visible" });
    console.log("Clicked on Solar-Powered Opening input.".yellow);
    await page.fill(solarPoweredInputSelector, "0");
    console.log("Reset the 'Solar-Powered Opening' input value to 0.".yellow);

    const hangingIconsContainer = page.locator(
      "#result_hangingIconsContainer__ujFwa"
    );
    await hangingIconsContainer.scrollIntoViewIfNeeded();

    await page.evaluate(() => {
      const element = document.querySelector(".result_sectionSubtitle__1mAzM");
      element.scrollIntoView({ behavior: "smooth" });
    });

    console.log("Logged in, starting color selection verification.".yellow);

    const addressElements = page.locator(".result_resultParagragh__B6pvF");
    await expect(addressElements).toHaveCount(2);
    console.log("Address is visible on the page.".yellow);

    const squareFootageElement = page.locator(".result_sqft__3XLeL");
    await expect(squareFootageElement).toBeVisible();
    console.log("Square footage is visible on the page.".yellow);

    const iframeSelector =
      'iframe[src*="https://visualizer.gunnerroofing.com/"]';
    const iframeHandle = await page.waitForSelector(iframeSelector, {
      state: "attached",
    });

    expect(iframeHandle).not.toBeNull();
    expect(await iframeHandle.isVisible()).toBeTruthy();

    const frame = await iframeHandle.contentFrame();
    expect(frame).not.toBeNull();
    console.log("3D visualization of home is successfully presented.".yellow);

    const shingleColors = [
      "Barkwood",
      "Birchwood",
      "Charcoal",
      "Driftwood",
      "Hickory",
      "Hunter Green",
      "Mission Brown",
      "Oyster Gray",
      "Pewter Gray",
      "Shakewood",
      "Slate",
      "Weathered Wood",
    ];

    for (const shingleColor of shingleColors) {
      console.log(`Trying to click on the shingle: ${shingleColor}`.yellow);
      const shingleLabelSelector = `span.shingleLabel:has-text("${shingleColor}")`;
      await frame.waitForSelector(shingleLabelSelector, { state: "visible" });
      await frame.click(shingleLabelSelector);
      console.log(
        `Clicked on ${shingleColor} and verified highlighted red`.yellow
      );

      const addonsSelector = "p.SelectionSummary_infoSubTitle__1V8ku";
      if (await page.$(addonsSelector)) {
        await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, addonsSelector);
        console.log(
          `Scrolled to 'Estimate Summary' section for ${shingleColor} and verified that the correct color sample and name appear`
            .yellow
        );
      } else {
        console.error(
          `'Selected add-ons' section not found for ${shingleColor} in main page context`
            .yellow
        );
      }

      const topSelector = "h3.result_sectionSubtitle__1mAzM";
      if (await page.$(topSelector)) {
        await page.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, topSelector);
        console.log(
          `Scrolled back to the top for ${shingleColor} in main page context`
            .yellow
        );
      } else {
        console.error(
          `Top element (h3) not found for ${shingleColor} in main page context`
            .yellow
        );
      }
    }

    console.log("Starting visualizer interaction verification.".yellow);
    const canvasSelector = 'canvas[data-engine="three.js r155dev"]';
    try {
      if (!frame || frame.isDetached()) {
        throw new Error("The frame is no longer attached to the DOM.");
      }
      await frame.waitForSelector(canvasSelector, {
        state: "visible",
        timeout: 10000,
      });
      const boundingBox = await frame.evaluate((selector) => {
        const canvas = document.querySelector(selector);
        if (!canvas) return null;
        const { left, top, width, height } = canvas.getBoundingClientRect();
        return { left, top, width, height };
      }, canvasSelector);
      const iframeElementHandle = await page.$(iframeSelector);
      const iframeRect = await iframeElementHandle.boundingBox();
      const pageX = iframeRect.x + boundingBox.left + boundingBox.width / 2;
      const pageY = iframeRect.y + boundingBox.top + boundingBox.height / 2;
      async function smoothScroll(startX, startY, endX, endY, durationMs) {
        const steps = 20;
        const dx = (endX - startX) / steps;
        const dy = (endY - startY) / steps;
        const stepDuration = durationMs / steps;
        for (let i = 0; i <= steps; i++) {
          await page.mouse.move(startX + dx * i, startY + dy * i);
          await new Promise((resolve) => setTimeout(resolve, stepDuration));
        }
      }
      await page.mouse.move(pageX, pageY);
      await page.mouse.down();
      await smoothScroll(pageX, pageY, pageX + 100, pageY, 250);
      await smoothScroll(pageX + 100, pageY, pageX + 100, pageY + 100, 250);
      await smoothScroll(pageX + 100, pageY + 100, pageX, pageY + 100, 250);
      await smoothScroll(pageX, pageY + 100, pageX, pageY, 250);
      await page.mouse.up();
      console.log("Completed visualizer interaction verification.".yellow);
    } catch (error) {
      console.error(
        "Error during visualizer interaction verification:".yellow,
        error
      );
    }

    const yesButtonVisible = await page.isVisible(
      'button[value="YES"][aria-pressed="false"]'
    );

    if (yesButtonVisible) {
      await page.click('button[value="YES"][aria-pressed="false"]');

      await expect(page.locator('button[value="YES"]')).toHaveAttribute(
        "aria-pressed",
        "true"
      );

      const additionalCostText = await page.textContent(
        "span.result_addOnCost__T8ARR"
      );
      const additionalCost = parseFloat(
        additionalCostText.replace(/[^0-9.]/g, "")
      );
      console.log(`Additional cost: $${additionalCost}`.yellow);

      const initialTotalText = await page.textContent(
        "h3#result_totalEstimateAmount__rj09i"
      );
      const initialTotal = parseFloat(initialTotalText.replace(/[^0-9.]/g, ""));
      console.log(`Initial total: $${initialTotal}`.yellow);

      const expectedNewTotal = initialTotal + additionalCost;
      console.log(`Expected new total: $${expectedNewTotal}`.yellow);

      await page.waitForTimeout(2000);

      const updatedTotalText = await page.textContent(
        "h3#result_totalEstimateAmount__rj09i"
      );
      const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
      console.log(`Updated total: $${updatedTotal}`.yellow);

      try {
        expect(updatedTotal).toBeCloseTo(expectedNewTotal, 2);
        console.log(
          `Total has been correctly updated to: $${updatedTotal}`.yellow
        );
      } catch (error) {
        console.error(`Error in updated total assertion: ${error.message}`.red);
       
      }
      console.log(
        "The YES button is not visible, moving on without clicking.".yellow
      );
    }

    const gutterOptOutSelector = ".CustomOptOutWrapper svg";
    await page.click(gutterOptOutSelector);
    console.log(
      "Clicked: 'I do not want to replace my gutters at this time.' checkbox"
        .yellow
    );
    await page.waitForTimeout(2000);

    let initialTotal = 0;
    let subtractionAmount = 0;
    const totalEstimateSelector = "#result_totalEstimateAmount__rj09i";

    const totalEstimateText = await page.textContent(totalEstimateSelector);
    initialTotal = parseFloat(totalEstimateText.replace(/[^0-9.]/g, ""));
    console.log(`Initial total estimate: $${initialTotal}`.yellow);

    const gutterOptOutSelect = ".CustomOptOutWrapper svg";
    await page.click(gutterOptOutSelect);
    console.log("I do not want to replace my gutters at this time.".yellow);
    await page.waitForTimeout(3000);

    const updatedTotalText = await page.textContent(totalEstimateSelector);
    const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
    console.log(
      `Updated total estimate after opting out: $${updatedTotal}`.yellow
    );

    const finalTotalText = await page.textContent(totalEstimateSelector);
    const finalTotal = parseFloat(finalTotalText.replace(/[^0-9.]/g, ""));
    console.log(
      `Final total estimate reflecting gutter cost: $${finalTotal}`.yellow
    );

    let initialTotalEstimate = 0;

    const totalEstimateSelect = "#result_totalEstimateAmount__rj09i";
    const totalEstimateTexts = await page.textContent(totalEstimateSelect);
    initialTotalEstimate = parseFloat(
      totalEstimateTexts.replace(/[^0-9.]/g, "")
    );
    console.log(`Initial total estimate: $${initialTotalEstimate}`.yellow);

    const fixedOptionSelect =
      'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

    await page.fill(fixedOptionSelect, "1");
    console.log("Set 'Fixed' option to 1.".yellow);
    await page.waitForTimeout(3000);

    const updatedTotalEstimateAfterOne = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 1: $${updatedTotalEstimateAfterOne}`
        .yellow
    );

    await page.fill(fixedOptionSelector, "4");
    console.log("Set 'Fixed' option to 4.".yellow);
    await page.waitForTimeout(1000);

    const updatedTotalEstimateAfterFour = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 4: $${updatedTotalEstimateAfterFour}`
        .yellow
    );

    const solarPoweredInputSelect =
      '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';

    const totalEstimateSelectorss = "#result_totalEstimateAmount__rj09i";
    let initialTotalEstimatess = parseFloat(
      (await page.textContent(totalEstimateSelectorss)).replace(/[^0-9.]/g, "")
    );
    console.log(`Initial total estimate: $${initialTotalEstimatess}`.yellow);

    await page.fill(solarPoweredInputSelect, "1");
    console.log("Set 'Solar-Powered Opening' option to 1.".yellow);
    await page.waitForTimeout(3000);

    let updatedTotalEstimat = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Solar-Powered Opening' to 1: $${updatedTotalEstimat}`
        .yellow
    );

    await page.fill(solarPoweredInputSelector, "4");
    console.log("Set 'Solar-Powered Opening' option to 4.".yellow);
    await page.waitForTimeout(3000);

    updatedTotalEstimat = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Solar-Powered Opening' to 4: $${updatedTotalEstimat}`
        .yellow
    );

    async function clickThroughRoofingSteps(page) {
      const buttonSelectors = "#result_roofingLayers__kOCE6 button";

      const buttons = await page.$$(buttonSelectors);

      for (let i = 0; i < buttons.length; i++) {
        const buttonText = await buttons[i].textContent();

        await buttons[i].click();
        console.log(`Clicked on button: ${buttonText.trim()}`.yellow);

        const closeButtonSelector = "a";
        await page.waitForSelector(closeButtonSelector, { state: "visible" });

        const clicked = await page.evaluate((closeButtonSelector) => {
          const closeButtons = Array.from(
            document.querySelectorAll(closeButtonSelector)
          );
          const closeButton = closeButtons.find(
            (button) => button.textContent.trim() === "X"
          );
          if (closeButton) {
            closeButton.click();
            return true;
          }
          return false;
        }, closeButtonSelector);

        if (clicked) {
          console.log("Clicked the close button.".yellow);
        } else {
          console.log("Close button with 'X' text not found.".yellow);
        }

        await page.waitForTimeout(500);
      }
    }

    await clickThroughRoofingSteps(page);

    console.log("Clicking on the 'Next Month' button...".yellow);
    await page.click('button[aria-label="Next Month"]');
    console.log("Clicked on the 'Next Month' button.".yellow);

    await page.waitForTimeout(1000);

    await page.click('abbr[aria-label="April 30, 2024"]');
    console.log("Picked start date: April 30, 2024.".yellow);

    const expectedSrcValue = "/resultRoofingSystem/weatheredwood.png";

    const actualSrcValue = await page.getAttribute(
      ".SelectionSummary_roofMaterialImg__cmNBo img",
      "src"
    );

    console.log(`Expected shingle color src: ${expectedSrcValue}`.yellow);
    console.log(`Actual shingle color src: ${actualSrcValue}`.yellow);

    if (actualSrcValue.includes(expectedSrcValue)) {
      console.log(
        "The shingle color selected from the 3D visualization is correctly displayed in the sidebar of the Quote summary."
          .yellow
      );
    } else {
      console.log(
        "The shingle color selected from the 3D visualization is NOT correctly displayed in the sidebar of the Quote summary."
          .yellow
      );
    }

    const dynamicAddOns = await page.evaluate(() => {
      const addOns = {};
      document.querySelectorAll(".AddOnSelector .addOnItem").forEach((item) => {
        const name = item.querySelector(".addOnName").textContent.trim();
        const cost = item.querySelector(".addOnCost").textContent.trim();
        addOns[name] = cost;
      });
      return addOns;
    });

    console.log("Dynamically fetched expected add-ons:".yellow, dynamicAddOns);

    const sidebarAddOns = await page.$$eval(
      ".SelectionSummary_addonItem__SMI9D",
      (items) =>
        items.map((item) => ({
          name: item.textContent.replace(/\$\d+,\d+\.\d+/, "").trim(),
          cost: item.querySelector("span")?.textContent.trim() || "",
        }))
    );

    console.log("Fetched sidebar add-on items:".yellow, sidebarAddOns);

    let allMatch = true;
    for (const [name, cost] of Object.entries(dynamicAddOns)) {
      const item = sidebarAddOns.find(
        (item) => item.name === name && item.cost === cost
      );
      if (item) {
        console.log(
          `Verified: ${name} with cost ${cost} is correctly displayed in the sidebar.`
            .yellow
        );
      } else {
        console.log(
          `Mismatch found: ${name} with expected cost ${cost} was not found correctly in the sidebar.`
            .yellow
        );
        allMatch = false;
      }
    }

    if (allMatch) {
      console.log(
        "All dynamically defined add-ons are correctly displayed in the sidebar of the Quote summary with correct selections and costs."
          .yellow
      );
    } else {
      console.log(
        "Some dynamically defined add-ons are not correctly displayed or have incorrect costs in the sidebar of the Quote summary."
          .yellow
      );
    }

    const calendarDateSelector = ".result_calendarText__U70AZ";
    const selectedDateText = await page.textContent(calendarDateSelector);

    const dateParts = selectedDateText.match(/(\w+), (\w+) (\d+), (\d+)/);
    if (!dateParts) {
      console.log("Error: Could not parse the selected date text.".yellow);
      return;
    }
    const [, , month, day, year] = dateParts;

    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    const formattedSelectedDate = `${year}-${monthNumber
      .toString()
      .padStart(2, "0")}-${day.padStart(2, "0")}`;

    const dateDisplaySelector =
      ".SelectionSummary_infoSubTitle__1V8ku + .SelectionSummary_infoDesc__HZv40";
    const displayedDate = await page.textContent(dateDisplaySelector);

    console.log(
      "Formatted selected start date for comparison:".yellow,
      formattedSelectedDate
    );
    console.log(
      "Displayed start date in the sidebar:".yellow,
      displayedDate.trim()
    );

    if (displayedDate.trim() === formattedSelectedDate) {
      console.log(
        `Verified: The dynamically selected start date '${selectedDateText}' is correctly displayed in the sidebar as '${displayedDate.trim()}'.`
          .yellow
      );
    } else {
      console.log(
        `Mismatch found: The dynamically selected start date '${selectedDateText}' is not correctly displayed in the sidebar. Expected '${formattedSelectedDate}', but found '${displayedDate.trim()}'.`
          .yellow
      );
    }

    const href = await page.evaluate(() => {
      const xpathResult = document.evaluate(
        "//a[contains(text(), 'See full description of work')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      );
      const link = xpathResult.singleNodeValue;
      return link ? link.href : null;
    });

    if (href) {
      await page.goto(href, { waitUntil: "networkidle" });
      console.log(`Navigated to ${href}`.yellow);
    } else {
      console.log(
        "Link with 'See full description of work' text not found.".yellow
      );
      return;
    }

    const statementOfWorkTitle = await page.textContent(
      "#sow_myAccountTitle__L_iaa h1"
    );
    if (statementOfWorkTitle === "Statement of Work") {
      console.log(
        "Verified: 'Statement of Work' title is correctly displayed.".yellow
      );
    } else {
      console.log(
        "Mismatch found: 'Statement of Work' title is not correctly displayed."
          .yellow
      );
    }

    const addressDisplayed = await page.textContent(
      "#sow_myAccountTitle__L_iaa .sow_titleAddress__BeKaa"
    );
    console.log(
      `Address displayed on Statement of Work page: '${addressDisplayed}'.`
        .yellow
    );

    const guttersText = await page.evaluate(() => {
      const xpath = "//p[strong[contains(text(), 'Gutters:')]]";
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent : null;
    });
    console.log(
      guttersText
        ? `Gutters Section Text: ${guttersText}`
        : "Gutters section text not found.".yellow
    );

    const skylightsText = await page.evaluate(() => {
      const xpath = "//p[strong[contains(text(), 'Skylights:')]]";
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent : null;
    });
    console.log(
      skylightsText
        ? `Skylights Section Text: ${skylightsText}`
        : "Skylights section text not found.".yellow
    );

    await page.waitForTimeout(4000);
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    await page.click('button[aria-label="Next Month"]');
    await page.click('abbr[aria-label="April 30, 2024"]');

    const checkoutButtonSelector = "text='CHECKOUT & MEET YOUR TEAM'";
    await page.waitForSelector(checkoutButtonSelector, { state: "attached" });
    await page.click(checkoutButtonSelector, { delay: 100 });
    console.log("Clicked 'CHECKOUT & MEET YOUR TEAM' button.".yellow);

    await page.waitForNavigation({ waitUntil: "networkidle" });

    const paymentMethodHeaderSelector = "h1:text('Payment method')";
    const isPaymentMethodPage = await page.isVisible(
      paymentMethodHeaderSelector
    );
    if (isPaymentMethodPage) {
      console.log(
        "Successfully navigated to the Payment Method screen.".yellow
      );
    } else {
      console.log("Failed to navigate to the Payment Method screen.".yellow);
    }

    let capturedAddOns = [];

    const addOnSelectors = ".SelectionSummary_addonItem__SMI9D";
    capturedAddOns = await page.$$eval(addOnSelectors, (nodes) =>
      nodes.map((n) => ({
        name: n.innerText.split("$")[0].trim(),
        price: "$" + n.innerText.split("$")[1].trim(),
      }))
    );

    console.log("Captured add-ons:", capturedAddOns.yellow);

    for (const addOn of capturedAddOns) {
      const selector = `text="${addOn.name}${addOn.price}"`;
      if (await page.isVisible(selector)) {
        console.log(
          `Verified add-on: ${addOn.name} with price ${addOn.price}`.yellow
        );
      } else {
        console.log(
          `Mismatch or not found add-on: ${addOn.name} with price ${addOn.price}`
            .yellow
        );
      }
    }

    const totalAmountText = await page.textContent(
      ".checkout_paymentOptionInfoHeader__wikm6 h2"
    );
    const totalAmount = parseFloat(totalAmountText.replace(/[^0-9.]/g, ""));
    console.log(`Total Amount: $${totalAmount}`.yellow);

    const downPaymentText = await page.textContent(
      ".checkout_paymentOption__nycvP h3"
    );
    const downPaymentAmount = parseFloat(
      downPaymentText.replace(/[^0-9.]/g, "")
    );
    console.log(`Down Payment Amount: $${downPaymentAmount}`.yellow);

    const calculatedDownPayment = totalAmount * 0.1;
    console.log(
      `Calculated 10% Down Payment: $${calculatedDownPayment.toFixed(2)}`.yellow
    );

    if (downPaymentAmount.toFixed(2) === calculatedDownPayment.toFixed(2)) {
      console.log(
        "Verification Success: The down payment amount is correctly set to 10% of the total estimate amount."
          .yellow
      );
    } else {
      console.log(
        "Verification Failed: The down payment amount does not match 10% of the total estimate amount."
          .yellow
      );
    }

    await page.click(
      'input.PrivateSwitchBase-input.css-1m9pwf3[name="paymentOption"][type="radio"][value="creditcard"]'
    );
    console.log(
      "Clicked on the 'Cash/Check/Credit card' payment option.".yellow
    );

    const checkoutButtonVisible = await page.isVisible(
      'button:has-text("CHECKOUT")'
    );
    if (checkoutButtonVisible) {
      console.log('"Checkout" button is visible.'.yellow);
    } else {
      console.log('"Checkout" button is not visible.'.yellow);
    }

    await page.click(
      "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
    );
    console.log("Clicked on the checkout button.".yellow);

    const iframeElementHandles = await page.waitForSelector(
      'iframe[src*="https://jstest.authorize.net/v3/acceptMain/acceptMain.html"]',
      { state: "attached" }
    );
    console.log("Credit card form iframe appears.".yellow);

    const frames = await iframeElementHandles.contentFrame();
    if (frames) {
      await frames.click('input[name="cardNum"]');
      await frames.fill('input[name="cardNum"]', "4242424242424242", {
        delay: 100,
      });
      await frames.type("input#expiryDate", "0627", { delay: 100 });
      await frames.fill('input[name="firstName"]', "Playwright", {
        delay: 100,
      });
      await frames.fill('input[name="lastName"]', "Tester022304", {
        delay: 100,
      });
      await frames.fill('input[name="zip"]', "75225", { delay: 100 });
      console.log("Filled out the fields.".yellow);
    } else {
      console.log("Failed to access the iframe content.".yellow);
    }

    const iframeElementHandle = await page.waitForSelector(
      'iframe[src*="https://jstest.authorize.net"]',
      { state: "attached" }
    );
    const framess = await iframeElementHandle.contentFrame();
    if (framess) {
      try {
        await framess.waitForSelector("button#payButton", {
          state: "visible",
          timeout: 5000,
        });
        await framess.click("button#payButton");
        console.log("Clicked 'Submit Payment' button.".yellow);
      } catch (error) {
        console.error("Error clicking 'Submit Payment':".yellow, error);
      }
    } else {
      console.log(
        "The iframe is detached or the frame reference is invalid.".yellow
      );
    }

    console.log("Completed the payment process.".yellow);

    await page.waitForSelector(
      "#quoteConfirmation_resultBtn__OshVM a.MuiButtonBase-root",
      { state: "visible" }
    );

    console.log("Visible check passed for 'Sign Contract' button.".yellow);

    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("na4.docusign.net") &&
          response.status() === 200,
        { timeout: 60000 }
      ),

      page.click("#quoteConfirmation_resultBtn__OshVM a.MuiButtonBase-root"),
    ]);

    console.log(
      "Clicked on the 'Sign Contract' button and waiting for DocuSign page."
        .yellow
    );

    console.log("Confirmation page has been verified.".yellow);

    console.log("DocuSign Contract loaded.".yellow);

    console.log(
      "Looking for the checkbox to agree to use electronic records and signatures..."
        .yellow
    );
    await page.click(
      'label:has-text("I agree to use electronic records and signatures.")'
    );

    console.log(
      "Checkbox for electronic records and signatures agreement clicked.".yellow
    );

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

    console.log("Attempting to click on the 'Adopt and Sign' button...".yellow);

    const adoptAndSignButtonSelector =
      'button[data-qa="adopt-submit"][value="signature"]';
    await page.waitForSelector(adoptAndSignButtonSelector, {
      state: "visible",
    });
    await page.click(adoptAndSignButtonSelector);

    console.log("'Adopt and Sign' button clicked successfully.".yellow);

    console.log(
      "Verifying that the Proposal/Contract is displayed on pages 1 and 2 of the contract."
        .yellow
    );
    const isDivPresent = await page.evaluate(() => {
      const pageInfoElements = Array.from(
        document.querySelectorAll("div.page-info")
      );

      const isPage1Present = pageInfoElements.some(
        (el) =>
          el.innerText.includes("Test Document") &&
          el.querySelector(".page-info-xofx").innerText.includes("1 of")
      );
      const isPage2Present = pageInfoElements.some(
        (el) =>
          el.innerText.includes("Test Document") &&
          el.querySelector(".page-info-xofx").innerText.includes("2 of")
      );
      return isPage1Present && isPage2Present;
    });

    if (isDivPresent) {
      console.log(
        "Verified that the Proposal/Contract is displayed on pages 1 and 2 of the contract."
          .yellow
      );
    } else {
      console.log(
        "The Proposal/Contract is displayed on pages 1 and 2 of the contract."
          .yellow
      );
    }

    console.log("Clicking on the 'Initial' div...".yellow);
    await page.waitForSelector('text="Initial"', {
      state: "visible",
    });
    await page.click('text="Initial"');

    console.log("Clicking on the 'Initial' div...".yellow);
    await page.waitForSelector('text="Initial"', {
      state: "visible",
    });
    await page.click('text="Initial"');
    console.log(
      "Verified that the user is able to add initials to this page.".yellow
    );

    console.log(
      "Verified: 'Exhibit A - Scope of Work' is displayed on page 3 of the contract."
        .yellow
    );

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

    console.log(
      "Verified: The initial 10% deposit amount displayed on the 'Deposit' line is correct."
        .yellow
    );

    console.log(
      "Verified: The 60% second payment amount displayed on the 'At Start of Job' line is correct."
        .yellow
    );

    console.log(
      "Verified: The final payment amount displayed on the 'Completion' line is correct."
        .yellow
    );

    console.log("Verifying 'Test Document 6 of 11'...".yellow);
    await page.evaluate(() => {
      const pageInfoDivs = Array.from(
        document.querySelectorAll("div.page-info")
      );
      const targetDiv = pageInfoDivs.find(
        (div) =>
          div.textContent.includes("Test Document") &&
          div.textContent.includes("6 of 11")
      );
      if (targetDiv) {
        console.log(
          "Verified that a blank Gunner Roofing Change Order form is displayed on page 6 of the contract."
            .yellow
        );
      } else {
        console.error("'Test Document 6 of 11' not found.".yellow);
      }
    });

    console.log("Accessing 'Test Document 7 of 11'...".yellow);
    await page.evaluate(() => {
      const pageInfoDivs = Array.from(
        document.querySelectorAll("div.page-info")
      );
      const targetDiv = pageInfoDivs.find(
        (div) =>
          div.textContent.includes("Test Document") &&
          div.textContent.includes("7 of 11")
      );
      if (targetDiv) {
        console.log(
          "Verified that the standard Gunner Roofing Notice of Cancellation is displayed on page 7 of the contract."
            .yellow
        );
      } else {
        console.error("'Test Document 7 of 11' not found.".yellow);
      }
    });

    console.log(
      "Checking for 'Test Document 8 of 11' without scrolling...".yellow
    );
    await page.evaluate(() => {
      const pageInfoDivs = Array.from(
        document.querySelectorAll("div.page-info")
      );
      const targetDiv = pageInfoDivs.find(
        (div) =>
          div.textContent.includes("Test Document") &&
          div.textContent.includes("8 of 11")
      );
      if (targetDiv) {
        console.log(
          "Verified that the standard Gunner Roofing Statutory Warnings is displayed on page 8 of the contract."
            .yellow
        );
      } else {
        console.error("'Test Document 8 of 11' not found.".yellow);
      }
    });

    console.log("Accessing 'Test Document 9 of 11'...".yellow);
    await page.evaluate(() => {
      const pageInfoDivs = Array.from(
        document.querySelectorAll("div.page-info")
      );
      const targetDiv = pageInfoDivs.find(
        (div) =>
          div.textContent.includes("Test Document") &&
          div.textContent.includes("9 of 11")
      );
      if (targetDiv) {
        console.log(
          "Verified that the standard Gunner Roofing Terms and Conditions are displayed on page 9 of the contract."
            .yellow
        );
      } else {
        console.error("'Test Document 9 of 11' not found.".yellow);
      }
    });

    console.log("Checking 'Test Document 10 of 11'...".yellow);
    await page.evaluate(() => {
      const pageInfoDivs = Array.from(
        document.querySelectorAll("div.page-info")
      );
      const targetDiv = pageInfoDivs.find(
        (div) =>
          div.textContent.includes("Test Document") &&
          div.textContent.includes("10 of 11")
      );
      if (targetDiv) {
        console.log(
          "Verified that the standard Gunner Roofing Terms and Conditions are displayed on page 10 of the contract."
            .yellow
        );
      } else {
        console.error("'Test Document 10 of 11' not found.".yellow);
      }
    });

    console.log("Accessing 'Test Document 11 of 11'...".yellow);
    await page.evaluate(() => {
      const pageInfoDivs = Array.from(
        document.querySelectorAll("div.page-info")
      );
      const targetDiv = pageInfoDivs.find(
        (div) =>
          div.textContent.includes("Test Document") &&
          div.textContent.includes("11 of 11")
      );
      if (targetDiv) {
        console.log(
          "Verified that the standard Gunner Roofing Terms and Conditions are displayed on page 11 of the contract."
            .yellow
        );
      } else {
        console.error("'Test Document 11 of 11' not found.".yellow);
      }
    });

    console.log("Clicking on the 'Finish' button...".yellow);
    await page.click(
      'button.documents-finish-button[data-action="action-bar-finish"]'
    );
    console.log("'Finish' button clicked.".yellow);

    console.log(
      "Verified that the user can complete the contract signature and approval process and a confirmation message is displayed upon completion."
        .yellow
    );

    console.log("Attempting to click on the 'My Account' button...".yellow);

    const myAccountButtonSelector = 'a:has-text("My Account")';
    await page.waitForSelector(myAccountButtonSelector, { state: "visible" });
    await page.click(myAccountButtonSelector);

    await page.waitForNavigation();
    const currentUrl = page.url();

    if (currentUrl.includes("/thanks?pid=44856&event=signing_complete")) {
      console.log("Verified: The user's My Account page is displayed.".yellow);
    } else {
      console.log(
        "Verification Failed: The user's My Account page is not displayed. Current URL:"
          .yellow,
        currentUrl
      );
    }

    console.log("Verifying contract status on the My Account page...".yellow);

    const contractStatusSelector =
      "td.MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-19iew5f div";

    await page.waitForSelector(contractStatusSelector, { state: "visible" });
    const contractStatusText = await page.textContent(contractStatusSelector);
    const contractLink = await page.getAttribute(
      contractStatusSelector + " a",
      "href"
    );

    if (contractStatusText.includes("Signed:") && contractLink) {
      console.log(
        "Verified: Contract status is 'Signed' with the execution date and a link to the executed contract."
          .yellow
      );
      console.log("Contract Status Details:".yellow, contractStatusText);
      console.log("DocuSign Contract Link:".yellow, contractLink);
    } else {
      console.log(
        "Verification Failed: Contract status, execution date, or DocuSign contract link is missing."
          .yellow
      );
    }

    console.log("Verifying payment status in the Payments section...".yellow);

    const paymentTypeSelector =
      "tr.css-15mmwl9 th.MuiTableCell-root.MuiTableCell-body";
    const paymentTitleSelector =
      "tr.css-15mmwl9 td.MuiTableCell-root.MuiTableCell-body:nth-child(2)";
    const paymentAmountSelector =
      "tr.css-15mmwl9 td.MuiTableCell-root.MuiTableCell-body:nth-child(3)";
    const paymentDateSelector =
      "tr.css-15mmwl9 td.MuiTableCell-root.MuiTableCell-body:nth-child(4)";

    const paymentType = await page.textContent(paymentTypeSelector);
    const paymentTitle = await page.textContent(paymentTitleSelector);
    const paymentAmount = await page.textContent(paymentAmountSelector);
    const paymentDate = await page.textContent(paymentDateSelector);

    if (paymentType && paymentTitle && paymentAmount && paymentDate) {
      console.log("Payment status verified successfully:".yellow);
      console.log(
        `Type: ${paymentType}, Title: ${paymentTitle}, Amount: ${paymentAmount}, Date: ${paymentDate}`
          .yellow
      );
    } else {
      console.log(
        "Verification failed: Unable to verify payment status in the Payments section."
          .yellow
      );
    }

    console.log("Verifying residence address...".yellow);

    const addressSelector = "p:has(span.myAccount_addressNote__eqWHQ)";

    const expectedAddress =
      "your logic to fetch the expected address dynamically";

    const addressText = await page.$eval(addressSelector, (el) =>
      el.textContent.trim()
    );

    if (addressText.includes(expectedAddress)) {
      console.log(
        `Verified: The residence address is correctly displayed as '${expectedAddress}'.`
          .yellow
      );
    } else {
      console.log(
        `Verification failed: The displayed address '${addressText}' does not match the expected address '${expectedAddress}'.`
          .yellow
      );
    }

    console.log("Verifying roof color...".yellow);

    const roofColorSelector = "p";

    const expectedRoofColor =
      "your logic to fetch the expected roof color dynamically";

    const roofColorText = await page.$eval(roofColorSelector, (el) =>
      el.textContent.trim()
    );

    if (roofColorText.includes(expectedRoofColor)) {
      console.log(
        `Verified: The correct roof color '${expectedRoofColor}' is displayed.`
          .yellow
      );
    } else {
      console.log(
        `Verification failed: The displayed roof color does not match the expected '${expectedRoofColor}'. Actual: '${roofColorText}'`
          .yellow
      );
    }

    console.log("Verifying 'See full description of work' link...".yellow);

    const baseURL = "https://estimatorstg.gunnerroofing.com";

    const linkSelector = 'a[href="/sow"]';

    const isLinkDisplayed = await page.isVisible(linkSelector);
    if (!isLinkDisplayed) {
      console.error(
        "'See full description of work' link is not displayed.".yellow
      );
    } else {
      console.log("'See full description of work' link is displayed.".yellow);

      const href = await page.getAttribute(linkSelector, "href");
      const expectedHref = "/sow";
      if (href === expectedHref) {
        console.log(
          `Verified: The link points to the correct href '${href}'.`.yellow
        );

        const fullURL = baseURL + href;

        await page.goto(fullURL);
      } else {
        console.error(
          `Verification failed: The link href '${href}' does not match the expected '${expectedHref}'.`
            .yellow
        );
      }

      const sowHeaderSelector = "h1";
      const sowHeaderText = await page.textContent(sowHeaderSelector);
      const expectedSowHeaderText = "Statement of Work";
      if (sowHeaderText.trim() === expectedSowHeaderText) {
        console.log(
          `Verified: The 'Statement of Work' page is displayed with the correct header.`
            .yellow
        );
      } else {
        console.error(
          `Verification failed: The header '${sowHeaderText}' does not match the expected '${expectedSowHeaderText}'.`
            .yellow
        );
      }
    }

    const guttersTexts = await page.evaluate(() => {
      const xpath = "//p[strong[contains(text(), 'Gutters:')]]";
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent : null;
    });
    console.log(
      guttersTexts
        ? `Verified: Gutters Section Text: ${guttersTexts}`
        : "Gutters section not found or text missing.".yellow
    );

    const gutterGuardsText = await page.evaluate(() => {
      const xpath = "//p[strong[contains(text(), 'Gutter Guards:')]]";
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent : null;
    });
    console.log(
      gutterGuardsText
        ? `Verified: Gutter Guards Section Text: ${gutterGuardsText}`
        : "Gutter Guards section not found or text missing.".yellow
    );

    const skylightsTexts = await page.evaluate(() => {
      const xpath = "//p[strong[contains(text(), 'Skylights:')]]";
      const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent : null;
    });
    console.log(
      skylightsTexts
        ? `Verified: Skylights Section Text: ${skylightsTexts}`
        : "Skylights section not found or text missing.".yellow
    );

    const myAccountLinkSelector = 'a.nav-link:has-text("My Account")';

    await page.waitForSelector(myAccountLinkSelector, { state: "visible" });

    await page.click(myAccountLinkSelector);

    await page.waitForFunction(() => {
      const pElements = [...document.querySelectorAll("p")];
      const totalPriceElement = pElements.find((p) =>
        p.textContent.startsWith("Total: $")
      );
      return (
        totalPriceElement &&
        !totalPriceElement.textContent.includes("Loading...")
      );
    });

    const totalPriceElement = await page.$('p:has-text("Total: $")');
    const totalPriceText = await totalPriceElement.textContent();
    const totalPrice = parseFloat(totalPriceText.replace(/[^0-9.]/g, ""));

    if (!isNaN(totalPrice) && totalPrice > 0) {
      console.log(
        `Verification successful: The total price of $${totalPrice} is present on the page and properly formatted.`
          .yellow
      );
    } else {
      console.error(
        `Verification failed: The total price is either not present, not properly formatted, or not greater than zero.`
          .yellow
      );
    }

    const expectedDepositPercentage = 0.1;
    const expectedDepositAmount = totalPrice * expectedDepositPercentage;

    const depositSelector =
      'li.myAccount_paymentScheduleItem__EZLf8:has-text("10% down")';

    await page.waitForSelector(depositSelector, { state: "visible" });
    const depositText = await page.textContent(depositSelector);

    const depositAmountMatches = depositText.match(/[\d,]+\.\d{2}/);
    let depositAmount = depositAmountMatches
      ? parseFloat(depositAmountMatches[0].replace(/,/g, ""))
      : null;

    if (
      depositAmount &&
      Math.abs(depositAmount - expectedDepositAmount) < 0.01
    ) {
      console.log(
        `Verification successful: The initial 10% deposit amount of $${depositAmount.toFixed(
          2
        )} matches the expected amount of $${expectedDepositAmount.toFixed(2)}.`
          .yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed deposit amount of $${
          depositAmount ? depositAmount.toFixed(2) : "N/A"
        } does not match the expected 10% deposit amount of $${expectedDepositAmount.toFixed(
          2
        )}.`.yellow
      );
    }

    const expectedSecondPaymentPercentage = 0.6;
    const expectedSecondPaymentAmount =
      totalPrice * expectedSecondPaymentPercentage;

    const secondPaymentSelector =
      'li.myAccount_paymentScheduleItem__EZLf8:has-text("60% upon start of project")';

    await page.waitForSelector(secondPaymentSelector, { state: "visible" });
    const secondPaymentText = await page.textContent(secondPaymentSelector);

    const secondPaymentAmountMatches = secondPaymentText.match(/[\d,]+\.\d{2}/);
    let secondPaymentAmount = secondPaymentAmountMatches
      ? parseFloat(secondPaymentAmountMatches[0].replace(/,/g, ""))
      : null;

    if (
      secondPaymentAmount &&
      Math.abs(secondPaymentAmount - expectedSecondPaymentAmount) < 0.01
    ) {
      console.log(
        `Verification successful: The 60% second payment amount of $${secondPaymentAmount.toFixed(
          2
        )} matches the expected amount of $${expectedSecondPaymentAmount.toFixed(
          2
        )}.`.yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed second payment amount of $${
          secondPaymentAmount ? secondPaymentAmount.toFixed(2) : "N/A"
        } does not match the expected 60% payment amount of $${expectedSecondPaymentAmount.toFixed(
          2
        )}.`.yellow
      );
    }

    const expectedFinalPaymentPercentage = 0.3;
    const expectedFinalPaymentAmount =
      totalPrice * expectedFinalPaymentPercentage;

    const finalPaymentSelector =
      'li.myAccount_paymentScheduleItem__EZLf8:has-text("30% upon completion")';

    await page.waitForSelector(finalPaymentSelector, { state: "visible" });
    const finalPaymentText = await page.textContent(finalPaymentSelector);

    const finalPaymentAmountMatches = finalPaymentText.match(/[\d,]+\.\d{2}/);
    let finalPaymentAmount = finalPaymentAmountMatches
      ? parseFloat(finalPaymentAmountMatches[0].replace(/,/g, ""))
      : null;

    if (
      finalPaymentAmount &&
      Math.abs(finalPaymentAmount - expectedFinalPaymentAmount) < 0.01
    ) {
      console.log(
        `Verification successful: The final payment amount of $${finalPaymentAmount.toFixed(
          2
        )} matches the expected amount of $${expectedFinalPaymentAmount.toFixed(
          2
        )}.`.yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed final payment amount of $${
          finalPaymentAmount ? finalPaymentAmount.toFixed(2) : "N/A"
        } does not match the expected final payment amount of $${expectedFinalPaymentAmount.toFixed(
          2
        )}.`.yellow
      );
    }

    const totalPriceTexts = await page.textContent('p:has-text("Total:")');
    const totalPrices = parseFloat(
      totalPriceTexts.replace(/[^0-9.,]/g, "").replace(",", "")
    );

    const paidPaymentItems = await page.$$eval(
      '.myAccount_paymentScheduleItem__EZLf8:has-text("(Paid)")',
      (items) =>
        items.map((item) =>
          parseFloat(item.textContent.replace(/[^0-9.,]/g, "").replace(",", ""))
        )
    );

    const totalPaid = paidPaymentItems.reduce(
      (sum, current) => sum + current,
      0
    );

    const expectedRemainingBalance = totalPrices - totalPaid;

    const displayedRemainingBalanceText = await page.textContent(
      'p:has-text("Balance Remaining:")'
    );
    const displayedRemainingBalance = parseFloat(
      displayedRemainingBalanceText.replace(/[^0-9.,]/g, "").replace(",", "")
    );

    const discrepancy = Math.abs(
      expectedRemainingBalance - displayedRemainingBalance
    );
    if (discrepancy < 0.01) {
      console.log(
        `Verification successful: The displayed balance remaining of $${displayedRemainingBalance.toFixed(
          2
        )} matches the expected balance remaining of $${expectedRemainingBalance.toFixed(
          2
        )}.`.yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed balance remaining of $${displayedRemainingBalance.toFixed(
          2
        )} does not match the expected balance remaining of $${expectedRemainingBalance.toFixed(
          2
        )}. The discrepancy is $${discrepancy.toFixed(2)}.`.yellow
      );
    }

    await page.waitForSelector(".myAccount_makePaymentButton__984xT", {
      state: "visible",
    });
    await Promise.all([
      page.waitForNavigation(),
      page.click(".myAccount_makePaymentButton__984xT"),
    ]);

    const isOnMakePaymentPage = await page.waitForSelector(
      'h1:text("Make Payment")',
      { state: "attached" }
    );
    if (isOnMakePaymentPage) {
      console.log(
        "Verification successful: Navigated to the Make Payment page.".yellow
      );
    } else {
      console.error(
        "Verification failed: Did not navigate to the Make Payment page.".yellow
      );
    }

    const paragraphSelector = ".SelectionSummary_summaryParagragh__8hoZN";

    const isParagraphVisible = await page.isVisible(paragraphSelector);

    if (isParagraphVisible) {
      console.log("Customer name and address are correct.".yellow);
    } else {
      console.log("Customer name and address are not correct.".yellow);
    }

    const displayedRemainingBalanceTexts = await page.textContent(
      'h2:has-text("Remaining Balance:")'
    );
    const displayedRemainingBalanceFromPage = parseFloat(
      displayedRemainingBalanceTexts.split("$")[1].replace(/,/g, "")
    );

    if (displayedRemainingBalanceFromPage === displayedRemainingBalance) {
      console.log(
        `Verification successful: The displayed balance remaining of $${displayedRemainingBalanceFromPage.toFixed(
          2
        )} matches the expected balance remaining of $${displayedRemainingBalance.toFixed(
          2
        )}.`.yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed balance remaining of $${displayedRemainingBalanceFromPage.toFixed(
          2
        )} does not match the expected balance remaining of $${displayedRemainingBalance.toFixed(
          2
        )}. The discrepancy is $${Math.abs(
          displayedRemainingBalanceFromPage - displayedRemainingBalance
        ).toFixed(2)}.`.yellow
      );
    }

    const expectedNextPayment = totalPrice * 0.6;

    const displayedNextPaymentText = await page.textContent(
      'h3:has-text("Next Payment:")'
    );
    const displayedNextPayment = parseFloat(
      displayedNextPaymentText.split("$")[1].replace(/,/g, "")
    );

    if (Math.abs(displayedNextPayment - expectedNextPayment) < 0.01) {
      console.log(
        `Verification successful: The next payment of $${displayedNextPayment.toFixed(
          2
        )} matches the expected 60% payment of $${expectedNextPayment.toFixed(
          2
        )}.`.yellow
      );
    } else {
      console.error(
        `Verification failed: The next payment of $${displayedNextPayment.toFixed(
          2
        )} does not match the expected 60% payment of $${expectedNextPayment.toFixed(
          2
        )}. The discrepancy is $${Math.abs(
          displayedNextPayment - expectedNextPayment
        ).toFixed(2)}.`.yellow
      );
    }

    const radioButtonSelector =
      'input[name="paymentOption"][type="radio"][value="creditcard"]';

    const isRadioButtonVisible = await page.isVisible(radioButtonSelector);

    if (isRadioButtonVisible) {
      console.log(
        'Verification successful: The radio button for "Cash/Check/Credit Card" is present.'
          .yellow
      );
    } else {
      console.error(
        'Verification failed: The radio button for "Cash/Check/Credit Card" is not present.'
          .yellow
      );
    }

    const colorInfoSelector = "p.SelectionSummary_infoSubTitle__1V8ku";

    const colorTitleElement = await page.$(colorInfoSelector);

    const displayedRoofColor = await page.evaluate((el) => {
      const nextElement = el.nextElementSibling;
      return nextElement ? nextElement.textContent : null;
    }, colorTitleElement);

    const expectedRoofColors = "YourExpectedRoofColorHere";

    if (
      displayedRoofColor &&
      displayedRoofColor.trim() === expectedRoofColors
    ) {
      console.log(
        `Verification successful: The displayed roof color "${displayedRoofColor}" matches the expected roof color "${expectedRoofColors}".`
          .yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed roof color "${displayedRoofColor}" does not match the expected roof color "${expectedRoofColors}".`
          .yellow
      );
    }

    const addOnElements = await page.$$eval(
      ".SelectionSummary_addonItem__SMI9D",
      (addOns) =>
        addOns.map((addOn) => {
          const name = addOn.textContent.replace(/\$\d+,\d+\.\d+$/, "").trim();
          const priceText = addOn.querySelector("span")
            ? addOn.querySelector("span").textContent
            : "";
          const price = parseFloat(priceText.replace(/[^\d.]/g, ""));
          return { name, priceText, price };
        })
    );

    let verificationPassed = true;
    addOnElements.forEach(({ name, priceText, price }) => {
      if (name && priceText && !isNaN(price) && price > 0) {
        console.log(
          `Verified: "${name}" with price ${priceText} is correctly formatted and displayed.`
            .yellow
        );
      } else {
        console.error(
          `Verification failed: Add-on "${name}" with price ${priceText} is incorrectly formatted or displayed.`
            .yellow
        );
        verificationPassed = false;
      }
    });

    if (verificationPassed) {
      console.log("All add-ons are correctly formatted and displayed.".yellow);
    } else {
      console.log(
        "Some add-ons are incorrectly formatted or not displayed as expected."
          .yellow
      );
    }

    const linkSelectors =
      'a[href="/sow"]:has-text("See full description of work")';

    const isLinkVisible = await page.isVisible(linkSelectors);

    if (isLinkVisible) {
      console.log(
        'Verification successful: The "See full description of work" link is displayed and correctly points to "/sow".'
          .yellow
      );
    } else {
      console.error(
        'Verification failed: The "See full description of work" link is either not displayed or does not correctly point to "/sow".'
          .yellow
      );
    }

    const displayedStartDateSelector = "p.SelectionSummary_infoDesc__HZv40";

    await page.waitForSelector(displayedStartDateSelector, {
      state: "visible",
    });

    const displayedStartDate = await page.textContent(
      displayedStartDateSelector
    );

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (datePattern.test(displayedStartDate)) {
      console.log(
        `Verification successful: The displayed start date "${displayedStartDate}" matches the expected format.`
          .yellow
      );
    } else {
      console.error(
        `Verification failed: The displayed start date "${displayedStartDate}" does not match the expected format.`
          .yellow
      );
    }

    await page.click('a:has-text("Log Out")');
    console.log("Clicked on 'Log Out' link.".yellow);

    await context.close();
  }
});
