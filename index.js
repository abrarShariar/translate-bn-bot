const puppeteer = require('puppeteer');
const sleep = require('sleep');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  const resultData = {
    name: 'বাংলা',
    identifier: 'bn',
    translations: {}
  }
  await page.goto('https://www.google.com/search?q=english+to+bangla&oq=english+to+bangla&aqs=chrome..69i57j0l5.7463j0j4&sourceid=chrome&ie=UTF-8', { waitUntil: 'load' });

  fs.readFile('en-US.json', async (err, data) => {
      if (err) throw err;
      let json = JSON.parse(data);
      for(let key in json.translations){
        const elementHandle = await page.$('#tw-source-text-ta');
        await elementHandle.click({clickCount: 3});
        await elementHandle.press('Backspace');

        let source_data = '';
        if (key === 'PDFPageCounter' || key === 'sessionRestoreErrorLinkInfo' || key === 'settingsEasyListCredit' || key === 'settingsUserscriptsExplanation'){
          source_data = json.translations[key].unsafeHTML;
        } else {
          source_data = json.translations[key];
        }
        sleep.sleep(1);
        await page.type('#tw-source-text-ta', source_data);
        //log source
        source_input = await page.$('#tw-source-text span');
        source_value = await (await source_input.getProperty('innerHTML')).jsonValue();
        console.log("source: ",source_value);
        sleep.sleep(2);
        target_input = await page.$('#tw-target-text span');
        target_value = await (await target_input.getProperty('innerHTML')).jsonValue();
        console.log("target: ",target_value);

        resultData.translations[key] = target_value;
      }

      //wwrite to bn.json file
      const finalObj = JSON.stringify(resultData);
      fs.writeFile('bn.json', finalObj, 'utf8', (err, data) => {
        if (err) throw err;
        console.log("result: ", data);
      });

      await browser.close();
  });

})();
