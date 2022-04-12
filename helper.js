var config = require('./config');
var ago = require('s-ago');

module.exports = {

    getAllScraps : () => {
        return new Promise((resolve, reject) => {
            config.ScrapData.orderByChild("status").equalTo(1).once('value', (snapshot) => {
                resolve(snapshot.val());
                reject(new Error('Error while fetching Scrap Data'));
            });
        })
    },

    getScrapById : (id) => {
        return new Promise((resolve, reject) => {
            config.ScrapData.child(id).once('value', (snapshot) => {
                resolve(snapshot.val());
                reject(new Error('Scrap Data not found'));
            });
        })
    },

    decideAttachmentType : (x) => {
        return new Promise((resolve, reject) => {
            x.ago = ago(new Date(x.createdAt));
            if (x.attachment.type == 'png' || x.attachment.type == 'jpg' || x.attachment.type == 'jpeg' || x.attachment.type == 'gif') {
                x.isImage = true;
            } else if (x.attachment.type == 'mp4') {
                x.isVideo = true;
            }
            resolve(x);
            reject(new Error('Error while deciding attachment type'));
        })
    },

    postScrapLikesCounter : (scrap) => {
        return new Promise( async (resolve, reject) => {

            // console.log(scrap);
            config.ScrapData.child(scrap.id).child('likesCount').once('value', async (snapshot) => {
                
                var likesCount;
                if (!snapshot.val()) {
                    await config.ScrapData.child(scrap.id).child('likesCount').set(0);
                    likesCount = 0;
                } else {
                    likesCount = snapshot.val();
                }

                scrap.likes = parseInt(scrap.likes);
                if (scrap.likes == 1) {
                    likesCount = likesCount + 1;
                } else {
                    likesCount = likesCount - 1;
                }

                await config.ScrapData.child(scrap.id).update({ likesCount: likesCount });
                resolve(likesCount);
                reject(new Error('Error while fetching Scrap Data'));
            });

        })
    }

}