const express = require("express");
const AuthServices = require("../services/auth");
const UserStore = require("../store/users");
const checkLogin = require("../middlewares/login");
const { handlerError, boomHandlerError } = require("../middlewares/handler");

const store = new UserStore();
const service = new AuthServices(store);

const router = express.Router();

/**
 * Function to login
 * @param req Request object for the POST /auth/login endpoint
 * @param res Response object for the POST /auth/login endpoint
 */
router.post("/login", checkLogin, async function (req, res) {
  try {
    const token = await service.login(req.body.name, req.body.password);
    res.json(token);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to validate token
 * @param req Request object for the POST /auth/validate endpoint
 * @param res Response object for the POST /auth/validate endpoint
 */
router.post("/validate", async function (req, res) {
  try {
    const dataToken = await service.validateToken(req.headers.authorization);
    res.json(dataToken);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to logout
 * @param req Request object for the POST /auth/logout endpoint
 * @param req Response object for the POST /auth/logout endpoint
 */
router.post("/logout", async function (req, res) {
  try {
    const message = await service.removeToken(req.headers.authorization);
    res.json(message);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

module.exports = router;
