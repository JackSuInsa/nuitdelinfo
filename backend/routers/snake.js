const express = require('express');
const router = express.Router();


router.get('/', function (req, res) {
	res.sendFile('snake.html', { root: "../public"});
});

router.use('*', function (req, res) {	
	res.status(404).sendFile('404.html', { root: '../public' });
});

module.exports = router;