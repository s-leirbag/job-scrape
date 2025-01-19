import 'dotenv/config';
import puppeteer from "puppeteer";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fillJobForm(
  searchQueries,
  locations,
  sites = [],
  fileType = ""
) {
  const browser = await puppeteer.launch({
    headless: false, // Disable headless mode to see browser actions
    // slowMo: 50, // Add a delay between actions (in ms) to make it easier to observe
    // devtools: true, // Optional: Open DevTools automatically
  });

  const page = await browser.newPage();
  await page.goto("https://jobspy.bunsly.com/");
  await page.setViewport({ width: 1080, height: 1024 });

  // Select job boards
  await page.waitForSelector("#multi-select-outlined");
  await page.click("#multi-select-outlined");

  await page.waitForSelector('[role="listbox"]');
  for (const site of sites) {
    const menuItemSelector = `[role="option"][data-value="${site}"]`;
    await page.waitForSelector(menuItemSelector);
    const checkbox = await page.$(`${menuItemSelector} input[type="checkbox"]`);
    await checkbox.click();
  }

  await page.keyboard.press("Escape");

  // Wait for fullscreen container modal's disappear animation to finish
  await delay(500);

  // Select file type
  await page.waitForSelector("#outlined-select");
  await page.click("#outlined-select");

  await page.waitForSelector('[role="listbox"]');
  const menuItemSelector = `[role="option"][data-value="${fileType}"]`;
  await page.waitForSelector(menuItemSelector);
  const option = await page.$(`${menuItemSelector}`);
  await option.click();

  // Wait for fullscreen container modal's disappear animation to finish
  await delay(500);

  // Submit all combo's of queries and locations
  for (const searchQuery of searchQueries) {
    const queryInput = await page.$("#\\:r0\\:");
    // Selecting all text in the field
    await queryInput.click({ clickCount: 3 });
    // Pressing backspace to delete
    await page.keyboard.press("Backspace");
    await queryInput.type(searchQuery);

    for (const location of locations) {
      const locationInput = await page.$("#\\:r1\\:");
      // Selecting all text in the field
      await locationInput.click({ clickCount: 3 });
      // Pressing backspace to delete
      await page.keyboard.press("Backspace");
      await locationInput.type(location);

      await delay(500);

      // Submit form
      let spyButton = await page.waitForSelector(
        "::-p-xpath(//button[text()='Spy'])"
      );
      spyButton.click();

      // Wait for spy button disappear animation to finish
      await delay(500);
      // Wait for download to finish
      spyButton = await page.waitForSelector(
        "::-p-xpath(//button[text()='Spy'])",
        { timeout: 60000 }
      );
    }
  }

  await delay(500);
  console.log("Job scraping completed!");

  await browser.close();
}

const searchQueries = process.env.SEARCH_QUERIES.split(",");
const locations = process.env.LOCATIONS.split(",");
const sites = process.env.SITES.split(",");
const fileType = process.env.FILE_TYPE;

try {
  await fillJobForm(searchQueries, locations, sites, fileType);
} catch (error) {
  console.error("Error:", error);
}
