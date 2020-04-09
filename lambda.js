var app = require('./src/handler');

module.exports.handler = function(event, context, callback) {
        app.default();
}
