import { FrontAppPage } from './app.po';

describe('front-app App', function() {
  let page: FrontAppPage;

  beforeEach(() => {
    page = new FrontAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
