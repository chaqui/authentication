const express = require("express");
const serverless = require("serverless-http");
const Sentry = require("@sentry/node");

const routerApiV1 = require("./routes/index");

const app = express();

app.use(express.json());
// Routes
routerApiV1(app);

module.exports.handler = serverless(app);
