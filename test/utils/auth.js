class UserToBadAuth {
  constructor() {
    this.id = 1;
  }
  async getUserByName(name) {
    return {
      userId: "123",
      name: "test",
      password: "$2b$10$uat2SnO/nKlXxb.UozC7de97pOJIQAb0YOJvmsg2pxC.bfZSik9V6",
      userRoles: [],
      tokens: [],
    };
  }
  async saveToken(name, token) {}
}
module.exports = { UserToBadAuth };
