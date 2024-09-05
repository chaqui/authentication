function validateRole(req, res, next) {
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

function validateRoleId(req, res, next) {
  const { roleId } = req.params;
  if (!roleId) {
    res.status(400).json({ error: 'Missing required fields: "rolId"' });
  } else {
    next();
  }
}

module.exports = { validateRole, validateRoleId };
