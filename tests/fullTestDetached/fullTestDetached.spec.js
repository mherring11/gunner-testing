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
    console.log("Data fetched successfully:".yellow, response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data from sheet:", error);
    return [];
  }
}

test('Check "Your quote is ready!" email and login'.yellow, async ({ browser }) => {
  test.setTimeout(480000);
  const context = await browser.newContext();
  const page = await context.newPage();

  page.context().on("page", async (newPage) => {
    console.log("New page opened:".yelllow, newPage.url());
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

  await test.step("Checking for the presence of YOUR ONLINE QUOTE button", async () => {
    const yourOnlineQuoteButton = page.locator('img[alt="Your Online Quote"]');
    await expect(yourOnlineQuoteButton).toBeVisible();
    console.log("YOUR ONLINE QUOTE button is visible.".yellow);
  });

  await page.click('a:has(img[alt="Your Online Quote"])');

  await page.goto("https://accounts.google.com/Logout", {
    waitUntil: "networkidle",
  });
  await page.goto("https://estimatorstg.gunnerroofing.com/login");

  await test.step("Fill in login credentials", async () => {
    await page.waitForSelector("#mui-1", { state: "visible" });
    await page.fill("#mui-1", "gunnerplaywright+02273@gmail.com");
    const emailValue = await page.$eval("#mui-1", (el) => el.value);
    console.log(`Email Input Value: ${emailValue}`.yellow);

    await page.waitForSelector("#mui-2", { state: "visible" });
    await page.fill("#mui-2", "123PWtest!");
    const passwordValue = await page.$eval("#mui-2", (el) => el.value);
    console.log(`Password Input Value: ${passwordValue}`.yellow);
  });

  await test.step("Click SIGN IN and verify no error messages", async () => {
    await page.click('button:has-text("SIGN IN")');

    await page.waitForNavigation({ waitUntil: "networkidle" });

    const errorMessage = await page.$(".error-message");
    expect(errorMessage).toBeNull();

    console.log("No error messages detected upon logging in.");
  });

  console.log("Logged in, waiting for page actions.".yellow);

  await test.step("Ensure 'NO' button is clicked before starting the 3D model", async () => {
    // Selector for the NO button
    const noButtonSelector = 'button[value="NO"]';

    // Retrieve the aria-pressed attribute to check if the NO button is selected
    const isNoSelected = await page.getAttribute(
      noButtonSelector,
      "aria-pressed"
    );

    if (isNoSelected === "false") {
      // If NO button is not selected, click it
      await page.click(noButtonSelector);
      console.log("Clicked the NO button.");
    } else {
      console.log("NO button was already selected.");
    }

    // Wait or perform additional checks if necessary before proceeding
  });

  await test.step("Ensure gutter replacement opt-out is not selected", async () => {
    // Selector for the checkbox wrapper for better click targeting
    const gutterOptOutWrapperSelector = ".CustomOptOutWrapper";
    // Selector for the actual checkbox input (hidden in your case)
    const gutterCheckboxSelector = `${gutterOptOutWrapperSelector} input[type="checkbox"]`;

    // Check if the checkbox is checked
    const isChecked = await page.isChecked(gutterCheckboxSelector);

    if (isChecked) {
      // If it's checked, click the wrapper to uncheck
      await page.click(gutterOptOutWrapperSelector);
      console.log("Unchecked the 'Do not want to replace my gutters' option.");
    } else {
      console.log(
        "'Do not want to replace my gutters' option was already not selected."
      );
    }
  });

  await test.step("Reset 'Fixed' option value to 0", async () => {
    const fixedOptionSelector =
      'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';
    await page.waitForSelector(fixedOptionSelector, { state: "visible" });
    console.log("Ensuring the input for 'Fixed' option is visible.");
    await page.fill(fixedOptionSelector, "0");
    console.log("Reset the 'Fixed' option input value to 0.");
  });

  await test.step("Reset 'Solar-Powered Opening' input value to 0", async () => {
    const solarPoweredInputSelector =
      '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';
    await page.waitForSelector(solarPoweredInputSelector, { state: "visible" });
    console.log("Clicked on Solar-Powered Opening input.");
    await page.fill(solarPoweredInputSelector, "0");
    console.log("Reset the 'Solar-Powered Opening' input value to 0.");
  });

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

  await test.step("Verify address and square footage are listed", async () => {
    const addressElements = page.locator(".result_resultParagragh__B6pvF");
    await expect(addressElements).toHaveCount(2);
    console.log("Address is visible on the page.");

    const squareFootageElement = page.locator(".result_sqft__3XLeL");
    await expect(squareFootageElement).toBeVisible();
    console.log("Square footage is visible on the page.");
  });

  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/22e075e2-c51c-4821-9cb1-6c89045f7dd4/"]';
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
  console.log("3D visualization of home is successfully presented.");

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
    console.log(`Clicked on ${shingleColor} and verified highlighted red`);
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
        `Scrolled to 'Estimate Summary' section for ${shingleColor} and verified that the correct color sample and name appear`
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
    await smoothScroll(pageX, pageY, pageX + 100, pageY, 250);
    await smoothScroll(pageX + 100, pageY, pageX + 100, pageY + 100, 250);
    await smoothScroll(pageX + 100, pageY + 100, pageX, pageY + 100, 250);
    await smoothScroll(pageX, pageY + 100, pageX, pageY, 250);
    await page.mouse.up();
    console.log("Completed visualizer interaction verification.");
  } catch (error) {
    console.error("Error during visualizer interaction verification:", error);
  }

  await page.waitForTimeout(1000);
  console.log("Delay after completing visualizer interaction verification.");

  await test.step("Check if the additional structures div is present and displayed", async () => {
    // Selector for the div you're interested in
    const divSelector = "#result_detachedStructure__UPrzP";

    // Attempt to get the div element
    const div = await page.$(divSelector);

    // Assert that the div is not null (i.e., it exists in the DOM)
    expect(div).not.toBeNull();

    // Further, you might want to check if it's visible (rendered on the page and not hidden)
    const isVisible = await div.isVisible();
    expect(isVisible).toBeTruthy();

    // Log to console upon successful verification
    console.log("Additional structures section and cost is displayed.");
  });

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

  await test.step("Click the YES button and verify the total is updated correctly", async () => {
    // Ensure the YES button is visible and ready for interaction
    await page.waitForSelector('button[value="YES"][aria-pressed="false"]', {
      state: "visible",
    });

    await test.step("Click the YES button and verify the total is updated correctly", async () => {
      // Ensure the YES button is visible and ready for interaction
      await page.waitForSelector('button[value="YES"][aria-pressed="false"]', {
        state: "visible",
      });

      // Click the YES button
      await page.click('button[value="YES"][aria-pressed="false"]');

      // Verify the YES button's aria-pressed attribute changes to true, indicating it's now selected
      await expect(page.locator('button[value="YES"]')).toHaveAttribute(
        "aria-pressed",
        "true"
      );

      // Get the additional cost text, extract the numerical value
      const additionalCostText = await page.textContent(
        "span.result_addOnCost__T8ARR"
      );
      const additionalCost = parseFloat(
        additionalCostText.replace(/[^0-9.]/g, "")
      );
      console.log(`Additional cost: $${additionalCost}`);

      // Get the initial total cost text, extract the numerical value
      const initialTotalText = await page.textContent(
        "h3#result_totalEstimateAmount__rj09i"
      );
      const initialTotal = parseFloat(initialTotalText.replace(/[^0-9.]/g, ""));
      console.log(`Initial total: $${initialTotal}`);

      // Calculate the expected new total
      const expectedNewTotal = initialTotal + additionalCost;
      console.log(`Expected new total: $${expectedNewTotal}`);

      // Wait for any asynchronous updates (assuming there's some delay to update the total)
      // await page.waitForTimeout(2000); // Adjust timeout as necessary for your app

      // Get the updated total cost text, extract the numerical value
      const updatedTotalText = await page.textContent(
        "h3#result_totalEstimateAmount__rj09i"
      );
      const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
      console.log(`Updated total: $${updatedTotal}`);

      // Assert the updated total matches the expected new total
      expect(updatedTotal).toBeCloseTo(expectedNewTotal, 2); // Using toBeCloseTo for floating point comparison

      console.log(`Total has been correctly updated to: $${updatedTotal}`);
    });
  });

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
  await test.step("Opt out of gutter replacement", async () => {
    const gutterOptOutSelector = ".CustomOptOutWrapper svg"; // Adjust if necessary to match the actual selector
    await page.click(gutterOptOutSelector);
    console.log("Clicked: 'I do not want to replace my gutters at this time.' checkbox");
    await page.waitForTimeout(2000); // Wait a bit for the total to potentially update
  });
  

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

  await test.step("Note the default total price of the estimate", async () => {
    const totalEstimateText = await page.textContent(totalEstimateSelector);
    initialTotal = parseFloat(totalEstimateText.replace(/[^0-9.]/g, ""));
    console.log(`Initial total estimate: $${initialTotal}`);
  });

  // Opt-out of gutter replacement
  await test.step("Opt out of gutter replacement", async () => {
    const gutterOptOutSelector = ".CustomOptOutWrapper svg";
    await page.click(gutterOptOutSelector);
    console.log("I do not want to replace my gutters at this time.");
    await page.waitForTimeout(3000); // Wait for potential update
  });

  // Check the updated total estimate
  await test.step("Check updated total estimate after opting out", async () => {
    const updatedTotalText = await page.textContent(totalEstimateSelector);
    const updatedTotal = parseFloat(updatedTotalText.replace(/[^0-9.]/g, ""));
    console.log(`Updated total estimate after opting out: $${updatedTotal}`);
  });

  // Scroll to the "Gutters" heading
  // await test.step("Scroll to the 'Gutters' heading", async () => {
  //   const guttersHeadingSelectors = "h3:text('Gutters')";
  //   await page.locator(guttersHeadingSelectors).scrollIntoViewIfNeeded();
  //   console.log("Scrolled smoothly to the 'Gutters' heading successfully.");
  //   await page.waitForTimeout(2000);
  // });

  // Verify the gutter cost is reflected in the updated total estimate
  await test.step("Verify gutter cost reflected in updated total", async () => {
    const finalTotalText = await page.textContent(totalEstimateSelector);
    const finalTotal = parseFloat(finalTotalText.replace(/[^0-9.]/g, ""));
    console.log(`Final total estimate reflecting gutter cost: $${finalTotal}`);

    // Assuming `expect` is available in your testing environment (e.g., Jest, Playwright Test)
    // Verify the final total is as expected, adjust the expected value as necessary
    // This is a placeholder assertion; the expected value should be based on your specific requirements
    // expect(finalTotal).toBeCloseTo(expectedFinalTotal, 2);
  });

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
  await test.step("Note the initial total estimate", async () => {
    const totalEstimateSelector = "#result_totalEstimateAmount__rj09i";
    const totalEstimateText = await page.textContent(totalEstimateSelector);
    initialTotalEstimate = parseFloat(
      totalEstimateText.replace(/[^0-9.]/g, "")
    );
    console.log(`Initial total estimate: $${initialTotalEstimate}`);
  });

  // Define fixedOptionSelector at a scope accessible by all relevant steps
  const fixedOptionSelector =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

  // Update the "Fixed" option value to "1" and verify the updated total estimate
  await test.step("Update 'Fixed' option to 1 and verify total", async () => {
    await page.fill(fixedOptionSelector, "1");
    console.log("Set 'Fixed' option to 1.");
    await page.waitForTimeout(3000); // Wait for any potential calculations to complete

    // Verify the updated total estimate
    const updatedTotalEstimateAfterOne = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 1: $${updatedTotalEstimateAfterOne}`
    );
    // Assume using expect for verification
  });

  // Update the "Fixed" option value to "4" and verify the updated total estimate
  await test.step("Update 'Fixed' option to 4 and verify total", async () => {
    await page.fill(fixedOptionSelector, "4");
    console.log("Set 'Fixed' option to 4.");
    await page.waitForTimeout(3000); // Wait for any potential calculations to complete

    // Verify the updated total estimate
    const updatedTotalEstimateAfterFour = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 4: $${updatedTotalEstimateAfterFour}`
    );
  });

  let initialTotalEstimates = 0;
  let updatedTotalEstimate = 0;
  await test.step("Note the initial total estimate", async () => {
    const totalEstimateSelector = "#result_totalEstimateAmount__rj09i";
    const totalEstimateText = await page.textContent(totalEstimateSelector);
    initialTotalEstimates = parseFloat(
      totalEstimateText.replace(/[^0-9.]/g, "")
    );
    console.log(`Initial total estimate: $${initialTotalEstimates}`);
  });

  const fixedOptionSelectors =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

  await test.step("Update 'Fixed' option to 1 and verify total", async () => {
    await page.fill(fixedOptionSelectors, "1");
    console.log("Set 'Fixed' option to 1.");
    await page.waitForTimeout(3000); // Wait for any potential calculations to complete

    const updatedTotalEstimateAfterOne = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 1: $${updatedTotalEstimateAfterOne}`
    );
  });

  await test.step("Update 'Fixed' option to 4 and verify total", async () => {
    await page.fill(fixedOptionSelector, "4");
    console.log("Set 'Fixed' option to 4.");
    await page.waitForTimeout(3000); // Wait for any potential calculations to complete

    const updatedTotalEstimateAfterFour = parseFloat(
      (await page.textContent("#result_totalEstimateAmount__rj09i")).replace(
        /[^0-9.]/g,
        ""
      )
    );
    console.log(
      `Updated total estimate after setting 'Fixed' to 4: $${updatedTotalEstimateAfterFour}`
    );
  });

  const solarPoweredInputSelector = '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';

await test.step("Note the initial total estimate", async () => {
  const totalEstimateSelector = "#result_totalEstimateAmount__rj09i";
  let initialTotalEstimate = parseFloat((await page.textContent(totalEstimateSelector)).replace(/[^0-9.]/g, ""));
  console.log(`Initial total estimate: $${initialTotalEstimate}`);
});

await test.step("Update 'Solar-Powered Opening' option to 1 and verify total", async () => {
  await page.fill(solarPoweredInputSelector, "1");
  console.log("Set 'Solar-Powered Opening' option to 1.");
  await page.waitForTimeout(3000); // Wait for any potential calculations to complete
  
  let updatedTotalEstimate = parseFloat((await page.textContent("#result_totalEstimateAmount__rj09i")).replace(/[^0-9.]/g, ""));
  console.log(`Updated total estimate after setting 'Solar-Powered Opening' to 1: $${updatedTotalEstimate}`);
  // Here you might compare updatedTotalEstimate with an expected value using expect or another assertion
});

await test.step("Update 'Solar-Powered Opening' option to 4 and verify total", async () => {
  await page.fill(solarPoweredInputSelector, "4");
  console.log("Set 'Solar-Powered Opening' option to 4.");
  await page.waitForTimeout(3000); // Wait for update
  
  updatedTotalEstimate = parseFloat((await page.textContent("#result_totalEstimateAmount__rj09i")).replace(/[^0-9.]/g, ""));
  console.log(`Updated total estimate after setting 'Solar-Powered Opening' to 4: $${updatedTotalEstimate}`);
  // Again, compare updatedTotalEstimate with an expected value
});

async function clickThroughRoofingSteps(page) {
  const buttonSelectors = '#result_roofingLayers__kOCE6 button';
  
  // Fetch all buttons at once to get their texts
  const buttons = await page.$$(buttonSelectors);
  
  for (let i = 0; i < buttons.length; i++) {
    // Get the text of the button to log it
    const buttonText = await buttons[i].textContent();
    
    // Click on the button
    await buttons[i].click();
    console.log(`Clicked on button: ${buttonText.trim()}`);

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
      console.log("Clicked the close button.");
    } else {
      console.log("Close button with 'X' text not found.");
    }

    await page.waitForTimeout(500); // Ensure the dialog has time to close before proceeding
  }
}

await test.step("Click through roofing steps", async () => {
  await clickThroughRoofingSteps(page);
});


await test.step("Pick a start date", async () => {
  // Directly click the 'Next Month' button without scrolling to it
  console.log("Clicking on the 'Next Month' button...");
  await page.click('button[aria-label="Next Month"]');
  console.log("Clicked on the 'Next Month' button.");

  // Wait a bit for the calendar to update to the next month
  await page.waitForTimeout(1000);

  // Directly click on the specific date without scrolling to it
  await page.click('abbr[aria-label="April 30, 2024"]');
  console.log("Picked start date: April 30, 2024.");
});

await test.step("Verify shingle color in Quote summary", async () => {
  // Define the expected src attribute value based on the selected shingle color
  const expectedSrcValue = "/resultRoofingSystem/weatheredwood.png"; // Adjust based on the selected color

  // Retrieve the src attribute of the img element within the specified div
  const actualSrcValue = await page.getAttribute(".SelectionSummary_roofMaterialImg__cmNBo img", "src");

  // Log the expected and actual src values for verification
  console.log(`Expected shingle color src: ${expectedSrcValue}`);
  console.log(`Actual shingle color src: ${actualSrcValue}`);

  // Verify that the actual src matches the expected src
  if (actualSrcValue.includes(expectedSrcValue)) {
    console.log("The shingle color selected from the 3D visualization is correctly displayed in the sidebar of the Quote summary.");
  } else {
    console.log("The shingle color selected from the 3D visualization is NOT correctly displayed in the sidebar of the Quote summary.");
  }
});


await test.step("Verify selected add-ons dynamically in Quote summary", async () => {
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

  console.log("Dynamically fetched expected add-ons:", dynamicAddOns);

  // Fetch all the add-on items from the sidebar
  const sidebarAddOns = await page.$$eval(".SelectionSummary_addonItem__SMI9D", items =>
    items.map(item => ({
      name: item.textContent.replace(/\$\d+,\d+\.\d+/, "").trim(), // Remove the cost from the name
      cost: item.querySelector("span")?.textContent.trim() || ""
    }))
  );

  // Log the fetched sidebar add-on items for debugging
  console.log("Fetched sidebar add-on items:", sidebarAddOns);

  // Verify each dynamically fetched add-on is displayed with the correct cost in the sidebar
  let allMatch = true;
  for (const [name, cost] of Object.entries(dynamicAddOns)) {
    const item = sidebarAddOns.find(item => item.name === name && item.cost === cost);
    if (item) {
      console.log(`Verified: ${name} with cost ${cost} is correctly displayed in the sidebar.`);
    } else {
      console.log(`Mismatch found: ${name} with expected cost ${cost} was not found correctly in the sidebar.`);
      allMatch = false;
    }
  }

  // Overall verification result
  if (allMatch) {
    console.log("All dynamically defined add-ons are correctly displayed in the sidebar of the Quote summary with correct selections and costs.");
  } else {
    console.log("Some dynamically defined add-ons are not correctly displayed or have incorrect costs in the sidebar of the Quote summary.");
  }
});


await test.step("Verify dynamically selected start date in Quote summary", async () => {
  // Fetch the selected date text directly from the calendar
  const calendarDateSelector = ".result_calendarText__U70AZ";
  const selectedDateText = await page.textContent(calendarDateSelector);

  // Convert the selected date to the format used in the sidebar ('YYYY-MM-DD')
  const dateParts = selectedDateText.match(/(\w+), (\w+) (\d+), (\d+)/);
  if (!dateParts) {
    console.log("Error: Could not parse the selected date text.");
    return;
  }
  const [, , month, day, year] = dateParts;
  // Assuming you have a function to convert month name to month number
  const monthNumber = new Date(`${month} 1`).getMonth() + 1;
  const formattedSelectedDate = `${year}-${monthNumber.toString().padStart(2, '0')}-${day.padStart(2, '0')}`;

  // Fetch the displayed start date in the sidebar
  const dateDisplaySelector = ".SelectionSummary_infoSubTitle__1V8ku + .SelectionSummary_infoDesc__HZv40"; // Adjusted to select the sibling of the title element
  const displayedDate = await page.textContent(dateDisplaySelector);

  console.log("Formatted selected start date for comparison:", formattedSelectedDate);
  console.log("Displayed start date in the sidebar:", displayedDate.trim());

  // Verify they match
  if (displayedDate.trim() === formattedSelectedDate) {
    console.log(`Verified: The dynamically selected start date '${selectedDateText}' is correctly displayed in the sidebar as '${displayedDate.trim()}'.`);
  } else {
    console.log(`Mismatch found: The dynamically selected start date '${selectedDateText}' is not correctly displayed in the sidebar. Expected '${formattedSelectedDate}', but found '${displayedDate.trim()}'.`);
  }
});




await test.step("Navigate to 'See full description of work' and verify Statement of Work page", async () => {
  // Find the link using XPath within page.evaluate and navigate to its href
  const href = await page.evaluate(() => {
    const xpathResult = document.evaluate("//a[contains(text(), 'See full description of work')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    const link = xpathResult.singleNodeValue;
    return link ? link.href : null;
  });

  if (href) {
    await page.goto(href, { waitUntil: "networkidle" });
    console.log(`Navigated to ${href}`);
  } else {
    console.log("Link with 'See full description of work' text not found.");
    return; // Exit the step if the link was not found
  }

  // Verify the Statement of Work title
  const statementOfWorkTitle = await page.textContent('#sow_myAccountTitle__L_iaa h1');
  if (statementOfWorkTitle === 'Statement of Work') {
    console.log("Verified: 'Statement of Work' title is correctly displayed.");
  } else {
    console.log("Mismatch found: 'Statement of Work' title is not correctly displayed.");
  }

  // Optionally, verify the address dynamically, which will vary per customer
  const addressDisplayed = await page.textContent('#sow_myAccountTitle__L_iaa .sow_titleAddress__BeKaa');
  console.log(`Address displayed on Statement of Work page: '${addressDisplayed}'.`);
});




await test.step("Verify Gutters and Skylights sections dynamically with XPath via page.evaluate", async () => {
  // Verify Gutters Section Text
  const guttersText = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Gutters:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(guttersText ? `Gutters Section Text: ${guttersText}` : "Gutters section text not found.");

  // Verify Skylights Section Text
  const skylightsText = await page.evaluate(() => {
    const xpath = "//p[strong[contains(text(), 'Skylights:')]]";
    const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    return element ? element.textContent : null;
  });
  console.log(skylightsText ? `Skylights Section Text: ${skylightsText}` : "Skylights section text not found.");






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


  await test.step("Click on the 'CHECKOUT & MEET YOUR TEAM' button and verify navigation to the Payment Method screen", async () => {
    // Scroll to the button and click it
    const checkoutButtonSelector = "text='CHECKOUT & MEET YOUR TEAM'";
    await page.waitForSelector(checkoutButtonSelector, { state: "attached" });
    await page.click(checkoutButtonSelector, { delay: 100 }); // Adding delay to mimic human interaction
    console.log("Clicked 'CHECKOUT & MEET YOUR TEAM' button.");
  
    // Wait for navigation to complete and the new page to load
    await page.waitForNavigation({ waitUntil: 'networkidle' });
  
    // Verify the Payment Method screen is displayed by checking for the <h1> tag containing "Payment method"
    const paymentMethodHeaderSelector = "h1:text('Payment method')";
    const isPaymentMethodPage = await page.isVisible(paymentMethodHeaderSelector);
    if (isPaymentMethodPage) {
      console.log("Successfully navigated to the Payment Method screen.");
    } else {
      console.log("Failed to navigate to the Payment Method screen.");
    }
  });
  

  let capturedAddOns = [];  
  await test.step("Capture customized quote options", async () => {
    // Capture the text of selected add-ons
    const addOnSelectors = '.SelectionSummary_addonItem__SMI9D';
    const addOns = await page.$$eval(addOnSelectors, (nodes) =>
      nodes.map((n) => ({
        name: n.innerText.split('$')[0].trim(), // Get name of the addon
        price: '$' + n.innerText.split('$')[1].trim() // Get price of the addon
      }))
    );
  
    console.log('Captured add-ons:', addOns);
    return addOns; // Return the captured add-ons for later verification
  });
  
  // Navigate to Payment Method screen
  // Assume navigation and waiting for page load is handled here
  
  await test.step("Verify customized quote options on Payment Method screen", async (addOns) => {
    // Iterate over each captured add-on and verify
    for (const addOn of capturedAddOns) {
      const selector = `text="${addOn.name}${addOn.price}"`;
      if (await page.isVisible(selector)) {
        console.log(`Verified add-on: ${addOn.name} with price ${addOn.price}`);
      } else {
        console.log(`Mismatch or not found add-on: ${addOn.name} with price ${addOn.price}`);
      }
    }
  });
  


})
await test.step("Verify 10% down amount", async () => {
  // Extract the total amount
  const totalAmountText = await page.textContent('.checkout_paymentOptionInfoHeader__wikm6 h2');
  const totalAmount = parseFloat(totalAmountText.replace(/[^0-9.]/g, ''));
  console.log(`Total Amount: $${totalAmount}`);

  // Extract the down payment amount
  const downPaymentText = await page.textContent('.checkout_paymentOption__nycvP h3');
  const downPaymentAmount = parseFloat(downPaymentText.replace(/[^0-9.]/g, ''));
  console.log(`Down Payment Amount: $${downPaymentAmount}`);

  // Calculate 10% of the total amount
  const calculatedDownPayment = totalAmount * 0.1;
  console.log(`Calculated 10% Down Payment: $${calculatedDownPayment.toFixed(2)}`);

  // Verify if the down payment amount is 10% of the total amount
  if (downPaymentAmount.toFixed(2) === calculatedDownPayment.toFixed(2)) {
    console.log("Verification Success: The down payment amount is correctly set to 10% of the total estimate amount.");
  } else {
    console.log("Verification Failed: The down payment amount does not match 10% of the total estimate amount.");
  }
});




await test.step("Click on 'Cash/Check/Credit card' payment option and verify 'Checkout' button", async () => {
  // Click on the radio button for "Cash/Check/Credit card" payment option
  await page.click('input.PrivateSwitchBase-input.css-1m9pwf3[name="paymentOption"][type="radio"][value="creditcard"]');
  console.log("Clicked on the 'Cash/Check/Credit card' payment option.");

  // Wait a bit for any changes to take effect after the click
  await page.waitForTimeout(1000);

  // Verify the "Checkout" button is visible
  const checkoutButtonVisible = await page.isVisible('button:has-text("CHECKOUT")');
  if (checkoutButtonVisible) {
    console.log('"Checkout" button is visible.');
  } else {
    console.log('"Checkout" button is not visible.');
  }
});




await test.step("Click on the 'Checkout' button", async () => {
  await page.click(
    "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
  );
  console.log("Clicked on the checkout button.");
});


await test.step("Verify credit card entry form and submit with test info", async () => {
  // Wait for the iframe to load and get a handle to it
  const iframeElementHandle = await page.waitForSelector(
    'iframe[src*="https://jstest.authorize.net/v3/acceptMain/acceptMain.html"]',
    { state: "attached" }
  );
  console.log("Credit card form iframe appears.");

  const frames = await iframeElementHandle.contentFrame();
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
  console.log("Filled out the fields.");
} else {
  console.log("Failed to access the iframe content.");
}});

  

  // const iframeElementHandle = await page.waitForSelector(
  //   'iframe[src*="https://jstest.authorize.net"]',
  //   { state: "attached" }
  // );
  // const framess = await iframeElementHandle.contentFrame();
  // if (frames) {
  //   try {
  //     await framess.waitForSelector("button#payButton", {
  //       state: "visible",
  //       timeout: 5000,
  //     });
  //     await framess.click("button#payButton");
  //     console.log("Clicked 'Submit Payment' button.");
  //   } catch (error) {
  //     console.error("Error clicking 'Submit Payment':", error);
  //   }
  // } else {
  //   console.log("The iframe is detached or the frame reference is invalid.");
  // }

  // console.log("Completed the payment process.");

  await page.waitForSelector(
    "#quoteConfirmation_resultBtn__OshVM a.MuiButtonBase-root",
    { state: "visible" }
  );

  console.log("Visible check passed for 'Sign Contract' button.");

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
    "Clicked on the 'Sign Contract' button and waiting for DocuSign page."
  );

  // Since we're using waitForResponse to detect navigation, we might not need another waitForNavigation call here.
  // However, if you have additional actions that depend on the full load of the DocuSign page, you can add them below.
  // For example, checking for a specific element on the DocuSign page to ensure it has loaded.
  // Ensure the page is fully loaded or a specific element is available before proceeding with further actions.
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

  await page.waitForTimeout(2000);

  console.log("Attempting to click the 'Continue' button...");
  await page.waitForSelector("#action-bar-btn-continue", { state: "visible" });
  await page.click("#action-bar-btn-continue");
  console.log("'Continue' button clicked.");

  await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Start' button...");

  try {
    await page.waitForSelector("#navigate-btn", { state: "visible" });

    await page.click("#navigate-btn");

    console.log("'Start' button clicked successfully.");
  } catch (error) {
    console.error("Error clicking the 'Start' button:", error.message);
  }

  console.log("Waiting for 2 seconds...");
  await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Sign' div...");
  await page.waitForSelector('div.signature-tab-content:has-text("Sign")', {
    state: "visible",
  });
  await page.click('div.signature-tab-content:has-text("Sign")');
  console.log("'Sign' div clicked successfully.");

  console.log("Waiting for 2 seconds before scrolling...");
  await page.waitForTimeout(2000);

  console.log("Attempting to click on the 'Adopt and Sign' button...");

  const adoptAndSignButtonSelector =
    'button[data-qa="adopt-submit"][value="signature"]';
  await page.waitForSelector(adoptAndSignButtonSelector, { state: "visible" });
  await page.click(adoptAndSignButtonSelector);

  console.log("'Adopt and Sign' button clicked successfully.");

  await page.waitForTimeout(2000);

  // ----------SCROLL BACK UP TO FIRST TEST DOCUMENT----------

  console.log("Scrolling back up to the specified 'Test Document' div...");
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
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("Specified 'Test Document' div not found.");
    }
  });

  // ----------CLICK ON FIRST AND SECOND INTIALS----------

  console.log("Waiting for 2 seconds...");
  await page.waitForTimeout(2000);

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

  console.log("Waiting for 2 seconds...");
  await page.waitForTimeout(2000);

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

  console.log("Waiting for 2 seconds...");
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 4 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("4 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 4 of 11' not found.");
    }
  });

  console.log("Waiting for 2 seconds...");
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 5 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("5 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 5 of 11' not found.");
    }
  });

  console.log(
    "Waiting for 2 seconds before scrolling to 'Test Document 6 of 11'..."
  );
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 6 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("6 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 6 of 11' not found.");
    }
  });

  console.log(
    "Waiting for 2 seconds before scrolling to 'Test Document 7 of 11'..."
  );
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 7 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("7 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 7 of 11' not found.");
    }
  });

  console.log(
    "Waiting for 2 seconds before scrolling to 'Test Document 8 of 11'..."
  );
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 8 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("8 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 8 of 11' not found.");
    }
  });

  console.log(
    "Waiting for 2 seconds before scrolling to 'Test Document 9 of 11'..."
  );
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 9 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("9 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 9 of 11' not found.");
    }
  });

  console.log(
    "Waiting for 2 seconds before scrolling to 'Test Document 10 of 11'..."
  );
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 10 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("10 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 10 of 11' not found.");
    }
  });

  console.log(
    "Waiting for 2 seconds before scrolling to 'Test Document 11 of 11'..."
  );
  await page.waitForTimeout(2000);

  console.log("Scrolling to 'Test Document 11 of 11'...");
  await page.evaluate(() => {
    const pageInfoDivs = Array.from(document.querySelectorAll("div.page-info"));
    const targetDiv = pageInfoDivs.find(
      (div) =>
        div.textContent.includes("Test Document") &&
        div.textContent.includes("11 of 11")
    );
    if (targetDiv) {
      targetDiv.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      console.error("'Test Document 11 of 11' not found.");
    }
  });

  await page.waitForTimeout(2000);

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

  console.log("Scrolling to 'credit' table header...");
  await page.waitForSelector('th:has-text("credit")', {
    state: "visible",
  });
  await page.evaluate(() => {
    const creditTh = Array.from(document.querySelectorAll("th")).find(
      (th) => th.textContent.trim() === "credit"
    );
    if (creditTh) {
      creditTh.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  console.log("Scrolling to the address note...");
  await page.evaluate(() => {
    const addressNoteSpan = document.querySelector(
      ".myAccount_addressNote__eqWHQ"
    );
    if (addressNoteSpan) {
      addressNoteSpan.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  console.log("Scrolling to 'See full description of work' link...");
  await page.evaluate(() => {
    const link = Array.from(document.querySelectorAll("a")).find(
      (el) => el.textContent === "See full description of work"
    );
    if (link) {
      link.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const link = document.querySelector('a[href="/sow"]');
    if (link) {
      link.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(2000);

  await page.evaluate(() => {
    const link = document.querySelector('a[href="/sow"]');
    if (link) {
      link.target = "_self";
    }
  });

  await page.click('a[href="/sow"]');

  console.log("Navigated to the 'See full description of work' page.");

  await page.waitForTimeout(3000);

  console.log("Scrolling to 'Tiger Paw Roof Deck Protection'...");
  await page.evaluate(() => {
    const section = [...document.querySelectorAll("p, h1, h2, h3, h4, h5, h6")] // Adjust the selectors as needed
      .find((el) => el.textContent.includes("Tiger Paw Roof Deck Protection"));
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const exclusionsElement = [...document.querySelectorAll("strong")] // Adjust the selector as needed
      .find((el) => el.textContent.includes("Exclusions:"));
    if (exclusionsElement) {
      exclusionsElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  await page.goto("https://estimatorstg.gunnerroofing.com/my-account");

  console.log("Returned to my account.");

  await page.waitForTimeout(3000);

  console.log("Scrolling to 'Balance Remaining:'...");
  await page.evaluate(() => {
    const strongTags = Array.from(document.querySelectorAll("strong"));
    const target = strongTags.find((el) =>
      el.textContent.includes("Balance Remaining:")
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  console.log("Clicking on the 'Make Payment' button...");
  const makePaymentButtonSelector = 'button:has-text("Make Payment")';
  await page.waitForSelector(makePaymentButtonSelector, { state: "visible" });
  await page.click(makePaymentButtonSelector);

  await page.waitForTimeout(3000);

  console.log("Scrolling to 'Selected add-ons:'...");
  await page.evaluate(() => {
    const pTag = document.querySelector(
      "p.SelectionSummary_infoSubTitle__1V8ku"
    );
    if (pTag) {
      pTag.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  console.log("Scrolling to 'Preferred start date:'...");
  await page.evaluate(() => {
    const pTag = document.querySelector(
      "p.SelectionSummary_infoSubTitle__1V8ku"
    );
    const preferredStartDateTag = Array.from(
      document.querySelectorAll("p.SelectionSummary_infoSubTitle__1V8ku")
    ).find((el) => el.textContent.includes("Preferred start date:"));
    if (preferredStartDateTag) {
      preferredStartDateTag.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      console.error("'Preferred start date:' p tag not found.");
    }
  });

  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const logOutLink = document.querySelector(
      'a.nav-link[style*="cursor: pointer;"]'
    );
    if (logOutLink) {
      logOutLink.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  await page.waitForTimeout(3000);

  await page.click('a:has-text("Log Out")');
  console.log("Clicked on 'Log Out' link.");
});

module.exports = {
  timeout: 480000,
};
