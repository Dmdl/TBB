var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// var bot = new builder.UniversalBot(connector, [
//     function (session) {
//         builder.Prompts.choice(session, 'What card would like to test?', CardNames, {
//             maxRetries: 3,
//             retryPrompt: 'Ooops, what you wrote is not a valid option, please try again'
//         });
//     },
//     function (session, results) {
//         // create the card based on selection
//         var selectedCardName = results.response.entity;
//         var card = createCard(selectedCardName, session);

//         // attach the card to the reply message
//         var msg = new builder.Message(session).addAttachment(card);
//         session.send(msg);
//     }
// ]);

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... We sell shirts. Say 'show shirts' to see our products.");
});

// Add dialog to return list of shirts available
bot.dialog('showShirts', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
        new builder.HeroCard(session)
            .title("Classic White T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .subtitle("100% Soft and Luxurious Cotton")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);
    session.send(msg).endDialog();
}).triggerAction({ matches: /^(show|list)/i });

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});