const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
	// primer1
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES (?, ?, ?)", ['test', 'test', 'Administrator']);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/primer1', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/example_1.html'));
});

app.post('/primer1/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt:", { username, password });

    const query = "SELECT title FROM user WHERE username = ? AND password = ?";
    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('ERROR', err);
            res.redirect("/pages/example_1.html#error");
        } else if (!row) {
            res.redirect("/pages/example_1.html#unauthorized");
        } else {
            res.send(`Hello <b>${row.title}</b>!<br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/pages/example_1.html">Go back to login</a>`);
        }
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
