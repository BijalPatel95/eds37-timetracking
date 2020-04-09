var app = require('./src/timeTrackingOutputEDS37');

module.exports.handler = function(event, context, callback) {
        app.default();
}
