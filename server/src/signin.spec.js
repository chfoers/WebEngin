"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
describe('login', () => {
    let driver;
    beforeAll((done) => {
        new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.CHROME).build().then((result) => {
            driver = result;
            done();
        });
    });
    afterAll((done) => {
        driver.quit().then(() => done());
    });
    it('Fehler beim Login', (done) => {
        (function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield driver.get('http://localhost:8080/users/login');
                yield driver.findElement(selenium_webdriver_1.By.name('email')).sendKeys('max.mustermann@gmail.com');
                yield driver.findElement(selenium_webdriver_1.By.name('password')).sendKeys('supersecret');
                yield driver.findElement(selenium_webdriver_1.By.css('.btn.btn-default')).click();
                try {
                    yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.className('alert')), 1000);
                }
                catch (e) {
                    fail('element not found');
                }
                let alertText = yield driver.findElement(selenium_webdriver_1.By.css('.alert')).getText();
                expect(alertText).toContain('Invalid');
                done();
            });
        })();
    });
});
