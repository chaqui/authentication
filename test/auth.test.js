const { UserStoreHappyPath, USerStoreSadPath } = require("./utils/users");
const AuthServices = require("../services/auth");
const { UserToBadAuth } = require("./utils/auth");

/**
 * Test suite for Login Services class in services/login.js file in happy path
 */
describe("Login Services in happy path", () => {
  let authService;
  beforeAll(async () => {
    authService = new AuthServices(new UserStoreHappyPath());
  });
  test("should call login", async () => {
    const token = await authService.login("test", "test");
    expect(token).not.toBeNull();
  });

  test("should call validateToken", async () => {
    let token = await authService.login("test", "test");
    token = "Bearer " + token.token;
    const dataToken = await authService.validateToken(token);
    expect(dataToken).not.toBeNull();
  });

  test("should call removeToken", async () => {
    let token = await authService.login("test", "test");
    token = "Bearer " + token.token;
    const result = await authService.removeToken(token);
    expect(result).not.toBeNull();
    expect(result).toBe("Logout sucessful!");
  });
});

/**
 * Test suite for Login Services class in services/login.js file in sad path
 */
describe("Login Services in sad path", () => {
  let authService;
  beforeAll(async () => {
    authService = new AuthServices(new USerStoreSadPath());
  });
  test("should call login", async () => {
    const r = expect(() => authService.login("sss", "test")).rejects;
    r.toThrow();
    r.toThrowError("Invalid username or password");
  });

  test("should call validateToken", () => {
    const r = expect(
      async () => await authService.validateToken("Bearer test"),
    ).rejects;
    r.toThrow();
    r.toThrowError("Invalid token");
  });
});

describe("Login Services with logout and validate bad", () => {
  let authService;
  beforeAll(async () => {
    authService = new AuthServices(new UserToBadAuth());
  });

  test("should call validateToken", async () => {
    let token = await authService.login("test", "test");
    token = "Bearer " + token.token;
    const r = expect(
      async () => await authService.validateToken(token),
    ).rejects;
    r.toThrow();
    r.toThrowError("Invalid token");
  });

  test("should call removeToken", async () => {
    let token = await authService.login("test", "test");
    token = "Bearer " + token.token;
    const r = expect(async () => await authService.removeToken(token)).rejects;
    r.toThrow();
    r.toThrowError("Invalid token");
  });
});

describe("All steps in login", () => {
  let authService;
  beforeAll(async () => {
    authService = new AuthServices(new UserStoreHappyPath());
  });

  test("Integrity test of Happy Path", async () => {
    let token = await authService.login("test", "test");
    expect(token).not.toBeNull();
    token = "Bearer " + token.token;
    const dataToken = await authService.validateToken(token);
    expect(dataToken).not.toBeNull();
    const result = await authService.removeToken(token);
    expect(result).not.toBeNull();
    expect(result).toBe("Logout sucessful!");
  });
});
