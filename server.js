const express = require('express');
const cors = require('cors');



const app = express();
app.use(cors());

const cookieParser = require("cookie-parser");
const session = require('express-session');

app.use(cookieParser('session'));
const oneDay = 1000 * 60 * 60 * 2;
app.use(session({
    secret : "myfirstsecret",
    saveUninitialized : true,
    cookie : {maxAge : oneDay },
    resave : false
}));



//parse request of content-type -- application/json
app.use(express.json());

//parse request of content-type -- application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//simple route
app.get("/", (req, res) => {
    
        res.json({message: "Login First."});       
});
app.get("/dashboard", (req, res) => {
    if (req.session.user) {
        
    res.json({message: "Welcome to Newton's Sidehustle Node Rest API with Express."});
    } else {
        res.json({message: "Login First."});       
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/')
});


require("./src/routes/user.route.js")(app);
require("./src/routes/login.route.js")(app);
require("./src/routes/property.route.js")(app);

//set port, listen to port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});