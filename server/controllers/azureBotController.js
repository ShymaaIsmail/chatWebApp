'use strict';
import * as botSettings from "../config/botConfig.js";
import * as builder from 'botbuilder'
import * as botbuilder_azure from "botbuilder-azure";
import reservationService from "../services/reservationService.js";
import reservation from "../models/reservationModel";


class azureBotController {

    constructor() {
        // Create chat connector for communicating with the Bot Framework Service
        this.botconfig = botSettings.botconfig;
        this.connector = new builder.ChatConnector({
            appId: this.botconfig.MicrosoftAppId,
            appPassword: this.botconfig.MicrosoftAppPassword,
            openIdMetadata: this.botconfig.BotOpenIdMetadata
        });
    }

    /**
     * Connect to the microsoft azure bot and start listen to start over
     * @param {*} req 
     * @param {*} res 
     */
    listenbot(req, res) {
        this.RegisterBot();
        // Listen for messages from users 
        return this.connector.listen();
    }

    /**
     * Register  microsoft azure bot  by the following steps:
     * 1- build Azure Bot Connection and set storage bot to table storage.
     * 2- manage Luis AppSetting which is responsible for Language Understanding Intelligent  Service
     * 3- manage Bot Dialogs and conversation waterfalls.
     */
    RegisterBot() {

        var bot = this.buildAzureBotConnection();

        //setup luis App setting
        bot = this.manageLuisAppSetting(bot);

        //dialogs responses
        bot = this.manageBotDialogs(bot);

        return bot;
    }



    /**
     * build Azure Bot Connection and set storage bot to table storage.
     */
    buildAzureBotConnection() {
        var tableName = 'botdata';
        var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, this.botconfig.AzureWebJobsStorage);
        var tableStorage = new botbuilder_azure.AzureBotStorage({
            gzipData: false
        }, azureTableClient);
        // Create your bot with a function to receive messages from the user
        // This default message handler is invoked if the user's utterance doesn't
        // match any intents handled by other dialogs.
        var bot = new builder.UniversalBot(this.connector, function (session, args) {
            session.send('You request is not understood. You said \'%s\'.', session.message.text);
            session.beginDialog('GreetingDialog');
        });
        bot.set('storage', tableStorage);
        return bot;
    }

    /**
     * manage Luis AppSetting which is responsible for Language Understanding Intelligent  Service
     * @param {*} bot 
     */
    manageLuisAppSetting(bot) {

        // Make sure you add code to validate these fields
        var luisAppId = this.botconfig.LuisAppId;
        var luisAPIKey = this.botconfig.LuisAPIKey;
        var luisAPIHostName = this.botconfig.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

        const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

        // Create a recognizer that gets intents from LUIS, and add it to the bot
        var recognizer = new builder.LuisRecognizer(LuisModelUrl);
        bot.recognizer(recognizer);
        return bot;
    }


    /**
     * manage Bot Dialogs and conversation waterfalls.
     * @param {*} bot 
     */
    manageBotDialogs(bot) {
        // Dialog to Luis greeting intent.
        bot.dialog('GreetingDialog',
            (session, args, next) => {
                session.send('Welcome to modeso Reservation Bot');
                session.endDialog();
            }
        ).triggerAction({
            matches: 'Greeting'
        })
        // Dialog to Help greeting intent.
        bot.dialog('HelpDialog',
            (session, args, next) => {
                session.beginDialog('ReserveDialog');
            }
        ).triggerAction({
            matches: 'Help'
        })

        // Dialog to Luis Reserve Request intent.
        bot.dialog('ReserveDialog',
            function (session, args) {

                session.send("Welcome to the Modeso reservation.");
                session.endDialog();

                session.beginDialog('GuestInfoDialog');

            }

        ).triggerAction({
            matches: 'ReserveRequest'
        })


        // Dialog to Luis collecting guest info  intent with (name and email entities).
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

       // Dialog to Luis ReservationDate intent for prefered date to reserve.
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
                            if (reservedDate.length == 0) { //available date
                                session.beginDialog('ConfirmDialog', {
                                    automaticStart: true
                                });

                            } else {

                                session.send('Unfortunaltely,This desired reservation date is busy, please enter another date.');
                                session.beginDialog('ReservationDateDialog');

                            }

                        }).catch(function (err) {});

                    }
                } else {
                    session.send("Please provide us with your Reservation Date (dd/MM/yyyy).");
                    session.endDialog();
                }
            }
        ).triggerAction({
            matches: 'ReservationDate'
        })

        // Dialog to Luis Confirm intent for guest confirmation to  his reservation 
        // as long as info are collected correctly and prefered dat is available.
        bot.dialog('ConfirmDialog',
            function (session, args, next) {
                var reservationFullInfo = session.userData.guestInfo;

                if (args != undefined && args.automaticStart != undefined && !args.automaticStart && reservationFullInfo != undefined) {
                    var new_reservation = new reservation(session.userData.guestInfo);

                    reservationService.createreservation(new_reservation).then(function (obj) {
                        session.send("Congratulations,Your reservation at " + session.userData.guestInfo.reservationDate + " has been confirmed");
                        session.endDialog();

                    }).catch(function (err) {});
                } else {
                    session.endDialog();
                    session.beginDialog('ConfirmDialog', {
                        automaticStart: false
                    });
                }
            }
        ).triggerAction({
            matches: 'Confirm'
        })

        return bot;
    }


}
export default new azureBotController();