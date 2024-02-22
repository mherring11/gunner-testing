const { test, expect } = require("@playwright/test");
const axios = require("axios");

async function fetchDataFromSheet() {
  console.log("Starting to fetch data from sheet...");
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

test('Check "Your order confirmation" email and click on "Log in to my account"', async ({
  browser,
}) => {
  console.log("Starting test to check the order confirmation email...");
  const context = await browser.newContext();
  const page = await context.newPage();
  console.log("Navigating to Gmail...");
  await page.goto("https://mail.google.com/");
  console.log("Filling in the email address...");
  await page.fill('input[type="email"]', "gunnerplaywright@gmail.com");
  await page.click('button:has-text("Next")');
  console.log("Entering password...");
  await page.fill('input[type="password"]', "testtest123!CHL");
  await page.click('button:has-text("Next")');
  console.log(
    "Logged into Gmail, searching for the order confirmation email..."
  );
  await page.waitForSelector('input[aria-label="Search mail"]');
  await page.fill(
    'input[aria-label="Search mail"]',
    'subject:"Your order confirmation"'
  );
  await page.keyboard.press("Enter");
  console.log("Opening the order confirmation email...");
  await page.waitForSelector('tr.zA:has-text("Your order confirmation")');
  await page.click('tr.zA:has-text("Your order confirmation")');
  console.log("Email opened, scrolling to the bottom...");
  await page.waitForSelector("div.aeJ");
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const element = document.querySelector("div.aeJ");
      const totalScroll = element.scrollHeight - element.clientHeight;
      const step = totalScroll / 60;
      let scrolled = 0;
      const scrollDown = setInterval(() => {
        if (scrolled < totalScroll) {
          element.scrollBy(0, step);
          scrolled += step;
        } else {
          clearInterval(scrollDown);
          resolve();
        }
      }, 100);
    });
  });
  console.log(
    "Scrolling completed, looking for the 'Log in to my account' button..."
  );
  await page.waitForSelector('img[alt="Log in to my account"]', {
    state: "visible",
  });
  console.log("'Log in to my account' button found, attempting to click...");
  await page.click('img[alt="Log in to my account"]');
  console.log("Clicked on 'Log in to my account', navigating to logout...");
  await page.goto("https://accounts.google.com/Logout", {
    waitUntil: "networkidle",
  });
  console.log("Logged out, navigating to the estimator login page...");
  await page.goto("https://estimatorstg.gunnerroofing.com/login");
  console.log("On login page, filling in credentials...");
  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "gunnerplaywright+022102@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value confirmed: ${emailValue}`);
  expect(emailValue).toBe("gunnerplaywright+022102@gmail.com");

  await page.waitForSelector("#mui-2", { state: "visible" });
  await page.fill("#mui-2", "123PWtest!");
  const passwordValue = await page.$eval("#mui-2", (el) => el.value);
  console.log(`Password Input Value confirmed: ${passwordValue}`);
  expect(passwordValue).toBe("123PWtest!");

  console.log("Attempting to sign in...");
  await page.click('button:has-text("SIGN IN")');
  console.log("Signed in, verifying sign-in and waiting for page actions...");
  await page.waitForSelector(".myAccount_paymentScheduleItem__EZLf8", {
    visible: true,
  });
  console.log("Account page loaded, scrolling to bottom of page...");
  await page.evaluate(() => {
    const targetElement = document.querySelector(
      ".myAccount_paymentScheduleItem__EZLf8"
    );
    if (targetElement) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000;
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
  console.log("Scrolled to bottom");

  await page.waitForTimeout(2000);

  console.log("Scrolling back up to 'Sign Contract' button...");

  await page.evaluate(() => {
    const signContractButton = Array.from(
      document.querySelectorAll("button")
    ).find((button) => button.textContent === "Sign Contract");
    if (signContractButton) {
      signContractButton.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });

  console.log("Scroll to 'Sign Contract' button completed.");

  console.log("Attempting to click 'Sign Contract' button...");

  await page.click('button:has-text("Sign Contract")');

  console.log("'Sign Contract' button clicked.");
});

module.exports = {
  timeout: 360000,
};
