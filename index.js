var restify = require('restify');
var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// var bot = new builder.UniversalBot(connector, function (session) {
//     session.send("Hi... Welcome to the ABC Bank Bot.");
//     session.send("We will help you with banking needs. What would you like to do?");
//     var msg = new builder.Message(session);
//     msg.attachmentLayout(builder.AttachmentLayout.carousel);
//     msg.attachments([
//         new builder.HeroCard(session)
//             .title("online bank")
//             .text("all online banking")
//             .buttons([
//                 builder.CardAction.imBack(session, "online Bank", "onlineBank")
//             ]),
//         new builder.HeroCard(session)
//             .title("product info")
//             .text("product information")
//             .buttons([
//                 builder.CardAction.imBack(session, "productInformation", "Proceed")
//             ]),
//         new builder.HeroCard(session)
//             .title("promotions")
//             .text("promotions")
//             .buttons([
//                 builder.CardAction.imBack(session, "promotions", "Proceed")
//             ]),
//         new builder.HeroCard(session)
//             .title("Branches & ATM")
//             .text("Branches & ATM")
//             .buttons([
//                 builder.CardAction.imBack(session, "Branches & ATM", "Proceed")
//             ]),
//         new builder.HeroCard(session)
//             .title("Rates and Tariffs")
//             .text("rates and tariffs")
//             .buttons([
//                 builder.CardAction.imBack(session, "Rates and Tariffs", "Proceed")
//             ])
//     ]);
//     session.send(msg);
// });

var bot = new builder.UniversalBot(connector, function (session) {
    session.send("Hi... Welcome to the ABC Bank Bot.");
    session.send("We will help you with banking needs. What would you like to do?");
    session.beginDialog('showOptions');
});

// Add dialog to return list of shirts available
bot.dialog('showOptions', function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel)
    msg.attachments([
        new builder.HeroCard(session)
            .title("Online Banking")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "online banking", "online banking")
            ]),
        new builder.HeroCard(session)
            .title("Classic Gray T-Shirt")
            .text("Price is $25 and carried in sizes (S, M, L, and XL)")
            .images([builder.CardImage.create(session, 'http://petersapparel.parseapp.com/img/grayshirt.png')])
            .buttons([
                builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
            ])
    ]);
    session.send(msg);
}).triggerAction({ matches: /^(show|list)/i });

bot.dialog('onlineBanking', [
    function (session) {
        session.send('online banking').endDialog();
    }
]).triggerAction({
    matches: /^online banking$/i
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