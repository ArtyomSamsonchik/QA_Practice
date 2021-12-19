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
    return $$('//button[@title="Sort"]');
  }
  get kebabButtons() {
    return $$('//button[@title="Menu"]');
  }
  get toolbarButtons() {
    return $$('//button[text()="Columns"]/../child::*');
  }
  async openViaSidebar(pageName) {
    await this.burgerButton.click();
    await $(`//a[@href="/${pageName}"]`).click();
  }
  async openToolbarMenu(button) {
    button = button.toLowerCase();
    await this.toolbarButtons
      .find(el => el.getText().includes(button))
      .click();
  }
}

module.exports = new ProblemsPage();