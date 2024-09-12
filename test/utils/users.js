class UserStoreHappyPath {
  async getUsers() {
    return [
      {
        userId: "123",
        name: "test",
        password: "test",
        userRoles: [],
      },
      {
        userId: "456",
        name: "test2",
        password: "test2",
        userRoles: [],
      },
    ];
  }
  async addUser(user) {
    return user;
  }

  async getUserByName(name) {
    return {
      userId: "123",
      name: "test",
      password: "$2b$10$uat2SnO/nKlXxb.UozC7de97pOJIQAb0YOJvmsg2pxC.bfZSik9V6",
      userRoles: [],
    };
  }
  async addRole(userName, roleId) {
    return true;
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
