describe('Wordle', () => {
  beforeAll(async () => {
    await browser.url('https://www.nytimes.com/games/wordle/index.html');
  });

  it('is visible', async () => {
    const playButton = await $('button[data-testid="Play"]');
    await playButton.isDisplayed();
    await playButton.click();

    const closeButton = await $('button[aria-label="Close"]');
    await closeButton.isDisplayed();
    await closeButton.click();

    const header = await $('header');
    await header.isDisplayed();
    const text = await header.getText();

    expect(text.includes('Wordle')).toEqual(true);
  });
});
