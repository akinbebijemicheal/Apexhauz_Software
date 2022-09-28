const Property = require('../models/property.model.js');

//Create and Save new Property
exports.create = (req, res) => {
    //validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content cannot be empty!"
        });
    }

    //Create a Property
    const { ownerid, status, price, state, city, address, type, image_url} = req.body;
    const property = new Property(ownerid, status, price, state, city, address, type, image_url);

    //Save Property in the database
    Property.create(property, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the property."
        });
        else res.send(data);
    });
};

//Retrieve all properties from the Database
exports.findAll = (req, res) => {

    Property.getAll((err, data) => {
        if (err) 
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving properties."
        });
        else res.send(data);
    });
};


//Find a single Property by Id
exports.findOne = (req, res) => {

    Property.findById(Number(req.params.propertyid), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Property with id ${req.params.propertyid}.`
                });
            }else {
                res.status(500).send({
                message: "Error retrieving Property with id" + req.params.propertyid
                });
            }
        }else res.send(data);
    });
};

//Update a property identified by the propertyid in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { ownerid, status, price, state, city, address, type, image_url } = req.body;
    Property.updateById(
        Number(req.params.propertyid),
        new Property(ownerid, status, price, state, city, address, type, image_url),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Property with id ${req.params.propertyid}.`
                    });
                }else {
                    res.status(500).send({
                    message: "Error updating Property with id" + req.params.propertyid
                    });
                }
            }else res.send(data);
        }
    );
};

//Update a property status identified by the propertyid in the request
exports.updatesold = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    const { status } = req.body;
    Property.updateSoldById(
        Number(req.params.propertyid),
        new Property(status),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Property with id ${req.params.propertyid}.`
                    });
                }else {
                    res.status(500).send({
                    message: "Error updating Property with id" + req.params.propertyid
                    });
                }
            }else res.send(data);
        }
    );
};

// Delete a Property with the specified id in the request
exports.delete = (req, res) => {
    Property.delete(Number(req.params.propertyid), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Property with id ${req.params.propertyid}.`
                });
            }else {
                res.status(500).send({
                message: "Could not delete Property with id" + req.params.propertyid
                });
            }
        }else res.send({ message: `Property was deleted Successfully!`});
    });
};