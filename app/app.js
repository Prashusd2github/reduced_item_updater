// Import express.js
const express = require("express");
const session = require("express-session");
const { User } = require("./models/user");
const { Item } = require("./models/items");

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
// Login route
app.get('/', function (req, res) {
    res.render('login');
});

app.get("/main", function (req, res) {
    
    const sql = 'SELECT * FROM items';

    db.query(sql)
        .then(results => {
            res.render('main', { title: 'reducer items', data: results });
        })
});

app.get("/notifications", function (req, res) {
    
    const sql = 'SELECT items.* FROM items,notifications where items.item_id = notifications.item_id';

    db.query(sql)
        .then(results => {
            res.render('notifications', { title: 'notifications', data: results });
        })
});



app.get("/store_details", function (req, res) {
    const sql = 'SELECT * FROM store';
    db.query(sql)
        .then(results => {
            res.render('store_details', { title: 'Store details', data: results });
        })
});

app.get("/fooditemdetails", function (req, res) {
    const sql = 'SELECT * FROM items';
    db.query(sql)
        .then(results => {
            res.render('fooditemdetails', { title: 'food item details', data: results });
        })
});

app.get("/profile", function (req, res) {
    const sql = 'SELECT * FROM items';

    db.query(sql)
        .then(results => {
            res.render('profile', { title: 'profile', data: results });
        })
});

app.get("/analytics", function (req, res) {
    const sql = 'SELECT * FROM items';

    db.query(sql)
        .then(results => {
            res.render('analytics', { title: 'analytics', data: results });
        })
});

app.get("/item_details/:id", async function (req, res) {
    const id = req.params.id;
    try {
        const item = await Item.getItemById(id);
        console.log(item);
        res.render('item_details', { item: item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create Item route
app.get('/create_item', async function (req, res) {
    const sql = 'SELECT * FROM store';

    try {
        const results = await db.query(sql);
        res.render('create_item', { title: 'create_item', stores: results });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.post("/create-item", async function (req, res) {
    const { item_name, actual_price, reduce_price, discount, store_id, items_available } = req.body;

    try {
        // Create a new item
        const newItem = new Item(item_name, actual_price, reduce_price, discount, store_id, items_available);
        const createdItemId = await newItem.createItem();

        // After creating the item successfully, add a notification
        await addNotification(createdItemId);

        res.render('create_item', { successMessage: 'Item created successfully' });
    } catch (error) {
        console.error(error);
        res.render('create_item', { errorMessage: 'Internal Server Error' });
    }
});

// Function to add a notification
async function addNotification(itemId) {
    const sql = 'INSERT INTO notifications (item_id) VALUES (?)';

    try {
        await db.query(sql, [itemId]);
    } catch (error) {
        console.error('Error adding notification:', error);
        throw error;
    }
}

app.get("/notification-count", async function (req, res) {
    try {
        const sql = 'SELECT COUNT(*) AS count FROM notifications';
        const result = await db.query(sql);
        const notificationCount = result[0].count;
        
        res.json({ count: notificationCount });
    } catch (error) {
        console.error('Error fetching notification count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/delete-item/:id", async function (req, res) {
    const itemId = req.params.id;
    try {
        await Item.deleteItem(itemId);
        res.render('edit-item', { successMessage: `Item ${itemId} deleted successfully`, itemId });
    } catch (error) {
        console.error(error);
        res.render('edit-item', { errorMessage: 'Internal Server Error', itemId });
    }
});


app.post('/set-password', async function (req, res) {
    const params = req.body; // Declare as const
    const user = new User(params.email);

    try {
        const uId = await user.getIdFromEmail();
        if (uId) {
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.send('password reset succesfully');
        } else {
            const newId = await user.addUser(params.email);
            res.send('Account created succesfully');
        }
    } catch (err) {
        console.error(`Error while setting password `, err.message);
        res.send('An error occurred while setting the password');
    }
});


// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    const params = req.body; // Declare as const
    const user = new User(params.email);
    
    try {
        const uId = await user.getIdFromEmail();
        if (uId) {
            const match = await user.authenticate(params.password);
            console.log(match);
            if (match) {
                req.session.uid = uId;
                req.session.loggedIn = true;
                console.log(req.session.id);
                res.redirect('/main');
            } else {
                res.send('Invalid email');
            }
        } else {
            res.send('Invalid email');
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
