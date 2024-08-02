

function checkUserData(req, res, next) {
  const { name, password } = req.body;
  if (!name || !password) {
    res.status(400).json({ error: 'Missing required fields: "name" and "password"' });
  }
  else if (typeof password !== "string") {
    res.status(400).json({ error: '"password" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }
  else {
    next();
  }
}

function checkAddRol(req,res, next){
  const {roleId} = req.body;
  const {name} = req.params;
  if(!name || !roleId){
    res.status(400).json({error: 'Missing required fields: "name" and "roleId"'});
  }
  else if(typeof name !== "string"){
    res.status(400).json({error: '"name" must be a string'});
  }
  else if(typeof roleId !== "string"){
    res.status(400).json({error: '"roleId" must be a string'});
  }
  else{
    next();
  }

}

module.exports = {
  checkUserData,
  checkAddRol};