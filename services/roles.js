const crypto = require("crypto");

class RolesServices {
  constructor(storage) {
    this.storage = storage;
  }

  async postRoles(body, res) {
    const { name, description } = body;
    const idGenerated = crypto.randomBytes(20).toString("hex");

    try {
      const newRole = {
        roleId: idGenerated,
        name: name,
        description: description,
      };

      const roleAdded = await this.storage.addRole(newRole);
      res.json(roleAdded);
    } catch (error) {
      res.status(500).json({ error: "Could not create role" });
    }
  }

  async getRoles(res) {
    try {
      const roles = await this.storage.getRoles();
      res.json(roles);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not return roles", message: error.message });
    }
  }

  async getRole(roleId, res) {
    try {
      const rol = await this.storage.getRole(roleId);
      res.json(rol);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Could not return role", message: error.message });
    }
  }
}

module.exports = RolesServices;
