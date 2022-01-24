const Page = require("../Page");

class ProblemsPage extends Page {
  get newProblemButton() {
    return $('//button[text()="New Problem"]');
  }
  get pageTitle() {
    return $('//header//h6');
  }
  get paginationInfo() {
    return $('//p[contains(@class, "Pagination-displayedRows")]');
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
  get problemsArr() {
    return $$('//div[@data-rowindex]');
  }
  get problemNameColumnTitle() {
    return $('//div[@data-field="Problem name" and @role="columnheader"]');
  }
  get problemNameSortIcon() {
    return this.problemNameColumnTitle.$('.//button[@aria-label="Sort"]/*[@data-testid]');
  }
  get positionColumnTitle() {
    return $('//div[@data-field="Position" and @role="columnheader"]');
  }
  get companyColumnTitle() {
    return $('//div[@data-field="Company" and @role="columnheader"]');
  }
  get companySortIcon() {
    return this.companyColumnTitle.$('.//button[@aria-label="Sort"]/*[@data-testid]');
  }
  get toolbarFiltersBtn() {
    return $('//button[@aria-label="Show filters"]');
  }
  get filtersFormColumnsBox() {
    return $('//div[label[text()="Columns"]]//select');
  }
  get filtersFormOperatorsBox() {
    return $('//div[label[text()="Operators"]]//select[count(option)>2]');
  }
  //----------------------------------------------------------------------------
  async getProblemId(problem) {
    return await problem.getAttribute("data-id");
  }
  
  async getProblemTitle(problem) {
    return await problem.$('.//div[@data-field="Problem name"]').getText();
  }

  async getProblemCompany(problem) {
    return await problem.$('.//div[@data-field="Company"]').getText();
  }

  async getProblemPosition(problem) {
    return await problem.$('.//div[@data-field="Position"]').getText();
  }

  async getProblemCreator(problem) {
    return await problem.$('.//div[@data-field="Creator"]').getText();
  }

  async getFullProblemsList() {
    let result = [];

    await browser.waitUntil(async () => {
      let currentArr = await this.problemsArr;
      if (currentArr.length !== 0 && currentArr.length === result.length) {
        return true;
      } else {
        result = currentArr;
        return false;
      }
    }, {
      timeout: 10000,
      timeoutMsg: "Couldn\'t wait for the full problems list in 10 sec"
    });
    
    return result;
  }

  async findProblem(problemsArr, key, searchValue) {
    let method = this[ new Array(
      "getProblemTitle",
      "getProblemCompany",
      "getProblemPosition",
      "getProblemCreator",
      "getProblemId"
      ).find(el => el.match(new RegExp(`${key}`, "i")) )
    ];

    let valuesArr = await Promise.all(
      problemsArr.map(async el => await method(el))
    );
    
    return problemsArr[valuesArr.findIndex(el => el === searchValue)];
  }

  async getAllProblemsId(valuesArr, key) {
    let remaining = valuesArr.length;
    let searchValue = valuesArr[0];
    let maxPagesSkip = 5;
    let idArr = [];
    let problemsArr = await this.getFullProblemsList();

    while(remaining) {
      let problem = await this.findProblem(problemsArr, key, searchValue);

      if (problem === undefined) {
        await this.nextPageButton.click();
        problemsArr = await this.getFullProblemsList();

        maxPagesSkip--;
        if (maxPagesSkip === 0) {
          throw new Error(`Cannot find problem by "${key}": ${searchValue} by skipping 5 pages.
          Assigned array of values ​​to search for:
          ${valuesArr}`);
        }

        continue;
      }

      idArr.push(await this.getProblemId(problem));
      remaining--;
      searchValue = valuesArr[valuesArr.length - remaining];
      maxPagesSkip = 5;
    }

    return idArr;
  }

  async open() {
    await super.open('/problems');
  }
}

module.exports = new ProblemsPage();