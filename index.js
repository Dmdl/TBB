var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... Welcome to the ABC Bank Bot.");
    session.send("We will help you with banking needs. What would you like to do?");
    session.beginDialog('showOptions');
});

// Add dialog to return list of options available
bot.dialog('showOptions', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("online bank")
            .text("all online banking")
            .buttons([
                builder.CardAction.imBack(session, "online Bank", "online Bank")
            ]),
        new builder.HeroCard(session)
            .title("product info")
            .text("product information")
            .buttons([
                builder.CardAction.imBack(session, "product Information", "product Information")
            ]),
        new builder.HeroCard(session)
            .title("promotions")
            .text("promotions")
            .buttons([
                builder.CardAction.imBack(session, "promotions", "promotions")
            ]),
        new builder.HeroCard(session)
            .title("Branches & ATM")
            .text("Branches & ATM")
            .buttons([
                builder.CardAction.imBack(session, "Branches ATM", "Branches & ATM")
            ]),
        new builder.HeroCard(session)
            .title("Rates and Tariffs")
            .text("rates and tariffs")
            .buttons([
                builder.CardAction.imBack(session, "Rates Tariffs", "Rates and Tariffs")
            ])
    ]);
    session.send(msg);
}).triggerAction({ matches: /^(option|list|options)/i });

bot.dialog('online Bank', [
    function (session) {
        session.send('online banking...').endDialog();
    }
]).triggerAction({
    matches: /^online Bank$/i
});

bot.dialog('product Information', [
    function (session) {
        session.send('product Information...').endDialog();
    }
]).triggerAction({
    matches: /^product Information$/i
});

var server = restify.createServer();
server.post('/api/messages', connector.listen());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// // Add dialog to handle 'Buy' button click
// bot.dialog('buyButtonClick', [
//     function (session, args, next) {
//         // Get color and optional size from users utterance
//         var utterance = args.intent.matched[0];
//         var color = /(white|gray)/i.exec(utterance);
//         var size = /\b(Extra Large|Large|Medium|Small)\b/i.exec(utterance);
//         if (color) {
//             // Initialize cart item
//             var item = session.dialogData.item = {
//                 product: "classic " + color[0].toLowerCase() + " t-shirt",
//                 size: size ? size[0].toLowerCase() : null,
//                 price: 25.0,
//                 qty: 1
//             };
//             if (!item.size) {
//                 // Prompt for size
//                 builder.Prompts.choice(session, "What size would you like?", "Small|Medium|Large|Extra Large");
//             } else {
//                 //Skip to next waterfall step
//                 next();
//             }
//         } else {
//             // Invalid product
//             session.send("I'm sorry... That product wasn't found.").endDialog();
//         }
//     },
//     function (session, results) {
//         // Save size if prompted
//         var item = session.dialogData.item;
//         if (results.response) {
//             item.size = results.response.entity.toLowerCase();
//         }

//         // Add to cart
//         if (!session.userData.cart) {
//             session.userData.cart = [];
//         }
//         session.userData.cart.push(item);

//         // Send confirmation to users
//         session.send("A '%(size)s %(product)s' has been added to your cart.", item).endDialog();
//     }
// ]).triggerAction({ matches: /(buy|add)\s.*shirt/i });