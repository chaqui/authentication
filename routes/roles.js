const express = require("express");
const RoleServices = require("../services/roles");
const { validateRole, validateRoleId } = require("../middlewares/roles.js");
const RolesStore = require("../store/roles");

const store = new RolesStore();
const service = new RoleServices(store);

const router = express.Router();
router.get("/:roleId", validateRoleId, async function (req, res) {
  service.getRole(req.params.roleId, res);
});
router.get("/", async function (req, res) {
  service.getRoles(res);
});
router.post("/", validateRole, async function (req, res) {
  service.postRoles(req.body, res);
});

module.exports = router;
