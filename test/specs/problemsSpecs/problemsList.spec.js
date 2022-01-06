const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/problemsPages/ProblemsList.page');
const PublicationsPage = require('../../pageobjects/Publications.page');
const axios = require('../../../methods/axios.APImethods');
const faker = require('faker');

describe("ProblemsList page tests", () => {
  before(async () => {
    //browser.maximizeWindow();
    let {artyomCredentials: {email, password}} = LoginData;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await PublicationsPage.pageTitle.waitForExist();
  });

  beforeEach(async () => {
    await ProblemsListPage.open();
  });

  it('Open "New Problem" page', async () => {
    let {newProblemButton} = ProblemsListPage;
    await newProblemButton.click();
    await expect(browser).toHaveUrlContaining('problems/create');
  })

  it("Problems pagination should be lower then equal to 10", async () => {
    let {firstProblem} = ProblemsListPage;
    await expect(firstProblem.$$('./../*')).toBeElementsArrayOfSize({lte: 10});
  });

  it("PrevProblems button should be not clickable at first page", async () => {
    let {prevPageButton} = ProblemsListPage;
    await expect(await prevPageButton).not.toBeClickable();
  })

  it.only("Goto next problems page", async () => {
    
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
  });

  it("Goto previous problems page" , async () => {
    let {firstProblem
      , nextPageButton
      , prevPageButton
      , getProblemId
    } = ProblemsListPage;

    await firstProblem.waitForExist();
    let promiseArr = (await firstProblem.$$('./../*')).map(async el => await getProblemId(el));
    let prevPageIdArr = await Promise.all(promiseArr);

    await nextPageButton.click();
    await prevPageButton.click();
    await firstProblem.waitForExist();

    for (let id of prevPageIdArr) {
      await expect(await $(`//div[@data-id="${id}"]`)).toBeExisting();
    }
  });

  it("Simple tests", async () => {
    await browser.url('http://www.xml2selenium.com/xpath/');

    async function openToolbarMenu(locators, buttonName) {
      let promisArr = locators.map(async el => [el, await el.getText()] );
      console.log(promisArr);
      let resultArr = await Promise.all(promisArr);
      let [button] = resultArr.find( ([, text]) => {
        return text.includes(buttonName);
      });
      return button;
    }
    let button = await openToolbarMenu(await $$('//nav/ul/li/a'), "Study");
    //await expect(href.$('./a')).toBeClickable();
    await expect(button).toHaveText("hjg");
  });
});