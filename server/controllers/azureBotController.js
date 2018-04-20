'use strict';

import  * as botSettings from "../config/botConfig.js";
import * as builder from 'botbuilder'
import * as botbuilder_azure from "botbuilder-azure";
import reservationService from "../services/reservationService.js";
const reservation = require("../models/reservationModel")

////////////////////////////////////////Bot builder/////////////////////////////////////////////////////////////////////////
// Create chat connector for communicating with the Bot Framework Service

var botconfig=botSettings.botconfig;
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
    
        session.send('You request is not understood. You said \'%s\'.', session.message.text);


        session.beginDialog('GreetingDialog');
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
        (session, args, next) => {
            session.send('Welcome to modeso Reservation Bot');
            session.endDialog();
        }
    ).triggerAction({
        matches: 'Greeting'
    })

    bot.dialog('HelpDialog',
        (session, args, next) => {
            session.beginDialog('ReserveDialog');
        }
    ).triggerAction({
        matches: 'Help'
    })


    bot.dialog('ReserveDialog',
         function (session, args) {

             session.send("Welcome to the Modeso reservation.");
             session.endDialog();

             session.beginDialog('GuestInfoDialog');

         }

    ).triggerAction({
        matches: 'ReserveRequest'
    })



    bot.dialog('GuestInfoDialog',
    function (session, args) {

        if (args != undefined && args.intent.entities != undefined) {
            var intent = args.intent;
            //Extract Info 
            var nameFullEntity = builder.EntityRecognizer.findEntity(intent.entities, 'name');
            var emailFullEntity = builder.EntityRecognizer.findEntity(intent.entities, 'contact');
 
            var guestInfo = {
                guestName: nameFullEntity ? nameFullEntity.entity : null,
                guestEmail: emailFullEntity ? emailFullEntity.entity : null
            };
             if (guestInfo.guestEmail != null && guestInfo.guestName != null) {
                session.userData.guestInfo = guestInfo;
                session.endDialog();
                session.beginDialog('ReservationDateDialog');

            } else {
                session.endDialog();
                session.beginDialog('GuestInfoDialog');

            }
        } else {
            session.send("Please provide us with your name and email correctly to fill the reservation request.");
            session.endDialog();
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
                 if (reservationDate.entity) {
                     session.userData.guestInfo.reservationDate = reservationDate.entity;
                     session.endDialog();
                     session.send("Please wait ,we are checking Availability of " + reservationDate.entity + " day.");
                     reservationService.checkDateAvailability(reservationDate.entity, session.userData.guestInfo.guestEmail).then(function (reservedDate) {
                         if (reservedDate.length == 0) {//available date
                              session.beginDialog('ConfirmDialog', { automaticStart: true });

                         } else {

                             session.send('Unfortunaltely,This desired reservation date is busy, please enter another date.');
                             session.beginDialog('ReservationDateDialog');

                         }

                     }).catch(function (err) {
                     });

                 }
             } else {
                 session.send("Please provide us with your Reservation Date (dd/MM/yyyy).");
                 session.endDialog();
             }
         }
    ).triggerAction({
        matches: 'ReservationDate'
    })

    bot.dialog('ConfirmDialog',
     function (session, args, next) {
         var reservationFullInfo = session.userData.guestInfo;
 
         if (args!=undefined&&args.automaticStart != undefined && !args.automaticStart && reservationFullInfo != undefined) {
             var new_reservation = new reservation(session.userData.guestInfo);
 
             reservationService.createreservation(new_reservation).then(function (obj) {
                 session.send("Congratulations,Your reservation at " + session.userData.guestInfo.reservationDate + " has been confirmed");
                 session.endDialog();

             }).catch(function (err) {
             });
         } else {
             session.endDialog();
             session.beginDialog('ConfirmDialog', { automaticStart: false });
         }
     }
    ).triggerAction({
        matches: 'Confirm'
    })


    return bot;
}