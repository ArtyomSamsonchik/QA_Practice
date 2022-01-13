const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/problemsPages/ProblemsList.page');
const PublicationsPage = require('../../pageobjects/Publications.page');
const axios = require('../../../methods/axios.APImethods');
//const faker = require('faker');

describe("ProblemsList page tests", () => {

  let accessToken;

  before(async () => {
    //browser.maximizeWindow();
    let {artyomCredentials: {email, password}} = LoginData;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await PublicationsPage.pageTitle.waitForExist();

    
    accessToken = (await axios.login(email, password)).data.login.accessToken;
  });

  beforeEach(async () => {
    await ProblemsListPage.open();
  });

  //working
  it('Open "New Problem" page', async () => {
    let {newProblemButton} = ProblemsListPage;
    await newProblemButton.click();
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
    await expect(await ProblemsListPage.paginationInfo).toHaveTextContaining("1–10");

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
    // let result = await ProblemsListPage.findProblem(
    //   await ProblemsListPage.getFullProblemsList(),
    //   "title",
    //   "Colorado river or BBQ jazz 3"
    // );
    
    // let result = await ProblemsListPage.getAllProblemsId(
    //   problemsData.map(({title}) => title),
    //    "title");
    // console.log(result);
    await ProblemsListPage.problemNameColumnTitle.click();
    await expect(ProblemsListPage.problemNameColumnTitle.$('.//*[@data-testid="ArrowUpwardIcon"]')).toBeDisplayed();
    await browser.pause(3000);
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