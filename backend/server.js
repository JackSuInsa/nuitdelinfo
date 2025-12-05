// import express module and create your express app
const express = require('express');
const app = express();

// set the server host and port
const port = 3000;

// add data to req.body (for POST requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// serve static files
app.use(express.static('../public'));

// set the view engine to ejs
app.set('view engine', 'ejs');

// import  and use express-session module
const session = require('express-session');
app.use(session({
	secret: 'login', //used to sign the session ID cookie
	name: 'login', // (optional) name of the session cookie
	resave: true, // forces the session to be saved back to the session store
	saveUninitialized: true, // forces a session an uninitialized session to be saved to the store	
}));

app.use('/index', (req, res) => {
    res.sendFile('index.html', { root: '../public' });
});

const snake = require('./routers/snake');
app.use('/sn4k3', snake);

app.get('/v1su4l1z3r', (req, res) => {
    res.sendFile('visualizer.html', { root: '../public' });
});

const quizz = require('./routers/quizz');
app.use('/quizz', quizz);
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../public' });
});

app.use((req, res) => {
	res.status(404).sendFile('404.html', { root: '../public' });
});

// run the server
app.listen(port, () => {
	// callback executed when the server is launched
	console.log(`Express app listening on port ${port}`);
});