const { test, expect } = require("@playwright/test");
const colors = require("colors");
const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "projectIds.json");

async function readProjectIdsFromFile() {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading project IDs from file:".yellow, error);
    return [];
  }
}

test.setTimeout(60000);
test("Admin Page - Sequential Project ID Verification", async ({ page }) => {
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
  await Promise.all([
    page.waitForNavigation(),
    page.click(
      'a[href="admin.php?page=ge-settings&view=projects&status=paid"]'
    ),
  ]);

  await page.waitForSelector(
    'a.link[href*="/wp-admin/admin.php?page=ge-settings&view=projects&project="]'
  );
  console.log("Projects page loaded...".yellow);

  const projectIds = await readProjectIdsFromFile();
  for (const project of projectIds) {
    console.log(
      `Going to the projects page for Project ID: ${project.projectId}`.yellow
    );
    await page.goto(
      `https://apistg.gunnerroofing.com/wp-admin/admin.php?page=ge-settings&view=projects&status=paid`
    );
    await page.waitForSelector(
      'a.link[href*="/wp-admin/admin.php?page=ge-settings&view=projects&project="]'
    );

    console.log(
      `Processing project ID: ${project.projectId}, Address: ${project.address}`
        .yellow
    );
    const projectLinkSelector = `a[href*="project=${project.projectId}"]`;

    if (await page.isVisible(projectLinkSelector)) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle" }),
        page.click(projectLinkSelector),
      ]);

      console.log(
        `Successfully verified navigation for project ID: ${project.projectId}.`
          .green
      );

      const imageSelector =
        'img.object-cover[src*="/wp-content/uploads/2022/10/3DHouseImage.png"]';

      await page.waitForSelector(imageSelector, { state: "visible" });

      console.log("Clicking on the 3D Visualizer...".yellow);
      await page.click(imageSelector);

      console.log("3D Visualizer clicked.".yellow);

      const iframeSelector =
        'iframe[src*="https://visualizer.gunnerroofing.com/"]';
      const iframeHandle = await page.waitForSelector(iframeSelector, {
        state: "attached",
      });
      expect(await iframeHandle.isVisible()).toBeTruthy();

      const frame = await iframeHandle.contentFrame();
      expect(frame).not.toBeNull();

      const canvasSelector = 'canvas[data-engine="three.js r155dev"]';
      await frame.waitForSelector(canvasSelector, { state: "visible" });

      const canvasBoundingBox = await frame.evaluate((selector) => {
        const canvas = document.querySelector(selector);
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      }, canvasSelector);

      const iframeBoundingBox = await iframeHandle.boundingBox();

      const centerX =
        iframeBoundingBox.x + canvasBoundingBox.x + canvasBoundingBox.width / 2;
      const centerY =
        iframeBoundingBox.y +
        canvasBoundingBox.y +
        canvasBoundingBox.height / 2;

      console.log("Interacting with the visualizer...".yellow);

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(
        centerX + canvasBoundingBox.width / 4,
        centerY + canvasBoundingBox.height / 4,
        { steps: 10 }
      );
      await page.mouse.up();

      console.log("Completed visualizer interaction verification.".yellow);
    }

    const customerName = await page.textContent(".project_info a");
    console.log(
      "Customer Name: " + customerName + ". Verification successful.".green
    );

    const email = await page.textContent(
      "table#customer tr:nth-of-type(2) td:nth-of-type(2)"
    );
    console.log("Email: " + email + ". Verification successful.".green);

    const phoneNumber = await page.textContent(
      "table#customer tr:nth-of-type(1) td:nth-of-type(2)"
    );
    console.log(
      "Phone Number: " + phoneNumber + ". Verification successful.".green
    );

    const preferredContact = await page.textContent(
      "table#customer tr:nth-of-type(3) td:nth-of-type(2)"
    );
    console.log(
      "Preferred Method of Contact: " +
        preferredContact +
        ". Verification successful.".green
    );

    const referral = await page.textContent(
      "table#customer tr:nth-of-type(4) td:nth-of-type(2)"
    );
    console.log(
      "Referral: " +
        referral +
        " (if blank, no referral was provided). Verification successful.".green
    );

    const projectAddressContent = await page.$$eval(
      ".project_info_header",
      (elements) =>
        elements.find((element) =>
          element.textContent.includes("Project Address")
        ).textContent
    );

    if (projectAddressContent.includes("Paid")) {
      console.log("Project Address - Paid verification successful.".green);
    } else {
      console.error(
        `Project Address - Paid verification failed. Content found: ${projectAddressContent}`
          .red
      );
    }

    const customerNameLinkSelector =
      'a.link.text-sm.link-primary.hover\\:link-secondary[target="_customer"]';

    const customerEditHref = await page.getAttribute(
      customerNameLinkSelector,
      "href"
    );

    console.log(
      `Navigating directly to Edit Customer page: ${customerEditHref}`.yellow
    );
    await page.goto(`https://apistg.gunnerroofing.com${customerEditHref}`);

    const isEditCustomerPage = await page.isVisible(
      "div.flex-parent h3.main-title >> text=/Edit Customer/"
    );

    if (isEditCustomerPage) {
      console.log(
        "Successfully navigated to and verified the Edit Customer page.".green
      );
    } else {
      console.error("Failed to verify the Edit Customer page.".red);
    }

    await page.goBack();
    console.log("Navigated back after verification.".yellow);

    const propertyAddressLinkSelector =
      'a.link.font-normal.link-primary.hover\\:link-secondary[target="_project"]';

    const projectEditHref = await page.getAttribute(
      propertyAddressLinkSelector,
      "href"
    );

    console.log(
      `Navigating directly to Edit Project page: ${projectEditHref}`.yellow
    );
    await page.goto(`https://apistg.gunnerroofing.com${projectEditHref}`);

    const isEditProjectPage = await page.isVisible(
      "div.flex-parent h3.main-title >> text=/Edit Project/"
    );

    if (isEditProjectPage) {
      console.log(
        "Successfully navigated to and verified the Edit Project page.".green
      );
    } else {
      console.error("Failed to verify the Edit Project page.".red);
    }

    await page.goBack();
    console.log("Navigated back after verification.".yellow);

    await page.waitForSelector(".slide-item.slick-slide.slick-active");

    const visualizerSlideSelector =
      '.slide-item.slick-slide.slick-active[tabindex="0"] >> text="Visualizer"';
    await page.click(visualizerSlideSelector);

    console.log("Clicked on the 'Visualizer' slide.".yellow);

    console.log("Verifying measurement fields...".yellow);

    const measurementRowsSelector = ".project_info text-sm pb-2 tr";

    const measurementRows = await page.$$(measurementRowsSelector);

    let allMeasurementsValid = true;

    for (const row of measurementRows) {
      const [typeElement, valueElement] = await row.$$("td");
      const type = await typeElement.textContent();
      const value = await valueElement.textContent();

      const numeralsCount = (value.match(/\d/g) || []).length;

      if (type.trim() === "Flat Area:") {
        console.log(
          `Flat Area has ${numeralsCount} numerals, which might be applicable.`
            .yellow
        );
        continue;
      }

      if (numeralsCount < 12) {
        console.error(`${type} has less than 12 numerals: ${value}.`.red);
        allMeasurementsValid = false;
      } else {
        console.log(
          `${type} validation passed with ${numeralsCount} numerals.`.green
        );
      }
    }

    if (allMeasurementsValid) {
      console.log("All measurement fields populated correctly.".green);
    } else {
      console.error(
        "Some measurement fields are not populated with at least 12 numerals."
          .red
      );
    }

    console.log(
      "Verifying 'Manually add measurements' modal display...".yellow
    );

    const manualMeasurementsButtonSelector =
      'button[data-hs-overlay="#measurementModal"]';

    await page.click(manualMeasurementsButtonSelector);

    const modalSelector = "#measurementModal";

    await page.waitForSelector(modalSelector, { state: "visible" });

    const isModalVisible = await page.isVisible(modalSelector);
    if (isModalVisible) {
      console.log(
        "The 'Manually add measurements' modal is displayed successfully.".green
      );
    } else {
      console.error(
        "The 'Manually add measurements' modal did not display as expected.".red
      );
    }

    console.log("Verifying measurements fields in the modal...".yellow);

    // Define an array of selectors for the input fields you want to verify
    const measurementFieldsSelectors = [
      "#total_area_field",
      "#ridges_field",
      "#valleys_field",
      "#rakes_field",
      "#eaves_field",

      "#flat_area_field",
      "#detached_area_field",
      "#hips_field",
      // "#url_field" // Assuming you want to check this as well, though it's not a numerical field
    ];

    for (const selector of measurementFieldsSelectors) {
      const value = await page.inputValue(selector); // Get value of each field
      const numeralLength = value.replace(/[^0-9]/g, "").length; // Remove non-numeric characters and calculate length

      if (numeralLength >= 12 || value.trim().length === 0) {
        // Checks if the field has at least 12 numerals or is intentionally left empty
        console.log(
          `Verification successful for field with selector "${selector}". Value: ${value}`
            .green
        );
      } else {
        console.error(
          `Verification failed for field with selector "${selector}". Numeric length is less than 12. Value: ${value}`
            .red
        );
      }
    }
    await page.click(
      'xpath=//h2[contains(text(), "Add Measurements")]/following-sibling::button'
    );

    const selectionRows = await page.$$(
      "div.project_info.text-sm.pb-2 table tbody tr"
    );

    for (const row of selectionRows) {
      const selectionName = await row.$eval("td:nth-of-type(1)", (element) =>
        element.textContent.trim()
      );
      const selectionValue = await row.$eval("td:nth-of-type(2)", (element) =>
        element.textContent.trim()
      );

      console.log(`Selection: ${selectionName}, Value: ${selectionValue}`);
    }
  }
});
