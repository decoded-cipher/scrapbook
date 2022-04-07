var express = require('express');
var router = express.Router();
var ago = require('s-ago');

var helper = require('./helper');

router.get('/', (req, res) => {
    helper.getAllScraps().then( async (scraps) => {

        var scraps = await Object.keys(scraps).map((key) => {
            return scraps[key];
        })

        await scraps.forEach(x => {
            x.ago = ago(new Date(x.createdAt));
            // console.log(x.ago);
        });

        await res.render('home', {scraps})
        // console.log(scraps);

    })
});

module.exports = router;