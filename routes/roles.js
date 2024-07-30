const express = require('express');
const RoleServices = require('../services/roles');
const validateRol = require('../middlewares/roles.js');


const service = new RoleServices();

const router = express.Router();
router.get("/:roleId", async function (req, res) { service.getRole(req, res); });
router.get("/", async function (req, res) { service.getRoles(res); });
router.post("/", validateRol, async function (req, res) { service.postRoles(req, res); });


module.exports = router;