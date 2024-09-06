function handlerError(err, req, res, next) {
  console.error(err);
  res.status(500).send("Something broke!");
}

function boomHandlerError(err, req, res, next) {
  console.log("boomHandlerError");
  if (err.isServer) {
    const { output } = err;
    console.error(err);
    res.status(output.statusCode).send(output.payload);
  } else {
    next(err);
  }
}

module.exports = handlerError;
