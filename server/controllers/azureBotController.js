'use strict';

var botconfig = require("../config/botConfig.js");
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

////////////////////////////////////////Bot builder/////////////////////////////////////////////////////////////////////////
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: botconfig.MicrosoftAppId,
    appPassword: botconfig.MicrosoftAppPassword,
    openIdMetadata: botconfig.BotOpenIdMetadata
});
  
exports.listenbot = function (req, res) {
    RegisterBot();
    // Listen for messages from users 
    return connector.listen();
}
function RegisterBot  () {
    
    /*----------------------------------------------------------------------------------------
    * Bot Storage: This is a great spot to register the private state storage for your bot. 
    * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
    * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
    * ---------------------------------------------------------------------------------------- */
     
    var bot = buildAzureBotConnection();

    //setup luis App setting
    bot = manageLuisAppSetting(bot);
     
    //dialogs responses
    bot = manageBotDialogs(bot);
 
    return bot;
};

function buildAzureBotConnection() {
    var tableName = 'botdata';
    var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, botconfig.AzureWebJobsStorage);
    var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

    // Create your bot with a function to receive messages from the user
    // This default message handler is invoked if the user's utterance doesn't
    // match any intents handled by other dialogs.
    var bot = new builder.UniversalBot(connector, function (session, args) {
        session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
    });

    bot.set('storage', tableStorage);

    return bot;
}

function manageLuisAppSetting(bot) {

    // Make sure you add code to validate these fields
    var luisAppId = botconfig.LuisAppId;
    var luisAPIKey = botconfig.LuisAPIKey;
    var luisAPIHostName = botconfig.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

    const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

    // Create a recognizer that gets intents from LUIS, and add it to the bot
    var recognizer = new builder.LuisRecognizer(LuisModelUrl);
    bot.recognizer(recognizer);
    return bot;
}

function manageBotDialogs(bot) {
    // Add a dialog for each intent that the LUIS app recognizes.
    // See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
    bot.dialog('GreetingDialog',
        (session, args, next)  => {
            session.send('Welcome to modeso Reservation Bot');
            session.endDialog();
         }
    ).triggerAction({
        matches: 'Greeting'
    })

    bot.dialog('HelpDialog',
        (session, args, next)  => {
            session.beginDialog('ReserveDialog');
        }
    ).triggerAction({
        matches: 'Help'
    })

    bot.dialog('ReserveDialog',
         function (session, args)  {

             session.send("Welcome to the Modeso reservation.");
             session.endDialog();

             session.beginDialog('GuestInfoDialog');

         } 
    
    ).triggerAction({
        matches: 'ReserveRequest'
    })



    bot.dialog('GuestInfoDialog', 
    function (session, args) {
         
        if (args != undefined && args.intent.entities != undefined ) {
            var intent = args.intent;
            //Extract Info 

            var name = builder.EntityRecognizer.findEntity(intent.entities, 'name');

            var email = builder.EntityRecognizer.findEntity(intent.entities, 'mail');

            var guestInfo = {
                name: name ? name.entity : null,
                email: email ? email.entity : null
            };
            session.userData.guestInfo = guestInfo;
          //  session.endDialogWithResult({ response: { guestInfo: session.userData.guestInfo } });
            session.endDialog();

            session.beginDialog('ReservationDateDialog');
        } else {
            session.send("Please provide us with your name and email to fill the reservation request.");
            session.endDialog();
            //session.endDialogWithResult({ response: { guestInfo: session.userData.guestInfo } });
        }
    } 
    
    ).triggerAction({
        matches: 'GuestInfo'
    })



    bot.dialog('ReservationDateDialog',
         function (session, args, next) {
             if (args != undefined && args.intent.entities != undefined) {
                 var intent = args.intent;
                 //Extract Info 

                 var reservationDate = builder.EntityRecognizer.findEntity(intent.entities, 'reservationDate');
                   

                 session.userData.guestInfo.reservationDate = reservationDate.entity;

                 console.log("full infoo : " + JSON.stringify(session.userData.guestInfo));

                 session.endDialog();

              } else {
                 session.send("Please provide us with your Reservation Date.");

                 session.endDialog();
             }
         }
    ).triggerAction({
        matches: 'ReservationDate'
    })



    bot.dialog('ConfirmDialog',
        (session, args, next) => {
            session.send('Would you confirm your reservation?');
            session.endDialog();
        }
    ).triggerAction({
        matches: 'Cancel'
    })

    bot.dialog('CancelDialog',
        (session, args, next) => {
            session.send('Are you sure you want to cancel your reservation?');
            session.endDialog();
        }
    ).triggerAction({
        matches: 'Cancel'
    })


    return bot;

}