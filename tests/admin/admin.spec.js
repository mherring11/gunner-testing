const { test, expect } = require("@playwright/test");
const colors = require("colors");

test("Admin Page", async ({ page }) => {
  await page.goto(
    "https://apistg.gunnerroofing.com/wp-login.php?loggedout=true&wp_lang=en_US"
  );

  const loginFormVisible = await page.isVisible("form#loginform");
  expect(loginFormVisible).toBeTruthy();

  await page.fill("#user_login", "mherring@clickherelabs.com");

  await page.fill("#user_pass", "MnSJune07!BTMJ");

  await page.click("#wp-submit");

  await page.click('text="Estimator Admin"');

  await page.click(
    'a[href="admin.php?page=ge-settings&view=projects&status=paid"]'
  );



  
});
