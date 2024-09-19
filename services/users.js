const bcrypt = require("bcrypt");
const crypto = require("crypto");
const boom = require("@hapi/boom");
class UserServices {
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * Function for get all users
   * @param res Response object for the GET /users endpoint
   *
   */
  async getUsers() {
    let users = await this.storage.getUsers();
    return users;
  }

  /**
   * Function for create a new user
   * @param body Request body for the POST /users endpoint
   * @param res Response object for the POST /users endpoint
   *
   */
  async postUsers(body) {
    const { name, password } = body;

    const passwordEncrypted = await bcrypt.hash(password, 10);
    const userId = crypto.randomBytes(20).toString("hex");
    const newUser = {
      userId: userId,
      name: name,
      password: passwordEncrypted,
    };
    const userAdd = await this.storage.addUser(newUser);
    return userAdd;
  }

  /**
   * Function to return user by userId
   * @param {String} userId  userId to return
   * @param {Response} res  response object for the GET /users/:userId endpoint
   */
  async getUserById(userId, res) {
    try {
      const user = await this.storage.getUserById(userId);
      if (user) {
        const { userId, name, userRoles } = user;
        res.json({ userId, name, userRoles });
      } else {
        res
          .status(404)
          .json({ error: 'Could not find user with provided "userId"' });
      }
    } catch (error) {
      res.status(500).json({ error: "Could not return user" });
    }
  }

  /**
   * Function to return user by name
   * @param {String} name  userId to return
   * @param {Response} res  response object for the GET /users/:userId endpoint
   */
  async getUserByName(name) {
    const user = await this.storage.getUserByName(name);

    if (user) {
      const { userId, name, userRoles } = user;
      return { userId, name, userRoles };
    }
    throw boom.notFound('Could not find user with provided "name"');
  }

  /**
   * Function to add roles to a user
   * @param {String} userName  userName to add role
   * @param {String} roleId  roleId to add role
   * @param {Response} res  Response object for the POST /users/:userName/roles endpoint
   */
  async addRoles(userName, roleId) {
    // user is used for ensure its existence
    const user = await this.getUserByName(userName);

    await this.storage.addRole(user.name, roleId);
    return "Role added";
  }
}

module.exports = UserServices;
