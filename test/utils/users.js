class UserStoreHappyPath {
  users = [
    {
      userId: "123",
      name: "test",
      password: "$2b$10$uat2SnO/nKlXxb.UozC7de97pOJIQAb0YOJvmsg2pxC.bfZSik9V6",
      userRoles: [],
      tokens: [],
    },
    {
      userId: "456",
      name: "test2",
      password: "test2",
      userRoles: [],
      tokens: [],
    },
  ];
  async getUsers() {
    return this.users;
  }
  async addUser(user) {
    this.users.push(user);
    return user;
  }

  async getUserByName(name) {
    return this.users.find((user) => user.name === name);
  }
  async addRole(userName, roleId) {
    const user = this.users.find((user) => user.name === userName);
    user.userRoles.push(roleId);
  }

  async saveToken(name, token) {
    const user = this.users.find((user) => user.name === name);
    user.tokens.push(token);
  }

  async removeToken(name, index) {
    const user = this.users.find((user) => user.name === name);
    user.tokens.splice(index, 1);
  }
}

class USerStoreSadPath {
  async getUsers() {
    return null;
  }
  async addUser(user) {
    throw new Error("Error adding user");
  }

  async getUserByName(name) {
    return null;
  }
}

module.exports = { UserStoreHappyPath, USerStoreSadPath };
