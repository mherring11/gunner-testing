const { test, expect } = require("@playwright/test");
const axios = require("axios");
const colors = require('colors');


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
test.setTimeout(120000);
test('Check "Contract and My Account"', async ({ browser }) => {
  console.log("Starting test to check the order confirmation email...");
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Logged out, navigating to the estimator login page...");
  await page.goto("https://estimatorstg.gunnerroofing.com/login");
  console.log("On login page, filling in credentials...");
  await page.waitForSelector("#mui-1", { state: "visible" });
  await page.fill("#mui-1", "gunnerplaywright+0308c@gmail.com");
  const emailValue = await page.$eval("#mui-1", (el) => el.value);
  console.log(`Email Input Value confirmed: ${emailValue}`);
  expect(emailValue).toBe("gunnerplaywright+0308c@gmail.com");

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
const baseURL = 'https://estimatorstg.gunnerroofing.com';

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
        
        // Concatenate base URL with href to form a complete URL
        const fullURL = baseURL + href;

        // Use page.goto() to navigate in the same tab to the complete URL
        await page.goto(fullURL);
        // Add your subsequent code here for what needs to be done on the /sow page
    } else {
        console.error(`Verification failed: The link href '${href}' does not match the expected '${expectedHref}'.`.yellow);
    }

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
  console.log(guttersTexts ? `Verified: Gutters Section Text: ${guttersTexts}` : "Gutters section not found or text missing.".yellow);

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
  console.log(skylightsTexts ? `Verified: Skylights Section Text: ${skylightsTexts}` : "Skylights section not found or text missing.".yellow);


// Selector that targets the link by its class and the text it contains
const myAccountLinkSelector = 'a.nav-link:has-text("My Account")';

// Wait for the "My Account" link to be visible on the page
await page.waitForSelector(myAccountLinkSelector, { state: 'visible' });

// Click on the "My Account" link
await page.click(myAccountLinkSelector);



// Wait for the total price to be displayed without "Loading..."
await page.waitForFunction(() => {
  const pElements = [...document.querySelectorAll('p')]; // Get all <p> elements
  const totalPriceElement = pElements.find(p => p.textContent.startsWith('Total: $')); // Find the <p> element that includes the total price
  return totalPriceElement && !totalPriceElement.textContent.includes('Loading...'); // Check if the text is not "Loading..."
});

// After waiting, fetch the total price text again
const totalPriceElement = await page.$('p:has-text("Total: $")'); // Use Playwright's :has-text pseudo-class to find the element
const totalPriceText = await totalPriceElement.textContent();
const totalPrice = parseFloat(totalPriceText.replace(/[^0-9.]/g, ""));

// Verification logic
if (!isNaN(totalPrice) && totalPrice > 0) {
  console.log(`Verification successful: The total price of $${totalPrice} is present on the page and properly formatted.`.yellow);
} else {
  console.error(`Verification failed: The total price is either not present, not properly formatted, or not greater than zero.`.yellow);
}


  
  // Assuming totalPrice has already been calculated

// Calculate the expected 10% deposit from the total price
const expectedDepositPercentage = 0.10;
const expectedDepositAmount = totalPrice * expectedDepositPercentage;

// Selector for the element containing the deposit amount
const depositSelector = 'li.myAccount_paymentScheduleItem__EZLf8:has-text("10% down")';

// Wait for the deposit element to be visible and fetch its text
await page.waitForSelector(depositSelector, { state: 'visible' });
const depositText = await page.textContent(depositSelector);

// Extract the numerical value from the deposit text
const depositAmountMatches = depositText.match(/[\d,]+\.\d{2}/); // Match the currency format
let depositAmount = depositAmountMatches ? parseFloat(depositAmountMatches[0].replace(/,/g, '')) : null; // Convert to float and handle commas

// Verification logic to check if the displayed deposit matches the expected 10% deposit
if (depositAmount && Math.abs(depositAmount - expectedDepositAmount) < 0.01) { // Allows for slight rounding differences
  console.log(`Verification successful: The initial 10% deposit amount of $${depositAmount.toFixed(2)} matches the expected amount of $${expectedDepositAmount.toFixed(2)}.`.yellow);
} else {
  console.error(`Verification failed: The displayed deposit amount of $${depositAmount ? depositAmount.toFixed(2) : "N/A"} does not match the expected 10% deposit amount of $${expectedDepositAmount.toFixed(2)}.`.yellow);
}


// Assuming totalPrice has already been calculated

// Calculate the expected 60% payment from the total price
const expectedSecondPaymentPercentage = 0.60;
const expectedSecondPaymentAmount = totalPrice * expectedSecondPaymentPercentage;

// Selector for the element containing the 60% second payment amount
const secondPaymentSelector = 'li.myAccount_paymentScheduleItem__EZLf8:has-text("60% upon start of project")';

// Wait for the second payment element to be visible and fetch its text
await page.waitForSelector(secondPaymentSelector, { state: 'visible' });
const secondPaymentText = await page.textContent(secondPaymentSelector);

// Extract the numerical value from the second payment text
const secondPaymentAmountMatches = secondPaymentText.match(/[\d,]+\.\d{2}/); // Match the currency format
let secondPaymentAmount = secondPaymentAmountMatches ? parseFloat(secondPaymentAmountMatches[0].replace(/,/g, '')) : null; // Convert to float and handle commas

// Verification logic to check if the displayed second payment matches the expected 60% payment
if (secondPaymentAmount && Math.abs(secondPaymentAmount - expectedSecondPaymentAmount) < 0.01) { // Allows for slight rounding differences
  console.log(`Verification successful: The 60% second payment amount of $${secondPaymentAmount.toFixed(2)} matches the expected amount of $${expectedSecondPaymentAmount.toFixed(2)}.`.yellow);
} else {
  console.error(`Verification failed: The displayed second payment amount of $${secondPaymentAmount ? secondPaymentAmount.toFixed(2) : "N/A"} does not match the expected 60% payment amount of $${expectedSecondPaymentAmount.toFixed(2)}.`.yellow);
}



 // Assuming totalPrice has already been calculated

// Calculate the expected 30% final payment from the total price
const expectedFinalPaymentPercentage = 0.30;
const expectedFinalPaymentAmount = totalPrice * expectedFinalPaymentPercentage;

// Selector for the element containing the final payment amount
const finalPaymentSelector = 'li.myAccount_paymentScheduleItem__EZLf8:has-text("30% upon completion")';

// Wait for the final payment element to be visible and fetch its text
await page.waitForSelector(finalPaymentSelector, { state: 'visible' });
const finalPaymentText = await page.textContent(finalPaymentSelector);

// Extract the numerical value from the final payment text
const finalPaymentAmountMatches = finalPaymentText.match(/[\d,]+\.\d{2}/); // Match the currency format
let finalPaymentAmount = finalPaymentAmountMatches ? parseFloat(finalPaymentAmountMatches[0].replace(/,/g, '')) : null; // Convert to float and handle commas

// Verification logic to check if the displayed final payment matches the expected 30% payment
if (finalPaymentAmount && Math.abs(finalPaymentAmount - expectedFinalPaymentAmount) < 0.01) { // Allows for slight rounding differences
  console.log(`Verification successful: The final payment amount of $${finalPaymentAmount.toFixed(2)} matches the expected amount of $${expectedFinalPaymentAmount.toFixed(2)}.`.yellow);
} else {
  console.error(`Verification failed: The displayed final payment amount of $${finalPaymentAmount ? finalPaymentAmount.toFixed(2) : "N/A"} does not match the expected final payment amount of $${expectedFinalPaymentAmount.toFixed(2)}.`.yellow);
}



// Fetch the total price text from the page and calculate the total price
const totalPriceTexts = await page.textContent('p:has-text("Total:")');
const totalPrices = parseFloat(totalPriceTexts.replace(/[^0-9.,]/g, "").replace(',', ''));

// Fetch all the payment items that have been marked as "(Paid)"
const paidPaymentItems = await page.$$eval('.myAccount_paymentScheduleItem__EZLf8:has-text("(Paid)")', items =>
  items.map(item => parseFloat(item.textContent.replace(/[^0-9.,]/g, "").replace(',', '')))
);

// Calculate the total paid amount
const totalPaid = paidPaymentItems.reduce((sum, current) => sum + current, 0);

// Calculate the expected remaining balance
const expectedRemainingBalance = totalPrices - totalPaid;

// Fetch the displayed remaining balance from the page
const displayedRemainingBalanceText = await page.textContent('p:has-text("Balance Remaining:")');
const displayedRemainingBalance = parseFloat(displayedRemainingBalanceText.replace(/[^0-9.,]/g, "").replace(',', ''));

// Verification logic with a small margin for rounding errors
const discrepancy = Math.abs(expectedRemainingBalance - displayedRemainingBalance);
if (discrepancy < 0.01) { // Allowing for a penny difference
    console.log(`Verification successful: The displayed balance remaining of $${displayedRemainingBalance.toFixed(2)} matches the expected balance remaining of $${expectedRemainingBalance.toFixed(2)}.`.yellow);
} else {
    console.error(`Verification failed: The displayed balance remaining of $${displayedRemainingBalance.toFixed(2)} does not match the expected balance remaining of $${expectedRemainingBalance.toFixed(2)}. The discrepancy is $${discrepancy.toFixed(2)}.`.yellow);
}


// Wait for the Make Payment button to be visible and click it
await page.waitForSelector('.myAccount_makePaymentButton__984xT', { state: 'visible' });
await Promise.all([
  page.waitForNavigation(), // Wait for the page navigation to complete
  page.click('.myAccount_makePaymentButton__984xT'), // Click the Make Payment button
]);

// Verify the Make Payment page is displayed
const isOnMakePaymentPage = await page.waitForSelector('h1:text("Make Payment")', { state: 'attached' });
if (isOnMakePaymentPage) {
    console.log('Verification successful: Navigated to the Make Payment page.'.yellow);
} else {
    console.error('Verification failed: Did not navigate to the Make Payment page.'.yellow);
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


// Assume displayedRemainingBalance and expectedRemainingBalance are already defined as shown in previous examples

// Fetch the displayed remaining balance text from the specific <h2> tag
const displayedRemainingBalanceTexts = await page.textContent('h2:has-text("Remaining Balance:")');
const displayedRemainingBalanceFromPage = parseFloat(displayedRemainingBalanceTexts.split('$')[1].replace(/,/g, ''));

// Check if the displayed remaining balance matches the one we have (displayedRemainingBalance)
if (displayedRemainingBalanceFromPage === displayedRemainingBalance) {
    console.log(`Verification successful: The displayed balance remaining of $${displayedRemainingBalanceFromPage.toFixed(2)} matches the expected balance remaining of $${displayedRemainingBalance.toFixed(2)}.`.yellow);
} else {
    console.error(`Verification failed: The displayed balance remaining of $${displayedRemainingBalanceFromPage.toFixed(2)} does not match the expected balance remaining of $${displayedRemainingBalance.toFixed(2)}. The discrepancy is $${Math.abs(displayedRemainingBalanceFromPage - displayedRemainingBalance).toFixed(2)}.`.yellow);
}


// Calculate the expected 60% payment based on the total price
const expectedNextPayment = totalPrice * 0.60;

// Fetch the displayed next payment text from the specific <h3> tag
const displayedNextPaymentText = await page.textContent('h3:has-text("Next Payment:")');
const displayedNextPayment = parseFloat(displayedNextPaymentText.split('$')[1].replace(/,/g, ''));

// Verification logic
if (Math.abs(displayedNextPayment - expectedNextPayment) < 0.01) { // Allowing for a penny difference
    console.log(`Verification successful: The next payment of $${displayedNextPayment.toFixed(2)} matches the expected 60% payment of $${expectedNextPayment.toFixed(2)}.`.yellow);
} else {
    console.error(`Verification failed: The next payment of $${displayedNextPayment.toFixed(2)} does not match the expected 60% payment of $${expectedNextPayment.toFixed(2)}. The discrepancy is $${Math.abs(displayedNextPayment - expectedNextPayment).toFixed(2)}.`.yellow);
}



// Selector for the radio button by its name, type, and value attributes
const radioButtonSelector = 'input[name="paymentOption"][type="radio"][value="creditcard"]';

// Check if the radio button is visible on the page
const isRadioButtonVisible = await page.isVisible(radioButtonSelector);

// Verification logic
if (isRadioButtonVisible) {
    console.log('Verification successful: The radio button for "Cash/Check/Credit Card" is present.'.yellow);
} else {
    console.error('Verification failed: The radio button for "Cash/Check/Credit Card" is not present.'.yellow);
}


// Assuming the color value is directly next to the "Color:" title in the DOM structure
const colorInfoSelector = 'p.SelectionSummary_infoSubTitle__1V8ku';

// Finding the element that contains "Color:" text
const colorTitleElement = await page.$(colorInfoSelector);

// Use JavaScript to navigate the DOM and find the actual color value
const displayedRoofColor = await page.evaluate((el) => {
  // Assuming the color value is in the next element
  const nextElement = el.nextElementSibling;
  return nextElement ? nextElement.textContent : null;
}, colorTitleElement);

// Your expected roof color
const expectedRoofColors = "YourExpectedRoofColorHere";

// Verification logic
if (displayedRoofColor && displayedRoofColor.trim() === expectedRoofColors) {
    console.log(`Verification successful: The displayed roof color "${displayedRoofColor}" matches the expected roof color "${expectedRoofColors}".`.yellow);
} else {
    console.error(`Verification failed: The displayed roof color "${displayedRoofColor}" does not match the expected roof color "${expectedRoofColors}".`.yellow);
}





  // Fetch all displayed add-on elements and their prices
const addOnElements = await page.$$eval('.SelectionSummary_addonItem__SMI9D', (addOns) =>
addOns.map((addOn) => {
  // Assuming the add-on name is always present and the price is wrapped in a <span>
  const name = addOn.textContent.replace(/\$\d+,\d+\.\d+$/, '').trim(); // Extract name by removing the price part
  const priceText = addOn.querySelector('span') ? addOn.querySelector('span').textContent : ''; // Extract price
  const price = parseFloat(priceText.replace(/[^\d.]/g, '')); // Convert price text to float for verification
  return { name, priceText, price };
})
);

// Verify each displayed add-on for proper formatting and positive price
let verificationPassed = true;
addOnElements.forEach(({ name, priceText, price }) => {
if (name && priceText && !isNaN(price) && price > 0) {
  console.log(`Verified: "${name}" with price ${priceText} is correctly formatted and displayed.`.yellow);
} else {
  console.error(`Verification failed: Add-on "${name}" with price ${priceText} is incorrectly formatted or displayed.`.yellow);
  verificationPassed = false;
}
});

// Final verification status
if (verificationPassed) {
console.log('All add-ons are correctly formatted and displayed.'.yellow);
} else {
console.log('Some add-ons are incorrectly formatted or not displayed as expected.'.yellow);
}


// Selector for the "See full description of work" link
const linkSelectors = 'a[href="/sow"]:has-text("See full description of work")';

// Check if the link is displayed on the page
const isLinkVisible = await page.isVisible(linkSelectors);

// Verify the link's presence and correctness
if (isLinkVisible) {
    console.log('Verification successful: The "See full description of work" link is displayed and correctly points to "/sow".'.yellow);
} else {
    console.error('Verification failed: The "See full description of work" link is either not displayed or does not correctly point to "/sow".'.yellow);
}



// Selector for the displayed start date
const displayedStartDateSelector = 'p.SelectionSummary_infoDesc__HZv40';

// Wait for the subtitle to ensure the section is loaded
await page.waitForSelector(displayedStartDateSelector, { state: 'visible' });

// Retrieve the displayed start date
const displayedStartDate = await page.textContent(displayedStartDateSelector);

// Check if the displayed start date matches the expected format (e.g., YYYY-MM-DD)
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
if (datePattern.test(displayedStartDate)) {
    console.log(`Verification successful: The displayed start date "${displayedStartDate}" matches the expected format.`.yellow);
} else {
    console.error(`Verification failed: The displayed start date "${displayedStartDate}" does not match the expected format.`.yellow);
}




  await page.waitForTimeout(3000);

  await page.click('a:has-text("Log Out")');
  console.log("Clicked on 'Log Out' link.");
});
