const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/problemsPages/ProblemsList.page');
const PublicationsPage = require('../../pageobjects/Publications.page');
const axios = require('../../../methods/axios.APImethods');
const faker = require('faker');
const expectChai = require('chai').expect;

describe("ProblemsList columns sort tests", () => {

  let accessToken;
  let problemsResponseData = [];
  let companiesResponseData = [];

  before("Get accessToken", async () => {
    let {artyomCredentials: {email, password}} = LoginData;
    accessToken = (await axios.login(email, password)).data.login.accessToken;
  });

  before("Generate companies with asc & desc titles", async () => {
    let randomCompanyTitle = faker.company.companyName(0);
    let ascTitle = "---" + randomCompanyTitle;
    let descTitle = "zzz" + randomCompanyTitle;
    let companiesRequestData = [];

    for (let currTitle of [ascTitle, descTitle]) {
      companiesRequestData = companiesRequestData.concat(
        await axios.generateCompaniesRequestData(2, {
          title: (i) => {
            let modifiers = [" A", " Z"];
            return currTitle + modifiers[i];
          }
        })
      );
    }

    await axios.createCompaniesArray(
      accessToken,
      companiesResponseData,
      companiesRequestData
    );
  });

  before("Generate problems with asc & desc all data fields", async () => {
    let randomProblemTitle = faker.random.word();
    let randomJobTitle = faker.name.jobTitle();
    let companiesId = companiesResponseData.map(el => el.data.companyCreate._id);

    let ascData = {
      problemTitle: "---" + randomProblemTitle,
      jobTitle: "---" + randomJobTitle,
      companiesId: [companiesId[0], companiesId[1] ]
    };
    let descData = {
      problemTitle: "zzz" + randomProblemTitle,
      jobTitle: "zzz" + randomJobTitle,
      companiesId: [companiesId[2], companiesId[3] ]
    };

    let problemsQueryData = [];

    for (let currData of [ascData, descData]) {
      let queryData = await axios.generateProblemsQueryData(10, {
        title: (i) => {
          return currData.problemTitle + " " + i;
        },
        companyId: (i) => {
          if (i < 5) return currData.companiesId[0];
          else return currData.companiesId[1];
        },
        jobTitle: (i) => {
          return currData.jobTitle + " " + i;
        }
      });

      problemsQueryData = problemsQueryData.concat(queryData);
    }

    await axios.createProblemsArray(
      accessToken,
      problemsResponseData,
      problemsQueryData
    );
  });

  before("Login and go to start page", async () => {
    //browser.maximizeWindow();
    let {artyomCredentials: {email, password}} = LoginData;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await PublicationsPage.pageTitle.waitForExist();
  });

  beforeEach(async () => {
    await ProblemsListPage.open();
  });

  after(async function deleleCompanies() {
    if (companiesResponseData.length) {
      let adminToken = (await axios.login(
      "doronina.anna2021@gmail.com",
      "Anna123456789*"
      )).data.login.accessToken;

      await axios.deleteCompaniesArray(
        adminToken,
        companiesResponseData.map(el => el.data.companyCreate._id)
      )
    }      
  });

  after(async function deleteProblems() {
    if (problemsResponseData.length) {
      await axios.deleteProblemsArray(
        accessToken,
        problemsResponseData.map(el => el.data.problemCreate._id)
      );
    }
  });

  describe("'Problem name' column sort tests", () => {

    beforeEach(async() => {
      await browser.refresh();
    });
  
    it("Ascending 'Problem name' column sort", async () => {
      await ProblemsListPage.problemNameColumnTitle.click();
      await ProblemsListPage.toolbarFiltersBtn.click();

      let operatorsBox = await ProblemsListPage.filtersFormOperatorsBox;
      await operatorsBox.selectByAttribute('value', 'isNotEmpty');
      await ProblemsListPage.toolbarFiltersBtn.click();

      let problemsArr = await ProblemsListPage.getFullProblemsList();
  
      for (let i = 0; i < problemsArr.length - 1; i++) {
        let prevTitle = await ProblemsListPage.getProblemTitle(problemsArr[i]);
        let nextTitle = await ProblemsListPage.getProblemTitle(problemsArr[i + 1]);
        expectChai(
          prevTitle <= nextTitle,
          `${prevTitle} <= ${nextTitle}`
        ).to.be.true;
      }
  
      await expect(ProblemsListPage.problemNameSortIcon).toHaveAttribute(
        'data-testid',
        'ArrowUpwardIcon'
      );
    });
  
    it("Descending 'Problem name' column sort", async () => {
      await ProblemsListPage.problemNameColumnTitle.click();
      await ProblemsListPage.problemNameColumnTitle.click();
      await ProblemsListPage.toolbarFiltersBtn.click();

      let operatorsBox = await ProblemsListPage.filtersFormOperatorsBox;
      await operatorsBox.selectByAttribute('value', 'isNotEmpty');
      await ProblemsListPage.toolbarFiltersBtn.click();

      let problemsArr = await ProblemsListPage.getFullProblemsList();
  
      for (let i = 0; i < problemsArr.length - 1; i++) {
        let prevTitle = await ProblemsListPage.getProblemTitle(problemsArr[i]);
        let nextTitle = await ProblemsListPage.getProblemTitle(problemsArr[i + 1]);
        expectChai(
          prevTitle >= nextTitle,
          `${prevTitle} >= ${nextTitle}`
        ).to.be.true;
      }
  
      await expect(ProblemsListPage.problemNameSortIcon).toHaveAttribute(
        'data-testid',
        'ArrowDownwardIcon'
      );
    });

    //TODO: Add sort check for next page
  });

  describe("'Position' column sort tests", () => {

    beforeEach(async() => {
      await browser.refresh();
    });

    //Теперь в названии position убираются все спецсимволы.
    //Но старые названия со спецсимволами остались.
    //Так что тест пока откладывается.
    it.skip("Ascending 'Position' column sort", async () => {
      await ProblemsListPage.positionColumnTitle.click();
      await ProblemsListPage.toolbarFiltersBtn.click();

      let columnsBox = await ProblemsListPage.filtersFormColumnsBox;
      await columnsBox.selectByAttribute('value', 'Position');

      let operatorsBox = await ProblemsListPage.filtersFormOperatorsBox;
      await operatorsBox.selectByAttribute('value', 'isNotEmpty');

      await ProblemsListPage.toolbarFiltersBtn.click();
      let problemsArr = await ProblemsListPage.getFullProblemsList();

      for (let i = 0; i < problemsArr.length - 1; i++) {
        let prevTitle = await ProblemsListPage.getProblemPosition(problemsArr[i]);
        let nextTitle = await ProblemsListPage.getProblemPosition(problemsArr[i + 1]);
        expectChai(
          prevTitle <= nextTitle,
          `${prevTitle} <= ${nextTitle}`
        ).to.be.true;
      }
  
      await expect(ProblemsListPage.problemNameSortIcon).toHaveAttribute(
        'data-testid',
        'ArrowUpwardIcon'
      );
    });
  
    it("Descending 'Position' column sort", async () => {
      await ProblemsListPage.positionColumnTitle.click();
      await ProblemsListPage.positionColumnTitle.click();
      await ProblemsListPage.toolbarFiltersBtn.click();

      let columnsBox = await ProblemsListPage.filtersFormColumnsBox;
      await columnsBox.selectByAttribute('value', 'Position');

      let operatorsBox = await ProblemsListPage.filtersFormOperatorsBox;
      await operatorsBox.selectByAttribute('value', 'isNotEmpty');

      await ProblemsListPage.toolbarFiltersBtn.click();
      let problemsArr = await ProblemsListPage.getFullProblemsList();

      for (let i = 0; i < problemsArr.length - 1; i++) {
        let prevTitle = await ProblemsListPage.getProblemPosition(problemsArr[i]);
        let nextTitle = await ProblemsListPage.getProblemPosition(problemsArr[i + 1]);
        expectChai(
          prevTitle >= nextTitle,
          `${prevTitle} >= ${nextTitle}`
        ).to.be.true;
      }
  
      await expect(ProblemsListPage.problemNameSortIcon).toHaveAttribute(
        'data-testid',
        'ArrowUpwardIcon'
      );      
    });
  });

  describe("'Company' column sort tests", () => {

    beforeEach(async() => {
      await browser.refresh();
    });

    it("Ascending 'Company' column sort", async () => {
      await ProblemsListPage.companyColumnTitle.click();
      await ProblemsListPage.toolbarFiltersBtn.click();

      let columnsBox = await ProblemsListPage.filtersFormColumnsBox;
      await columnsBox.selectByAttribute('value', 'Company');

      let operatorsBox = await ProblemsListPage.filtersFormOperatorsBox;
      await operatorsBox.selectByAttribute('value', 'isNotEmpty');
      await ProblemsListPage.toolbarFiltersBtn.click();

      let problemsArr = await ProblemsListPage.getFullProblemsList();

      for (let i = 0; i < problemsArr.length - 1; i++) {
        let currTitle = await ProblemsListPage.getProblemCompany(problemsArr[i]);
        let nextTitle = await ProblemsListPage.getProblemCompany(problemsArr[i + 1]);
        expectChai(
          currTitle <= nextTitle,
          `'${currTitle}' <= '${nextTitle}'`
        ).to.be.true;
      }
  
      await expect(ProblemsListPage.companySortIcon).toHaveAttribute(
        'data-testid',
        'ArrowUpwardIcon'
      );      
    });

    it("Descending 'Company' column sort", async () => {
      await ProblemsListPage.companyColumnTitle.click();
      await ProblemsListPage.companyColumnTitle.click();
      await ProblemsListPage.toolbarFiltersBtn.click();

      let columnsBox = await ProblemsListPage.filtersFormColumnsBox;
      await columnsBox.selectByAttribute('value', 'Company');

      let operatorsBox = await ProblemsListPage.filtersFormOperatorsBox;
      await operatorsBox.selectByAttribute('value', 'isNotEmpty');
      await ProblemsListPage.toolbarFiltersBtn.click();

      let problemsArr = await ProblemsListPage.getFullProblemsList();

      for (let i = 0; i < problemsArr.length - 1; i++) {
        let currTitle = await ProblemsListPage.getProblemCompany(problemsArr[i]);
        let nextTitle = await ProblemsListPage.getProblemCompany(problemsArr[i + 1]);
        expectChai(
          currTitle >= nextTitle,
          `'${currTitle}' >= '${nextTitle}'`
        ).to.be.true;
      }
  
      await expect(ProblemsListPage.companySortIcon).toHaveAttribute(
        'data-testid',
        'ArrowDownwardIcon'
      );
    });
  });

})