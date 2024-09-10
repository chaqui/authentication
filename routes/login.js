const express = require("express");

const UserStore = require("../store/users");
const LoginServices = require("../services/login");
const checkLogin = require("../middlewares/login");
const { handlerError, boomHandlerError } = require("../middlewares/handler");

const store = new UserStore();
const service = new LoginServices(store);

const router = express.Router();

/**
 * Function to login
 * @param req Request object for the POST /login endpoint
 * @param res Response object for the POST /login endpoint
 */
router.post("/", checkLogin, function (req, res) {
  try {
    const token = service.login(req.body.name, req.body.password);
    res.json(token);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to validate token
 * @param req Request object for the POST /login/validate endpoint
 * @param res Response object for the POST /login/validate endpoint
 */
router.post("/validate", function (req, res) {
  try {
    const dataToken = service.validateToken(req.headers.authorization);
    res.json(dataToken);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

module.exports = router;
