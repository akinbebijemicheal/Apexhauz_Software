const router = require("express").Router();

const propertyController = require('../controllers/property.controller');

module.exports = app => {
    // Create a new property 
    router.post("/", propertyController.create);

    // Retrieve all properties
    router.get("/", propertyController.findAll);

    // Retrieve a single property with id
    router.get("/:propertyid", propertyController.findOne);

    // Update a property with id
    router.put("/:propertyid",propertyController.update);

    // Update a property with id
    router.put("/:propertyid/sold",propertyController.updatesold);

    //Delete a property with id
    router.delete("/:propertyid", propertyController.delete);

    app.use('/api/property', router);
};