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
        })
    }

}