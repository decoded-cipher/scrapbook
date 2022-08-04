require('dotenv').config()

var express = require('express');
var hbs = require('express-handlebars');

var Router = require('./router');
var app = express();
app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');

var bodyParser = require("body-parser");
app.use(bodyParser.json())

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layout/'
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use('/', Router);

module.exports = app;
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on PORT ${process.env.PORT}`);
})