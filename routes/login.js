const express = require("express");
const LoginServices = require("../services/login");
const UserStore = require("../store/users");
const checkLogin = require("../middlewares/login");

const store = new UserStore();
const service = new LoginServices(store);

const router = express.Router();

/**
 * Function to login
 * @param req Request object for the POST /login endpoint
 * @param res Response object for the POST /login endpoint
 */
router.post("/", checkLogin, function (req, res) {
  const token = service.login(req.body.name, req.body.password);
  res.json(token);
});

/**
 * Function to validate token
 * @param req Request object for the POST /login/validate endpoint
 * @param res Response object for the POST /login/validate endpoint
 */
router.post("/validate", function (req, res) {
  const dataToken = service.validateToken(req.headers.authorization);
  res.json(dataToken);
});

module.exports = router;
