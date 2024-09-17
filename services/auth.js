const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");

const SECRET_KEY = process.env.SECRET_KEY;
class AuthServices {
  constructor(storageUser) {
    this.storageUser = storageUser;
    this.secret_key = this.SECRET_KEY || "mysecret";
  }

  /**
   *
   * Function for login a user
   * @param {String} name Identifier of the user
   * @param {String} password Password of the user
   * @param {Object} res Response object
   * @returns
   */
  async login(name, password) {
    // Get user by name
    const user = await this.storageUser.getUserByName(name);

    if (!user) {
      throw boom.unauthorized("Invalid username or password");
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw boom.unauthorized("Invalid username or password");
    }

    const token = this.generateToken(user);
    this.storageUser.saveToken(name, token);
    return { token: token };
  }

  /**
   * Function for generate a token
   * @param {Object} user information of the user
   * @returns String token
   */
  generateToken(user) {
    let { name, userRoles } = user;

    const token = jwt.sign({ name, userRoles }, this.secret_key, {
      expiresIn: "1h",
    });
    return token;
  }

  /**
   * Function for token validation
   * @param {String} token Token to validate
   * @param {Object} res Object response
   */
  async validateToken(token) {
    token = token.split(" ")[1];
    try {
      const { name } = jwt.verify(token, this.secret_key);
      const user = await this.storageUser.getUserByName(name);
      const index = this.getIndexToken(user, token);
      let { userRoles } = user;
      return { name, userRoles };
    } catch (error) {
      throw boom.unauthorized("Invalid token");
    }
  }

  /**
   * Delete token used after logout
   * @param {String} token Token to validate
   * @param {Object} res Object response
   */
  async removeToken(token) {
    token = token.split(" ")[1];
    const { name } = jwt.verify(token, this.secret_key);
    const user = await this.storageUser.getUserByName(name);
    const index = this.getIndexToken(user, token);
    await this.storageUser.removeToken(user.name, index);
    return "Logout sucessful!";
  }

  /**
   * Function for get the index of the token
   * @param {Object} user information of the user
   * @param {*} token
   * @returns
   */
  getIndexToken(user, token) {
    const index = user.tokens.findIndex((t) => t === token);
    if (index < 0) {
      throw Error("Invalid token");
    }
    return index;
  }
}
module.exports = AuthServices;
