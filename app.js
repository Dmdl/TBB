var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: 'process.env.MICROSOFT_APP_ID',
    appPassword: 'process.env.MICROSOFT_APP_PASSWORD'
});

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});