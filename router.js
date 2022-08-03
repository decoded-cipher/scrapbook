var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var helper = require('./helper');

router.post('/', urlencodedParser, (req, res) => {
    helper.getVisitorId(req.body.visitorId);
});

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

        helper.decideAttachmentType(scrap).then((scrap) => {
            res.render('scrap', { scrap });
            // console.log(scrap);
        })

    })
});


router.post('/scrap/:id/like', (req, res) => {
    helper.postScrapLikesCounter(req.body).then(async(response) => {
        res.json(response);
        // console.log(response);
    })
});

module.exports = router;