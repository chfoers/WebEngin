import { Builder, By, until, promise, Browser, WebDriver } from 'selenium-webdriver';
import * as fs from 'fs';

describe('login', () => {
  let driver: WebDriver;

  beforeAll((done) => {
    new Builder().forBrowser(Browser.CHROME).build().then((result) => {
      driver = result;
      done();
    });
  });

  afterAll((done) => {
    driver.quit().then(() => done());
  });

  it('Fehler beim Login', (done) => {
    (async function () {
      await driver.get('http://localhost:8080/users/login');
      await driver.findElement(By.name('email')).sendKeys('max.mustermann@gmail.com');
      await driver.findElement(By.name('password')).sendKeys('supersecret');
      await driver.findElement(By.css('.btn.btn-default')).click();
      try {
        await driver.wait(until.elementLocated(By.className('alert')), 1000);
      } catch (e) {
        fail('element not found');
      }
      let alertText = await driver.findElement(By.css('.alert')).getText();
      expect(alertText).toContain('Invalid');
      done();
    })();
  })
});
