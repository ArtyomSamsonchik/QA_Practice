const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/ProblemsPages/ProblemsList.page');

describe("ProblemsList page tests", () => {
  xit("Goto problems page", async () => {
    let {email, password} = LoginData.artyomCredentials;
    let {pageTitle} = ProblemsListPage;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    await expect(pageTitle).toBeExisting();
    await expect(pageTitle).toHaveText("problems");
  });

  xit("Problems pagination should be by 10", async () => {
    let {email, password} = LoginData.artyomCredentials;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    let arr = await ProblemsListPage.problemsArray;
    await expect(arr).toBeElementsArrayOfSize(10);
  });

  it("Open first problem page", async () => {
    let {email, password} = LoginData.artyomCredentials;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    //let x = await ProblemsListPage.firstProblem.getAttribute("data-id");

    //let problems = await $$('//*[@data-rowindex=0]/../*').getAttribute("role");
    //let problem = await $$('//*[@data-rowindex=0]/../*').find(el => el.getAttribute("role"));

    let problem = await $('//*[@data-rowindex=0]');
    await expect (problem).toHaveAttribute("role", "row");

    //let [problem, user] = await ProblemsListPage.problemsArray.$('//a');
    //await ProblemsListPage.problemsArray[0].$('//a[1]').click();
  })
});
