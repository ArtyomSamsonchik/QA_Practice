const LoginPage = require("../pageobjects/Login.page");
const PublicationsPage = require("../pageobjects/Publications.page");
const loginData = require("../../data/login.data");

describe("My Login page", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();
    await LoginPage.login(
      loginData.leadCredentials.email,
      loginData.leadCredentials.password
    );
    await expect(PublicationsPage.pageTitle).toBeExisting();
    await expect(PublicationsPage.pageTitle).toHaveTextContaining(
      "publications"
    );
  });
  
});
