const crypto = require("crypto");
const boom = require("@hapi/boom");
class RolesServices {
  constructor(storage) {
    this.storage = storage;
  }

  /**
   * Function to create a new role
   * @param {Object} body information to create a new role
   * @returns {Object} role created
   */
  async postRoles(body) {
    const { name, description } = body;
    const idGenerated = crypto.randomBytes(20).toString("hex");
    const newRole = {
      roleId: idGenerated,
      name: name,
      description: description,
    };

    const roleAdded = await this.storage.addRole(newRole);
    return roleAdded;
  }

  /**
   * Function to get all roles
   * @returns {Array} roles
   */
  async getRoles() {
    const roles = await this.storage.getRoles();
    return roles;
  }

  /**
   * Function to get role by roleId
   * @param {String} roleId  roleId to return
   * @returns {Object} role with the roleId
   */
  async getRole(roleId) {
    const rol = await this.storage.getRole(roleId);
    if (rol) {
      return rol;
    }
    throw boom.notFound('Could not find role with provided "roleId"');
  }
}

module.exports = RolesServices;
