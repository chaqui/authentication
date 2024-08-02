function checkLogin(req, res, next) {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({ error: "Bad request" });
    return;
  }
  next();
}

module.exports = checkLogin;
