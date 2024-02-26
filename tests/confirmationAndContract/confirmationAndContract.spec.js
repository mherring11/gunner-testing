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
  test.setTimeout(360000);
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
  await page.fill("#mui-1", "gunnerplaywright+022302@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value confirmed: ${emailValue}`);
  expect(emailValue).toBe("gunnerplaywright+022302@gmail.com");

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

  await page.waitForNavigation({
    url: (url) => url.href.startsWith("https://na4.docusign.net/Signing/"),
    waitUntil: "networkidle",
    timeout: 60000 // Increase timeout to 60 seconds
  });
  

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
  timeout: 360000,
};
