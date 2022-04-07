var config = require('./config');

module.exports = {

    getAllScraps : () => {
        return new Promise((resolve, reject) => {
            config.ScrapData.orderByChild("status").equalTo(1).once('value', (snapshot) => {
                resolve(snapshot.val());
                reject(new Error('Error while fetching Scrap Data'));
            });
        })
    }

}