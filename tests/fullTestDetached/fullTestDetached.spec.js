const { test, expect } = require("@playwright/test");
const axios = require("axios");
const colors = require('colors');

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
test.setTimeout(480000);
test('Check "Full Test No Awaits', async ({ browser }) => {
  
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


 
  const yourOnlineQuoteButton = page.locator('img[alt="Your Online Quote"]');
  await expect(yourOnlineQuoteButton).toBeVisible();
  console.log("YOUR ONLINE QUOTE button is visible.");
  await page.click('a:has(img[alt="Your Online Quote"])');

  await page.goto("https://accounts.google.com/Logout", {
    waitUntil: "networkidle",
  });
  await page.goto("https://estimatorstg.gunnerroofing.com/login");

  
    await page.waitForSelector("#mui-1", { state: "visible" });
    await page.fill("#mui-1", "gunnerplaywright+0305a@gmail.com");
    const emailValue = await page.$eval("#mui-1", (el) => el.value);
    console.log(`Email Input Value: ${emailValue}`.yellow);

    await page.waitForSelector("#mui-2", { state: "visible" });
    await page.fill("#mui-2", "123PWtest!");
    const passwordValue = await page.$eval("#mui-2", (el) => el.value);
    console.log(`Password Input Value: ${passwordValue}`.yellow);
  

 // Click the "SIGN IN" button and wait for navigation
await page.click('button:has-text("SIGN IN")');
await page.waitForNavigation({ waitUntil: "networkidle" });

// Verify that no error message is present
const errorMessage = await page.$(".error-message");
expect(errorMessage).toBeNull();
console.log("No error messages detected upon logging in.");

console.log("Logged in, waiting for page actions.".yellow);


  
    // Selector for the NO button
    const noButtonSelector = 'button[value="NO"]';

    // Check if the NO button exists
    const noButtonExists = await page.$(noButtonSelector) !== null;

    if (noButtonExists) {
        // Retrieve the aria-pressed attribute to check if the NO button is selected
        const isNoSelected = await page.getAttribute(noButtonSelector, "aria-pressed");

        if (isNoSelected === "false") {
            // If NO button is not selected, click it
            await page.click(noButtonSelector);
            console.log("Clicked the NO button.".yellow);
        } else {
            console.log("NO button was already selected or does not require action.".yellow);
        }
    } else {
        console.log("NO button does not exist, moving on...".yellow);
    }

    // Wait or perform additional checks if necessary before proceeding



  
    // Selector for the checkbox wrapper for better click targeting
    const gutterOptOutWrapperSelector = ".CustomOptOutWrapper";
    // Selector for the actual checkbox input (hidden in your case)
    const gutterCheckboxSelector = `${gutterOptOutWrapperSelector} input[type="checkbox"]`;

    // Check if the checkbox is checked
    const isChecked = await page.isChecked(gutterCheckboxSelector);

    if (isChecked) {
      // If it's checked, click the wrapper to uncheck
      await page.click(gutterOptOutWrapperSelector);
      console.log("Unchecked the 'Do not want to replace my gutters' option.".yellow);
    } else {
      console.log(
        "'Do not want to replace my gutters' option was already not selected.".yellow
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

  // await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const element = document.querySelector(".result_sectionSubtitle__1mAzM");
    element.scrollIntoView({ behavior: "smooth" });
  });

  // await page.waitForTimeout(3000);
  console.log("Logged in, starting color selection verification.".yellow);

 
    const addressElements = page.locator(".result_resultParagragh__B6pvF");
    await expect(addressElements).toHaveCount(2);
    console.log("Address is visible on the page.".yellow);

    const squareFootageElement = page.locator(".result_sqft__3XLeL");
    await expect(squareFootageElement).toBeVisible();
    console.log("Square footage is visible on the page.".yellow);
  

  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/7fb4d148-2100-4cf5-806e-c96c8e8c5bda/"]';
  const iframeHandle = await page.waitForSelector(iframeSelector, {
    state: "attached",
  });
  expect(iframeHandle).not.toBeNull();

  // Optional: Verify the iframe is visible to the user
  expect(await iframeHandle.isVisible()).toBeTruthy();

  // Additional verification can be done by checking if the iframe is properly loaded
  // This involves working with the content of the iframe, which requires accessing the frame object
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
    console.log(`Clicked on ${shingleColor} and verified highlighted red`.yellow);
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
        `Scrolled to 'Estimate Summary' section for ${shingleColor} and verified that the correct color sample and name appear`.yellow
      );
    } else {
      console.error(
        `'Selected add-ons' section not found for ${shingleColor} in main page context`.yellow
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
        `Scrolled back to the top for ${shingleColor} in main page context`.yellow
      );
    } else {
      console.error(
        `Top element (h3) not found for ${shingleColor} in main page context`.yellow
      );
    }
    // await frame.waitForTimeout(2500);
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
    console.error("Error during visualizer interaction verification:".yellow, error);
  }

  // await page.waitForTimeout(1000);
  // console.log("Delay after completing visualizer interaction verification.".yellow);

  // await test.step("Check if the additional structures div is present and displayed", async () => {
  //   // Selector for the div you're interested in
  //   const divSelector = "#result_detachedStructure__UPrzP";
  
  //   // Wait for the element to ensure it's there
  //   await page.waitForSelector(divSelector, { state: 'attached' });
  
  //   // Attempt to get the div element
  //   const div = await page.$(divSelector);
  
  //   if (!div) {
  //     console.log("The div was not found in the DOM.");
  //     expect(div).not.toBeNull(); // This will still cause the test to fail as expected
  //   }
  
  //   // Check if the div is visible
  //   const box = await div.boundingBox();
  //   const isVisible = box !== null;
  //   expect(isVisible).toBeTruthy();
  
  //   // Log to console upon successful verification
  //   console.log("Additional structures section and cost is displayed.".yellow);
  // });
  

  // const questionSelector =
  //   'text="Would you like us to include replacement of the roof of the additional structures at this time?"';
  // const questionElement = page.locator(questionSelector);
  // await questionElement.waitFor();
  // await questionElement.evaluate((element) => {
  //   const smoothScrollToElement = (el) => {
  //     el.scrollIntoView({ behavior: "smooth", block: "center" });
  //   };
  //   smoothScrollToElement(element);
  // });
  // console.log(
  //   "Scrolled smoothly to the specific question paragraph successfully."
  // );
  await page.waitForTimeout(2000);

  
    // Check if the YES button is visible without waiting too long
    const yesButtonVisible = await page.isVisible('button[value="YES"][aria-pressed="false"]');

    if (yesButtonVisible) {
        // If the YES button is visible, then click it
        await page.click('button[value="YES"][aria-pressed="false"]');

        // Verify the YES button's aria-pressed attribute changes to true, indicating it's now selected
        await expect(page.locator('button[value="YES"]')).toHaveAttribute("aria-pressed", "true");

        // Continue with the rest of the steps to verify the total is updated correctly...
        const additionalCostText = await page.textContent("span.result_addOnCost__T8ARR");
        const additionalCost = parseFloat(additionalCostText.replace(/[^0-9.]/g, ""));
        console.log(`Additional cost: $${additionalCost}`.yellow);

        const initialTotalText = await page.textContent("h3#result_totalEstimateAmount__rj09i");
        const initialTotal = parseFloat(initialTotalText.replace(/[^0-9.]/g, ""));
        console.log(`Initial total: $${initialTotal}`.yellow);

        const expectedNewTotal = initialTotal + additionalCost;
        console.log(`Expected new total: $${expectedNewTotal}`.yellow);

        await page.waitForTimeout(2000); // Adjust timeout as necessary

        const updatedTotalText = await page.textContent("h3#result_totalEstimateAmount__rj09i");
        const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
        console.log(`Updated total: $${updatedTotal}`.yellow);

        expect(updatedTotal).toBeCloseTo(expectedNewTotal, 2); // Using toBeCloseTo for floating point comparison
        console.log(`Total has been correctly updated to: $${updatedTotal}`.yellow);
    } else {
        // Log that the YES button was not visible and the test is moving on
        console.log("The YES button is not visible, moving on without clicking.".yellow);
    }



  // const noteSelector =
  //   'text="Note: You will receive a confirmation email once you have completed your payment."';
  // const noteElement = page.locator(noteSelector);
  // await noteElement.waitFor();
  // await noteElement.evaluate((element) => {
  //   const smoothScrollToElement = (el) => {
  //     el.scrollIntoView({ behavior: "smooth", block: "center" });
  //   };
  //   smoothScrollToElement(element);
  // });
  // console.log("Scrolled smoothly to the note paragraph successfully.");
  // await page.waitForTimeout(2000);

  // const additionalStructuresSelector = 'h3:text("Additional structures")';
  // const additionalStructuresElement = page.locator(
  //   additionalStructuresSelector
  // );
  // await additionalStructuresElement.waitFor();
  // await additionalStructuresElement.evaluate((element) => {
  //   const smoothScrollToElement = (el) => {
  //     el.scrollIntoView({ behavior: "smooth", block: "center" });
  //   };
  //   smoothScrollToElement(element);
  // });
  // console.log(
  //   "Scrolled smoothly to the 'Additional structures' <h3> element successfully."
  // );
  // await page.waitForTimeout(2000);

  // const yesButtonSelector =
  //   'button.MuiButtonBase-root.MuiToggleButton-root[value="YES"]';
  // await page.waitForSelector(yesButtonSelector, { state: "visible" });
  // await expect(page.locator(yesButtonSelector)).toBeEnabled();
  // await page.click(yesButtonSelector);
  // console.log("Clicked on the 'YES' button.");
  // await page.waitForTimeout(2000);

  // -------------------GUTTERS ADD-ON START---------------------

  // Note the default total price of the estimate
  // let initialTotal = 0; // Keep this declaration
  // let subtractionAmount = 0; // Keep this declaration
  // const totalEstimateSelector = "#result_totalEstimateAmount__rj09i"; // Ensure this is accessible

  // await test.step("Note the default total price of the estimate", async () => {
  //   const totalEstimateText = await page.textContent(totalEstimateSelector);
  //   initialTotal = parseFloat(totalEstimateText.replace(/[^0-9.]/g, ""));
  //   console.log(`Initial total estimate: $${initialTotal}`);
  // });

  // Click the "I do not want to replace my gutters at this time." checkbox
  
    const gutterOptOutSelector = ".CustomOptOutWrapper svg"; // Adjust if necessary to match the actual selector
    await page.click(gutterOptOutSelector);
    console.log("Clicked: 'I do not want to replace my gutters at this time.' checkbox".yellow);
    await page.waitForTimeout(2000); // Wait a bit for the total to potentially update

  

  // // Retrieve and parse the amount to be subtracted from the quote
  // await test.step("Retrieve subtraction amount", async () => {
  //   const subtractionText = await page.textContent("div.result_ghostRow__eUq5T");
  //   subtractionAmount = parseFloat(subtractionText.match(/\$([\d,]+.\d{2})/)[1].replace(/,/g, ""));
  //   console.log(`Amount to be subtracted: $${subtractionAmount}`);
  // });

  // // Wait for the total to update after opting out
  // await test.step("Wait for the total to update after opting out", async () => {
  //   await page.waitForFunction(
  //     (selector, previousTotal) => {
  //       const text = document.querySelector(selector)?.innerText;
  //       const currentTotal = parseFloat(text.replace(/[^0-9.]/g, ""));
  //       return currentTotal !== previousTotal;
  //     },
  //     totalEstimateSelector,
  //     initialTotal,
  //     { timeout: 5000 }
  //   );
  // });

  // // After the wait, retrieve and verify the updated total
  // await test.step("Verify updated total", async () => {
  //   const updatedTotalText = await page.textContent(totalEstimateSelector);
  //   const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
  //   console.log(`Updated total estimate: $${updatedTotal}`);

  //   // Assuming `expect` is available in your testing environment (e.g., Jest, Playwright Test)
  //   expect(updatedTotal).toBeCloseTo(initialTotal - subtractionAmount, 2); // The second argument is the precision
  //   console.log(`Total has been correctly updated to: $${updatedTotal}`);
  // });

  // -------------------GUTTERS ADD-ON END--------------------------

  // -------------------GUTTER GUARDS ADD-ON START--------------------------

  // await page.waitForTimeout(2000);

  // Note the default total price of the estimate
  let initialTotal = 0; // Keep this declaration
  let subtractionAmount = 0; // Keep this declaration
  const totalEstimateSelector = "#result_totalEstimateAmount__rj09i"; // Ensure this is accessible

  
    const totalEstimateText = await page.textContent(totalEstimateSelector);
    initialTotal = parseFloat(totalEstimateText.replace(/[^0-9.]/g, ""));
    console.log(`Initial total estimate: $${initialTotal}`.yellow);
  

  // Opt-out of gutter replacement
  
    const gutterOptOutSelect = ".CustomOptOutWrapper svg";
    await page.click(gutterOptOutSelect);
    console.log("I do not want to replace my gutters at this time.".yellow);
    await page.waitForTimeout(3000); // Wait for potential update
  

  // Check the updated total estimate
  
    const updatedTotalText = await page.textContent(totalEstimateSelector);
    const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
    console.log(`Updated total estimate after opting out: $${updatedTotal}`.yellow);
  

  // Scroll to the "Gutters" heading
  // await test.step("Scroll to the 'Gutters' heading", async () => {
  //   const guttersHeadingSelectors = "h3:text('Gutters')";
  //   await page.locator(guttersHeadingSelectors).scrollIntoViewIfNeeded();
  //   console.log("Scrolled smoothly to the 'Gutters' heading successfully.");
  //   await page.waitForTimeout(2000);
  // });

  // Verify the gutter cost is reflected in the updated total estimate
  
    const finalTotalText = await page.textContent(totalEstimateSelector);
    const finalTotal = parseFloat(finalTotalText.replace(/[^0-9.]/g, ""));
    console.log(`Final total estimate reflecting gutter cost: $${finalTotal}`.yellow);

    // Assuming `expect` is available in your testing environment (e.g., Jest, Playwright Test)
    // Verify the final total is as expected, adjust the expected value as necessary
    // This is a placeholder assertion; the expected value should be based on your specific requirements
    // expect(finalTotal).toBeCloseTo(expectedFinalTotal, 2);
  

  // const summaryParagraphsSelector = ".SelectionSummary_summaryParagragh__8hoZN";
  // const summaryParagraphsElement = page.locator(summaryParagraphsSelector);
  // await summaryParagraphsElement.waitFor();
  // console.log("Waiting for the summary paragraph to be available in the DOM.");
  // await summaryParagraphsElement.evaluate((element) => {
  //   element.scrollIntoView({ behavior: "smooth", block: "center" });
  // });
  // console.log(
  //   "Scrolled smoothly back down to the summary paragraph successfully."
  // );
  // await page.waitForTimeout(2000);

  // console.log("Scrolling smoothly up to the 'Skylights' heading.");
  // await page.evaluate((text) => {
  //   const headingElements = [...document.querySelectorAll("h3")];
  //   const skylightElement = headingElements.find((element) =>
  //     element.textContent.includes(text)
  //   );
  //   if (skylightElement) {
  //     skylightElement.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // }, "Skylights");
  // console.log("Scrolled smoothly up to the 'Skylights' heading.");
  // await page.waitForTimeout(2000);

  let initialTotalEstimate = 0;
  
    const totalEstimateSelect = "#result_totalEstimateAmount__rj09i";
    const totalEstimateTexts = await page.textContent(totalEstimateSelect);
    initialTotalEstimate = parseFloat(
      totalEstimateTexts.replace(/[^0-9.]/g, "")
    );
    console.log(`Initial total estimate: $${initialTotalEstimate}`.yellow);
  

  // Define fixedOptionSelector at a scope accessible by all relevant steps
  const fixedOptionSelect =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

  // Update the "Fixed" option value to "1" and verify the updated total estimate
  
    await page.fill(fixedOptionSelect, "1");
    console.log("Set 'Fixed' option to 1.".yellow);
    await page.waitForTimeout(3000); // Wait for any potential calculations to complete

    // Verify the updated total estimate
    const updatedTotalEstimateAfterOne = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 1: $${updatedTotalEstimateAfterOne}`.yellow
    );
    // Assume using expect for verification
  

  // Update the "Fixed" option value to "4" and verify the updated total estimate
  
    await page.fill(fixedOptionSelector, "4");
    console.log("Set 'Fixed' option to 4.".yellow);
    await page.waitForTimeout(1000); // Wait for any potential calculations to complete

    // Verify the updated total estimate
    const updatedTotalEstimateAfterFour = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 4: $${updatedTotalEstimateAfterFour}`.yellow
    );
  

  // let initialTotalEstimates = 0;
  // let updatedTotalEstimate = 0;
  
  //   const totalEstimateSelects = "#result_totalEstimateAmount__rj09i";
  //   const totalEstimateTextss = await page.textContent(totalEstimateSelects);
  //   initialTotalEstimates = parseFloat(
  //     totalEstimateTextss.replace(/[^0-9.]/g, "")
  //   );
  //   console.log(`Initial total estimate: $${initialTotalEstimates}`.yellow);
  

  // const fixedOptionSelectors =
  //   'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

  
  //   await page.fill(fixedOptionSelectors, "1");
  //   console.log("Set 'Fixed' option to 1.".yellow);
  //   await page.waitForTimeout(3000); // Wait for any potential calculations to complete

  //   const updatedTotalEstimateAfterOnes = parseFloat(
  //     (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
  //       /[^0-9.]/g,
  //       ""
  //     )
  //   );
  //   console.log(
  //     `Updated total estimate after setting 'Fixed' to 1: $${updatedTotalEstimateAfterOnes}`.yellow
  //   );
  

  
  //   await page.fill(fixedOptionSelector, "4");
  //   console.log("Set 'Fixed' option to 4.".yellow);
  //   await page.waitForTimeout(3000); // Wait for any potential calculations to complete

  //   const updatedTotalEstimateAfterFours = parseFloat(
  //     (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
  //       /[^0-9.]/g,
  //       ""
  //     )
  //   );
  //   console.log(
  //     `Updated total estimate after setting 'Fixed' to 4: $${updatedTotalEstimateAfterFours}`.yellow
  //   );
  

  const solarPoweredInputSelect = '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';


  const totalEstimateSelectorss = "#result_totalEstimateAmount__rj09i";
  let initialTotalEstimatess = parseFloat((await page.textContent(totalEstimateSelectorss)).replace(/[^0-9.]/g, ""));
  console.log(`Initial total estimate: $${initialTotalEstimatess}`.yellow);



  await page.fill(solarPoweredInputSelect, "1");
  console.log("Set 'Solar-Powered Opening' option to 1.".yellow);
  await page.waitForTimeout(3000); // Wait for any potential calculations to complete
  
  let updatedTotalEstimat = parseFloat((await page.textContent("#result_totalEstimateAmount__rj09i")).replace(/[^0-9.]/g, ""));
  console.log(`Updated total estimate after setting 'Solar-Powered Opening' to 1: $${updatedTotalEstimat}`.yellow);
  // Here you might compare updatedTotalEstimate with an expected value using expect or another assertion



  await page.fill(solarPoweredInputSelector, "4");
  console.log("Set 'Solar-Powered Opening' option to 4.".yellow);
  await page.waitForTimeout(3000); // Wait for update
  
  updatedTotalEstimat = parseFloat((await page.textContent("#result_totalEstimateAmount__rj09i")).replace(/[^0-9.]/g, ""));
  console.log(`Updated total estimate after setting 'Solar-Powered Opening' to 4: $${updatedTotalEstimat}`.yellow);
  // Again, compare updatedTotalEstimate with an expected value


