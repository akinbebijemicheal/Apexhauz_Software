const bcrypt = require('bcrypt');
const req = require('express/lib/request');
const jwt = require("jsonwebtoken");
const db = require('../config/db.config.js');
require("dotenv").config();

;

// constructor
class Login {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }


    //LOGIN CHECK
    static check(newLogin, result) {
       //create token
       const token = jwt.sign(
        { login_email : newLogin.email }, 
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
        );

        //check if email is registered
        db.query(`SELECT * FROM users WHERE email = ?`, [newLogin.email], (err, res) => {
            if (err) {
                console.log("err: ", err);
                result(err, null);
                return;
            }

            //if email is registered
            if (res.length) {
                console.log("found User with email ");
                // result(null, userpassword[0]); 

                //Select the password of the registered email found in database
            db.query(`SELECT password FROM users WHERE email = ?`, [newLogin.email], (error, userpasswordraw) => {
                if (error) {
                    console.log("error: ", error);
                    result(err, null);
                    return;
                }
                //Password is selected and held in a variable
                if (userpasswordraw.length) {
                    const userpasswordstring = JSON.stringify(userpasswordraw);
                    const userpassword = userpasswordstring.substr(14,60);
                    // result(null, userpassword); 
                
             
                    //compare both passwords from request and from database
                bcrypt.compare(newLogin.password, userpassword, function(error1, correct) {
                    if (error1) {
                        console.log("error1: ", error1);
                        result(err, null);
                        return;
                    }
                    console.log(correct);

                    //if both are the same
                    if (correct==true) {
                        console.log("Password Correct")
                        //Update new token
                        db.query("UPDATE users SET token = ? WHERE email = ?", [ token, newLogin.email], (error2, updated) => {
                            if (error2) {
                                console.log("error: ", err);
                                result(null, err);
                                return;
                            }
                           
                            console.log("Successful");
                            
                            result(null, token); 
                    })}else{
                        //password is wrong
                        console.log("Wrong Password");
                        result(null, "Wrong Password"); 
                    }
                    
            })
        
    }
        })
        }else{
            //user with email isnt found
            console.log("User with email not found, input email again or create account");
            result(null, "User with email not found, input email again or create account"); 
        }
    });

    }

   

}

module.exports = Login;