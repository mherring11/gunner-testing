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

test('Check "Full Test No Awaits', async ({ browser }) => {
  test.setTimeout(480000);
  const context = await browser.newContext();
  const page = await context.newPage();

  page.context().on("page", async (newPage) => {
    console.log("New page opened:", newPage.url());
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

  // await page.waitForSelector("div.aeJ");
  // await page.evaluate(() => {
  //   return new Promise((resolve) => {
  //     const element = document.querySelector("div.aeJ");
  //     const totalScroll = element.scrollHeight - element.clientHeight;
  //     const step = totalScroll / 40;
  //     let scrolled = 0;

  //     const scrollDown = setInterval(() => {
  //       if (scrolled < totalScroll) {
  //         element.scrollBy(0, step);
  //         scrolled += step;
  //       } else {
  //         clearInterval(scrollDown);
  //         const scrollUp = setInterval(() => {
  //           if (scrolled > 0) {
  //             element.scrollBy(0, -step);
  //             scrolled -= step;
  //           } else {
  //             clearInterval(scrollUp);
  //             resolve();
  //           }
  //         }, 100);
  //       }
  //     }, 100);
  //   });
  // });

  await page.waitForSelector('img[alt="Your Online Quote"]', {
    state: "visible",
  });
  await page.click('a:has(img[alt="Your Online Quote"])');
  console.log("Processing complete, proceeding to log into the website.");

  await page.goto("https://accounts.google.com/Logout", {
    waitUntil: "networkidle",
  });
  await page.goto("https://estimatorstg.gunnerroofing.com/login");

  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "gunnerplaywright+02263@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value: ${emailValue}`);

  await page.waitForSelector("#mui-2", { state: "visible" });
  await page.fill("#mui-2", "123PWtest!");
  const passwordValue = await page.$eval("#mui-2", (el) => el.value);
  console.log(`Password Input Value: ${passwordValue}`);

  await page.click('button:has-text("SIGN IN")');
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });

  console.log("Logged in, waiting for page actions.");

  const hangingIconsContainer = page.locator(
    "#result_hangingIconsContainer__ujFwa"
  );
  await hangingIconsContainer.scrollIntoViewIfNeeded();

  // await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const element = document.querySelector(".result_sectionSubtitle__1mAzM");
    element.scrollIntoView({ behavior: "smooth" });
  });

  // await page.waitForTimeout(3000);
  console.log("Logged in, starting color selection verification.");

  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/5372338c-01e0-42ac-9638-1d1a82421e23/"]';
  const iframeHandle = await page.waitForSelector(iframeSelector, {
    state: "attached",
    timeout: 20000,
  });
  const frame = await iframeHandle.contentFrame();

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
    console.log(`Trying to click on the shingle: ${shingleColor}`);
    const shingleLabelSelector = `span.shingleLabel:has-text("${shingleColor}")`;
    await frame.waitForSelector(shingleLabelSelector, { state: "visible" });
    await frame.click(shingleLabelSelector);
    console.log(`Clicked on ${shingleColor}`);
    // await frame.waitForTimeout(2500);

    const addonsSelector = "p.SelectionSummary_infoSubTitle__1V8ku";
    if (await page.$(addonsSelector)) {
      await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, addonsSelector);
      console.log(
        `Scrolled to 'Selected add-ons' section for ${shingleColor} in main page context`
      );
    } else {
      console.error(
        `'Selected add-ons' section not found for ${shingleColor} in main page context`
      );
    }
    // await frame.waitForTimeout(2500);

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
      );
    } else {
      console.error(
        `Top element (h3) not found for ${shingleColor} in main page context`
      );
    }
    // await frame.waitForTimeout(2500);
  }

  console.log("Starting visualizer interaction verification.");
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
    await smoothScroll(pageX, pageY, pageX + 100, pageY, 500);
    await smoothScroll(pageX + 100, pageY, pageX + 100, pageY + 100, 500);
    await smoothScroll(pageX + 100, pageY + 100, pageX, pageY + 100, 500);
    await smoothScroll(pageX, pageY + 100, pageX, pageY, 500);
    await page.mouse.up();
    console.log("Completed visualizer interaction verification.");
  } catch (error) {
    console.error("Error during visualizer interaction verification:", error);
  }

  // await page.waitForTimeout(2000);
  console.log("Delay after completing visualizer interaction verification.");

  const questionSelector =
    'text="Would you like us to include replacement of the roof of the additional structures at this time?"';
  const questionElement = page.locator(questionSelector);
  await questionElement.waitFor();
  await questionElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });
  console.log(
    "Scrolled smoothly to the specific question paragraph successfully."
  );
  // await page.waitForTimeout(2000);

  const noteSelector =
    'text="Note: You will receive a confirmation email once you have completed your payment."';
  const noteElement = page.locator(noteSelector);
  await noteElement.waitFor();
  await noteElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });
  console.log("Scrolled smoothly to the note paragraph successfully.");
  // await page.waitForTimeout(2000);

  const additionalStructuresSelector = 'h3:text("Additional structures")';
  const additionalStructuresElement = page.locator(
    additionalStructuresSelector
  );
  await additionalStructuresElement.waitFor();
  await additionalStructuresElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });
  console.log(
    "Scrolled smoothly to the 'Additional structures' <h3> element successfully."
  );
  // await page.waitForTimeout(2000);

  const yesButtonSelector =
    'button.MuiButtonBase-root.MuiToggleButton-root[value="YES"]';
  await page.waitForSelector(yesButtonSelector, { state: "visible" });
  await expect(page.locator(yesButtonSelector)).toBeEnabled();
  await page.click(yesButtonSelector);
  console.log("Clicked on the 'YES' button.");
  // await page.waitForTimeout(2000);

  const summaryParagraphSelector = ".SelectionSummary_summaryParagragh__8hoZN";
  const summaryParagraphElement = page.locator(summaryParagraphSelector);
  await summaryParagraphElement.waitFor();
  await summaryParagraphElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });
  console.log("Scrolled smoothly down to the summary paragraph successfully.");
  // await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const paragraphs = [...document.querySelectorAll("p")];
    const targetParagraph = paragraphs.find((p) =>
      p.textContent.includes("Included as standard.")
    );
    if (targetParagraph) {
      targetParagraph.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  console.log(
    "Scrolled smoothly to the paragraph containing 'Included as standard.'"
  );
  // await page.waitForTimeout(2000);

  const customCheckboxWrapperSelector = "div.CustomOptOutWrapper";
  await page.waitForSelector(customCheckboxWrapperSelector, {
    state: "visible",
  });
  console.log("Waiting for custom checkbox to become visible.");
  await page.click(customCheckboxWrapperSelector);
  console.log("Clicked on the custom checkbox in the 'Gutters' section.");
  // await page.waitForTimeout(2000);

  const summaryParagraphSelectors = ".SelectionSummary_summaryParagragh__8hoZN";
  const summaryParagraphElements = page.locator(summaryParagraphSelectors);
  await summaryParagraphElements.waitFor();
  console.log("Waiting for the summary paragraph to be available in the DOM.");
  await summaryParagraphElements.evaluate((element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  console.log("Scrolled smoothly down to the summary paragraph successfully.");
  // await page.waitForTimeout(2000);

  const guttersHeadingSelectors = "h3:text('Gutters')";
  const guttersHeadingElements = page.locator(guttersHeadingSelectors);
  await guttersHeadingElements.waitFor();
  console.log("Waiting for the 'Gutters' heading to be available in the DOM.");
  await guttersHeadingElements.evaluate((element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  console.log("Scrolled smoothly up to the 'Gutters' heading successfully.");
  // await page.waitForTimeout(2000);

  const customCheckboxWrapperSelectors = "div.CustomOptOutWrapper";
  await page.click(customCheckboxWrapperSelectors);
  console.log(
    "Clicked on the first custom checkbox within the 'Gutters' section."
  );
  // await page.waitForTimeout(2000);

  console.log(
    "Proceeding to verify and interact with the second custom checkbox..."
  );
  const secondCustomCheckboxSelector = "div.CustomCheckboxWrapper";
  const isSecondCheckboxPresent = await page
    .locator(secondCustomCheckboxSelector)
    .isVisible({ timeout: 5000 })
    .catch((e) => false);
  if (isSecondCheckboxPresent) {
    console.log("Second custom checkbox is present. Interacting...");
    await page.click(secondCustomCheckboxSelector);
    console.log("Clicked on the second custom checkbox.");
  } else {
    console.error("Second custom checkbox is not present or visible.");
  }
  // await page.waitForTimeout(2000);

  const summaryParagraphsSelector = ".SelectionSummary_summaryParagragh__8hoZN";
  const summaryParagraphsElement = page.locator(summaryParagraphsSelector);
  await summaryParagraphsElement.waitFor();
  console.log("Waiting for the summary paragraph to be available in the DOM.");
  await summaryParagraphsElement.evaluate((element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  console.log(
    "Scrolled smoothly back down to the summary paragraph successfully."
  );
  // await page.waitForTimeout(2000);

  console.log("Scrolling smoothly up to the 'Skylights' heading.");
  await page.evaluate((text) => {
    const headingElements = [...document.querySelectorAll("h3")];
    const skylightElement = headingElements.find((element) =>
      element.textContent.includes(text)
    );
    if (skylightElement) {
      skylightElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, "Skylights");
  console.log("Scrolled smoothly up to the 'Skylights' heading.");
  // await page.waitForTimeout(2000);

  const fixedOptionSelector =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';
  await page.waitForSelector(fixedOptionSelector, { state: "visible" });
  console.log("Ensuring the input for 'Fixed' option is visible.");
  await page.fill(fixedOptionSelector, "0");
  await page.click(fixedOptionSelector);
  await page.fill(fixedOptionSelector, "1");
  // await page.waitForTimeout(3000);
  await page.fill(fixedOptionSelector, "4");
  console.log(
    "Reset the number input value to 0, then increased first by 1, then set to 4."
  );
  // await page.waitForTimeout(3000);

  const solarPoweredInputSelector =
    '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';
  await page.click(solarPoweredInputSelector);
  console.log("Clicked on Solar-Powered Opening input.");
  await page.fill(solarPoweredInputSelector, "1");
  // await page.waitForTimeout(3000);
  await page.fill(solarPoweredInputSelector, "4");
  console.log(
    "Increased the Solar-Powered Opening input value first by 1, then by 3."
  );
  // await page.waitForTimeout(3000);

  const targetDivSelector = "#result_roofingLayers__kOCE6";
  await page.waitForSelector(targetDivSelector, { state: "visible" });
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  }, targetDivSelector);
  console.log("Scrolled smoothly to the target div.");
  // await page.waitForTimeout(2000);

  async function scrollToAndClickDate(page) {
    async function scrollToPreviousMonthButton() {
      await page.waitForSelector('button[aria-label="Previous Month"]', {
        state: "attached",
      });
      await page.evaluate(() => {
        const previousMonthButton = document.querySelector(
          'button[aria-label="Previous Month"]'
        );
        previousMonthButton.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
      console.log('Smoothly scrolled to the "Previous Month" button.');
    }
    await scrollToPreviousMonthButton();
    // await page.waitForTimeout(2000);
    console.log("Clicking on the 'Next Month' button...");
    await page.click('button[aria-label="Next Month"]');
    console.log("Clicked on the 'Next Month' button.");
    // await page.waitForTimeout(2000);
    await page.click('abbr[aria-label="April 30, 2024"]');
    console.log("Clicked on April 30, 2024.");
  }

  await scrollToAndClickDate(page);
  // await page.waitForTimeout(2000);
  await page.waitForSelector("#result_totalEstimateAmount__rj09i", {
    state: "visible",
  });
  // await page.waitForTimeout(1000);

  await page.evaluate(() => {
    const scrollToElement = document.querySelector(
      "#result_totalEstimateAmount__rj09i"
    );
    scrollToElement.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // await page.waitForTimeout(6000);

  await page.evaluate(() => {
    const scrollToElement = document.querySelector(
      ".SelectionSummary_infoSubTitle__1V8ku"
    );
    scrollToElement.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // await page.waitForTimeout(4000);

  const href = await page.evaluate(() => {
    const link = document.evaluate(
      "//a[contains(text(), 'See full description of work')]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    return link ? link.href : null;
  });
  if (href) {
    await page.goto(href, { waitUntil: "networkidle" });
    console.log(`Navigated to ${href}`);
  } else {
    console.log("Link with 'See full description of work' text not found.");
  }
  // await page.waitForTimeout(4000);

  await page.evaluate(() => {
    const skylightsElement = document.evaluate(
      "//strong[contains(text(), 'Skylights:')]",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    skylightsElement.scrollIntoView();
  });

  console.log("Smoothly scrolled to Skylights:");
  // await page.waitForTimeout(4000);
  await page.goBack({ waitUntil: "networkidle" });
  // await page.waitForTimeout(2000);
  console.log("Clicking on the 'Next Month' button...");
  await page.click('button[aria-label="Next Month"]');
  console.log("Clicked on the 'Next Month' button.");
  await page.click('abbr[aria-label="April 30, 2024"]');
  console.log("Clicked on April 30, 2024.");

  await page.evaluate(async () => {
    const buttonXPath =
      "//button[contains(text(), 'CHECKOUT & MEET YOUR TEAM')]";
    const button = document.evaluate(
      buttonXPath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (button) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
      button.click();
    }
  });
  console.log("Clicked 'CHECKOUT & MEET YOUR TEAM' button without scrolling.");

  await page.waitForSelector(".SelectionSummary_infoSubTitle__1V8ku", {
    state: "visible",
  });

  await page.waitForSelector(".SelectionSummary_infoSubTitle__1V8ku", {
    state: "visible",
  });

  await page.click(".SelectionSummary_infoSubTitle__1V8ku");

  console.log(
    "Clicked on the element related to 'Preferred start date:' without scrolling."
  );

  // await page.waitForTimeout(4000);
  await page.evaluate(() => {
    const pElements = Array.from(document.querySelectorAll("p"));
    const targetElement = pElements.find((p) =>
      p.textContent.includes(
        "Gunner offers flexible ways to pay. Select one to proceed to checkout."
      )
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  console.log("Smoothly scrolled back to the payment options.");
  // await page.waitForTimeout(3000);

  await page.click(
    'input.PrivateSwitchBase-input.css-1m9pwf3[name="paymentOption"][type="radio"][value="creditcard"]'
  );
  console.log("Clicked on the credit card payment option.");
  // await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const div = document.querySelector("div.checkout_card_body__8MFut");
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  });
  console.log("Smoothly scrolled to the checkout card body.");
  // await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const button = document.querySelector(
      "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
    );
    if (button) {
      button.scrollIntoView({ behavior: "smooth" });
    }
  });
  console.log("Smoothly scrolled to the checkout button.");
  // await page.waitForTimeout(3000);

  await page.click(
    "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
  );
  console.log("Clicked on the checkout button.");

  const iframeElementHandles = await page.waitForSelector(
    'iframe[src*="https://jstest.authorize.net/v3/acceptMain/acceptMain.html"]'
  );
  const frames = await iframeElementHandles.contentFrame();
  if (frame) {
    await frames.click('input[name="cardNum"]');
    await frames.fill('input[name="cardNum"]', "4242424242424242", {
      delay: 100,
    });
    await frames.type("input#expiryDate", "0627", { delay: 100 });
    await frames.fill('input[name="firstName"]', "Playwright", { delay: 100 });
    await frames.fill('input[name="lastName"]', "Tester022304", {
      delay: 100,
    });
    await frames.fill('input[name="zip"]', "75225", { delay: 100 });
    console.log("Filled out the fields.");
  } else {
    console.log("Failed to access the iframe content.");
  }

  const iframeElementHandle = await page.waitForSelector(
    'iframe[src*="https://jstest.authorize.net"]',
    { state: "attached" }
  );
  const framess = await iframeElementHandle.contentFrame();
  if (frames) {
    try {
      await framess.waitForSelector("button#payButton", {
        state: "visible",
        timeout: 5000,
      });
      await framess.click("button#payButton");
      console.log("Clicked 'Submit Payment' button.");
    } catch (error) {
      console.error("Error clicking 'Submit Payment':", error);
    }
  } else {
    console.log("The iframe is detached or the frame reference is invalid.");
  }

  console.log("Completed the payment process.");

  await page.waitForSelector(
    "#quoteConfirmation_resultBtn__OshVM a.MuiButtonBase-root",
    { state: "visible" }
  );

  console.log("Visible check passed for 'Sign Contract' button.");

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
  );

  console.log("DocuSign page loaded.");

  console.log(
    "Looking for the checkbox to agree to use electronic records and signatures..."
  );
  await page.click(
    'label:has-text("I agree to use electronic records and signatures.")'
  );

  console.log(
    "Checkbox for electronic records and signatures agreement clicked."
  );

  // await page.waitForTimeout(2000);

  console.log("Attempting to click the 'Continue' button...");
  await page.waitForSelector("#action-bar-btn-continue", { state: "visible" });
  await page.click("#action-bar-btn-continue");
  console.log("'Continue' button clicked.");

  // await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Start' button...");

  try {
    await page.waitForSelector("#navigate-btn", { state: "visible" });

    await page.click("#navigate-btn");

    console.log("'Start' button clicked successfully.");
  } catch (error) {
    console.error("Error clicking the 'Start' button:", error.message);
  }

  // await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Sign' div...");
  await page.waitForSelector('div.signature-tab-content:has-text("Sign")', {
    state: "visible",
  });
  await page.click('div.signature-tab-content:has-text("Sign")');
  console.log("'Sign' div clicked successfully.");

  // await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Adopt and Sign' button...");

  const adoptAndSignButtonSelector =
    'button[data-qa="adopt-submit"][value="signature"]';
  await page.waitForSelector(adoptAndSignButtonSelector, { state: "visible" });
  await page.click(adoptAndSignButtonSelector);

  console.log("'Adopt and Sign' button clicked successfully.");

  // await page.waitForTimeout(2000);

  console.log("Navigating to the specified 'Test Document' div...");
  await page.evaluate(() => {
    const pageInfoElements = Array.from(
      document.querySelectorAll("div.page-info")
    );
    const targetDiv = pageInfoElements.find(
      (el) =>
        el.innerText.includes("Test Document") &&
        el.querySelector(".page-info-xofx").innerText.includes("2 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "auto", block: "center" });
    } else {
      console.error("Specified 'Test Document' div not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Clicking on the 'Initial' div...");
  await page.waitForSelector('text="Initial"', {
    state: "visible",
  });
  await page.click('text="Initial"');

  console.log("Waiting for 2 seconds...");
  await page.waitForTimeout(2000);

  console.log("Clicking on the 'Initial' div...");
  await page.waitForSelector('text="Initial"', {
    state: "visible",
  });
  await page.click('text="Initial"');

  // await page.waitForTimeout(2000);

  console.log("Clicking on the next 'Initial' div...");
  const initialDivs = await page.$$(
    "div.initials-tab-content.tab-button-yellow.v2"
  );

  if (initialDivs.length > 1) {
    await initialDivs[1].click();
    console.log("Second 'Initial' div clicked successfully.");
  } else {
    console.error("Not enough 'Initial' divs found.");
  }

  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 4 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("4 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 4 of 11' found.");
    } else {
      console.error("'Test Document 4 of 11' not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 5 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("5 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 5 of 11' found.");
    } else {
      console.error("'Test Document 5 of 11' not found.");
    }
  });

  console.log("Checking for 'Test Document 6 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("6 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 6 of 11' found.");
    } else {
      console.error("'Test Document 6 of 11' not found.");
    }
  });

  console.log("Checking for 'Test Document 7 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("7 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 7 of 11' found.");
    } else {
      console.error("'Test Document 7 of 11' not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 8 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("8 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 8 of 11' found.");
    } else {
      console.error("'Test Document 8 of 11' not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 9 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("9 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 9 of 11' found.");
    } else {
      console.error("'Test Document 9 of 11' not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 10 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("10 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 10 of 11' found.");
    } else {
      console.error("'Test Document 10 of 11' not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 11 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("11 of 11")
    );
    if (targetDiv) {
      console.log("'Test Document 11 of 11' found.");
    } else {
      console.error("'Test Document 11 of 11' not found.");
    }
  });

  // await page.waitForTimeout(2000);

  console.log("Clicking on the 'Finish' button...");
  await page.click(
    'button.documents-finish-button[data-action="action-bar-finish"]'
  );
  console.log("'Finish' button clicked.");

  await page.waitForTimeout(3000);

  console.log("Attempting to click on the 'My Account' button...");
  const myAccountButtonSelector = 'a:has-text("My Account")';
  await page.waitForSelector(myAccountButtonSelector, { state: "visible" });
  await page.click(myAccountButtonSelector);
  console.log("'My Account' button clicked successfully.");

  await page.waitForTimeout(3000);

  console.log("Ensuring 'credit' table header is present...");
  await page.waitForSelector('th:has-text("credit")', {
    state: "visible",
  });
  console.log("'credit' table header is present.");

  // await page.waitForTimeout(3000);

  console.log("Ensuring the address note is present...");
  await page.waitForSelector(".myAccount_addressNote__eqWHQ", {
    state: "visible",
  });

  // console.log("Ensuring 'See full description of work' link is present...");
  // await page.waitForSelector('a[href="/sow"]', {
  //   state: "visible",
  // });

  // console.log("Clicking on 'See full description of work' link...");
  // await page.click('a[href="/sow"]');
  // console.log("Navigated to the 'See full description of work' page.");

  // await page.waitForTimeout(3000);

  // console.log("Ensuring 'Tiger Paw Roof Deck Protection' is present...");
  // await page.waitForFunction(
  //   () => {
  //     const section = [
  //       ...document.querySelectorAll("p, h1, h2, h3, h4, h5, h6"),
  //     ] // Adjust the selectors as needed
  //       .find((el) =>
  //         el.textContent.includes("Tiger Paw Roof Deck Protection")
  //       );
  //     return section !== undefined;
  //   },
  //   { timeout: 5000 }
  // );

  // // await page.waitForTimeout(3000);

  // console.log("Ensuring 'Exclusions:' section is present...");
  // await page.waitForFunction(
  //   () => {
  //     const exclusionsElement = [...document.querySelectorAll("strong")] // Adjust the selector as needed
  //       .find((el) => el.textContent.includes("Exclusions:"));
  //     return exclusionsElement !== undefined;
  //   },
  //   { timeout: 5000 }
  // );

  // await page.waitForTimeout(3000);

  // await page.goto("https://estimatorstg.gunnerroofing.com/my-account");

  // console.log("Returned to my account.");

  console.log("Ensuring 'Balance Remaining:' is present...");
  await page.evaluate(() => {
    const strongTags = Array.from(document.querySelectorAll("strong"));
    const target = strongTags.find((el) =>
      el.textContent.includes("Balance Remaining:")
    );
    if (target) {
      target.scrollIntoView({ behavior: "auto", block: "center" });
    }
  });

  console.log("Clicking on the 'Make Payment' button...");
  const makePaymentButtonSelector = 'button:has-text("Make Payment")';
  await page.waitForSelector(makePaymentButtonSelector, { state: "visible" });
  await page.click(makePaymentButtonSelector);

  console.log("Ensuring 'Selected add-ons:' is present...");
  await page.evaluate(() => {
    const pTag = document.querySelector(
      "p.SelectionSummary_infoSubTitle__1V8ku"
    );
    if (pTag) {
      pTag.scrollIntoView({ behavior: "auto", block: "center" });
    }
  });

  console.log("Ensuring 'Preferred start date:' is present...");
  await page.evaluate(() => {
    const preferredStartDateTag = Array.from(
      document.querySelectorAll("p.SelectionSummary_infoSubTitle__1V8ku")
    ).find((el) => el.textContent.includes("Preferred start date:"));
    if (preferredStartDateTag) {
      preferredStartDateTag.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    } else {
      console.error("'Preferred start date:' p tag not found.");
    }
  });

  console.log("Ensuring 'Log Out' link is present...");
  await page.evaluate(() => {
    const logOutLink = document.querySelector(
      'a.nav-link[style*="cursor: pointer;"]'
    );
    if (logOutLink) {
      logOutLink.scrollIntoView({ behavior: "auto", block: "center" });
    }
  });

  await page.click('a:has-text("Log Out")');
  console.log("Clicked on 'Log Out' link.");
});

module.exports = {
  timeout: 480000,
};
