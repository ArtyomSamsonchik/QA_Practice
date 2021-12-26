const Page = require("./Page");

class PublicationsPage extends Page {
  get pageTitle() {
    return $("h6");
  }

  async open() {
    await super.open("/publications");
  }
}

module.exports = new PublicationsPage();
