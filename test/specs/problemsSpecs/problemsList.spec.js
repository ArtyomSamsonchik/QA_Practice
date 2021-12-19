const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/ProblemsPages/ProblemsList.page');

describe("ProblemsList page tests", () => {
  it("Goto problems page", async () => {
    let {email, password} = LoginData.artyomCredentials;
    let {pageTitle} = ProblemsListPage;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    await expect(pageTitle).toBeExisting();
    await expect(pageTitle).toHaveText("problems");
  });
});

//npm run cleanWin && 