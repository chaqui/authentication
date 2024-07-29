
const express = require("express");
const serverless = require("serverless-http");

const users = require("./users");

const app = express();

app.use(express.json());
const router = express.Router();
router.use("/users", users);
app.use('/api/v1', router);


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
