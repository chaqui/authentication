/**
 * Middleware to handle errors in the application
 * @param {Error} err  Error object
 * @param {Obect} res  Object response from express
 */
function handlerError(err, res) {
  console.error(err);
  res.status(500).send("Something broke!");
}

/**
 * Middleware to handle errors with boom library
 * @param {Error} err error object
 * @param {Object} res Object response from express
 * @param {Callback} next  Callback function from express to call the next middleware in the chain
 */
function boomHandlerError(err, res, next) {
  if (err.isBoom) {
    const { output } = err;
    console.error(err);
    res.status(output.statusCode).send(output.payload);
  } else {
    next(err);
  }
}

module.exports = { handlerError, boomHandlerError };
