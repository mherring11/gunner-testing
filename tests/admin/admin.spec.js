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

test("Admin Page", async ({ page }) => {
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
  if (projectIds.length > 0) {
    const { projectId, address } = projectIds[0]; 
    console.log(
      `Processing project ID: ${projectId}, Address: ${address}`.yellow
    );

    for (const { projectId, address } of projectIds) {
      const projectIDSelector = `a[href*="project=${projectId}"]`;
      const addressText = address.replace(/,\s+/g, ", ").trim();

      const projectIDExists = await page.isVisible(projectIDSelector);
      console.log(`Project ID ${projectId} visibility:`, projectIDExists);
      expect(projectIDExists).toBeTruthy();

      const addressSelector = `a[href*="project=${projectId}"]:has-text("${
        addressText.split(",")[0]
      }")`;
      const addressExists = await page.isVisible(addressSelector);
      console.log(`Address ${addressText} visibility:`, addressExists);
      expect(addressExists).toBeTruthy();

      if (projectIDExists && addressExists) {
        console.log(`Clicking on project ID ${projectId} link...`.yellow);
        await Promise.all([
          page.waitForNavigation(),
          page.click(projectIDSelector),
        ]);

        console.log(
          `Navigated to project ID ${projectId} details page.`.yellow
        );
      }
    }

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
      iframeBoundingBox.y + canvasBoundingBox.y + canvasBoundingBox.height / 2;

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

  await page.goBack();
  console.log("Navigated back a page.".yellow);

  for (const project of projectIds) {
    const expectedHref = `/wp-admin/admin.php?page=ge-settings&view=projects&project=${project.projectId}`;

    const formattedAddress = project.address
      .replace(/, /g, ", ")
      .replace(/&/g, "&amp;");

    const linkSelector = `a[href="${expectedHref}"]:has-text("${formattedAddress}")`;

    if (await page.isVisible(linkSelector)) {
      console.log(
        `Verified link for project ID ${project.projectId} with address "${project.address}" is correctly linked.`
          .yellow
      );
    } else {
      console.error(
        `Link for project ID ${project.projectId} with address "${project.address}" is not correctly linked or visible.`
          .red
      );
    }
  }

  for (const project of projectIds) {
    const expectedHref = `/wp-admin/admin.php?page=ge-settings&view=projects&project=${project.projectId}`;

    const linkSelector = `a[href="${expectedHref}"]`;

    if (await page.isVisible(linkSelector)) {
      console.log(
        `Verified link for project ID ${project.projectId} is correctly linked to its project record.`
          .yellow
      );
    } else {
      console.error(
        `Link for project ID ${project.projectId} is not correctly linked to its project record or not visible.`
          .red
      );
    }
  }

  for (const project of projectIds) {
   
    const projectLinkSelector = `a[href*="/wp-admin/admin.php?page=ge-settings&view=projects&project=${project.projectId}"]`;

  
    if (await page.isVisible(projectLinkSelector)) {
      
      await Promise.all([
        page.waitForNavigation(),
        page.click(projectLinkSelector),
      ]);

      console.log(
        `Clicked on the project ID link for project ID: ${project.projectId}.`
          .yellow
      );

     
      const currentUrl = page.url();
      const expectedUrlPart = `/wp-admin/admin.php?page=ge-settings&view=projects&project=${project.projectId}`;
      if (currentUrl.includes(expectedUrlPart)) {
        console.log(
          `Successfully verified navigation for project ID: ${project.projectId}.`
            .green
        );
      } else {
        console.error(
          `Failed to navigate to the expected URL for project ID: ${project.projectId}. Current URL: ${currentUrl}`
            .red
        );
      }
    } else {
      console.error(
        `Link for project ID ${project.projectId} is not visible or correctly linked to its project record.`
          .red
      );
    }
  }

  for (const project of projectIds) {
   
    const simplifiedAddress = project.address.split(",")[0]; 

   
    const expectedHref = `/wp-admin/post.php?post=${project.projectId}&action=edit`;

   
    const projectLinkSelector = `a[href*="/wp-admin/post.php?post=${project.projectId}&action=edit"]`;
await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }), 
    page.click(projectLinkSelector),
]);


const currentUrl = page.url();
const expectedUrl = `https://apistg.gunnerroofing.com/wp-admin/post.php?post=${project.projectId}&action=edit`;
if (!currentUrl.includes(expectedUrl)) {
    console.error(`Failed to navigate to the expected URL for project ID: ${project.projectId}. Current URL: ${currentUrl}`);
    return; 
}


const uniqueElement = 'input#post-title'; 
const elementVisible = await page.isVisible(uniqueElement, { timeout: 10000 }).catch(e => {
    console.error(`Error waiting for the unique element ${uniqueElement}: ${e.message}`);
    return false; 
});

if (elementVisible) {
    console.log(`Verified unique element on edit page for project ID: ${project.projectId}.`.yellow);
} else {
    console.error(`Unique element ${uniqueElement} not visible on the page for project ID: ${project.projectId}.`);
   
    await page.screenshot({ path: `debug_project_${project.projectId}.png` });
}

  }
});
