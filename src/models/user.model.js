const jwt = require("jsonwebtoken");
const db = require('../config/db.config.js');
require("dotenv").config();


// constructor
class User {
    constructor(email, first_name, last_name, hashpassword, phone, address, is_admin) {
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.hashpassword = hashpassword;
        this.phone = phone;
        this.address = address;
        this.is_admin = is_admin;
    }


    //CREATE NEW USER
    static create(newUser, result) {
       //create token
       const token = jwt.sign(
        { user_email : newUser.email }, 
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
        );
        db.query(`INSERT INTO users (email, first_name, last_name, password, phone, address, is_admin, token) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [newUser.email, newUser.first_name, newUser.last_name, newUser.hashpassword, newUser.phone, newUser.address, newUser.is_admin, token], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
        


            console.log("Created User: ", { ...newUser, token });
            
           
            result(null, { id: res.insertId, ...newUser });
        });

    }

    //FIND A SPECIFIC USER BY ID
    static findById(id, result) {
        db.query('SELECT * FROM users WHERE id = ?', [id], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.length) {
                console.log("found User: ", res[0]);
                result(null, res[0]); 
                return;
            }

            //not found
            result({ kind: "not_found" }, null);
        });
    }

    // GET ALL USERS
    static getAll(result) {
        db.query('SELECT * FROM users', (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }
                console.log("Users: ", res);
                result(null, res); 
        });
    }


    //UPDATE A USER BY ID
    static updateById(id, user, result) {
        db.query("UPDATE users SET  email = ?, first_name = ?, last_name = ?, password = ?, phone = ?, address = ?, is_admin = ? WHERE id = ?", [ user.email, user.first_name, user.last_name, user.hashpassword, user.phone, user.address, user.is_admin, id], (err, res) => {
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

            console.log("updated user: ", { ...user });
            result(null, { ...user });
        });
    }

     //DELETE A USER BY ID
     static delete(id, result) {
        db.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
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

            console.log("deleted user: ", id);
            result(null, res);
        });
    }


}

module.exports = User;