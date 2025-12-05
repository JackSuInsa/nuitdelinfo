const express = require('express');
const router = express.Router();
const path = require('path');

const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../db/db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the quizz database.');
});

router.get('/', function (req, res) {
	res.sendFile('quizz.html', { root: "../public"});
});

router.get('/getQuestion', function (req, res) {
    console.log("Recuperation des questions");
    db.get('SELECT * FROM questions ORDER BY RANDOM() LIMIT 1', (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            question: row.question,
            reponse1: row.reponse1,
            reponse2: row.reponse2,
            reponse3: row.reponse3,
            numReponseBonne: row.numReponseBonne
        });
    });
});

router.use('*', function (req, res) {
    res.status(404).sendFile('404.html', { root: '../public' });
});

module.exports = router;