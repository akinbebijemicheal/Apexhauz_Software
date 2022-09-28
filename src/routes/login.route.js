const router = require("express").Router();

const loginController = require('../controllers/login.controller');

module.exports = app => {
    // Login Request
    router.post("/auth/login", loginController.check);


    app.use('/api/users', router);
};