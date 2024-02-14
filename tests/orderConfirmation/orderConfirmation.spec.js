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

test('Check "Your order confirmation" email and click on "Log in to my account"', async ({
  browser,
}) => {
  // Create a new browser context and page instance
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Gmail and log in
  await page.goto("https://mail.google.com/");
  await page.fill('input[type="email"]', "playwright021224@gmail.com");
  await page.click('button:has-text("Next")');
  await page.fill('input[type="password"]', "Playwright24!"); // Consider using environment variables for sensitive information
  await page.click('button:has-text("Next")');

  // Wait for the inbox to load
  await page.waitForSelector('input[aria-label="Search mail"]');

  // Search for the email with the specified subject
  await page.fill(
    'input[aria-label="Search mail"]',
    'subject:"Your order confirmation"'
  );
  await page.keyboard.press("Enter");

  // Wait for the search results and click on the email
  await page.waitForSelector('tr.zA:has-text("Your order confirmation")');
  await page.click('tr.zA:has-text("Your order confirmation")');

  // Wait for the email content container to load
  await page.waitForSelector("div.aeJ");

  // Smoothly scroll to the bottom of the email content
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const element = document.querySelector("div.aeJ");
      const totalScroll = element.scrollHeight - element.clientHeight;
      const step = totalScroll / 60; // Adjust the duration or steps as needed for smoothness
      let scrolled = 0;

      const scrollDown = setInterval(() => {
        if (scrolled < totalScroll) {
          element.scrollBy(0, step);
          scrolled += step;
        } else {
          clearInterval(scrollDown);
          resolve();
        }
      }, 100); // Adjust the interval for smoothness
    });
  });

  await page.waitForSelector('img[alt="Log in to my account"]', {
    state: "visible",
  });

  // Smoothly scroll to the "Log in to my account" image if it's not already in view
  await page.evaluate(() => {
    const loginButton = document.querySelector(
      'img[alt="Log in to my account"]'
    );
    if (loginButton) {
      loginButton.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  // Wait a bit to ensure the smooth scroll has finished
  await page.waitForTimeout(6000); // Adjust based on your scroll duration

  // Click the "Log in to my account" button or image
  await page.click('img[alt="Log in to my account"]');

  // After the email has been processed
  console.log("Processing complete, proceeding to log into the website.");

  await page.goto("https://accounts.google.com/Logout", {
    waitUntil: "networkidle",
  });

  // Navigate to the login page
  await page.goto("https://estimatorstg.gunnerroofing.com/login");

  // Wait for the email input to be visible, fill it, and assert it is filled
  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "playwright021224@gmail.com");
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

  // Log in and wait for page actions to complete
  console.log("Logged in, waiting for page actions.");

  // Wait for the specific element to be loaded and rendered on the page
  await page.waitForSelector(".myAccount_paymentScheduleItem__EZLf8", {
    visible: true,
  });

  // Smoothly scroll to the specified <li> element
  await page.evaluate(() => {
    const targetElement = document.querySelector(
      ".myAccount_paymentScheduleItem__EZLf8"
    );
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000; // Smooth scroll duration in milliseconds
      let startTime = null;

      function smoothScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const nextScroll = easeFunction(
          timeElapsed,
          startPosition,
          distance,
          duration
        );

        window.scrollTo(0, nextScroll);
        if (timeElapsed < duration) requestAnimationFrame(smoothScroll);
      }

      function easeFunction(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(smoothScroll);
    }
  });

  // Remove the event listener after the test
  page.context().removeListener("page", async (newPage) => {
    await newPage.close();
  });
});

// Export the configuration for Playwright
module.exports = {
  timeout: 360000, // Global timeout for all actions set to 3 minutes
};
