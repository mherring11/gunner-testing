// Import the Playwright test function and the axios HTTP client
const { test } = require('@playwright/test');
const axios = require('axios');

// Asynchronously fetch data from an external API sheet
async function fetchDataFromSheet() {
    try {
        // Make an HTTP GET request to the API endpoint
        const response = await axios.get('https://app.apisheet.io/v1/pLKq7XK0/gunner_estimator1', {
            headers: {
                'Authorization': `Bearer 4aas6f8oanh-i5x7uu2xacn` // Authorization token for API access
            }
        });
        console.log("Data fetched successfully:", response.data);
        return response.data; // Return the fetched data
    } catch (error) {
        console.error("Error fetching data from sheet:", error);
        return []; // Return an empty array in case of an error
    }
}

// Define a test case to register accounts from fetched sheet data
test('Register accounts from sheet data', async ({ page }) => {
    const sheetData = await fetchDataFromSheet(); // Fetch data to be used in the test
    // If no data is fetched, log an error and return early
    if (sheetData.length === 0) {
        console.error("Failed to fetch data from the sheet or no data available");
        return;
    }

    test.setTimeout(180000); // Set a global timeout for the test to 3 minutes

    // Iterate over each user data entry
    for (const { userEmail, firstName, lastName, password, streetAddress, city, state, zip, phone } of sheetData) {
        console.log(`Registering account for email: ${userEmail}`);
        // Navigate to the registration page
        await page.goto('https://estimatorstg.gunnerroofing.com/register');
        console.log("Page loaded.");

        try {
            // Fill in the registration form with user data
            await page.fill('#mui-2', userEmail);
            await page.fill('#login_firstNameInput__83jKa', firstName);
            await page.fill('#mui-1', lastName);
            await page.fill('#mui-3', password);
            await page.fill('#mui-4', password);
            await page.click('button:has-text("NEXT STEP")')
            await page.fill('#mui-5', streetAddress);
            await page.fill('#mui-7', city);
            await page.click('#login_state__00tza'); 
            await page.waitForSelector('ul[role="listbox"] >> text="' + state + '"');
            await page.click('ul[role="listbox"] >> text="' + state + '"'); 
            await page.fill('#mui-8', zip);
           
            await page.fill('#mui-9', phone);
            

            await page.waitForLoadState('networkidle');
            // Handle dynamic questions, clicking "YES" or "NO" as appropriate
            const yesButtons = await page.$$(`button[value="YES"]`);
            for (const button of yesButtons) {
                await button.waitForElementState('stable');
                await button.click({ force: true });  
            }

            const callButtonSelector = 'button[value="Call"]:has-text("CALL")';
            await page.waitForSelector(callButtonSelector, { state: 'attached' });
            const callButton = await page.$(callButtonSelector);
            // Handle the call button visibility and click it if it's visible
            if (callButton && await callButton.isVisible()) {
                await callButton.waitForElementState('stable');
                await callButton.click();     
            }
            // Check if the insurance question is visible and handle it if it is
            const insuranceQuestionVisible = await page.isVisible('text="Will this project be covered by insurance?"');
            if (insuranceQuestionVisible) {
                // If the question is visible, click the "NO" button
                const insuranceNoButton = await page.waitForSelector('text="Will this project be covered by insurance?" >> ../.. >> button[value="NO"]');
                await insuranceNoButton.click({ force: true });
                console.log('Clicked insurance NO button.');    
            }
            // Submit the form and wait for the confirmation that the quote is being generated
            await page.click('button:has-text("submit")');
            await page.waitForSelector('text="Your quote is being generated."');
            console.log('Form submitted, waiting for confirmation page.');

            // Log out from the session to start anew for the next registration
            await page.click('li#logOutNavBtn >> text="Log Out"');

            await context.clearCookies();
            await context.clearPermissions();
            await page.evaluate(() => localStorage.clear());
            console.log('Session data cleared.');

            // Navigate back to the registration page for the next user
            await page.goto('https://estimatorstg.gunnerroofing.com/register');
            console.log("Returned to the registration page.");
        } catch (error) {
            // If an error occurs, log it and continue with the next user
            console.error(`Error with data for email ${userEmail}:`, error);
            continue;
        }
    }
});

// Export a configuration object for Playwright
module.exports = {
    timeout: 180000 // Global timeout for all actions set to 3 minutes
};
