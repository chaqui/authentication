const express = require("express");
const LoginServices = require("../services/auth");
const UserStore = require("../store/users");
const checkLogin = require("../middlewares/login");

const store = new UserStore();
const service = new LoginServices(store);

const router = express.Router();
router.post("/login", checkLogin, function (req, res) {
  service.login(req.body.name, req.body.password, res);
});
router.post("/validate", function (req, res) {
  service.validateToken(req.headers.authorization, res);
});
router.post("/logout", function (req, res) {
  service.removeToken(req.headers.authorization, res);
});

module.exports = router;
