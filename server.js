var express = require('express'),
    path = require('path'),
    compress = require('compression'),
    logger = require('morgan');

var app = express();

app.use(compress({
    threshold: 100
}));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
