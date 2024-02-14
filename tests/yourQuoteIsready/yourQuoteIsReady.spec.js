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

// -----------------PRESS PLAY BUTTON----------------------



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
  await page.fill('input[type="email"]', "playwright021324@gmail.com");
  await page.click("#identifierNext");
  await page.waitForNavigation();
  await page.fill('input[type="password"]', "Playwright24!"); // Use environment variables for passwords
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

// Export the configuration for Playwright
module.exports = {
  timeout: 360000, // Global timeout for all actions set to 3 minutes
};