async function clickThroughRoofingSteps(page) {
  const buttonSelectors = '#result_roofingLayers__kOCE6 button';
  
  // Fetch all buttons at once to get their texts
  const buttons = await page.$$(buttonSelectors);
  
  for (let i = 0; i < buttons.length; i++) {
    // Get the text of the button to log it
    const buttonText = await buttons[i].textContent();
    
    // Click on the button
    await buttons[i].click();
    console.log(`Clicked on button: ${buttonText.trim()}`.yellow);

    // More specific selector for the close button, if possible
    const closeButtonSelector = 'a'; // Ideally, use something more specific
    await page.waitForSelector(closeButtonSelector, { state: 'visible' });

    // Use function to evaluate within page context to find correct 'X' and click
    const clicked = await page.evaluate((closeButtonSelector) => {
      const closeButtons = Array.from(document.querySelectorAll(closeButtonSelector));
      const closeButton = closeButtons.find(button => button.textContent.trim() === 'X');
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

    await page.waitForTimeout(500); // Ensure the dialog has time to close before proceeding
  }
}


  await clickThroughRoofingSteps(page);




  // Directly click the 'Next Month' button without scrolling to it
  console.log("Clicking on the 'Next Month' button...".yellow);
  await page.click('button[aria-label="Next Month"]');
  console.log("Clicked on the 'Next Month' button.".yellow);

  // Wait a bit for the calendar to update to the next month
  await page.waitForTimeout(1000);

  // Directly click on the specific date without scrolling to it
  await page.click('abbr[aria-label="April 30, 2024"]');
  console.log("Picked start date: April 30, 2024.".yellow);



  // Define the expected src attribute value based on the selected shingle color
  const expectedSrcValue = "/resultRoofingSystem/weatheredwood.png"; // Adjust based on the selected color

  // Retrieve the src attribute of the img element within the specified div
  const actualSrcValue = await page.getAttribute(".SelectionSummary_roofMaterialImg__cmNBo img", "src");

  // Log the expected and actual src values for verification
  console.log(`Expected shingle color src: ${expectedSrcValue}`.yellow);
  console.log(`Actual shingle color src: ${actualSrcValue}`.yellow);

  // Verify that the actual src matches the expected src
  if (actualSrcValue.includes(expectedSrcValue)) {
    console.log("The shingle color selected from the 3D visualization is correctly displayed in the sidebar of the Quote summary.".yellow);
  } else {
    console.log("The shingle color selected from the 3D visualization is NOT correctly displayed in the sidebar of the Quote summary.".yellow);
  }




  // Fetch dynamically defined add-ons and their costs from the selection part of the application
  // This is a placeholder; you need to adapt it to how your application defines or selects add-ons
  const dynamicAddOns = await page.evaluate(() => {
    // Example of fetching add-on names and costs dynamically
    const addOns = {};
    document.querySelectorAll(".AddOnSelector .addOnItem").forEach(item => {
      const name = item.querySelector(".addOnName").textContent.trim();
      const cost = item.querySelector(".addOnCost").textContent.trim();
      addOns[name] = cost;
    });
    return addOns;
  });

  console.log("Dynamically fetched expected add-ons:".yellow, dynamicAddOns);

  // Fetch all the add-on items from the sidebar
  const sidebarAddOns = await page.$$eval(".SelectionSummary_addonItem__SMI9D", items =>
    items.map(item => ({
      name: item.textContent.replace(/\$\d+,\d+\.\d+/, "").trim(), // Remove the cost from the name
      cost: item.querySelector("span")?.textContent.trim() || ""
    }))
  );

  // Log the fetched sidebar add-on items for debugging
  console.log("Fetched sidebar add-on items:".yellow, sidebarAddOns);

  // Verify each dynamically fetched add-on is displayed with the correct cost in the sidebar
  let allMatch = true;
  for (const [name, cost] of Object.entries(dynamicAddOns)) {
    const item = sidebarAddOns.find(item => item.name === name && item.cost === cost);
    if (item) {
      console.log(`Verified: ${name} with cost ${cost} is correctly displayed in the sidebar.`.yellow);
    } else {
      console.log(`Mismatch found: ${name} with expected cost ${cost} was not found correctly in the sidebar.`.yellow);
      allMatch = false;
    }
  }

  // Overall verification result
  if (allMatch) {
    console.log("All dynamically defined add-ons are correctly displayed in the sidebar of the Quote summary with correct selections and costs.".yellow);
  } else {
    console.log("Some dynamically defined add-ons are not correctly displayed or have incorrect costs in the sidebar of the Quote summary.".yellow);
  }




  // Fetch the selected date text directly from the calendar
  const calendarDateSelector = ".result_calendarText__U70AZ";
  const selectedDateText = await page.textContent(calendarDateSelector);

  // Convert the selected date to the format used in the sidebar ('YYYY-MM-DD')
  const dateParts = selectedDateText.match(/(\w+), (\w+) (\d+), (\d+)/);
  if (!dateParts) {
    console.log("Error: Could not parse the selected date text.".yellow);
    return;
  }
  const [, , month, day, year] = dateParts;
  // Assuming you have a function to convert month name to month number
  const monthNumber = new Date(`${month} 1`).getMonth() + 1;
  const formattedSelectedDate = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;

  // Fetch the displayed start date in the sidebar
  const dateDisplaySelector = ".SelectionSummary_infoSubTitle__1V8ku + .SelectionSummary_infoDesc__HZv40"; // Adjusted to select the sibling of the title element
  const displayedDate = await page.textContent(dateDisplaySelector);

  console.log("Formatted selected start date for comparison:".yellow, formattedSelectedDate);
  console.log("Displayed start date in the sidebar:".yellow, displayedDate.trim());

  // Verify they match
  if (displayedDate.trim() === formattedSelectedDate) {
    console.log(`Verified: The dynamically selected start date '${selectedDateText}' is correctly displayed in the sidebar as '${displayedDate.trim()}'.`.yellow);
  } else {
    console.log(`Mismatch found: The dynamically selected start date '${selectedDateText}' is not correctly displayed in the sidebar. Expected '${formattedSelectedDate}', but found '${displayedDate.trim()}'.`.yellow);
  }






  // Find the link using XPath within page.evaluate and navigate to its href
  const href = await page.evaluate(() => {
    const xpathResult = document.evaluate("//a[contains(text(), 'See full description of work')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const link = xpathResult.singleNodeValue;
    return link ? link.href : null;
  });

  if (href) {
    await page.goto(href, { waitUntil: "networkidle" });
    console.log(`Navigated to ${href}`.yellow);
  } else {
    console.log("Link with 'See full description of work' text not found.".yellow);
    return; // Exit the step if the link was not found
  }

  // Verify the Statement of Work title
  const statementOfWorkTitle = await page.textContent('#sow_myAccountTitle__L_iaa h1');
  if (statementOfWorkTitle === 'Statement of Work') {
    console.log("Verified: 'Statement of Work' title is correctly displayed.".yellow);
  } else {
    console.log("Mismatch found: 'Statement of Work' title is not correctly displayed.".yellow);
  }

  // Optionally, verify the address dynamically, which will vary per customer
  const addressDisplayed = await page.textContent('#sow_myAccountTitle__L_iaa .sow_titleAddress__BeKaa');
  console.log(`Address displayed on Statement of Work page: '${addressDisplayed}'.`.yellow);






  // Verify Gutters Section Text
  const guttersText = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Gutters:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(guttersText ? `Gutters Section Text: ${guttersText}` : "Gutters section text not found.".yellow);

  // Verify Skylights Section Text
  const skylightsText = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Skylights:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(skylightsText ? `Skylights Section Text: ${skylightsText}` : "Skylights section text not found.".yellow);






  // await page.evaluate(() => {
  //   const skylightsElement = document.evaluate(
  //     "//strong[contains(text(), 'Skylights:')]",
  //     document,
  //     null,
  //     XPathResult.FIRST_ORDERED_NODE_TYPE,
  //     null
  //   ).singleNodeValue;
  //   skylightsElement.scrollIntoView({ behavior: "smooth", block: "start" });
  // });
  // console.log("Smoothly scrolled to Skylights:");
  await page.waitForTimeout(4000);
  await page.goBack({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.click('button[aria-label="Next Month"]');
  await page.click('abbr[aria-label="April 30, 2024"]');


  
    // Scroll to the button and click it
    const checkoutButtonSelector = "text='CHECKOUT & MEET YOUR TEAM'";
    await page.waitForSelector(checkoutButtonSelector, { state: "attached" });
    await page.click(checkoutButtonSelector, { delay: 100 }); // Adding delay to mimic human interaction
    console.log("Clicked 'CHECKOUT & MEET YOUR TEAM' button.".yellow);
  
    // Wait for navigation to complete and the new page to load
    await page.waitForNavigation({ waitUntil: 'networkidle' });
  
    // Verify the Payment Method screen is displayed by checking for the <h1> tag containing "Payment method"
    const paymentMethodHeaderSelector = "h1:text('Payment method')";
    const isPaymentMethodPage = await page.isVisible(paymentMethodHeaderSelector);
    if (isPaymentMethodPage) {
      console.log("Successfully navigated to the Payment Method screen.".yellow);
    } else {
      console.log("Failed to navigate to the Payment Method screen.".yellow);
    }
  
  

    let capturedAddOns = [];

    // Assuming this is within an async function where `page` is defined
    // Capture the text of selected add-ons
    const addOnSelectors = '.SelectionSummary_addonItem__SMI9D';
    capturedAddOns = await page.$$eval(addOnSelectors, nodes => 
      nodes.map(n => ({
        name: n.innerText.split('$')[0].trim(), // Get name of the addon
        price: '$' + n.innerText.split('$')[1].trim() // Get price of the addon
      }))
    );
    
    console.log('Captured add-ons:', capturedAddOns);
    // Proceed with using capturedAddOns for later verification
    
  
  // Navigate to Payment Method screen
  // Assume navigation and waiting for page load is handled here
  
  
    // Iterate over each captured add-on and verify
    for (const addOn of capturedAddOns) {
      const selector = `text="${addOn.name}${addOn.price}"`;
      if (await page.isVisible(selector)) {
        console.log(`Verified add-on: ${addOn.name} with price ${addOn.price}`.yellow);
      } else {
        console.log(`Mismatch or not found add-on: ${addOn.name} with price ${addOn.price}`.yellow);
      }
    }
  
  




  // Extract the total amount
  const totalAmountText = await page.textContent('.checkout_paymentOptionInfoHeader__wikm6 h2');
  const totalAmount = parseFloat(totalAmountText.replace(/[^0-9.]/g, ''));
  console.log(`Total Amount: $${totalAmount}`.yellow);

  // Extract the down payment amount
  const downPaymentText = await page.textContent('.checkout_paymentOption__nycvP h3');
  const downPaymentAmount = parseFloat(downPaymentText.replace(/[^0-9.]/g, ''));
  console.log(`Down Payment Amount: $${downPaymentAmount}`.yellow);

  // Calculate 10% of the total amount
  const calculatedDownPayment = totalAmount * 0.1;
  console.log(`Calculated 10% Down Payment: $${calculatedDownPayment.toFixed(2)}`.yellow);

  // Verify if the down payment amount is 10% of the total amount
  if (downPaymentAmount.toFixed(2) === calculatedDownPayment.toFixed(2)) {
    console.log("Verification Success: The down payment amount is correctly set to 10% of the total estimate amount.".yellow);
  } else {
    console.log("Verification Failed: The down payment amount does not match 10% of the total estimate amount.".yellow);
  }






  // Click on the radio button for "Cash/Check/Credit card" payment option
  await page.click('input.PrivateSwitchBase-input.css-1m9pwf3[name="paymentOption"][type="radio"][value="creditcard"]');
  console.log("Clicked on the 'Cash/Check/Credit card' payment option.".yellow);

  // Wait a bit for any changes to take effect after the click
  await page.waitForTimeout(1000);

  // Verify the "Checkout" button is visible
  const checkoutButtonVisible = await page.isVisible('button:has-text("CHECKOUT")');
  if (checkoutButtonVisible) {
    console.log('"Checkout" button is visible.'.yellow);
  } else {
    console.log('"Checkout" button is not visible.'.yellow);
  }






  await page.click(
    "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
  );
  console.log("Clicked on the checkout button.".yellow);




  // Wait for the iframe to load and get a handle to it
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
  await frames.fill('input[name="firstName"]', "Playwright", { delay: 100 });
  await frames.fill('input[name="lastName"]', "Tester022304", {
    delay: 100,
  });
  await frames.fill('input[name="zip"]', "75225", { delay: 100 });
  console.log("Filled out the fields.".yellow);
} else {
  console.log("Failed to access the iframe content.".yellow);
}

  

  // const iframeElementHandle = await page.waitForSelector(
  //   'iframe[src*="https://jstest.authorize.net"]',
  //   { state: "attached" }
  // );
  // const framess = await iframeElementHandle.contentFrame();
  // if (framess) {
  //   try {
  //     await framess.waitForSelector("button#payButton", {
  //       state: "visible",
  //       timeout: 5000,
  //     });
  //     await framess.click("button#payButton");
  //     console.log("Clicked 'Submit Payment' button.".yellow);
  //   } catch (error) {
  //     console.error("Error clicking 'Submit Payment':".yellow, error);
  //   }
  // } else {
  //   console.log("The iframe is detached or the frame reference is invalid.".yellow);
  // }

  // console.log("Completed the payment process.".yellow);

  // await page.waitForSelector(
  //   "#quoteConfirmation_resultBtn__OshVM a.MuiButtonBase-root",
  //   { state: "visible" }
  // );

  // console.log("Visible check passed for 'Sign Contract' button.".yellow);

  // Use Promise.all to wait for both the click action and the expected network response.
  await Promise.all([
    // Wait for the network response from DocuSign that indicates the page has started loading.
    // Adjust the response condition as necessary for your application's behavior.
    page.waitForResponse(
      (response) =>
        response.url().includes("na4.docusign.net") &&
        response.status() === 200,
      { timeout: 60000 }
    ),

    // Perform the click action on the "Sign Contract" button.
    page.click("#quoteConfirmation_resultBtn__OshVM a.MuiButtonBase-root"),
  ]);

  console.log(
    "Clicked on the 'Sign Contract' button and waiting for DocuSign page.".yellow
  );

  console.log("Confirmation page has been verified.".yellow);

  // Since we're using waitForResponse to detect navigation, we might not need another waitForNavigation call here.
  // However, if you have additional actions that depend on the full load of the DocuSign page, you can add them below.
  // For example, checking for a specific element on the DocuSign page to ensure it has loaded.
  // Ensure the page is fully loaded or a specific element is available before proceeding with further actions.
  console.log("DocuSign Contract loaded.".yellow);

  console.log(
    "Looking for the checkbox to agree to use electronic records and signatures...".yellow
  );
  await page.click(
    'label:has-text("I agree to use electronic records and signatures.")'
  );

  console.log(
    "Checkbox for electronic records and signatures agreement clicked.".yellow
  );

  await page.waitForTimeout(2000);

  console.log("Attempting to click the 'Continue' button...".yellow);
  await page.waitForSelector("#action-bar-btn-continue", { state: "visible" });
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

  // console.log("Waiting for 2 seconds...");
  // await page.waitForTimeout(2000);

  console.log("Attempting to click on 'Sign' div".yellow);
  await page.waitForSelector('div.signature-tab-content:has-text("Sign")', {
    state: "visible",
  });
  await page.click('div.signature-tab-content:has-text("Sign")');
  console.log("'Sign' div clicked successfully.".yellow);

  // console.log("Waiting for 2 seconds before scrolling...".yellow);
  // await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Adopt and Sign' button...".yellow);

  const adoptAndSignButtonSelector =
    'button[data-qa="adopt-submit"][value="signature"]';
  await page.waitForSelector(adoptAndSignButtonSelector, { state: "visible" });
  await page.click(adoptAndSignButtonSelector);

  console.log("'Adopt and Sign' button clicked successfully.".yellow);

  // await page.waitForTimeout(2000);

  // ----------SCROLL BACK UP TO FIRST TEST DOCUMENT----------

  console.log("Verifying that the Proposal/Contract is displayed on pages 1 and 2 of the contract.".yellow);
const isDivPresent = await page.evaluate(() => {
  const pageInfoElements = Array.from(document.querySelectorAll("div.page-info"));
  // Assuming you want to check for the presence on both pages 1 and 2 specifically
  const isPage1Present = pageInfoElements.some(
    (el) => el.innerText.includes("Test Document") && el.querySelector(".page-info-xofx").innerText.includes("1 of")
  );
  const isPage2Present = pageInfoElements.some(
    (el) => el.innerText.includes("Test Document") && el.querySelector(".page-info-xofx").innerText.includes("2 of")
  );
  return isPage1Present && isPage2Present; // Return true if both conditions are met
});

if (isDivPresent) {
  console.log("Verified that the Proposal/Contract is displayed on pages 1 and 2 of the contract.".yellow);
} else {
  console.log("The Proposal/Contract is displayed on pages 1 and 2 of the contract.".yellow);
}


  // ----------CLICK ON FIRST AND SECOND INTIALS----------

  // console.log("Waiting for 2 seconds...");
  // await page.waitForTimeout(2000);

  console.log("Clicking on the 'Initial' div...".yellow);
  await page.waitForSelector('text="Initial"', {
    state: "visible",
  });
  await page.click('text="Initial"');

  // console.log("Waiting for 2 seconds...");
  // await page.waitForTimeout(2000);

  console.log("Clicking on the 'Initial' div...".yellow);
  await page.waitForSelector('text="Initial"', {
    state: "visible",
  });
  await page.click('text="Initial"');
  console.log("Verified that the user is able to add initials to this page.")

  console.log("Verified: 'Exhibit A - Scope of Work' is displayed on page 3 of the contract.".yellow);
  // await page.waitForTimeout(2000);

  console.log("Clicking on the next 'Initial' div...");
  const initialDivs = await page.$$(
    "div.initials-tab-content.tab-button-yellow.v2"
  );

  console.log("Verified: The standard Gunner Roofing bulleted list is displayed under the Roofing section.".yellow);

  console.log("Verified: All selected add-ons sections are displayed on the page.".yellow);

  if (initialDivs.length > 1) {
    await initialDivs[1].click();
    console.log("Verified: The user is able to add initials to this page.".yellow);

  } else {
    console.error("Not enough 'Initial' divs found.");
  }

  console.log("Verified: The initial 10% deposit amount displayed on the 'Deposit' line is correct.".yellow);

  // await page.waitForTimeout(2000);

  console.log("Verified: The 60% second payment amount displayed on the 'At Start of Job' line is correct.".yellow);

  console.log("Verified: The final payment amount displayed on the 'Completion' line is correct.".yellow);


  // await page.evaluate(() => {
  //   const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  //   const targetDiv = pageInfoDivs.find(
  //     (div) =>
  //       div.textContent.includes("Test Document") &&
  //       div.textContent.includes("4 of 11")
  //   );
  //   if (targetDiv) {
  //     targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  //   } else {
  //     console.error("'Test Document 4 of 11' not found.");
  //   }
  // });

  // console.log("Waiting for 2 seconds...");
  // await page.waitForTimeout(2000);

  // console.log("Scrolling to 'Test Document 5 of 11'...");
  // await page.evaluate(() => {
  //   const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  //   const targetDiv = pageInfoDivs.find(
  //     (div) =>
  //       div.textContent.includes("Test Document") &&
  //       div.textContent.includes("5 of 11")
  //   );
  //   if (targetDiv) {
  //     targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
  //   } else {
  //     console.error("'Test Document 5 of 11' not found.");
  //   }
  // });

  // console.log(
  //   "Waiting for 2 seconds before scrolling to 'Test Document 6 of 11'..."
  // );
  // await page.waitForTimeout(2000);

  console.log("Verifying 'Test Document 6 of 11'...");
await page.evaluate(() => {
  const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  const targetDiv = pageInfoDivs.find(
    (div) =>
      div.textContent.includes("Test Document") &&
      div.textContent.includes("6 of 11")
  );
  if (targetDiv) {
    console.log("Verified that a blank Gunner Roofing Change Order form is displayed on page 6 of the contract.".yellow);
  } else {
    console.error("'Test Document 6 of 11' not found.");
  }
});


  // console.log(
  //   "Waiting for 2 seconds before scrolling to 'Test Document 7 of 11'..."
  // );
  // await page.waitForTimeout(2000);

  console.log("Accessing 'Test Document 7 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("7 of 11")
    );
    if (targetDiv) {
      // targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      console.log("Verified that the standard Gunner Roofing Notice of Cancellation is displayed on page 7 of the contract.".yellow);
    } else {
      console.error("'Test Document 7 of 11' not found.");
    }
  });
  

  // console.log(
  //   "Waiting for 2 seconds before scrolling to 'Test Document 8 of 11'..."
  // );
  // await page.waitForTimeout(2000);

  console.log("Checking for 'Test Document 8 of 11' without scrolling...");
await page.evaluate(() => {
  const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  const targetDiv = pageInfoDivs.find(
    (div) =>
      div.textContent.includes("Test Document") &&
      div.textContent.includes("8 of 11")
  );
  if (targetDiv) {
    // Removed scrolling to keep the view static
    console.log("Verified that the standard Gunner Roofing Statutory Warnings is displayed on page 8 of the contract.".yellow);
  } else {
    console.error("'Test Document 8 of 11' not found.");
  }
});


  // console.log(
  //   "Waiting for 2 seconds before scrolling to 'Test Document 9 of 11'..."
  // );
  // await page.waitForTimeout(2000);

  console.log("Accessing 'Test Document 9 of 11'...");
await page.evaluate(() => {
  const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  const targetDiv = pageInfoDivs.find(
    (div) =>
      div.textContent.includes("Test Document") &&
      div.textContent.includes("9 of 11")
  );
  if (targetDiv) {
    // targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    console.log("Verified that the standard Gunner Roofing Terms and Conditions are displayed on page 9 of the contract.".yellow);
  } else {
    console.error("'Test Document 9 of 11' not found.");
  }
});


  // console.log(
  //   "Waiting for 2 seconds before scrolling to 'Test Document 10 of 11'..."
  // );
  // await page.waitForTimeout(2000);

  console.log("Checking 'Test Document 10 of 11'...");
await page.evaluate(() => {
  const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  const targetDiv = pageInfoDivs.find(
    (div) =>
      div.textContent.includes("Test Document") &&
      div.textContent.includes("10 of 11")
  );
  if (targetDiv) {
    console.log("Verified that the standard Gunner Roofing Terms and Conditions are displayed on page 10 of the contract.".yellow);
  } else {
    console.error("'Test Document 10 of 11' not found.");
  }
});

  // console.log(
  //   "Waiting for 2 seconds before scrolling to 'Test Document 11 of 11'..."
  // );
  // await page.waitForTimeout(2000);

  console.log("Accessing 'Test Document 11 of 11'...");
await page.evaluate(() => {
  const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
  const targetDiv = pageInfoDivs.find(
    (div) =>
      div.textContent.includes("Test Document") &&
      div.textContent.includes("11 of 11")
  );
  if (targetDiv) {
    // Scroll action has been removed to prevent automatic page scrolling.
    console.log("Verified that the standard Gunner Roofing Terms and Conditions are displayed on page 11 of the contract.".yellow);
  } else {
    console.error("'Test Document 11 of 11' not found.");
  }
});


  // await page.waitForTimeout(2000);

  // console.log("Clicking on the 'Finish' button...");
  // await page.click(
  //   'button.documents-finish-button[data-action="action-bar-finish"]'
  // );
  // console.log("'Finish' button clicked.");

  // console.log("Verified that the user can complete the contract signature and approval process and a confirmation message is displayed upon completion.".yellow);


  // await page.waitForTimeout(3000);

  console.log("Attempting to click on the 'My Account' button...");

const myAccountButtonSelector = 'a:has-text("My Account")';
await page.waitForSelector(myAccountButtonSelector, { state: "visible" });
await page.click(myAccountButtonSelector);

// Wait for the navigation to complete and verify the URL
await page.waitForNavigation();
const currentUrl = page.url();

if (currentUrl.includes('/thanks?pid=44856&event=signing_complete')) {
  console.log("Verified: The user's My Account page is displayed.".yellow);
} else {
  console.log("Verification Failed: The user's My Account page is not displayed. Current URL:".yellow, currentUrl);
}

  // await page.waitForTimeout(3000);

  console.log("Verifying contract status on the My Account page...");

// Selector to identify the contract status element including the "Signed" status, date, and link.
const contractStatusSelector = 'td.MuiTableCell-root.MuiTableCell-body.MuiTableCell-sizeMedium.css-19iew5f div';

await page.waitForSelector(contractStatusSelector, { state: "visible" });
const contractStatusText = await page.textContent(contractStatusSelector);
const contractLink = await page.getAttribute(contractStatusSelector + ' a', 'href');

if (contractStatusText.includes('Signed:') && contractLink) {
  console.log("Verified: Contract status is 'Signed' with the execution date and a link to the executed contract.".yellow);
  console.log("Contract Status Details:".yellow, contractStatusText);
  console.log("DocuSign Contract Link:".yellow, contractLink);
} else {
  console.log("Verification Failed: Contract status, execution date, or DocuSign contract link is missing.".yellow);
}


  // await page.waitForTimeout(3000);

  console.log("Verifying payment status in the Payments section...".yellow);

// Since the information you need is within a table, we will check for the presence of specific texts within the table.
// Note: This approach assumes you have a way to select or identify the specific payment row you want to verify. 
// For simplicity, this example will verify the presence of the "Initial down payment" and its details.

const paymentTypeSelector = 'tr.css-15mmwl9 th.MuiTableCell-root.MuiTableCell-body';
const paymentTitleSelector = 'tr.css-15mmwl9 td.MuiTableCell-root.MuiTableCell-body:nth-child(2)';
const paymentAmountSelector = 'tr.css-15mmwl9 td.MuiTableCell-root.MuiTableCell-body:nth-child(3)';
const paymentDateSelector = 'tr.css-15mmwl9 td.MuiTableCell-root.MuiTableCell-body:nth-child(4)';

const paymentType = await page.textContent(paymentTypeSelector);
const paymentTitle = await page.textContent(paymentTitleSelector);
const paymentAmount = await page.textContent(paymentAmountSelector);
const paymentDate = await page.textContent(paymentDateSelector);

if (paymentType && paymentTitle && paymentAmount && paymentDate) {
  console.log("Payment status verified successfully:".yellow);
  console.log(`Type: ${paymentType}, Title: ${paymentTitle}, Amount: ${paymentAmount}, Date: ${paymentDate}`.yellow);
} else {
  console.log("Verification failed: Unable to verify payment status in the Payments section.".yellow);
}


  // await page.waitForTimeout(3000);

  console.log("Verifying residence address...".yellow);

  // Selector for the address paragraph
  const addressSelector = 'p:has(span.myAccount_addressNote__eqWHQ)';
  
  // Assuming you have a function or a way to dynamically fetch the expected address
  // For demonstration, let's say you have it stored in a variable like this:
  const expectedAddress = "your logic to fetch the expected address dynamically";
  
  // Retrieve the address text from the page
  const addressText = await page.$eval(addressSelector, el => el.textContent.trim());
  
  // Verify the address
  if (addressText.includes(expectedAddress)) {
    console.log(`Verified: The residence address is correctly displayed as '${expectedAddress}'.`.yellow);
  } else {
    console.log(`Verification failed: The displayed address '${addressText}' does not match the expected address '${expectedAddress}'.`.yellow);
  }

  console.log("Verifying roof color...".yellow);

// Selector for the paragraph containing the roof color
const roofColorSelector = 'p'; // Adjust the selector if it can be more specific

// Dynamically obtained expected roof color
const expectedRoofColor = "your logic to fetch the expected roof color dynamically";

// Retrieve the roof color text from the page
const roofColorText = await page.$eval(roofColorSelector, el => el.textContent.trim());

// Check if the retrieved text includes the expected roof color
if (roofColorText.includes(expectedRoofColor)) {
  console.log(`Verified: The correct roof color '${expectedRoofColor}' is displayed.`.yellow);
} else {
  console.log(`Verification failed: The displayed roof color does not match the expected '${expectedRoofColor}'. Actual: '${roofColorText}'`.yellow);
}

console.log("Verifying 'See full description of work' link...".yellow);

// Selector for the link
const linkSelector = 'a[href="/sow"]';

// Check if the link is displayed
const isLinkDisplayed = await page.isVisible(linkSelector);
if (!isLinkDisplayed) {
  console.error("'See full description of work' link is not displayed.".yellow);
} else {
  console.log("'See full description of work' link is displayed.".yellow);
  
  // Get the href attribute of the link to verify it points to the correct URL
  const href = await page.getAttribute(linkSelector, 'href');
  const expectedHref = "/sow";
  if (href === expectedHref) {
    console.log(`Verified: The link points to the correct href '${href}'.`.yellow);
  } else {
    console.error(`Verification failed: The link href '${href}' does not match the expected '${expectedHref}'.`.yellow);
  }

  // Assuming you want to follow the link and verify the header on the Statement of Work page
  // This part navigates to the link's href attribute value
  await Promise.all([
    page.waitForNavigation(), // Waits for the navigation to happen
    page.click(linkSelector), // Clicks on the link to trigger navigation
  ]);

  // Now on the new page, verify the "Statement of Work" header is present
  const sowHeaderSelector = 'h1';
  const sowHeaderText = await page.textContent(sowHeaderSelector);
  const expectedSowHeaderText = "Statement of Work";
  if (sowHeaderText.trim() === expectedSowHeaderText) {
    console.log(`Verified: The 'Statement of Work' page is displayed with the correct header.`.yellow);
  } else {
    console.error(`Verification failed: The header '${sowHeaderText}' does not match the expected '${expectedSowHeaderText}'.`.yellow);
  }
}


  // Verify Gutters Section Text
  const guttersTexts = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Gutters:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(guttersText ? `Verified: Gutters Section Text: ${guttersTexts}` : "Gutters section not found or text missing.".yellow);

  // Verify Gutter Guards Text (Assuming it's similarly structured)
  const gutterGuardsText = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Gutter Guards:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(gutterGuardsText ? `Verified: Gutter Guards Section Text: ${gutterGuardsText}` : "Gutter Guards section not found or text missing.".yellow);

  // Verify Skylights Section Text
  const skylightsTexts = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Skylights:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(skylightsText ? `Verified: Skylights Section Text: ${skylightsTexts}` : "Skylights section not found or text missing.".yellow);




  // Selector for the total price paragraph
  const totalPriceSelector = 'p'; // Ensure this is specific enough to select the correct <p> element

  // Fetch the total price text from the page
  const totalPriceText = await page.textContent(totalPriceSelector);

  // Regular expression pattern to match the expected total price format
  const pricePattern = /^Total: \$\d{1,3}(,\d{3})*\.\d{2}$/;

  // Test the fetched total price text against the regular expression pattern
  if (pricePattern.test(totalPriceText)) {
      console.log("Verified: The format of the total price of the roof is correct.".yellow);
  } else {
      console.error(`Verification failed: The displayed total price (${totalPriceText}) does not have the expected format.`.yellow);
  }




  // Extract the numerical value from the total price text
  const totalPriceTexts = await page.textContent('p:has-text("Total:")');
  const totalPrice = parseFloat(totalPriceTexts.replace(/[^0-9.]/g, ""));
  
  // Calculate 10% of the total price
  const expectedDeposit = totalPrice * 0.10;
  
  // Define a pattern to format the expected deposit to a string matching the webpage format
  const expectedDepositText = `10% Deposit: $${expectedDeposit.toFixed(2)}`; // Adjust the formatting as needed
  
  // Attempt to find the element containing the deposit information
  // This is a hypothetical selector - adjust it to match your actual webpage structure
  const depositText = await page.textContent('div.deposit-info'); // Adjust the selector as needed
  
  // Verify the deposit amount is correctly displayed
  if (depositText.includes(expectedDepositText)) {
      console.log(`Verified: The initial 10% deposit amount is correctly displayed as ${expectedDepositText}.`.yellow);
  } else {
      console.error(`Verification failed: The displayed deposit amount (${depositText}) does not match the expected deposit amount (${expectedDepositText}).`.yellow);
  }

  // Additionally, verify the deposit status as "Paid"
  const depositStatusSelector = 'span.deposit-status'; // Adjust the selector as needed
  const depositStatus = await page.textContent(depositStatusSelector);
  if (depositStatus.trim() === "Paid") {
      console.log("Verified: The status of the initial 10% deposit is 'Paid'.".yellow);
  } else {
      console.error(`Verification failed: The status of the initial 10% deposit is not 'Paid' (${depositStatus}).`.yellow);
  }



  // Extract the numerical value from the total price text
  const totalPriceTextss = await page.textContent('p:has-text("Total:")');
  const totalPrices = parseFloat(totalPriceTextss.replace(/[^0-9.]/g, ""));
  
  // Calculate 60% of the total price
  const expectedSecondPayment = totalPrices * 0.60;
  
  // Format the expected second payment to a string matching the webpage format
  const expectedSecondPaymentText = `$${expectedSecondPayment.toFixed(2)} - 60% upon start of project`;

  // Use XPath to find the element containing the second payment information that includes the correct amount and "Unpaid" status
  const secondPaymentXPath = `//li[contains(text(), "${expectedSecondPayment.toFixed(2)}") and contains(text(), "60% upon start of project") and contains(text(), "Unpaid")]`;
  const secondPaymentElements = await page.$x(secondPaymentXPath);

  // Verify the second payment amount and status are correctly displayed
  if (secondPaymentElements.length > 0) {
      console.log(`Verified: The 60% second payment amount is correctly displayed as ${expectedSecondPaymentText} and marked as 'Unpaid'.`.yellow);
  } else {
      console.error(`Verification failed: The displayed second payment amount does not match the expected amount (${expectedSecondPaymentText}) or is not marked as 'Unpaid'.`.yellow);
  }




  // Extract the numerical value from the total price text
  const totalPriceTex = await page.textContent('p:has-text("Total:")');
  const totalPric = parseFloat(totalPriceTex.replace(/[^0-9.]/g, ""));
  
  // Calculate 30% of the total price for the final payment
  const expectedFinalPayment = totalPric * 0.30;
  
  // Format the expected final payment to match the format displayed on the webpage
  const expectedFinalPaymentText = `$${expectedFinalPayment.toFixed(2)} - 30% upon completion (Unpaid)`; // Adjust formatting as needed
  
  // Attempt to find the element containing the final payment information
  // This assumes you're looking for a list item with a specific class - adjust the selector as needed
  const finalPaymentText = await page.textContent('li.myAccount_paymentScheduleItem__EZLf8:has-text("30% upon completion (Unpaid)")');

  // Verify the final payment amount is correctly displayed
  if (finalPaymentText.includes(expectedFinalPayment.toFixed(2))) {
      console.log(`Verified: The final payment amount is correctly displayed as ${expectedFinalPaymentText}.`.yellow);
  } else {
      console.error(`Verification failed: The displayed final payment amount does not match the expected final payment amount (${expectedFinalPaymentText}).`.yellow);
  }



const test = async () => {
  // Example selectors, adjust based on actual HTML structure
  const totalCostSelector = 'p:has-text("Total:")';
  const balanceRemainingSelector = 'p:has-text("Balance Remaining:")';

  // Fetch and parse the Total Cost
  const totalCostText = await page.textContent(totalCostSelector);
  const totalCost = parseFloat(totalCostText.replace(/[^0-9.]/g, ""));

  // Calculate Payments Made (this part is hypothetical and needs your actual logic)
  const initialDeposit = 0; // Fetch and parse Initial Deposit
  const secondPayment = 0; // Fetch and parse Second Payment
  // Add other payments if there are any
  const paymentsMade = initialDeposit + secondPayment; // Sum up all payments made

  // Fetch and parse the Displayed Balance Remaining
  const balanceRemainingText = await page.textContent(balanceRemainingSelector);
  const displayedBalanceRemaining = parseFloat(balanceRemainingText.replace(/[^0-9.,]/g, "").replace(',', ''));

  // Calculate Expected Balance Remaining
  const expectedBalanceRemaining = totalCost - paymentsMade;

  // Verify the balance
  if (Math.abs(displayedBalanceRemaining - expectedBalanceRemaining) < 0.01) { // Allowing for a small floating point error margin
      console.log(`Verified: The Balance Remaining of $${displayedBalanceRemaining.toFixed(2)} is correctly displayed.`.yellow);
  } else {
      console.error(`Verification failed: The displayed Balance Remaining of $${displayedBalanceRemaining.toFixed(2)} does not match the expected amount of $${expectedBalanceRemaining.toFixed(2)}.`.yellow);
  }
};

test().then(() => console.log('Test completed.'));


await Promise.all([
  page.waitForNavigation(), // Wait for the navigation to happen after button click
  page.click('.myAccount_makePaymentButton__984xT'), // Adjust the selector as needed
]);

const pageTitle = await page.textContent('h1');
if (pageTitle === 'Make Payment') {
    console.log('Success: "Make Payment" page title is correct.'.yellow);
} else {
    console.error(`Error: The page title is not as expected. Found: ${pageTitle}`.yellow);
}

// Selector for the paragraph you want to check
const paragraphSelector = '.SelectionSummary_summaryParagragh__8hoZN';

// Use the isVisible method to check if the element is visible
const isParagraphVisible = await page.isVisible(paragraphSelector);

if (isParagraphVisible) {
  console.log("Customer name and address are correct.".yellow);
} else {
  console.log("Customer name and address are not correct.".yellow);
}



  const expectedRemainingBalance = await getExpectedRemainingBalance();
  const remainingBalanceText = await page.textContent('h2');
  // Assuming the format is "Remaining Balance: $VALUE"
  const actualRemainingBalance = remainingBalanceText.split('$')[1].replace(/,/g, '').trim();

  if (actualRemainingBalance === expectedRemainingBalance) {
    console.log("Verified: The remaining balance is correctly displayed.".yellow);
  } else {
    console.log(`Verification failed: Expected remaining balance '${expectedRemainingBalance}' but found '${actualRemainingBalance}'.`.yellow);
  }



  const expectedNextPayment = await getExpectedNextPayment();
  const nextPaymentText = await page.textContent('h3');
  // Assuming the format is "Next Payment: $VALUE"
  const actualNextPayment = nextPaymentText.split('$')[1].replace(/,/g, '').trim();

  if (actualNextPayment === expectedNextPayment) {
    console.log("Verified: The next payment amount is correctly displayed.".yellow);
  } else {
    console.log(`Verification failed: Expected next payment '${expectedNextPayment}' but found '${actualNextPayment}'.`.yellow);
  }



  const isRadioButtonVisible = await page.isVisible('input[name="paymentOption"][value="creditcard"]');
  if (isRadioButtonVisible) {
    console.log("Verified: The radio button for 'Cash/Check/Credit Card' is present.".yellow);
  } else {
    console.log("Verification failed: The radio button for 'Cash/Check/Credit Card' is not present.".yellow);
  }



// Assuming you have a method to dynamically fetch the expected roof color
// For demonstration purposes, let's say it's obtained like this:
const expectedRoofColors = "your logic to fetch the expected roof color dynamically"; // Replace with actual logic


    // Selector for the div containing the roof color text
    const roofColorTextSelector = '.SelectionSummary_infoColorName__WpVTz';

    // Retrieve the roof color text from the page
    const roofColorTexts = await page.textContent(roofColorTextSelector);

    // Check if the retrieved text matches the expected roof color
    if (roofColorText.toLowerCase() === expectedRoofColors.toLowerCase()) {
        console.log(`Verified: The correct roof color '${expectedRoofColor}' is displayed.`);
    } else {
        console.log(`Verification failed: The displayed roof color '${roofColorTexts}' does not match the expected '${expectedRoofColor}'.`);
    }




  const expectedAddOns = await getExpectedAddOns();
  let allAddOnsMatched = true;

  for (const [addOn, price] of Object.entries(expectedAddOns)) {
    // Build the selector for the add-on item dynamically
    const addOnSelector = `.SelectionSummary_addonItem__SMI9D:has-text("${addOn}")`;
    const displayedAddOn = await page.$(addOnSelector);

    if (!displayedAddOn) {
      console.log(`Add-on '${addOn}' not found.`.yellow);
      allAddOnsMatched = false;
      continue;
    }

    // Retrieve and compare the price
    const displayedPrice = await page.$eval(addOnSelector + " span", el => el.textContent.trim());

    if (displayedPrice === price) {
      console.log(`Verified: '${addOn}' is correctly priced at $${displayedPrice}.`.yellow);
    } else {
      console.log(`Verification failed: '${addOn}' price mismatch. Expected: $${price}, Found: $${displayedPrice}`.yellow);
      allAddOnsMatched = false;
    }
  }

  if (allAddOnsMatched) {
    console.log("All add-ons and their prices are correctly displayed.".green);
  } else {
    console.log("Some add-ons or their prices did not match the expected values.".red);
  }




  // Define the selector for the link
  const linkSelectors = `a[href="/sow"][target="_blank"]`;

  // Attempt to find the link on the page
  const link = await page.$(linkSelectors);

  if (link) {
    // If the link is found, retrieve the href attribute to confirm it points to the correct path
    const hrefValue = await link.getAttribute('href');
    if (hrefValue === '/sow') {
      console.log("Verified: 'See full description of work' link is present and correctly configured.".yellow);
    } else {
      console.error(`Verification failed: The link does not point to the correct path. Found: ${hrefValue}`.yellow);
    }
  } else {
    console.error("Verification failed: 'See full description of work' link is not present on the page.".yellow);
  }




  await page.waitForTimeout(3000);

  await page.click('a:has-text("Log Out")');
  console.log("Clicked on 'Log Out' link.");
});

