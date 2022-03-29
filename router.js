var express = require('express');
var router = express.Router();
var helper = require('./helper');

router.get('/', (req, res) => {
    helper.getAllScraps().then((scraps) => {
        
        res.render('home', {scraps})
        // console.log(scraps);

    })
});

module.exports = router;