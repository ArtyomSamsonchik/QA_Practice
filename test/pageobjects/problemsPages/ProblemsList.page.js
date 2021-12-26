const Page = require("../Page");

class ProblemsPage extends Page {
  get btnNewProblem() {
    return $('//button[text()="New Problem"]');
  }
  get pageTitle() {
    return $('//header//h6');
  }
  get nextPageButton() {
    return $('//*[@title="Go to next page"]');
  }
  get prevPageButton() {
    return $('//*[@title="Go to previous page"]');
  }
  get firstProblem() {
    return $('//div[@data-rowindex]');
  }
  get paginationInfo() {
    return $('//*[contains(@class, "displayedRows")]');
  }
  get example() {
    return $$('//div[button[@aria-label="Select columns"]]/*');
  }
  //-----------------------------------------------------------------------------
  async getProblemId(problem) {
    return await problem.getAttribute("data-id");
  }
  
  async open() {
    await super.open('/problems');
  }
}

module.exports = new ProblemsPage();