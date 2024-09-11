const bcrypt = require("bcrypt");
const UserServices = require("../services/users");

class UserStore {
  async getUsers() {
    return [
      {
        userId: "123",
        name: "test",
        userRoles: [],
      },
      {
        userId: "456",
        name: "test2",
        userRoles: [],
      },
    ];
  }
  async addUser(user) {
    return user;
  }
}

describe("User Services", () => {
  let store = new UserStore();
  test("should call getUsers", async () => {
    const userServices = new UserServices(store);
    const users = await userServices.getUsers();
    console.log(users);
    expect(users).not.toBeNull();
    expect(users.length).toBe(2);
  });

  test("should call postUsers", async () => {
    const userServices = new UserServices(store);
    const body = { name: "test", password: "test" };
    let user = await userServices.postUsers(body);
    expect(user).not.toBeNull();
    expect(user.name).toBe(body.name);
  });

  test("should convert password to hash", async () => {
    const userServices = new UserServices(store);
    const body = { name: "test", password: "test" };
    let user = await userServices.postUsers(body);
    expect(user).not.toBeNull();
    expect(user.password).not.toBe(body.password);
    expect(bcrypt.compare(body.password, user.password)).toBeTruthy();
  });
});
