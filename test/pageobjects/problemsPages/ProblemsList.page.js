const Page = require("../Page");

class ProblemsPage extends Page {
  get btnNewProblem() {
    return $('//button[text()="New Problem"]');
  }
  get pageTitle() {
    return $('//header//h6');
  }
  get burgerButton() {
    return $('//button[@id="nav-bar-toggle"]');
  }
  get sortButtons() {
    return $('//div[@role="row"][*//button[@title="Sort"]]');
  }
  get kebabButtons() {
    //return $$('//button[@title="Menu"]');
    return $('//div[@role="row"][*//button[@title="Menu"]]');
  }
  get toolbar() {
    return $('//button[@aria-label="Select columns"]/..');
  }
  get problemsList() {
    return $('//div[@data-rowindex="0"]/..');
  }
  get example() {
    return $$('//div[button[@aria-label="Select columns"]]/*');
  }
  
  async openViaSidebar(pageName) {
    pageName = await pageName.toLowerCase();
    await this.burgerButton.click();
    await $(`//a[@href="/${pageName}"]`).click();
  }

  async openToolbarMenu(title) {
    title = await title.toUpperCase();
    let button;
    await this.toolbar.$$('./*').forEach(el => {
      //el.getText().then(console.log);
      el.getText().then(result => {
          if (result.includes(title)) return button = el;
      }).then(result => result.click());
    });
    return $('//div[@role="tooltip"]');
    //return button;
  }

  waitFor(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }
}

module.exports = new ProblemsPage();