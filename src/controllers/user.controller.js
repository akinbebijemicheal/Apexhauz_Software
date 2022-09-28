const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');


//Create and Save new User
exports.create = (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    //Create a User
    const {email, first_name, last_name, password, phone, address, is_admin} = req.body;

    bcrypt.hash(password, 10, function(err, hashpassword) {
        // Now we can store the password hash in db.

       
    const user = new User(email, first_name, last_name, hashpassword, phone,  address, is_admin);

    //Save user in the database
    User.create(user, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the User."
        });
        else res.send(data);
    });
    });
    
};

//Retrieve all Users from the Database
exports.findAll = (req, res) => {

    User.getAll((err, data) => {
        if (err) 
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving users."
        });
        else res.send(data);
    });
};


//Find a single user by Id
exports.findOne = (req, res) => {

    User.findById(Number(req.params.id), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with id ${req.params.id}.`
                });
            }else {
                res.status(500).send({
                message: "Error retrieving user with id" + req.params.id
                });
            }
        }else res.send(data);
    });
};

//Update a User identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { id, email, first_name, last_name, password, address, is_admin } = req.body;
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashpassword) => {
            // Now we can store the password hash in db.
    User.updateById(
        Number(req.params.id),
        new User(id, email, first_name, last_name, hashpassword, address, is_admin),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found user with id ${req.params.id}.`
                    });
                }else {
                    res.status(500).send({
                    message: "Error updating user with id" + req.params.id
                    });
                }
            }else res.send(data);
        }
    );
});
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    User.delete(Number(req.params.id), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found user with id ${req.params.id}.`
                });
            }else {
                res.status(500).send({
                message: "Could not delete user with id" + req.params.id
                });
            }
        }else res.send({ message: `User was deleted Successfully!`});
    });
};