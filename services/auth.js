const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
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
  async login(name, password, res) {
    try {
      const user = await this.storageUser.getUserByName(name);

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const token = this.generateToken(user);
        await this.storageUser.saveToken(user.name, token);
        res.json({ token });
      }
    } catch (error) {
      res.status(500).json({ error: "Could not login" });
    }
  }

  /**
   * Function for generate a token
   * @param {Object} user information of the user
   * @returns String token
   */
  generateToken(user) {
    let { name, userRoles } = user;
    const token = jwt.sign({ name, userRoles }, SECRET_KEY, {
      expiresIn: "1h",
    });
    return token;
  }

  /**
   * Function for token validation
   * @param {String} token Token to validate
   * @param {Object} res Object response
   */
  async validateToken(token, res) {
    token = token.split(" ")[1];
    try {
      const user = jwt.verify(token, SECRET_KEY);
      let { name, userRoles } = user;
      res.json({ name, userRoles });
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  }

  /**
   * Delete token used after logout
   * @param {String} token Token to validate
   * @param {Object} res Object response
   */
  async removeToken(token, res) {
    try {
      token = token.split(" ")[1];
      const { name } = jwt.verify(token, SECRET_KEY);
      const user = await this.storageUser.getUserByName(name);
      const index = user.tokens.findIndex((t) => t === token);
      await this.storageUser.removeToken(user.name, index);

      res.status(200).json("Logout sucessful!");
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
}
module.exports = LoginServices;
