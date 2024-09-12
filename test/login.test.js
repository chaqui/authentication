const { UserStoreHappyPath, USerStoreSadPath } = require("./utils/users");
const LoginServices = require("../services/login");

/**
 * Test suite for Login Services class in services/login.js file in happy path
 */
describe("Login Services in happy path", () => {
  let store = new UserStoreHappyPath();
  const loginServices = new LoginServices(store);
  test("should call login", async () => {
    const token = await loginServices.login("test", "test");
    expect(token).not.toBeNull();
  });

  test("should call validateToken", async () => {
    let token = await loginServices.login("test", "test");
    token = "Bearer " + token.token;
    const dataToken = await loginServices.validateToken(token);
    expect(dataToken).not.toBeNull();
  });
});

/**
 * Test suite for Login Services class in services/login.js file in sad path
 */
describe("Login Services in sad path", () => {
  let store = new USerStoreSadPath();
  const loginServices = new LoginServices(store);
  test("should call login", async () => {
    const r = expect(() => loginServices.login("sss", "test")).rejects;
    r.toThrow();
    r.toThrowError("Invalid username or password");
  });

  test("should call validateToken", async () => {
    const r = expect(() => loginServices.validateToken("Bearer test")).rejects;
    r.toThrow();
    r.toThrowError("Invalid token");
  });
});
