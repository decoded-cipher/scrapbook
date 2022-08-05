var express = require('express');
var router = express.Router();

var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});

var helper = require('./helper');

router.get('/', urlencodedParser, (req, res) => {
    
    var visitorId = req.headers.visitorid;
    // console.log(visitorId);

    helper.getAllScraps().then(async (scraps) => {

        var scraps = Object.keys(scraps).map((key) => {
            return scraps[key];
        })

        await scraps.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        await scraps.forEach(x => {
            helper.decideAttachmentType(x).then((x) => {
                helper.replaceURLWithHTMLLinks(x).then((x) => {
                    
                    helper.generateLikeCountMessage(x, visitorId).then((x) => {
                        // console.log(x);
                    });

                });
            });
        });
        
        metadata = {
            title: "Inovus Scrapbook",
            description: "Inovus Scrapbook is an exclusive social network for Inovus Fellows for scrapbooking and sharing scrapbooking content. It's more like a daily diary for them to scribble about their self-learning endeavors & DIY projects",
            image: "https://user-images.githubusercontent.com/44474792/182791904-7241eafc-c8a2-42c1-a0aa-c54b4de8bc16.png",
            url: process.env.BASE_URL
        }

        res.render('home', { scraps, metadata });

    })
});


router.get('/scrap/:id', (req, res) => {
    helper.getScrapById(req.params.id).then((scrap) => {

        helper.decideAttachmentType(scrap).then((scrap) => {
            helper.generateScrapMetaData(scrap).then((metadata) => {

                res.render('scrap', { scrap, metadata });

            }).catch((err) => {
                console.log(err);
            })
        }).catch((err) => {
            console.log(err);
        })

    })
});


router.post('/scrap/:id/like', (req, res) => {
    helper.postScrapLikesCounter(req.body).then(async (totalLikes) => {
        res.json(totalLikes);
        // console.log(totalLikes);
    })
});

module.exports = router;