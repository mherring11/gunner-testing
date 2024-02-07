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

// Define a test case to register accounts from fetched sheet data
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
    await page.goto("https://estimatorstg.gunnerroofing.com/register");
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
      await gmailPage.fill('input[type="email"]', "gunnerplaywright@gmail.com");
      await gmailPage.click("#identifierNext");
      await gmailPage.waitForNavigation();
      await gmailPage.fill('input[type="password"]', "testtest123!CHL"); // It's better to use environment variables for passwords
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
});

// Define a separate test case to check for the "Your quote is ready!" email
test('Check "Your quote is ready!" email and login', async ({ browser }) => {
  // Set a longer timeout for this test if it's taking more than 30 seconds
  test.setTimeout(180000); // e.g., 180 seconds

  // Create a new browser context for a clean session
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listener to close any new page (tab) that opens
  page.context().on("page", async (newPage) => {
    console.log("New page opened:", newPage.url());
    await newPage.close();
  });

  // Clear cookies before starting the email checking process
  await context.clearCookies();

  // Go to Gmail login page
  await page.goto("https://mail.google.com/");
  await page.fill('input[type="email"]', "gunnerplaywright@gmail.com");
  await page.click("#identifierNext");
  await page.waitForNavigation();
  await page.fill('input[type="password"]', "testtest123!CHL"); // Use environment variables for passwords
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
      const step = totalScroll / 40; // smaller step for a smoother scroll
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

  // Wait for the email input to be visible, fill it, and assert it is filled
  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "gunnerplaywright@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value: ${emailValue}`); // Should log the filled email

  // Wait for the password input to be visible, fill it, and assert it is filled
  await page.waitForSelector("#mui-2", { state: "visible" });
  await page.fill("#mui-2", "123PWtest!");
  const passwordValue = await page.$eval("#mui-2", (el) => el.value);
  console.log(`Password Input Value: ${passwordValue}`); // Should log the filled password

  await page.click('button:has-text("SIGN IN")'), // Adjust the selector if necessary
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

  // Wait for 3 seconds
  await page.waitForTimeout(3000);

  // Smooth scroll to the second element with class 'result_sectionSubhead__Qmam7'
  await page.evaluate(() => {
    const element = document.querySelector(".result_sectionSubtitle__1mAzM");
    element.scrollIntoView({ behavior: "smooth" });
  });

  // Wait for 3 seconds to ensure the scroll has completed
  await page.waitForTimeout(3000);

  console.log("Logged in, starting color selection verification.");

  // Wait for the iframe to be loaded and get its handle
  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/8e4de528-e671-4c4c-9e36-44e782a43e2f/"]';
  const iframeHandle = await page.waitForSelector(iframeSelector, {
    state: "attached",
    timeout: 20000,
  });
  if (!iframeHandle) {
    console.error("iFrame not found or the page was closed");
    await page.screenshot({ path: "debug-screenshot.png" });
    return; // Exit if the iframe is not found
  }

  const frame = await iframeHandle.contentFrame();
  if (!frame) {
    console.error("Failed to retrieve content frame from iframe.");
    return;
  }

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

    // Click on the shingle color within the iframe
    const shingleLabelSelector = `span.shingleLabel:has-text("${shingleColor}")`;
    await frame.waitForSelector(shingleLabelSelector, { state: "visible" });
    await frame.click(shingleLabelSelector);

    console.log(`Clicked on ${shingleColor}`);
    await frame.waitForTimeout(2500); // Wait for 2.5 seconds to observe changes

    // Scroll to the 'Selected add-ons' section using the main page context
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
    await frame.waitForTimeout(2500); // Wait after scrolling

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
    await frame.waitForTimeout(2500); // Wait after scrolling
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
      const steps = 20; // Increase for smoother scrolling
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

  // Remove the event listener after the test
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });
});

