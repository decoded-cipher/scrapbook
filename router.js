var express = require('express');
var router = express.Router();
var ago = require('s-ago');

var helper = require('./helper');

router.get('/', (req, res) => {
    helper.getAllScraps().then( async (scraps) => {

        var scraps = Object.keys(scraps).map((key) => {
            return scraps[key];
        })

        await scraps.forEach(x => {
            x.ago = ago(new Date(x.createdAt));
            // console.log(x.ago);

            if (x.attachment.type == 'png' || x.attachment.type == 'jpg' || x.attachment.type == 'jpeg' || x.attachment.type == 'gif') {
                x.isImage = true;
            } else if (x.attachment.type == 'mp4') {
                x.isVideo = true;
            }
        });

        await scraps.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.render('home', { scraps })
        // console.log(scraps);

    })
});

module.exports = router;