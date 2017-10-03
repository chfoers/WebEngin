import { browser, element, by, promise } from 'protractor';
describe('login', () => {
    beforeEach(() => {
        browser.get('/users/login');
    });
    it('Show Error bei falschen login', async () => {
        await element(by.id('email')).sendKeys('max.mustermann@gmail.com');
        await element(by.id('password')).sendKeys('geheim');
        await element(by.css('.btn.btn-default')).click();
        // kein explizites Warten erforderlich
        let alertText = await element(by.css('.alert-danger')).getText();
        expect(alertText).toContain('Invalid');
    });
});
