const express = require("express");
const router = express.Router();
const {
  checkUserData,
  checkUserName,
  checkAddRole,
} = require("../middlewares/users");
const UserServices = require("../services/users");
const UserStore = require("../store/users");

const store = new UserStore();
const service = new UserServices(store);

/**
 * Function to return user by name
 * @param req Request object for the GET /users/:name endpoint
 * @param res Response object for the GET /users/:name endpoint
 */
router.get("/:name", checkUserName, async function (req, res) {
  const user = await service.getUserByName(req.params.name);
  res.json(user);
});

/**
 * Function to return all users
 * @param req Request object for the GET /users endpoint
 * @param res Response object for the GET /users endpoint
 */
router.get("/", async function (req, res) {
  const users = await service.getUsers();
  res.json(users);
});

router.post("/", checkUserData, async function (req, res) {
  const userAdd = await service.postUsers(req.body);
  res.json(userAdd);
});
router.post("/:name/roles/", checkAddRole, async function (req, res) {
  service.addRoles(req.params.name, req.body.roleId, res);
});

module.exports = router;
