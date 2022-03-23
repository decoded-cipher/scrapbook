var express = require('express');
var hbs = require('express-handlebars');

var Router = require('./routes/router');
var app = express();
app.set('views', (__dirname, 'views'));
app.set('view engine', 'hbs');

app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layout/'
}));

app.use(express.static(__dirname + '/public'));

app.use('/', Router);

module.exports = app;
app.listen(process.env.PORT | 3000);