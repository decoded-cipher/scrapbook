var express = require('express');
var router = express.Router();
var ago = require('s-ago');

var helper = require('./helper');

router.get('/', (req, res) => {
    helper.getAllScraps().then((scraps) => {

        var scraps = Object.keys(scraps).map((key) => {
            return scraps[key];
        })

        scraps.forEach(x => {
            x.ago = ago(new Date(x.createdAt));
            // console.log(x.ago);
        });

        res.render('home', {scraps})
        // console.log(scraps);

    })
});

module.exports = router;