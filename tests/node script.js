// Import dependencies
const { chromium } = require('playwright');

// Function to demonstrate opening a new tab, interacting with it, and returning to the original tab
async function interactWithNewTabAndReturn(url, openSelector, actionSelector) {
    const browser = await chromium.launch({ headless: false });
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(url);
  
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        page.click(openSelector),
      ]);
  
      await newPage.waitForLoadState();
      console.log('New Page URL:', newPage.url());
      await newPage.close();
      await page.bringToFront();
      await page.click(actionSelector);
    } catch (error) {
      console.error('Error during interaction with new tab:', error);
    } finally {
      await browser.close();
    }
  }
  
  // Usage example:
  interactWithNewTabAndReturn(
    'https://estimatorstg.gunnerroofing.com/result?pid=44250',
    'a[href="/sow"]:has-text("See full description of work")',
    'button:has-text("CHECKOUT & MEET YOUR TEAM")'
  );

  // Export the function
module.exports = interactWithNewTabAndReturn;
  