const express = require("express");
const RoleServices = require("../services/roles");
const { validateRole, validateRoleId } = require("../middlewares/roles.js");
const RolesStore = require("../store/roles");

const store = new RolesStore();
const service = new RoleServices(store);

const router = express.Router();

/**
 * Function to get a role by roleId
 * @param req Request object for the GET /roles/:roleId endpoint
 * @param res Response object for the GET /roles/:roleId endpoint
 */
router.get("/:roleId", validateRoleId, async function (req, res) {
  let role = await service.getRole(req.params.roleId);
  res.json(role);
});

/**
 * Function to get all roles from the database
 * @param req Request object for the GET /roles endpoint
 * @param res Response object for the GET /roles endpoint
 */
router.get("/", async function (req, res) {
  let roles = await service.getRoles();
  res.json(roles);
});

/**
 * Function to add a role
 * @param req Request object for the POST /roles endpoint
 * @param res Response object for the POST /roles endpoint
 */
router.post("/", validateRole, async function (req, res) {
  const roleAdd = await service.postRoles(req.body);
  res.json(roleAdd);
});

module.exports = router;
