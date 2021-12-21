const LoginPage = require('../../pageobjects/Login.page');
const LoginData = require('../../../data/login.data');
const ProblemsListPage = require('../../pageobjects/ProblemsPages/ProblemsList.page');
const { waitFor } = require('../../pageobjects/ProblemsPages/ProblemsList.page');
const { resolveObjectURL } = require('buffer');

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

    let arr = await ProblemsListPage.problemsList.$$('./*');
    //await expect(list).toBeExisting();
    await expect(arr).toBeElementsArrayOfSize({lte: 10});
  });

  xit("Work with arrays", async () => {
    let {email, password} = LoginData.artyomCredentials;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    const x = await ProblemsListPage.example;
    //await expect(x).toBeElementsArrayOfSize(4);
    await x[0].$('.//span').getAttribute("class");
  });

  xit("Open test toolbar menu", async () => {
    let {email, password} = LoginData.artyomCredentials;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    let menu = await ProblemsListPage.openToolbarMenu("columns");
    //await expect(menu).toBeExisting();
    await expect(menu).toHaveAttribute("role", "tooltip");
    await waitFor(2000);
  });



  xit("Practise test for array locator", async () => {
    let {email, password} = LoginData.artyomCredentials;
    await LoginPage.open();
    await LoginPage.login(email, password);
    await ProblemsListPage.openViaSidebar("problems");

    await ProblemsListPage.sortButtons.$$('.//button[@title="Sort"]')
      .forEach(() => console.log("Hello"));
  });

  it("Siple tests", async () => {
    await browser.url('http://www.xml2selenium.com/xpath/');
    let menuButtons = await $$('//nav/ul/li');
    //----------------Exprloring---------------------------
    //await expect(arr).toBeElementsArrayOfSize(8);
    //await arr.forEach(el => console.log(el.getText()));
    //await menuButtons[0].$('./a').getHTML();
    //await menuButtons[0].getHTML();

    //------------------Nice--------------------------
    // let arr = menuButtons.map(el => el.getText());
    // let href;
    // await Promise.all(arr).then(textArr => {
    //   return textArr.map((el, i) => [menuButtons[i], el]);
    // }).then(result => {
    //   [href] = result.find(([, text]) => text.includes("News"));
    // });
    //-----------------Wrong----------------------------------------
    let map = new Map(menuButtons.map(el => [el, el.getText()]));
    let href;
    await Promise.all(map.values()).then(textArr => {
      console.log(textArr);
      let buttons = Array.from(map.keys());
      href = buttons[ textArr.findIndex(el => el.includes("News")) ];
    });
    //-------------------Wrong-----------------------
    //let arr = menuButtons.map(el => [el, el.getText()]);
    // let href = arr.find( ([, promise]) => {
    //   let succes = false;
    //   promise.then(result => {
    //     if (result.includes("News")) succes = true;
    //     console.log(succes, Array.isArray(arr));
    //   });
    //   return succes;
    // });


    //await expect(href.$('./a')).toBeClickable();
    await expect(href.$('./a')).toHaveText("hjg");
  });
});