const bcrypt = require("bcrypt");
const boom = require("@hapi/boom");

const UserServices = require("../services/users");
const { UserStoreHappyPath, USerStoreSadPath } = require("./utils/users");
/**
 * Test suite for User Services class in services/users.js file in happy path
 */
describe("User Services in happy path", () => {
  let userServices;
  beforeAll(async () => {
    userServices = new UserServices(new UserStoreHappyPath());
  });

  test("should call getUsers", async () => {
    const users = await userServices.getUsers();
    expect(users).not.toBeNull();
    expect(users.length).toBe(2);
  });

  test("should call postUsers", async () => {
    const body = { name: "test", password: "test" };
    let user = await userServices.postUsers(body);
    expect(user).not.toBeNull();
    expect(user.name).toBe(body.name);
    expect(user.password).not.toBeNull();
    expect(user.password).not.toBe(body.password);
  });

  test("should convert password to hash", async () => {
    const body = { name: "test", password: "test" };
    let user = await userServices.postUsers(body);
    expect(user).not.toBeNull();
    expect(user.password).not.toBe(body.password);
    expect(bcrypt.compare(body.password, user.password)).toBeTruthy();
  });
  test("should call getUser", async () => {
    const user = await userServices.getUserByName("test");
    expect(user).not.toBeNull();
    expect(user.name).toBe("test");
  });

  test("should call addRole", async () => {
    const result = await userServices.addRoles("test", "test");
    expect(result).toBe("Role added");
  });
});

/**
 * Test suite for User Services class in services/users.js file in sad path
 */
describe("User Services in sad path", () => {
  let userServices;
  beforeAll(async () => {
    userServices = new UserServices(new USerStoreSadPath());
  });

  test("should call getUsers", async () => {
    const users = await userServices.getUsers();
    expect(users).toBeNull();
  });

  test("should call postUsers", async () => {
    const body = { name: "test", password: "test" };
    try {
      await userServices.postUsers(body);
    } catch (error) {
      expect(error.message).toBe("Error adding user");
    }
  });
  test("should call getUser", async () => {
    const r = expect(() => userServices.getUserByName("test")).rejects;
    r.toThrow();
    r.toThrow('Could not find user with provided "name"');
  });
  test("should call addRole", async () => {
    const r = expect(() => userServices.addRoles("test", "test")).rejects;
    r.toThrow();
    r.toThrow('Could not find user with provided "name"');
  });
});
