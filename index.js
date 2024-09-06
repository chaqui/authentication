const express = require("express");
const serverless = require("serverless-http");
const Sentry = require("@sentry/node");

const routerApiV1 = require("./routes/index");
const { handlerError, boomHandlerError } = require("./middlewares/handler");

const app = express();

app.use(express.json());
// Routes
routerApiV1(app);

//TODO: Error handlers middleware, not working in serverless

module.exports.handler = serverless(app);
