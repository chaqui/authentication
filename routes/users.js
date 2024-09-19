const express = require("express");

const { handlerError, boomHandlerError } = require("../middlewares/handler");
const {
  checkUserData,
  checkUserName,
  checkAddRole,
} = require("../middlewares/users");
const UserServices = require("../services/users");
const UserStore = require("../store/users");

const store = new UserStore();
const service = new UserServices(store);

const router = express.Router();

/**
 * Function to return user by name
 * @param req Request object for the GET /users/:name endpoint
 * @param res Response object for the GET /users/:name endpoint
 */
router.get("/:name", checkUserName, async function (req, res) {
  try {
    const user = await service.getUserByName(req.params.name);
    res.json(user);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to return all users
 * @param req Request object for the GET /users endpoint
 * @param res Response object for the GET /users endpoint
 */
router.get("/", async function (req, res) {
  try {
    const users = await service.getUsers();
    res.json(users);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to add a user
 * @param req Request object for the POST /users endpoint
 * @param res Response object for the POST /users endpoint
 * @returns Object with the user information
 */
router.post("/", checkUserData, async function (req, res) {
  try {
    const userAdd = await service.postUsers(req.body);
    res.json(userAdd);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

/**
 * Function to add a role to the user
 * @param req Request object for the POST /users/:name/roles endpoint
 * @param res Response object for the POST /users/:name/roles endpoint
 * @returns Object with the user information
 */
router.post("/:name/roles/", checkAddRole, async function (req, res) {
  try {
    let message = service.addRoles(req.params.name, req.body.roleId);
    res.json(message);
  } catch (e) {
    boomHandlerError(e, res, handlerError);
  }
});

module.exports = router;
