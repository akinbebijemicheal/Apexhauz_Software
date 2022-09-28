const db = require('../config/db.config.js')

// constructor
class Property {
    constructor(ownerid, status, price, state, city, address, type, image_url) {
        this.ownerid = ownerid;
        this.status = status;
        this.price = price;
        this.state = state;
        this.city = city;
        this.address = address;
        this.type = type;
        this.image_url = image_url;
    }


    //CREATE NEW property
    static create(newProperty, result) {
        db.query(`INSERT INTO property (ownerid, status, price, state, city, address, type, image_url) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [newProperty.ownerid, newProperty.status, newProperty.price, newProperty.state, newProperty.city, newProperty.address, newProperty.type, newProperty.image_url], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("Created Property: ", { ...newProperty });
            result(null, { propertyid: res.insertpropertyid, ...newProperty });
        });
    }

    //FIND A SPECIFIC property BY propertyid
    static findById(propertyid, result) {
        db.query(`SELECT * FROM property WHERE propertyid = ?`, [propertyid], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("found property: ", res[0]);
                result(null, res[0]); 
                return;
            }

            //not found
            result({ kind: "not_found" }, null);
        });
    }

    // GET ALL propertyS
    static getAll(result) {
        db.query('SELECT * FROM property', (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
                console.log("propertys: ", res);
                result(null, res); 
        });
    }


    //UPDATE A property BY propertyid
    static updateById(propertyid, property, result) {
        db.query("UPDATE property SET ownerid = ?, status = ?, price = ?, state = ?, city = ?, address = ?, type = ?, image_url = ? WHERE propertyid = ?", [property.ownerid, property.status, property.price, property.state, property.city, property.address, property.type, property.image_url, propertyid], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                //not found
                result({ kind: "not_found" }, null); 
                return;
            }

            console.log("updated property: ", { ...property });
            result(null, { ...property });
        });
    }

        //UPDATE A property availability (SOLD) BY propertyid
        static updateSoldById(propertyid, property, result) {

            db.query("SELECT * FROM property WHERE status like '%sold%' AND propertyid = ?", [propertyid], (err, res) => {
                if (res.length > 0){

                    db.query("UPDATE property SET status = 'available' WHERE propertyid = ?", [propertyid], (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(null, err);
                            return;
                        }
            
                        if (res.affectedRows == 0) {
                            //not found
                            result({ kind: "not_found" }, null); 
                            return;
                        }
            
                        console.log("updated property status: ", { ...property });
                        result(null, { ...property });
                    });
                }else{
                    db.query("UPDATE property SET status = 'sold' WHERE propertyid = ?", [propertyid], (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(null, err);
                            return;
                        }
            
                        if (res.affectedRows == 0) {
                            //not found
                            result({ kind: "not_found" }, null); 
                            return;
                        }
            
                        console.log("updated property status: ", { ...property });
                        result(null, { ...property });
                    }); 
                }
                
            });
            
        }

     //DELETE A property BY propertyid
     static delete(propertyid, result) {
        db.query("DELETE FROM property WHERE propertyid = ?", propertyid, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                //not found
                result({ kind: "not_found" }, null); 
                return;
            }

            console.log("deleted property: ", propertyid);
            result(null, res);
        });
    }


}

module.exports = Property;