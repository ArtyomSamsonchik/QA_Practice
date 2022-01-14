const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/problemsPages/ProblemsList.page');
const PublicationsPage = require('../../pageobjects/Publications.page');
const axios = require('../../../methods/axios.APImethods');
const faker = require('faker');
const expectChai = require('chai').expect;

describe("ProblemsList page tests", () => {

  let accessToken;
  let problemsResponseData;

  before("Get accessToken", async () => {
    let {artyomCredentials: {email, password}} = LoginData;
    accessToken = (await axios.login(email, password)).data.login.accessToken;
  });
  
  before("Login and go to start page", async () => {
    //browser.maximizeWindow();
    let {artyomCredentials: {email, password}} = LoginData;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await PublicationsPage.pageTitle.waitForExist();
  });
  
  before("Ganerate problems with ascending titles", async () => {
    let makeAscTitleCallback = () => {
      let count = 0;
      let title = "---" + faker.random.word();
      return () => title + count++;
    };
    let problemsQueryData = await axios.generateProblemsQueryData(10, {
      title: makeAscTitleCallback()
    });
    problemsResponseData = await axios.createProblemsArray(
      accessToken,
      problemsQueryData
    );
  });

  beforeEach(async () => {
    await ProblemsListPage.open();
  });

  after(async function deleteProblems() {
    await axios.deleteProblemsArray(
      accessToken,
      problemsResponseData.map(el => el.data.problemCreate._id)
    );
  })

  //working
  it('Open "New Problem" page', async () => {
    await ProblemsListPage.newProblemButton.click();
    await expect(browser).toHaveUrlContaining('problems/create');
  })

  //working
  it("Problems pagination should be by 10", async () => {
    // let problemsData = await axios.createRandomProblems(
    //   accessToken,
    //   "617a184bb95fa7cfcbf1b831",
    //   11
    // );
    // await browser.refresh();

    await expect(ProblemsListPage.getFullProblemsList()).toBeElementsArrayOfSize(10);
    await expect(ProblemsListPage.paginationInfo).toHaveTextContaining("1–10");

    // await axios.deleteProblemsArray(
    //   accessToken,
    //   problemsData.map(el => el.data.problemCreate._id)
    // );
  });

  //working
  it("PrevProblems button should be not clickable at first page", async () => {
    await expect(await ProblemsListPage.prevPageButton).not.toBeClickable();
  });

  //working
  it("Goto next problems page", async () => {
    
    await expect(ProblemsListPage.nextPageButton).toBeClickable();

    let resultArr = await ProblemsListPage.getFullProblemsList();

    let idArr = await Promise.all(
      resultArr.map(async el => await ProblemsListPage.getProblemId(el))
    );

    await ProblemsListPage.nextPageButton.click();
    await ProblemsListPage.getFullProblemsList();

    for (let id of idArr) {
      await expect(await $(`//div[@data-id="${id}"]`)).not.toBeExisting();
    }
    await expect(ProblemsListPage.paginationInfo).toHaveTextContaining("11–20");
  });

  it.only("Practice and debug test", async () => {
  
    await ProblemsListPage.problemNameColumnTitle.click();
    let problemsArr = await ProblemsListPage.getFullProblemsList();
    browser.pause(5000);

    for (let i = 0; i < problemsArr.length - 1; i++) {
      let prevTitle = await ProblemsListPage.getProblemTitle(problemsArr[i]);
      let nextTitle = await ProblemsListPage.getProblemTitle(problemsArr[i + 1]);
      expectChai(
        prevTitle < nextTitle,
        `${prevTitle} should be lower than ${nextTitle}`
      ).to.be.true;
    }

    await expect(ProblemsListPage.problemNameSortIcon).toHaveAttribute(
      'data-testid',
      'ArrowUpwardIcon'
    );
  });

  //working
  it("Goto previous problems page" , async () => {
    let prevPageProblemsArr = await ProblemsListPage.getFullProblemsList();
    let prevPageIdArr = await Promise.all(
      prevPageProblemsArr.map(async el => await ProblemsListPage.getProblemId(el))
    );

    await ProblemsListPage.nextPageButton.click();
    await ProblemsListPage.prevPageButton.click();
    await ProblemsListPage.getFullProblemsList();

    for (let id of prevPageIdArr) {
      await expect(await $(`//div[@data-id="${id}"]`)).toBeExisting();
    }
    await expect(ProblemsListPage.paginationInfo).toHaveTextContaining("1–10");
  });

});