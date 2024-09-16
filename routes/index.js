const express = require("express");

const users = require("./users");
const roles = require("./roles");
const auth = require("./auth");

function routerApiV1(app) {
  const router = express.Router();
  router.use("/users", users);
  router.use("/roles", roles);
  router.use("/auth", login);
  app.use("/api/v1", router);
}

module.exports = routerApiV1;
