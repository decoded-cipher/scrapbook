var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    var sample = 'Node.js + HBS Template'
    res.render('home', { sample })
});

module.exports = router;