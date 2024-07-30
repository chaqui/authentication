const express = require('express');
const router = express.Router();

const LoginServices = require('../services/login');

const service = new LoginServices();

router.post("/", function (req, res) {
    service.login(req.body.name, req.body.password).then(user => {
        if (user) {
            res.json({ userId: user.userId, name: user.name, userRoles: user.userRoles });
        } else {
            res.status(401).json({ error: "Unauthorized" });
        }
    });
});

module.exports = router;