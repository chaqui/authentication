const bcrypt = require("bcrypt");

class UserServices {
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * Function for create a new user
   * @param body Request body for the POST /users endpoint
   * @param res Response object for the POST /users endpoint
   *
   */
  async postUsers(body, res) {
    const { name, password } = body;

    try {
      password = await bcrypt.hash(password, 10);
      const userId = crypto.randomBytes(20).toString("hex");
      const userAdd = await this.storage.addUser(name, password, userId);
      res.json(userAdd);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }

  /**
   * Function for create a new user
   * @param body Request body for the POST /users endpoint
   * @param res Response object for the POST /users endpoint
   *
   */
  async postUsers(body, res) {
    let { password } = body;
    const { name } = body;

    try {
      password = await bcrypt.hash(password, 10);
      const userAdd = await this.storage.addUser(name, password);
      res.json(userAdd);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not create user" });
    }
  }

  /**
   * Function to return user by userId
   * @param {String} userId  userId to return
   * @param {Response} res  response object for the GET /users/:userId endpoint
   */
  async getUser(userId, res) {
    try {
      const user = await this.storage.getUser(userId);
      if (user) {
        const { userId, name, userRoles } = Item;
        res.json({ userId, name, userRoles });
      } else {
        res
          .status(404)
          .json({ error: 'Could not find user with provided "userId"' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not return user" });
    }
  }

  /**
   * Function to return user by userId
   * @param {String} name  userId to return
   * @param {Response} res  response object for the GET /users/:userId endpoint
   */
  async getUser(name, res) {
    try {
      const user = await this.storage.getUser(name);
      if (user) {
        const { name, userRoles } = user;
        res.json({ name, userRoles });
      } else {
        res
          .status(404)
          .json({ error: 'Could not find user with provided "userId"' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not return user" });
    }
  }

  /**
   * Function to add roles to a user
   * @param {String} userId  userId to add role
   * @param {String} roleId  roleId to add role
   * @param {Response} res  Response object for the POST /users/:userId/roles endpoint
   */
  async addRoles(name, roleId, res) {
    const user = await this.storage.getUser(userId);
    if (!user) {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
      return;
    }
    try {
      await this.storage.addRole(name, roleId);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not add role" });
    }
  }
}

module.exports = UserServices;
