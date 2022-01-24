const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/problemsPages/ProblemsList.page');
const PublicationsPage = require('../../pageobjects/Publications.page');
const axios = require('../../../methods/axios.APImethods');

describe("ProblemsList page pagination test suite", () => {

  let accessToken;
  let problemsResponseData = [];

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
  
  before("Ganerate 20 random problems", async () => {
    let problemsQueryData = await axios.generateProblemsQueryData(20);

    await axios.createProblemsArray(
      accessToken,
      problemsResponseData,
      problemsQueryData
    );
  });

  beforeEach(async () => {
    await ProblemsListPage.open();
  });

  after(async function deleteProblems() {
    if (problemsResponseData.length) {
      await axios.deleteProblemsArray(
        accessToken,
        problemsResponseData.map(el => el.data.problemCreate._id)
      );
    }
  });

  it('Open "New Problem" page', async () => {
    await ProblemsListPage.newProblemButton.click();
    await expect(browser).toHaveUrlContaining('problems/create');
  })

  it("Problems pagination should be by 10", async () => {
    await expect(ProblemsListPage.getFullProblemsList()).toBeElementsArrayOfSize(10);
    await expect(ProblemsListPage.paginationInfo).toHaveTextContaining("1–10");
  });

  it("PrevProblems button should be not clickable at first page", async () => {
    await expect(await ProblemsListPage.prevPageButton).not.toBeClickable();
  });

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