var config = require('./config');

module.exports = {

    getAllScraps : () => {
        return new Promise((resolve, reject) => {
            config.ScrapData.once('value', (snapshot) => {
                resolve(snapshot.val());
            });
        })
    }

}