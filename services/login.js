const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const boom = require("@hapi/boom");

const SECRET_KET = process.env.SECRET_KET;
class LoginServices {
  constructor(storageUser) {
    this.storageUser = storageUser;
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
    const user = await this.storageUser.getUserByName(name);
    if (!user) {
      throw boom.notFound('Could not find user with provided "name"');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return { token: this.generateToken(user) };
    }
  }

  /**
   * Function for generate a token
   * @param {Object} user information of the user
   * @returns String token
   */
  generateToken(user) {
    let { name, userRoles } = user;
    const token = jwt.sign({ name, userRoles }, SECRET_KET, {
      expiresIn: "1h",
    });
    return token;
  }

  /**
   * Function for validate a token
   * @param {String} token Token to validate
   * @param {Object} res Object response
   */
  async validateToken(token) {
    token = token.split(" ")[1];
    try {
      const user = jwt.verify(token, SECRET_KET);
      let { name, userRoles } = user;
      return { name, userRoles };
    } catch (error) {
      throw boom.unauthorized("Invalid token");
    }
  }
}
module.exports = LoginServices;
