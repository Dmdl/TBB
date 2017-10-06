var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... Welcome to the ABC Bank Bot.");
    session.send("We will help you with banking needs. What would you like to do?");
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
        new builder.HeroCard(session)
            .title("online bank")
            .text("all online banking")
            .buttons([
                builder.CardAction.imBack(session, "online bank", "Proceed")
            ]),
        new builder.HeroCard(session)
            .title("product info")
            .text("product information")
            .buttons([
                builder.CardAction.imBack(session, "product information", "Proceed")
            ]),
        new builder.HeroCard(session)
            .title("promotions")
            .text("promotions")
            .buttons([
                builder.CardAction.imBack(session, "promotions", "Proceed")
            ]),
        new builder.HeroCard(session)
            .title("Branches & ATM")
            .text("Branches & ATM")
            .buttons([
                builder.CardAction.imBack(session, "Branches & ATM", "Proceed")
            ]),
        new builder.HeroCard(session)
            .title("Rates and Tariffs")
            .text("rates and tariffs")
            .buttons([
                builder.CardAction.imBack(session, "Rates and Tariffs", "Proceed")
            ])
    ]);
    session.send(msg).endConversation();
});

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});