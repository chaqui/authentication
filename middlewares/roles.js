function validateRol(req, res, next) {
  const { name, description } = req.body;
  if (!name || !description) {
    res
      .status(400)
      .json({ error: 'Missing required fields: "name" "description:"' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  } else if (typeof description !== "string") {
    res.status(400).json({ error: '"description" must be a string' });
  } else {
    next();
  }
}

module.exports = validateRol;
