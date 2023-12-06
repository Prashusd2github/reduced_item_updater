// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

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

// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000/`);
});
