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

test('Check "Your quote is ready!" email and login', async ({ browser }) => {
  test.setTimeout(180000);
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

  await page.waitForSelector("div.aeJ");
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
  await page.fill("#mui-1", "gunnerplaywright+02264@gmail.com");
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

  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const element = document.querySelector(".result_sectionSubtitle__1mAzM");
    element.scrollIntoView({ behavior: "smooth" });
  });

  await page.waitForTimeout(3000);
  console.log("Logged in, starting color selection verification.");

  const iframeSelector =
    'iframe[src*="https://visualizer.gunnerroofing.com/58b6d79c-4473-4d06-ba3d-1fe75ec522b7/"]';
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
    await frame.waitForTimeout(2500);

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
    await frame.waitForTimeout(2500);

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
    await smoothScroll(pageX, pageY, pageX + 100, pageY, 2000);
    await smoothScroll(pageX + 100, pageY, pageX + 100, pageY + 100, 2000);
    await smoothScroll(pageX + 100, pageY + 100, pageX, pageY + 100, 2000);
    await smoothScroll(pageX, pageY + 100, pageX, pageY, 2000);
    await page.mouse.up();
    console.log("Completed visualizer interaction verification.");
  } catch (error) {
    console.error("Error during visualizer interaction verification:", error);
  }
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });
});

module.exports = {
  timeout: 360000,
};
