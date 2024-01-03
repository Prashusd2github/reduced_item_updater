// Import express.js
const express = require("express");
const session = require("express-session");
const { User } = require("./models/user");

// Create express app
const app = express();

// Add static files location
app.use(express.static("static"));
// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));

// Get the functions in the db.js file to use
const db = require('./services/db');

app.use(session({
    secret: 'secretkeysdfjsflyoifasd',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
    }
}));

// Register
app.get('/register', function (req, res) {
    res.render('register');
});

// Login route
app.get('/login', function (req, res) {
    res.render('login');
});

app.get("/", function (req, res) {
    
    const sql = 'SELECT * FROM reducer_items';

    db.query(sql)
        .then(results => {
            res.render('index', { title: 'reducer items', data: results });
        })
});


app.get("/store_details", function (req, res) {
    const sql = 'SELECT * FROM reducer_items';

    db.query(sql)
        .then(results => {
            res.render('store_details', { title: 'Store details', data: results });
        })
});

app.get("/fooditemdetails", function (req, res) {
    const sql = 'SELECT * FROM reducer_items';

    db.query(sql)
        .then(results => {
            res.render('fooditemdetails', { title: 'food item details', data: results });
        })
});

app.get("/profile", function (req, res) {
    const sql = 'SELECT * FROM reducer_items';

    db.query(sql)
        .then(results => {
            res.render('profile', { title: 'profile', data: results });
        })
});

app.get("/analytics", function (req, res) {
    const sql = 'SELECT * FROM reducer_items';

    db.query(sql)
        .then(results => {
            res.render('analytics', { title: 'analytics', data: results });
        })
});


app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password and redirect to the users single-student page
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.send('Password set successfully');
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.email);
            res.send('Perhaps a page where a new user sets a programme would be good here');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});


// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            match = await user.authenticate(params.password);
            if (match) {
                req.session.uid = uId;
                req.session.loggedIn = true;
                console.log(req.session.id);
                res.redirect('/');
            }
            else {
                // TODO improve the user journey here
                res.send('invalid password');
            }
        }
        else {
            res.send('invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Logout
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
