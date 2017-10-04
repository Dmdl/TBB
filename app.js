var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: '806a71d0-3144-42de-a5c7-d741a1402123',
    appPassword: '4iwV6TfEC2JBYqTpAvQq9fE'
});

var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

bot.dialog('/', intents);

intents.matchesAny([/^hi/i, /^hello/i, /^hi!/i, /^hello!/i, /^how are you?/i, /^how are you/i], [
    function (session) {
        session.userData.defaultCount = 0;
        console.log('user id---- ' + session.message.address.user.id);
        var displayName = session.message.user.name;
        var firstName = displayName.substr(0, displayName.indexOf(' '));
        console.log('incomming message from channel ' + session.message.address.channelId);
        session.send('Hello I’m M2C2! How can I help you %s? If you need help just say HELP.', firstName);
    }
]);

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});