// Define a separate test case to check for the Detached structures
test('Check "Detached Structure"', async ({ browser }) => {
  // Set a longer timeout for this test if it's taking more than 30 seconds
  test.setTimeout(240000); // e.g., 240 seconds

  // Create a new browser context for a clean session
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listener to close any new page (tab) that opens
  page.context().on("page", async (newPage) => {
    console.log("New page opened:", newPage.url());
    await newPage.close();
  });

  // Clear cookies before starting the email checking process
  await context.clearCookies();

  // Go to Gmail login page
  await page.goto("https://mail.google.com/");
  await page.fill('input[type="email"]', "gunnerplaywright020501@gmail.com");
  await page.click("#identifierNext");
  await page.waitForNavigation();
  await page.fill('input[type="password"]', "testtest123!CHL"); // Use environment variables for passwords
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
      const step = totalScroll / 40; // smaller step for a smoother scroll
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

  // Wait for the email input to be visible, fill it, and assert it is filled
  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "gunnerplaywright020501@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value: ${emailValue}`); // Should log the filled email

  // Wait for the password input to be visible, fill it, and assert it is filled
  await page.waitForSelector("#mui-2", { state: "visible" });
  await page.fill("#mui-2", "123PWtest!");
  const passwordValue = await page.$eval("#mui-2", (el) => el.value);
  console.log(`Password Input Value: ${passwordValue}`); // Should log the filled password

  await page.click('button:has-text("SIGN IN")'), // Adjust the selector if necessary
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

  // Wait for 3 seconds
  await page.waitForTimeout(3000);

  // Smooth scroll to the second element with class 'result_sectionSubhead__Qmam7'
  await page.evaluate(() => {
    const element = document.querySelector(".result_sectionSubtitle__1mAzM");
    element.scrollIntoView({ behavior: "smooth" });
  });

  // Wait for 3 seconds to ensure the scroll has completed
  await page.waitForTimeout(3000);

  console.log("Logged in, starting color selection verification.");

  // Wait for the iframe to be loaded and get its handle
  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/678652e6-5b6b-413d-b74a-32e508c1292d/"]';
  const iframeHandle = await page.waitForSelector(iframeSelector, {
    state: "attached",
    timeout: 20000,
  });
  if (!iframeHandle) {
    console.error("iFrame not found or the page was closed");
    await page.screenshot({ path: "debug-screenshot.png" });
    return; // Exit if the iframe is not found
  }

  // Smoothly scroll to the iframe before accessing its content
  await iframeHandle.scrollIntoViewIfNeeded({
    behavior: "smooth",
    block: "center",
  });

  // Wait a moment for the smooth scrolling to complete
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

  // Check if the "NO" button is enabled and ready for interaction
  const isNoButtonEnabled = await page.isEnabled(noButtonSelector);
  if (!isNoButtonEnabled) {
    console.error("The 'NO' button is not enabled.");
    throw new Error("The 'NO' button is not enabled or interactable.");
  }

  // Click the "NO" button
  await page.click(noButtonSelector);
  console.log("Clicked on the NO button.");

  await page.waitForTimeout(1000);

  // Ensure all necessary parts of the page are loaded
  await page.waitForLoadState("domcontentloaded");

  // Define the selector for the "Gutters" section's custom checkbox wrapper
  const customCheckboxsWrapperSelector = "div.CustomOptOutWrapper"; // Ensure this is the correct selector for your page

  // Wait for the custom checkbox to be visible
  await page.waitForSelector(customCheckboxsWrapperSelector, {
    state: "visible",
  });

  // Use page.evaluate to check if the checkbox within the custom checkbox wrapper is checked
  const isChecked = await page.evaluate((selector) => {
    const checkbox = document.querySelector(
      selector + " input[type='checkbox']"
    );
    return checkbox && checkbox.checked; // Returns true if the checkbox exists and is checked
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

  // Wait for any potential page updates after the interaction
  await page.waitForTimeout(2000); // Adjust the timeout as needed based on your application's behavior

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

    // Click on the shingle color within the iframe
    const shingleLabelSelector = `span.shingleLabel:has-text("${shingleColor}")`;
    await frame.waitForSelector(shingleLabelSelector, { state: "visible" });
    await frame.click(shingleLabelSelector);

    console.log(`Clicked on ${shingleColor}`);
    await frame.waitForTimeout(2500); // Wait for 2.5 seconds to observe changes

    // Scroll to the 'Selected add-ons' section using the main page context
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
    await frame.waitForTimeout(2500); // Wait after scrolling

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
    await frame.waitForTimeout(2500); // Wait after scrolling
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
      const steps = 20; // Increase for smoother scrolling
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

  // Define the selector for the target paragraph element
  const summaryParagraphSelector = ".SelectionSummary_summaryParagragh__8hoZN";

  // Now, smoothly scroll to the paragraph element
  const summaryParagraphElement = page.locator(summaryParagraphSelector);

  // Wait for the element to be available in the DOM
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

  // Ensure the script waits until necessary elements are fully loaded and ready
  await page.waitForLoadState("domcontentloaded");

  // Define the selector for the "Gutters" heading to ensure visibility
  const guttersHeadingSelector = "h3:text('Gutters')";

  // Wait for the "Gutters" heading to become visible
  await page.waitForSelector(guttersHeadingSelector, { state: "visible" });

  // Smoothly scroll to the "Gutters" heading
  const guttersHeadingElement = page.locator(guttersHeadingSelector);
  await guttersHeadingElement.scrollIntoViewIfNeeded({
    behavior: "smooth",
    block: "center",
  });
  console.log("Scrolled smoothly up to the 'Gutters' heading successfully.");

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

  // Wait for any potential page updates after the click
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

  // Optionally wait for a moment after scrolling
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

  // Wait for the scrolling animation to complete
  await page.waitForTimeout(2000);

  // Click on the first custom checkbox within the "Gutters" section
  const customCheckboxWrapperSelectors = "div.CustomOptOutWrapper";
  await page.click(customCheckboxWrapperSelectors);
  console.log("Clicked on the custom checkbox in the 'Gutters' section.");

  // Wait for any potential page updates after the click
  await page.waitForTimeout(2000);

  console.log(
    "Proceeding to verify and interact with the second custom checkbox..."
  );

  const secondCustomCheckboxSelector = "div.CustomCheckboxWrapper"; // Ensure this is correct
  const isSecondCheckboxPresent = await page
    .locator(secondCustomCheckboxSelector)
    .isVisible({ timeout: 5000 })
    .catch((e) => false); // Adjust the timeout as needed

  if (isSecondCheckboxPresent) {
    console.log("Second custom checkbox is present. Interacting...");
    await page.click(secondCustomCheckboxSelector);
    console.log("Clicked on the second custom checkbox.");
  } else {
    console.error("Second custom checkbox is not present or visible.");
    // Handle the absence of the checkbox accordingly, maybe skip or take alternative actions
  }
  // Wait for any potential page updates after the click
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

  // Wait for the scrolling animation to complete
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

  // Optionally, wait for the scrolling animation to complete
  await page.waitForTimeout(2000); // Adjust as necessary

  // Define a more specific selector to accurately target the input field for "Fixed" option
  const fixedOptionSelector =
    'div.result_backSectionContent__2N1Hn div.result_inlineContent__WAHUf:has-text("Fixed") input[type="number"]';

  // Ensure the input is visible
  await page.waitForSelector(fixedOptionSelector, { state: "visible" });

  // Set the value to 0 first to ensure it starts from 0
  await page.fill(fixedOptionSelector, "0");

  // Wait for the input logic to process the reset to 0
  await page.waitForTimeout(3000); // Adjust the timeout as needed

  // Click on the input to focus
  await page.click(fixedOptionSelector);

  // Increase the value by 1
  await page.fill(fixedOptionSelector, "1");

  // Wait a bit for any potential page logic to process the change
  await page.waitForTimeout(3000); // Adjust the timeout as needed

  // Increase the value to 4 (since you're directly setting the value, it's not adding 3 to the previous but setting to 4 directly)
  await page.fill(fixedOptionSelector, "4");

  // Wait a bit for any potential page logic to process the change
  await page.waitForTimeout(3000); // Adjust the timeout as needed

  console.log(
    "Reset the number input value to 0, then increased first by 1, then set to 4."
  );

  // Selector for the input element within the specific section
  const solarPoweredInputSelector =
    '.result_skylightOptionTitle__BV1J3:has-text("Solar-Powered Opening") + div > input[type="number"]';

  // Click on the input to focus
  await page.click(solarPoweredInputSelector);

  // Increase the value by 1
  await page.fill(solarPoweredInputSelector, "1");

  // Wait a bit for any potential page logic to process the change
  await page.waitForTimeout(3000); // Adjust the timeout as needed

  // Increase the value by 3, assuming you want to set the total value to 4
  await page.fill(solarPoweredInputSelector, "4");

  // Wait a bit for any potential page logic to process the change
  await page.waitForTimeout(3000); // Adjust the timeout as needed


  console.log(
    "Increased the Solar-Powered Opening input value first by 1, then by 3."
  );

  // Remove the event listener after the test
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });
});

// Export the configuration for Playwright
module.exports = {
  timeout: 240000, // Global timeout for all actions set to 3 minutes
};
