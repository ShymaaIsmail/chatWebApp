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
 return   connector.listen();
}
function RegisterBot() {
    
    /*----------------------------------------------------------------------------------------
    * Bot Storage: This is a great spot to register the private state storage for your bot. 
    * We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
    * For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
    * ---------------------------------------------------------------------------------------- */
    console.log(botconfig);
    
    var bot = buildAzureBotConnection();

    //setup luis App setting
    manageLuisAppSetting(bot);
    //dialogs responses
    manageBotDialogs(bot);
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

}

function manageBotDialogs(bot) {
    // Add a dialog for each intent that the LUIS app recognizes.
    // See https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 
    bot.dialog('GreetingDialog',
        (session) => {
            session.send('You reached the Greeting intent. You said \'%s\'.', session.message.text);
            session.endDialog();
        }
    ).triggerAction({
        matches: 'Greeting'
    })

    bot.dialog('HelpDialog',
        (session) => {
            session.send('You reached the Help intent. You said \'%s\'.', session.message.text);
            session.endDialog();
        }
    ).triggerAction({
        matches: 'Help'
    })

    bot.dialog('CancelDialog',
        (session) => {
            session.send('You reached the Cancel intent. You said \'%s\'.', session.message.text);
            session.endDialog();
        }
    ).triggerAction({
        matches: 'Cancel'
    })

    bot.dialog('ReserveDialog',
        (session) => {
            session.send('You reached the ReserveDialog intent. You said \'%s\'.', session.message.text);
            session.endDialog();
        }
    ).triggerAction({
        matches: 'ReserveRequest'
    })



    bot.dialog('GuestInfoDialog',
        (session) => {
            session.send('You reached the GuestInfo intent. You said \'%s\'.', session.message.text);
            session.endDialog();
        }
    ).triggerAction({
        matches: 'GuestInfo'
    })



    bot.dialog('ReservationDateDialog',
        (session) => {
            session.send('You reached the ReservationDate intent. You said \'%s\'.', session.message.text);
            session.endDialog();
        }
    ).triggerAction({
        matches: 'ReservationDate'
    })


}