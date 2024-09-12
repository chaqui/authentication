class RolesStoreHappyPath {
  constructor() {
    this.roles = [];
  }

  addRole(role) {
    this.roles.push(role);
    return role;
  }

  getRoles() {
    return this.roles;
  }

  getRole(roleId) {
    return this.roles.find((role) => role.roleId === roleId);
  }
}

class RolesStoreSadPath {
  addRole() {
    throw new Error("Error adding role");
  }

  getRoles() {
    return null;
  }

  getRole() {
    return null;
  }
}

module.exports = { RolesStoreHappyPath, RolesStoreSadPath };
