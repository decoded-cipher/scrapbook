var config = require('./config');
var ago = require('s-ago');

module.exports = {

    getVisitorId: (visitorId) => {
        return visitorId;
    },

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

            if (x.attachment) {
                if (x.attachment.type == 'png' || x.attachment.type == 'jpg' || x.attachment.type == 'jpeg' || x.attachment.type == 'gif') {
                    x.isImage = true;
                } else if (x.attachment.type == 'mp4') {
                    x.isVideo = true;
                }
            }

            // check if x.content has any url, then return the url
            if (x.content.match(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/g)) {
                x.url = x.content.match(/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/g)[0];
            }
            // console.log(x.url);
            resolve(x);
            reject(new Error('Error while deciding attachment type'));
        })
    },

    postScrapLikesCounter : (scrap) => {
        return new Promise( async (resolve, reject) => {

            await config.ScrapData.child(scrap.id).child('likes').once('value', async (snapshot) => {
                var likes = snapshot.val();
                if (likes) {
                    for (var key in likes) {
                        var likesArray = Object.keys(likes).map((key) => {
                            return likes[key];
                        })
                    }

                    if (likesArray.includes(scrap.visitorId)) {
                        totalLikes = likesArray.length - 1;
                        await config.ScrapData.child(scrap.id).child('likes').child(key).remove();
                        await config.ScrapData.child(scrap.id).child('likesCount').set(totalLikes);

                        if (totalLikes == 0) { 
                            await config.ScrapData.child(scrap.id).child('likesCount').remove();
                        }
                    } else {
                        totalLikes = likesArray.length + 1;
                        await config.ScrapData.child(scrap.id).child('likes').push(scrap.visitorId);
                        await config.ScrapData.child(scrap.id).child('likesCount').set(totalLikes);
                    }
                    
                } else {
                    var totalLikes = 1;
                    await config.ScrapData.child(scrap.id).child('likes').push(scrap.visitorId);
                    await config.ScrapData.child(scrap.id).child('likesCount').set(totalLikes);
                }

                resolve(totalLikes);
            }).catch((err) => {
                reject(err);
            })
        })
    },

    generateScrapMetaData : (scrap) => {
        return new Promise((resolve, reject) => {
            metadata = {
                title: "Scrap | Inovus Scrapbook",
                description: scrap.content,
                image: scrap.attachment.url,
                url: process.env.BASE_URL + "/scrap/" + scrap._id,
                author: scrap.user.name
            }
            resolve(metadata);
            reject(new Error('Error while generating metadata'));
        })
    },

    replaceURLWithHTMLLinks : (scrap) => {
        return new Promise((resolve, reject) => {
            
            scrap.content = scrap.content.replace(/\n/g, '<br>');

            var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            var url = regex.exec(scrap.content);
            if (url) {
                var nonUrlPart = scrap.content.substring(0, scrap.content.indexOf(url[0]));
                var urlPart = scrap.content.substring(scrap.content.indexOf(url[0]));
                var urlPart = urlPart.replace(url[0], `<a target="_blank" href="${url[0]}">${url[0]}</a>`);
                scrap.content = nonUrlPart + urlPart;
            }
            resolve(scrap);
            reject(new Error('Error while replacing URL with HTML links'));
        })
    }

}





// var processMessageContent = (content) => {
//     var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
//     var url = regex.exec(content);
//     if (url) {
//         var nonUrlPart = content.substring(0, content.indexOf(url[0]));
//         var urlPart = content.substring(content.indexOf(url[0]));
//         var urlPart = urlPart.replace(url[0], `<a target="_blank" href="${url[0]}">${url[0]}</a>`);
//         content = nonUrlPart + urlPart;
//     }
//     return content;
// }