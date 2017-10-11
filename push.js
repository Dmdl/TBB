var restify = require('restify');
var builder = require('botbuilder');
var CronJob = require('cron').CronJob;
var server = restify.createServer();
var service = require('./service.js');

server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

var job = new CronJob('00 50 9 * * 1-5', function () {
    /*
     * Runs every weekday (Monday through Friday)
     * at 11:30:00 AM. It does not run on Saturday
     * or Sunday.
     */
    if (savedAddress && bot) {
        sendProactiveMessage(savedAddress);
    }
}, function () {
    /* This function is executed when the job stops */
},
    true, /* Start the job right now */
    'Asia/Colombo' /* Time zone of this job. */
);
job.start();

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

    // setTimeout(() => {
    //     sendProactiveMessage(savedAddress);
    // }, 5000);

    service.saveUserAddress(savedAddress).then(function (result) {
        console.log('saved');
    }).fail(function (error) {
        console.log('error');
    });
});