const express = require("express");
const router = express.Router();
const {
  checkUserData,
  checkUserName,
  checkUserId,
  checkAddRol,
} = require("../middlewares/users");
const UserServices = require("../services/users");
const UserStore = require("../store/users");

const store = new UserStore();
const service = new UserServices(store);

router.get("/:name", checkUserName, async function (req, res) {
  service.getUserByName(req.params.name, res);
});
// router.get("/:userId", checkUserId, async function (req, res) {
//   service.getUserById(req.params.userId, res);
// });
router.get("/", async function (req, res) {
  service.getUsers(res);
});
router.post("/", checkUserData, async function (req, res) {
  service.postUsers(req.body, res);
});
router.post("/:name/roles/", checkAddRol, async function (req, res) {
  service.addRoles(req.body.userId, req.body.roleId, res);
});

module.exports = router;
