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
    return response.data;
  } catch (error) {
    console.error("Error fetching data from sheet:", error);
    return []; 
  }
}

// -----------------PRESS PLAY BUTTON----------------------

test('Check "Detached Structure"', async ({ browser }) => {
  
  test.setTimeout(360000);

  // Create a new browser for a clean session
  const context = await browser.newContext();
  const page = await context.newPage();

  
  page.context().on("page", async (newPage) => {
    console.log("New page opened:", newPage.url());
    await newPage.close();
  });

  // Clear cookies
  await context.clearCookies();

  // Go to Gmail login page
  await page.goto("https://mail.google.com/");
  await page.fill('input[type="email"]', "playwright021324@gmail.com");
  await page.click("#identifierNext");
  await page.waitForNavigation();
  await page.fill('input[type="password"]', "Playwright24!");
  await page.click("#passwordNext");
  await page.waitForNavigation();

  // Wait for the inbox to load and search for the email
  await page.waitForSelector('input[aria-label="Search mail"]', {
    state: "visible",
  });
  await page.fill(
    'input[aria-label="Search mail"]',
    'subject:"Your quote is ready!"'
  );
  await page.press('input[aria-label="Search mail"]', "Enter");
  await page.click('tr.zA:has-text("Your quote is ready!")');

  // Wait for the email content container to load
  await page.waitForSelector("div.aeJ");

  // Smoothly scroll to the bottom and then back to the top of the email content
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const element = document.querySelector("div.aeJ");
      const totalScroll = element.scrollHeight - element.clientHeight;
      const step = totalScroll / 40;
      let scrolled = 0;

      const scrollDown = setInterval(() => {
        if (scrolled < totalScroll) {
          element.scrollBy(0, step);
          scrolled += step;
        } else {
          clearInterval(scrollDown);
          const scrollUp = setInterval(() => {
            if (scrolled > 0) {
              element.scrollBy(0, -step);
              scrolled -= step;
            } else {
              clearInterval(scrollUp);
              resolve();
            }
          }, 100);
        }
      }, 100);
    });
  });

  // Wait for the "YOUR ONLINE QUOTE" button to be visible and clickable
  await page.waitForSelector('img[alt="Your Online Quote"]', {
    state: "visible",
  });

  // Click the link that contains the "YOUR ONLINE QUOTE" image
  await page.click('a:has(img[alt="Your Online Quote"])');

  // After the email has been processed
  console.log("Processing complete, proceeding to log into the website.");

  await page.goto("https://accounts.google.com/Logout", {
    waitUntil: "networkidle",
  });

  // Navigate to the login page
  await page.goto("https://estimatorstg.gunnerroofing.com/login");

  // Wait for the email input to be visible, fill it.
  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "playwright021324@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value: ${emailValue}`);

  // Wait for the password input to be visible, fill it.
  await page.waitForSelector("#mui-2", { state: "visible" });
  await page.fill("#mui-2", "Playwright24!");
  const passwordValue = await page.$eval("#mui-2", (el) => el.value);
  console.log(`Password Input Value: ${passwordValue}`);

  await page.click('button:has-text("SIGN IN")'),
    // Remove the event listener after the test
    page.context().removeListener("page", async (newPage) => {
      await newPage.close();
    });

  // After logging in to the website
  console.log("Logged in, waiting for page actions.");

  // Scroll to the first element
  const hangingIconsContainer = page.locator(
    "#result_hangingIconsContainer__ujFwa"
  );
  await hangingIconsContainer.scrollIntoViewIfNeeded();

  await page.waitForTimeout(3000);

  // Smooth scroll to the second element
  await page.evaluate(() => {
    const element = document.querySelector(".result_sectionSubtitle__1mAzM");
    element.scrollIntoView({ behavior: "smooth" });
  });

  await page.waitForTimeout(3000);

  console.log("Logged in, starting color selection verification.");

  // Wait for the iframe to be loaded and get its handle
  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/66a695be-44e7-4b69-97cc-8d77f1b27667/"]';
  const iframeHandle = await page.waitForSelector(iframeSelector, {
    state: "attached",
    timeout: 20000,
  });
  if (!iframeHandle) {
    console.error("iFrame not found or the page was closed");
    await page.screenshot({ path: "debug-screenshot.png" });
    return; 
  }

  // Smoothly scroll to the iframe before accessing its content
  await page.evaluate((selector) => {
    const iframeElement = document.querySelector(selector);
    if (iframeElement) {
      iframeElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, iframeSelector);

  
  await page.waitForTimeout(2000);

  // Access the iframe's content frame
  const frame = await iframeHandle.contentFrame();
  if (!frame) {
    console.error("Failed to retrieve content frame from iframe.");
    return;
  }

  // Define the selector for the "NO" button to ensure it is clicked before proceeding
  const noButtonSelector =
    'button.MuiButtonBase-root.MuiToggleButton-root[value="NO"]';

  // Wait for the "NO" button to be visible on the page
  await page.waitForSelector(noButtonSelector, { state: "visible" });

  // Smoothly scroll to the "NO" button before clicking
  await page.evaluate((selector) => {
    const button = document.querySelector(selector);
    if (button) {
      button.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, noButtonSelector);

  
  await page.waitForTimeout(1000);

  // Check if the "NO" button is enabled and ready for interaction after scrolling
  const isNoButtonEnabled = await page.isEnabled(noButtonSelector);
  if (!isNoButtonEnabled) {
    console.error("The 'NO' button is not enabled.");
    throw new Error("The 'NO' button is not enabled or interactable.");
  }

  // Click the "NO" button after ensuring it's visible and interactable
  await page.click(noButtonSelector);
  console.log("Clicked on the NO button.");

  // Wait for a brief moment to let any page changes occur
  await page.waitForTimeout(1000);

  // Ensure all necessary parts of the page are loaded before proceeding
  await page.waitForLoadState("domcontentloaded");

  // Define the selector for the "Gutters" section's custom checkbox wrapper
  const customCheckboxsWrapperSelector = "div.CustomOptOutWrapper"; 

  // Wait for the custom checkbox to be visible
  await page.waitForSelector(customCheckboxsWrapperSelector, {
    state: "visible",
  });

  // Use page.evaluate to check if the checkbox within the custom checkbox wrapper is checked
  const isChecked = await page.evaluate((selector) => {
    const checkbox = document.querySelector(
      selector + " input[type='checkbox']"
    );
    return checkbox && checkbox.checked; 
  }, customCheckboxsWrapperSelector);

  if (isChecked) {
    console.log(
      "Custom checkbox in 'Gutters' section is already checked. Clicking to uncheck."
    );
    await page.click(customCheckboxsWrapperSelector);
    console.log(
      "Clicked on the custom checkbox in the 'Gutters' section to toggle its state."
    );
  } else {
    console.log(
      "Custom checkbox in 'Gutters' section is not checked. No action taken."
    );
  }

  // Ensure the script waits for the necessary parts of the page to be fully loaded
  await page.waitForLoadState("domcontentloaded");

  // Define the selectors for "Fixed" and "Solar-Powered Opening" input fields
  const fixedInputSelector =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';
  const solarPoweredInputSelectors =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Solar-Powered Opening") input[type="number"]';

  // Function to reset an input value to 0
  async function resetInputToZero(selector) {
    await page.waitForSelector(selector, { state: "visible" });
    await page.fill(selector, "0"); // Set the value to 0
    console.log(`Reset the input value to 0 for selector: ${selector}`);
  }

  // Reset "Fixed" and "Solar-Powered Opening" inputs to 0
  await resetInputToZero(fixedInputSelector);
  await resetInputToZero(solarPoweredInputSelectors);

  
  await page.waitForTimeout(2000);


  await page.waitForTimeout(2000); 
  
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

  // Loop through each shingle color
  for (const shingleColor of shingleColors) {
    console.log(`Trying to click on the shingle: ${shingleColor}`);

    // Selector to target the shingle label within the iframe
    const shingleLabelSelector = `span.shingleLabel:has-text("${shingleColor}")`;
    await frame.waitForSelector(shingleLabelSelector, { state: "visible" });
    await frame.click(shingleLabelSelector);
    console.log(`Clicked on ${shingleColor}`);
    await frame.waitForTimeout(2500);

    // Selector for the 'Selected add-ons' section in the main page context
    const addonsSelector = "p.SelectionSummary_infoSubTitle__1V8ku";
    if (await page.$(addonsSelector)) {
      // Smooth scrolling to the 'Selected add-ons' section
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
    await frame.waitForTimeout(2500); 

    // Scroll back to the top element (<h3>) using the main page context
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
    await frame.waitForTimeout(2500); 
  }

  // Now, simulate the drag on the visualizer canvas to verify the movement
  console.log("Starting visualizer interaction verification.");

  const canvasSelector = 'canvas[data-engine="three.js r155dev"]';
  try {
    // Ensure the frame is still valid and has not navigated away or reloaded
    if (!frame || frame.isDetached()) {
      throw new Error("The frame is no longer attached to the DOM.");
    }

    // Wait for the canvas to be fully ready within the iframe
    await frame.waitForSelector(canvasSelector, {
      state: "visible",
      timeout: 10000,
    });

    // Get the bounding box of the canvas within the iframe
    const boundingBox = await frame.evaluate((selector) => {
      const canvas = document.querySelector(selector);
      if (!canvas) return null;
      const { left, top, width, height } = canvas.getBoundingClientRect();
      return { left, top, width, height };
    }, canvasSelector);

    if (!boundingBox) {
      throw new Error("Unable to locate the canvas within the iframe.");
    }

    // Assuming 'iframeSelector' is the selector for the iframe element in the page context
    const iframeElementHandle = await page.$(iframeSelector);
    const iframeRect = await iframeElementHandle.boundingBox();

    // Calculate the adjusted coordinates for mouse actions
    const pageX = iframeRect.x + boundingBox.left + boundingBox.width / 2;
    const pageY = iframeRect.y + boundingBox.top + boundingBox.height / 2;

    // Define a function to perform smooth scrolling
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

    // Perform mouse drag within the canvas by simulating mouse movement and clicks
    await page.mouse.move(pageX, pageY);
    await page.mouse.down();

    // Scroll in each direction for 2 seconds
    // Scroll Right
    await smoothScroll(pageX, pageY, pageX + 100, pageY, 2000);
    // Scroll Down
    await smoothScroll(pageX + 100, pageY, pageX + 100, pageY + 100, 2000);
    // Scroll Left
    await smoothScroll(pageX + 100, pageY + 100, pageX, pageY + 100, 2000);
    // Scroll Up
    await smoothScroll(pageX, pageY + 100, pageX, pageY, 2000);

    await page.mouse.up();

    console.log("Completed visualizer interaction verification.");
  } catch (error) {
    console.error("Error during visualizer interaction verification:", error);
  }

  await page.waitForTimeout(2000);

  console.log("Completed visualizer interaction verification with a delay.");

  // Now smoothly scroll to the specific question paragraph
  const questionSelector =
    'text="Would you like us to include replacement of the roof of the additional structures at this time?"';
  const questionElement = page.locator(questionSelector);

  // Wait for the element to be available in the DOM
  await questionElement.waitFor();

  // Scroll the element into view smoothly
  await questionElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });

  console.log(
    "Scrolled smoothly to the specific question paragraph successfully."
  );

  await page.waitForTimeout(2000);

  // Define the selector for the target <p> element containing the specific note text
  const noteSelector =
    'text="Note: You will receive a confirmation email once you have completed your payment."';

  // Now, smoothly scroll to the <p> element containing the specific note
  const noteElement = page.locator(noteSelector);

  // Wait for the element to be available in the DOM
  await noteElement.waitFor();

  // Scroll the element into view smoothly
  await noteElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });

  console.log("Scrolled smoothly to the note paragraph successfully.");

  await page.waitForTimeout(2000);

  // Define the selector for the target <h3> element containing "Additional structures"
  const additionalStructuresSelector = 'h3:text("Additional structures")';

  // Now, smoothly scroll to the <h3> element containing "Additional structures"
  const additionalStructuresElement = page.locator(
    additionalStructuresSelector
  );

  // Wait for the element to be available in the DOM
  await additionalStructuresElement.waitFor();

  // Scroll the element into view smoothly
  await additionalStructuresElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });

  console.log(
    "Scrolled smoothly to the 'Additional structures' <h3> element successfully."
  );

  await page.waitForTimeout(2000);

  // Define the selector for the "YES" button at the beginning of your script or before its first use
  const yesButtonSelector =
    'button.MuiButtonBase-root.MuiToggleButton-root[value="YES"]';

  // Use the selector to wait for the "YES" button to become visible
  await page.waitForSelector(yesButtonSelector, { state: "visible" });

  // Optionally, ensure the "YES" button is not disabled before clicking
  await expect(page.locator(yesButtonSelector)).toBeEnabled();

  // Click the "YES" button
  await page.click(yesButtonSelector);
  console.log("Clicked on the 'YES' button.");

  // Optionally, wait for any actions triggered by clicking the "YES" button to complete
  await page.waitForTimeout(2000); // Adjust the timeout based on your application's behavior

 
  const summaryParagraphSelector = ".SelectionSummary_summaryParagragh__8hoZN";

  // Now, smoothly scroll to the paragraph element
  const summaryParagraphElement = page.locator(summaryParagraphSelector);

  
  await summaryParagraphElement.waitFor();

  // Scroll the element into view smoothly
  await summaryParagraphElement.evaluate((element) => {
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });

  await page.waitForTimeout(2000);

  console.log("Scrolled smoothly down to the summary paragraph successfully.");

  // Scroll to a paragraph containing specific text
  await page.evaluate(() => {
    const paragraphs = [...document.querySelectorAll("p")];
    const targetParagraph = paragraphs.find((p) =>
      p.textContent.includes("Included as standard.")
    ); // Find the one that includes the text
    if (targetParagraph) {
      targetParagraph.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  console.log(
    "Scrolled smoothly to the paragraph containing 'Included as standard.'"
  );
  await page.waitForTimeout(2000);

  // Define the selector for the "Gutters" section's custom checkbox wrapper
  const customCheckboxWrapperSelector = "div.CustomCheckboxWrapper";

  // Wait for the custom checkbox to be visible
  await page.waitForSelector(customCheckboxWrapperSelector, {
    state: "visible",
  });

  // Click the custom checkbox
  console.log("Clicking on the custom checkbox in the 'Gutters' section.");
  await page.click(customCheckboxWrapperSelector);


  await page.waitForTimeout(2000);

  // Smoothly scroll back down to the summary paragraph
  const summaryParagraphSelectors = ".SelectionSummary_summaryParagragh__8hoZN";
  const summaryParagraphElements = page.locator(summaryParagraphSelectors);

  await summaryParagraphElements.waitFor(); // Ensure the element is available in the DOM

  await summaryParagraphElements.evaluate((element) => {
    // Scroll the element into view smoothly
    const smoothScrollToElement = (el) => {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    smoothScrollToElement(element);
  });

  
  await page.waitForTimeout(2000);

  console.log("Scrolled smoothly down to the summary paragraph successfully.");

  // Smoothly scroll up to the "Gutters" heading
  const guttersHeadingSelectors = "h3:text('Gutters')";
  const guttersHeadingElements = page.locator(guttersHeadingSelectors);
  await guttersHeadingElements.waitFor();
  await guttersHeadingElements.evaluate((element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  console.log("Scrolled smoothly up to the 'Gutters' heading successfully.");

  
  await page.waitForTimeout(2000);

  // Click on the first custom checkbox within the "Gutters" section
  const customCheckboxWrapperSelectors = "div.CustomOptOutWrapper";
  await page.click(customCheckboxWrapperSelectors);
  console.log("Clicked on the custom checkbox in the 'Gutters' section.");

  
  await page.waitForTimeout(2000);

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
  
  await page.waitForTimeout(2000);

  // Smoothly scroll back down to the summary paragraph
  const summaryParagraphsSelector = ".SelectionSummary_summaryParagragh__8hoZN";
  const summaryParagraphsElement = page.locator(summaryParagraphsSelector);
  await summaryParagraphsElement.waitFor();
  await summaryParagraphsElement.evaluate((element) => {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  console.log(
    "Scrolled smoothly back down to the summary paragraph successfully."
  );

  
  await page.waitForTimeout(2000);

  // Define a more generic selector for the "Skylights" heading if possible
  const skylightsHeadingSelector = "h3";

  // Scroll the "Skylights" heading into view smoothly using XPath to find the element by its text content
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

  
  await page.waitForTimeout(2000);

  // Define a more specific selector to accurately target the input field for "Fixed" option
  const fixedOptionSelector =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

  // Ensure the input is visible
  await page.waitForSelector(fixedOptionSelector, { state: "visible" });

  // Set the value to 0 first to ensure it starts from 0
  await page.fill(fixedOptionSelector, "0");

  
  await page.waitForTimeout(3000); 

  
  await page.click(fixedOptionSelector);

  
  await page.fill(fixedOptionSelector, "1");

  
  await page.waitForTimeout(3000); 

  // Increase the value to 4 (since you're directly setting the value, it's not adding 3 to the previous but setting to 4 directly)
  await page.fill(fixedOptionSelector, "4");

  
  await page.waitForTimeout(3000); 

  console.log(
    "Reset the number input value to 0, then increased first by 1, then set to 4."
  );

  // Selector for the input element within the specific section
  const solarPoweredInputSelector =
    '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';

  
  await page.click(solarPoweredInputSelector);

  
  await page.fill(solarPoweredInputSelector, "1");

  
  await page.waitForTimeout(3000); 

  // Increase the value by 3, assuming you want to set the total value to 4
  await page.fill(solarPoweredInputSelector, "4");

  
  await page.waitForTimeout(3000); 

  console.log(
    "Increased the Solar-Powered Opening input value first by 1, then by 3."
  );

  // Define the selector for the target div
  const targetDivSelector = "#result_roofingLayers__kOCE6";

  
  await page.waitForSelector(targetDivSelector, { state: "visible" });

  // Scroll the target div into view smoothly
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, targetDivSelector);

  console.log("Scrolled smoothly to the target div.");

  
  await page.waitForTimeout(2000);

  async function clickSequence(page) {
    const interactions = [
      { selector: 'button.MuiButtonBase-root:has-text("ROOF DECK BASE")' },
      { selector: 'button.MuiButtonBase-root:has-text("LEAK BARRIER")' },
      {
        selector: 'button.MuiButtonBase-root:has-text("Roof Deck Protection")',
      },
      {
        selector: 'button.MuiButtonBase-root:has-text("Starter Strip Shingle")',
      },
      { selector: 'button.MuiButtonBase-root:has-text("Shingles")' },
      { selector: 'button.MuiButtonBase-root:has-text("Flashing")' },
      { selector: 'button.MuiButtonBase-root:has-text("Attic Ventilation")' },
      { selector: 'button.MuiButtonBase-root:has-text("RIDGE CAP SHINGLES")' },
    ];

    for (const interaction of interactions) {
      
      await page.click(interaction.selector);
      console.log(`Clicked on section opened by ${interaction.selector}`);

      
      const closeButtonSelector = 'a[role="button"]:has-text("X")'; 
      await page.waitForSelector(closeButtonSelector, { state: "visible" });
      console.log(`The "X" is now visible.`);

      
      await page.click(closeButtonSelector);
      console.log(`Clicked the "X" to close.`);

      await clickSequence(page);

      await page.waitForTimeout(1000);
    }

    console.log("Completed interaction with all specified sections.");
  }

  await page.waitForTimeout(2000);

  async function scrollToAndClickDate(page) {
    // Function to scroll to the "Previous Month" button
    async function scrollToPreviousMonthButton() {
      await page.waitForSelector('button[aria-label="Previous Month"]', {
        state: "attached",
      });

      await page.evaluate(() => {
        const previousMonthButton = document.querySelector(
          'button[aria-label="Previous Month"]'
        );
        if (previousMonthButton) {
          previousMonthButton.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      });

      console.log('Smoothly scrolled to the "Previous Month" button.');
    }

    
    await scrollToPreviousMonthButton();

    
    await page.waitForTimeout(2000);

    
    await page.click('abbr[aria-label="March 28, 2024"]');
    console.log("Clicked on March 28, 2024.");
  }

  
  await scrollToAndClickDate(page);

  await page.waitForTimeout(2000);

  
  await page.waitForSelector("#result_totalEstimateAmount__rj09i", {
    state: "visible",
  });
  await page.waitForTimeout(1000);

  // Smooth scroll to the first target element
  await page.evaluate(() => {
    const scrollToElement = document.querySelector(
      "#result_totalEstimateAmount__rj09i"
    );
    if (scrollToElement) {
      scrollToElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  
  await page.waitForTimeout(6000);

  // Smooth scroll to the second target element
  await page.evaluate(() => {
    const scrollToElement = document.querySelector(
      ".SelectionSummary_infoSubTitle__1V8ku"
    );
    if (scrollToElement) {
      scrollToElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  await page.waitForTimeout(4000);

  // Fetch the href attribute of the link using XPath
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

  // Check if href is found, and navigate to the URL directly in the same tab
  if (href) {
    await page.goto(href, { waitUntil: "networkidle" });
    // Add your logic after navigation if needed
    console.log(`Navigated to ${href}`);
  } else {
    console.log("Link with 'See full description of work' text not found.");
  }

  await page.waitForTimeout(4000);

  // Smooth scroll to <strong>Exclusions:</strong>
  await page.evaluate(() => {
    const skylightsElement = document.evaluate(
      "//strong[contains(text(), 'Skylights:')]", 
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (skylightsElement) {
      skylightsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
  console.log("Smoothly scrolled to Skylights:");

  await page.waitForTimeout(4000); 

  // Go back to the previous page
  await page.goBack({ waitUntil: "networkidle" });

  await page.waitForTimeout(2000);

 
  await page.click('abbr[aria-label="March 28, 2024"]');
  console.log("Clicked on March 28, 2024.");

  // Smooth scroll to the "CHECKOUT & MEET YOUR TEAM" button and click it after 3 seconds
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
      button.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Wait for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Click the button if it's still available
    button?.click();
  });
  console.log(
    "Clicked 'CHECKOUT & MEET YOUR TEAM' button after smooth scrolling and waiting."
  );

  // Ensure the element for "Preferred start date:" is present
  await page.waitForSelector(".SelectionSummary_infoSubTitle__1V8ku", {
    state: "visible",
  });

  // Smoothly scroll to the element for "Preferred start date:"
  await page.evaluate(() => {
    const pElements = Array.from(
      document.querySelectorAll(".SelectionSummary_infoSubTitle__1V8ku")
    );
    const targetElement = pElements.find((p) =>
      p.textContent.includes("Preferred start date:")
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  console.log("Smoothly scrolled to 'Preferred start date:'");

  
  await page.waitForTimeout(4000);

  // Smoothly scroll back up to the specific <p> element about payment options
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

  await page.waitForTimeout(3000);

  // Click on the input element for payment option: credit card
  await page.click(
    'input.PrivateSwitchBase-input.css-1m9pwf3[name="paymentOption"][type="radio"][value="creditcard"]'
  );
  console.log("Clicked on the credit card payment option.");

  
  await page.waitForTimeout(2000);

  // Smoothly scroll to the <div class="checkout_card_body__8MFut">
  await page.evaluate(() => {
    const div = document.querySelector("div.checkout_card_header___8ukV");
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  });
  console.log("Smoothly scrolled to the checkout card body.");

  await page.waitForTimeout(3000);

  // Smoothly scroll to the checkout button
  await page.evaluate(() => {
    const button = document.querySelector(
      "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
    );
    if (button) {
      button.scrollIntoView({ behavior: "smooth" });
    }
  });
  console.log("Smoothly scrolled to the checkout button.");

  
  await page.waitForTimeout(3000);

  // Click the checkout button
  await page.click(
    "button.MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.css-1hw9j7s"
  );
  console.log("Clicked on the checkout button.");

  // Locate the iframe by a part of its src attribute that's unique
  const iframeElementHandles = await page.waitForSelector(
    'iframe[src*="https://jstest.authorize.net/v3/acceptMain/acceptMain.html"]'
  );

  // Interact with the iframe
  const frames = await iframeElementHandles.contentFrame();

  if (frame) {

    // Click and type in the card number field
    await frames.click('input[name="cardNum"]'); 
    await frames.type('input[name="cardNum"]', "4242424242424242", {
      delay: 100,
    });

    // Expiry Date
    await frames.type("input#expiryDate", "0627", { delay: 100 });

    // First Name
    await frames.type('input[name="firstName"]', "Playwright", { delay: 100 });

    // Last Name
    await frames.type('input[name="lastName"]', "Tester021224", { delay: 100 });

    // ZIP Code
    await frames.type('input[name="zip"]', "75225", { delay: 100 });

    console.log("Filled out the fields with simulated typing.");
  } else {
    console.log("Failed to access the iframe content.");
  }

  // Getting the iframe reference before interacting with the "Submit Payment" button
  const iframeElementHandle = await page.waitForSelector(
    'iframe[src*="https://jstest.authorize.net"]',
    { state: "attached" }
  );
  const framess = await iframeElementHandle.contentFrame();

  if (frame) {
    try {
    
      await framess.waitForSelector("button#payButton", {
        state: "visible",
        timeout: 5000,
      });

      // Clicking the "Submit Payment" button
      await framess.click("button#payButton");
      console.log("Clicked 'Submit Payment' button.");
    } catch (error) {
      console.error("Error clicking 'Submit Payment':", error);
      
    }
  } else {
    console.log("The iframe is detached or the frame reference is invalid.");

  }

  // Remove the event listener after the test
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });
});


module.exports = {
  timeout: 360000, 
};
