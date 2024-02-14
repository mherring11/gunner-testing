const { test, expect } = require("@playwright/test");
const axios = require("axios");

// Asynchronously fetch data from an API sheet
async function fetchDataFromSheet() {
  try {
    const response = await axios.get(
      "https://app.apisheet.io/v1/x2OagYQ0/gunner_estimator4",
      {
        headers: { Authorization: `Bearer 3g7h3ke6qb8-dr506kc6cwp` },
      }
    );
    console.log("Data fetched successfully:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data from sheet:", error);
    return []; // Return an empty array in case of an error
  }
}

test("registration form test with API data", async ({ page }) => {
  // Fetch data from the sheet
  const formData = await fetchDataFromSheet();

  // Assuming formData is an array of objects, each representing form field values
  // Navigate to the registration page
  await page.goto("https://staging.gunnerroofing.com/register/");

  // Example of filling a form with the first item in the fetched data
  // Replace 'fieldName' with actual field identifiers and formData properties
  if (formData.length > 0) {
    const firstItem = formData[0]; // Assuming you want to use the first item
    await page.type('input[name="streetAddress"]', firstItem.streetAddress);
    await page.type('input[name="city"]', firstItem.city);
    await page.selectOption('select[name="state"]', firstItem.state);
    await page.type('input[name="zip"]', firstItem.zip); // Using the name attribute
    await page.type('input[name="phone"]', firstItem.phone);
    await page.type('input[name="firstName"]', firstItem.firstName); // Example, adjust accordingly
    await page.type('input[name="lastName"]', firstItem.lastName); // Example, adjust accordingly
    // Continue for other fields...
  }

  // Submit the form
  // await page.click('submit-button-selector'); // Adjust the selector as needed
});
