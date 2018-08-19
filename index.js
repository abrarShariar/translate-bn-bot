const puppeteer = require('puppeteer');
const sleep = require('sleep');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.google.com/search?q=english+to+bangla&oq=english+to+bangla&aqs=chrome..69i57j0l5.7463j0j4&sourceid=chrome&ie=UTF-8', { waitUntil: 'load' });

  await page.type('#tw-source-text-ta', 'new');
  //log source
  source_input = await page.$('#tw-source-text span');
  source_value = await (await source_input.getProperty('innerHTML')).jsonValue();
  console.log("source: ",source_value);

  sleep.sleep(3);

  target_input = await page.$('#tw-target-text span');
  target_value = await (await target_input.getProperty('innerHTML')).jsonValue();

  console.log("target: ",target_value);

  await browser.close();
})();
