// Import express.js
const express = require("express");

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello world!");
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});
// Sample data (replace this with actual database queries)
const stores = [
  { id: 1, name: 'Store A', location: 'City A, State A', rating: 4.5 },
  { id: 2, name: 'Store B', location: 'City B, State B', rating: 4.0 },
];

// Define routes
app.get('/', (req, res) => {
  res.render('homepage', { appName: 'Your App Name', tagline: 'Your tagline here' });
});

app.get('/store-list', (req, res) => {
  res.render('store-list', { appName: 'Your App Name', stores });
});

// Other routes...

// Set up Pug as the view engine
app.set('view engine', 'pug');

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
