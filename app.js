const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const {exec} = require('child_process');
const pug = require('pug');

const app = express();
app.use(express.static(path.join(__dirname, '.')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
	db.run("CREATE TABLE secret_table (username TEXT)");
	// primer1
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES (?, ?, ?)", ['admin', 'admin', 'Administrator']);
	db.run("INSERT INTO user VALUES (?, ?, ?)", ['user', 'user', 'User']);
	// I want to reference
	db.run("CREATE TABLE news (title TEXT, owner TEXT)");
	db.run("INSERT INTO news VALUES (?, ?)", ['Izbori 2023', 'user']);
	db.run("INSERT INTO news VALUES (?, ?)", ['Izbori 2022', 'user']);
	db.run("INSERT INTO news VALUES (?, ?)", ['ETF', 'admin']);
	db.run("INSERT INTO news VALUES (?, ?)", ['Izbori 2024', 'admin']);
	// secret
	
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login attempt:", { username, password });

    const query = "SELECT title FROM user WHERE username = '" + username + "' AND password = '" + password + "'" ;
	console.log('QUERY: ' + query);
    db.get(query, (err, row) => {
        if (err) {
            console.error('ERROR', err);
            res.redirect("/pages/login.html#error");
        } else if (!row) {
            res.redirect("/pages/login.html#unauthorized");
        } else {
            res.send(`Hello <b>${row.title}</b>!<br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/pages/example_1.html">Go back to login</a>`);
        }
    });
});


app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/news.html'));
});

app.get('/news_alert', (req, res) => {
	res.sendFile(path.join(__dirname, '/pages/news_alert.html'));
});

app.get('/search', (req, res) => {

    const searchQuery = req.query.search;
    if (searchQuery) {
		query = "SELECT * FROM news WHERE title LIKE '%" + searchQuery + "%' AND owner = 'user'";
    }else{
		query = "SELECT * FROM news WHERE owner = 'user'";
	}

	console.log('Search query: ' + searchQuery);

    
	console.log('QUERY: ' + query);
    db.all(query, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error occurred while querying the database');
        } else {
            res.json(rows);
        }
    });
});

app.get('/list', (req, res) => {
	const folder = req.query.folder;
	if (folder) {
	  // Run the command with the parameter the user gives us
	  exec(`dir ${folder}`, (error, stdout, stderr) => {
		let output = stdout;
		if (error) {
		  // If there are any errors, show that
		  output = error; 
		}
		res.send(
		  pug.renderFile('./pages/list.pug', {output: output, folder: folder})
		);
	  });
	} else {
	  res.send(pug.renderFile('./pages/list.pug', {}));
	}
  });

app.post('/news', (req, res) => {

	const title = req.body.title;

	if (!title) {
		return res.status(400).send('Title is required');
	}

	console.log('Title: ' + title);

	const query = "INSERT INTO news (title, owner) VALUES ('"+ title +"', 'user')";
	console.log('QUERY: ' + query);

	db.run(query, (err) => {
		if (err) {
			console.error(err.message);
			res.sendFile(path.join(__dirname, '/pages/news.html'));
		} else {
			res.sendFile(path.join(__dirname, '/pages/news.html'));
		}

	});

});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
