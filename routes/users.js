const express = require('express');
const router = express.Router();
const { checkUserData, checkAddRol } = require('../middlewares/users');
const UserServices = require('../services/users');

const service = new UserServices();

router.get("/:userId", async function (req, res) { service.getUser(req.params.userId, res); });
router.get("/", async function (req, res) { service.getUsers(res); });
router.post("/", checkUserData, async function (req, res) { service.postUsers(req.body, res); });
router.post("/:userId/roles/", checkAddRol, async function (req, res) { service.addRoles(req.params.userId, req.body.roleId, res); });

module.exports = router;