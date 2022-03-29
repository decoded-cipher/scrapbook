require('dotenv').config()

// ----- Firebase Config Start -----
var admin = require("firebase-admin");
var serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

var database = admin.database()
var ScrapData = database.ref(process.env.FIREBASE_DATABASE_PATH)
// ----- Firebase Config End -----

module.exports = {database, ScrapData}