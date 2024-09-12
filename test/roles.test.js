const RolesServices = require("../services/roles");
const { RolesStoreHappyPath, RolesStoreSadPath } = require("./utils/roles");

/**
 * Test suite for Roles Services class in services/roles.js file in happy path
 */
describe("Roles Services in happy path", () => {
  let store = new RolesStoreHappyPath();
  let roleId = "";
  test("should call getRoles", async () => {
    const rolesServices = new RolesServices(store);
    const roles = await rolesServices.getRoles();
    expect(roles).not.toBeNull();
    expect(roles.length).toBe(0);
  });

  test("should call postRoles", async () => {
    const rolesServices = new RolesServices(store);
    const body = { name: "test", description: "test" };
    let role = await rolesServices.postRoles(body);
    expect(role).not.toBeNull();
    expect(role.name).toBe(body.name);
    expect(role.description).toBe(body.description);
    roleId = role.roleId;
  });

  test("should call getRole", async () => {
    const rolesServices = new RolesServices(store);
    const role = await rolesServices.getRole(roleId);
    expect(role).not.toBeNull();
    expect(role.roleId).toBe(roleId);
  });
});

/**
 * Test suite for Roles Services class in services/roles.js file in sad path
 */
describe("Roles Services in sad path", () => {
  let store = new RolesStoreSadPath();
  test("should call getRoles", async () => {
    const rolesServices = new RolesServices(store);
    const roles = await rolesServices.getRoles();
    expect(roles).toBeNull();
  });

  test("should call postRoles", async () => {
    const rolesServices = new RolesServices(store);
    const body = { name: "test", description: "test" };
    const r = expect(() => rolesServices.postRoles(body)).rejects;
    r.toThrow();
    r.toThrowError("Error adding role");
  });

  test("should call getRole", async () => {
    const rolesServices = new RolesServices(store);
    const r = expect(() => rolesServices.getRole("test")).rejects;
    r.toThrow();
    r.toThrowError('Could not find role with provided "roleId"');
  });
});
