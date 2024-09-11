const UserServices = require("../services/users");

class UserStore {
  async getUsers() {
    return [];
  }

  async addUser() {
    return {};
  }

  async getUserByName(name) {
    return {};
  }

  async postUsers(user) {
    return user;
  }
}

jest.mock("../store/users");

describe("User Services", () => {
  const store = new UserStore();
  const userServices = new UserServices(store);
  it("should call getUsers", () => {
    let users = userServices.getUsers();
    expect(userServices.getUsers).not.toBeNull();
  });

  it("should call postUsers", () => {
    const body = { name: "test", password: "test" };
    userServices.postUsers(body);
    expect(userServices.postUsers).not.toBeNull();
  });
});
