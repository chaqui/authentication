const express = require('express');
const router = express.Router();
const checkUserData = require('../middlewares/users');
const UserServices = require('../services/users');

const service = new UserServices();

router.get("/:userId", async function (req, res) { service.getUser(req, res); });
router.get("/", async function (req, res) { service.getUsers(res); });
router.post("/", checkUserData, async function (req, res) { service.postUsers(req, res); });

module.exports = router;