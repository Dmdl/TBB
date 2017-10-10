var restify = require('restify');
var builder = require('botbuilder');
var cron = require('node-cron');
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

//00 00 24 * * *
cron.schedule('* 12 18 * *', function () {
    if (savedAddress && bot) {
        sendProactiveMessage(savedAddress);
    }
});

function sendProactiveMessage(addr) {
    var msg = new builder.Message().address(addr);
    msg.text('Hello, this is a notification---push');
    msg.textLocale('en-US');
    bot.send(msg);
}

var savedAddress;
server.post('/api/messages', connector.listen());

server.get('/api/CustomWebApi', (req, res, next) => {
    sendProactiveMessage(savedAddress);
    res.send('triggered');
    next();
}
);

bot.dialog('/', function (session, args) {

    savedAddress = session.message.address;
    console.log('savedAddress----------- ' + JSON.stringify(savedAddress));

    var message = 'Hello! In a few seconds I\'ll send you a message proactively to demonstrate how bots can initiate messages.';
    session.send(message);

    connector.url
    message = 'You can also make me send a message by accessing: ';
    message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
    session.send(message);

    setTimeout(() => {
        sendProactiveMessage(savedAddress);
    }, 5000)
});