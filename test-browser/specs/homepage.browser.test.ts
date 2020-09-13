import homepage from '../pages/home.page';

describe('The homepage', () => {
  beforeAll(() => {
    homepage.open();
  });
  it('should display a heading', () => {
    expect(homepage.heading.isDisplayed()).toBe(true);

    // Simulate mobile window (Pixel 2)
    browser.setWindowSize(411, 731);

    expect(homepage.heading.isDisplayed()).toBe(true);
  });
});
