const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  async login(name, password, res) {
    try {
      console.log("login");
      const user = await this.storageUser.getUserByName(name);
      console.log(user);
      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
          res.json({ token: this.generateToken(user) });
        }
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Could not login" });
    }
    return null;
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
  async validateToken(token, res) {
    token = token.split(" ")[1];
    try {
      const user = jwt.verify(token, SECRET_KET);
      let { name, userRoles } = user;
      res.json({ name, userRoles });
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  }
}
module.exports = LoginServices;
