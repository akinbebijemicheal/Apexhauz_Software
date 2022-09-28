const Login = require('../models/login.model.js');




//Create and Save new User
exports.check = (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    //Create a User
    const {email, password} = req.body;
    

    const login = new Login(email, password);

    //Save user in the database
    Login.check(login, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
        else {
            req.session.user = req.body.email
            res.send(data)
        };
    });
    

    
};
