const express = require("express");

const RolesStore = require("../store/roles");
const RoleServices = require("../services/roles");
const { validateRole, validateRoleId } = require("../middlewares/roles.js");
const { handlerError, boomHandlerError } = require("../middlewares/handler");

const store = new RolesStore();
const service = new RoleServices(store);

const router = express.Router();

/**
 * Function to get a role by roleId
 * @param req Request object for the GET /roles/:roleId endpoint
 * @param res Response object for the GET /roles/:roleId endpoint
 */
router.get("/:roleId", validateRoleId, async function (req, res) {
  try {
    let role = await service.getRole(req.params.roleId);
    res.json(role);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to get all roles from the database
 * @param req Request object for the GET /roles endpoint
 * @param res Response object for the GET /roles endpoint
 */
router.get("/", async function (req, res) {
  try {
    let roles = await service.getRoles();
    res.json(roles);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to add a role
 * @param req Request object for the POST /roles endpoint
 * @param res Response object for the POST /roles endpoint
 */
router.post("/", validateRole, async function (req, res) {
  try {
    const roleAdd = await service.postRoles(req.body);
    res.json(roleAdd);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

module.exports = router;
