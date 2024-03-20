const { test, expect } = require("@playwright/test");
const colors = require("colors");

test("Verisk Low Price", async ({ page }) => {
  console.log("Navigating to the login page...".yellow);
  await page.goto(
    "https://apistg.gunnerroofing.com/wp-login.php?loggedout=true&wp_lang=en_US"
  );

  const loginFormVisible = await page.isVisible("form#loginform");
  console.log("Checking if login form is visible:".yellow, loginFormVisible);
  expect(loginFormVisible).toBeTruthy();

  console.log("Filling in the username...".yellow);
  await page.fill("#user_login", "mherring@clickherelabs.com");

  console.log("Filling in the password...".yellow);
  await page.fill("#user_pass", "MnSJune07!BTMJ");

  console.log("Submitting the login form...".yellow);
  await page.click("#wp-submit");

  console.log("Navigating to 'Estimator Admin'...".yellow);
  await page.click('text="Estimator Admin"');

  console.log("Going to the projects page...".yellow);
  await page.click(
    'a[href="admin.php?page=ge-settings&view=projects&status=unpaid"]'
  );

  console.log("Selecting project 45917...".yellow);
  await page.click('text="45917"');

  console.log("Waiting for the address information to load...".yellow);
  await page.waitForSelector(".project_info .row .col-md-12 a", {
    state: "attached",
  });

  console.log("Waiting for the address information to load...".yellow);
  await page.waitForSelector(".project_info .row .col-md-12", {
    state: "attached",
  });

  await page.waitForSelector(".project_info .row .col-md-12 a", {
    state: "attached",
  });
  const streetAddress = await page.textContent(
    ".project_info .row .col-md-12 a"
  );
  console.log(`Street address found: ${streetAddress}`.yellow);
  expect(streetAddress).toContain("220 13th Terrace North");

  const cityStateZip = await page.textContent(
    ".project_info .row .col-md-12:has-text('Birmingham, AL 35204')"
  );
  console.log(`City, State, ZIP found: ${cityStateZip}`.yellow);
  expect(cityStateZip).toContain("Birmingham, AL 35204");

  await page.waitForSelector(
    '.project_info_header.font-bold.pb-2:has-text("Verisk Estimate (Average)")'
  );
  const projectInfoHeaderText = await page.textContent(
    ".project_info_header.font-bold.pb-2"
  );
  console.log("Average text found", projectInfoHeaderText);
  expect(projectInfoHeaderText).toContain("Customer");

  console.log("Navigating back to the previous page...".yellow);
  await page.goBack();

  console.log("Selecting project 45970...".yellow);
  await page.click('text="45970"');

  console.log("Waiting for the project 45970 address information to load...".yellow);
  await page.waitForSelector(".project_info .row .col-md-12", {
    state: "attached",
  });

  await page.waitForSelector(
    ".project_info .row .col-md-12 a[target='_project']",
    { state: "attached" }
  );
  const streetAddres = await page.textContent(
    ".project_info .row .col-md-12 a[target='_project']"
  );
  console.log(`Street address found: ${streetAddres}`.yellow);
  expect(streetAddres).toContain("15 Butternut Hollow Rd");

  const cityStateZips = await page.textContent(
    ".project_info .row .col-md-12:has-text('Greenwich, CT 06830')"
  );
  console.log(`City, State, ZIP found: ${cityStateZips}`.yellow);
  expect(cityStateZips).toContain("Greenwich, CT 06830");

  await page.waitForSelector(
    '.project_info_header.font-bold.pb-2:has-text("Verisk Estimate (Average)")'
  );
  const projectInfoHeaderTexts = await page.textContent(
    ".project_info_header.font-bold.pb-2"
  );
  console.log("Average text found", projectInfoHeaderTexts);
  expect(projectInfoHeaderTexts).toContain("Customer");

  console.log("Navigating back to the previous page...".yellow);
  await page.goBack();

  console.log("Selecting project 45980...".yellow);
  await page.click('text="45980"');

  console.log("Waiting for the project 45980 address information to load...".yellow);
  await page.waitForSelector(".project_info .row .col-md-12", {
    state: "attached",
  });

  await page.waitForSelector(
    ".project_info .row .col-md-12 a[target='_project']",
    { state: "attached" }
  );
  const streetAddresss = await page.textContent(
    ".project_info .row .col-md-12 a[target='_project']"
  );
  console.log(`Street address found: ${streetAddresss}`.yellow);
  expect(streetAddresss).toContain("2308 Alsace Road");

  const cityStateZipss = await page.textContent(
    ".project_info .row .col-md-12:has-text('Reading, PA 19604')"
  );
  console.log(`City, State, ZIP found: ${cityStateZipss}`.yellow);
  expect(cityStateZipss).toContain("Reading, PA 19604");

  await page.waitForSelector(
    '.project_info_header.font-bold.pb-2:has-text("Verisk Estimate (Low)")'
  );
  const projectInfoHeaderTextss = await page.textContent(
    ".project_info_header.font-bold.pb-2"
  );
  console.log("Low text found", projectInfoHeaderTextss);
  expect(projectInfoHeaderTextss).toContain("Customer");

  console.log("Navigating back to the previous page...".yellow);
  await page.goBack();

  console.log("Selecting project 45994...".yellow);
  await page.click('text="45994"');

  console.log("Waiting for the project 45994 address information to load...".yellow);
  await page.waitForSelector(".project_info .row .col-md-12", {
    state: "attached",
  });

  await page.waitForSelector(
    ".project_info .row .col-md-12 a[target='_project']",
    { state: "attached" }
  );
  const streetAddressss = await page.textContent(
    ".project_info .row .col-md-12 a[target='_project']"
  );
  console.log(`Street address found: ${streetAddressss}`.yellow);
  expect(streetAddressss).toContain("1501 Alsace Road");

  const cityStateZipsss = await page.textContent(
    ".project_info .row .col-md-12:has-text('Reading, PA 19604')"
  );
  console.log(`City, State, ZIP found: ${cityStateZipsss}`.yellow);
  expect(cityStateZipsss).toContain("Reading, PA 19604");

  await page.waitForSelector(
    '.project_info_header.font-bold.pb-2:has-text("Verisk Estimate (Low)")'
  );
  const projectInfoHeaderTextsss = await page.textContent(
    ".project_info_header.font-bold.pb-2"
  );
  console.log("Low text found", projectInfoHeaderTextsss);
  expect(projectInfoHeaderTextsss).toContain("Customer");


});
