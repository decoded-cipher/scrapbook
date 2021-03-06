var express = require('express');
var router = express.Router();

var helper = require('./helper');

router.get('/', (req, res) => {
    helper.getAllScraps().then( async (scraps) => {

        var scraps = Object.keys(scraps).map((key) => {
            return scraps[key];
        })
        
        await scraps.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        await scraps.forEach(x => {
            helper.decideAttachmentType(x).then( (x) => {
                // console.log(scraps);
            })
        });
        res.render('home', { scraps });

    })
});


router.get('/scrap/:id', (req, res) => {
    helper.getScrapById(req.params.id).then((scrap) => {

        helper.decideAttachmentType(scrap).then( (scrap) => {
            res.render('scrap', { scrap });
            // console.log(scrap);
        })

    })
});

module.exports = router;