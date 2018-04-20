import azureBot from '../controllers/azureBotController';

///////////////////////BOT ENDPOINT route/////////////////////////////////////////////////////////////

export default class botRoutes {

    constructor(app) {
        app.route('/api/messages')
            .post(azureBot.listenbot());
    }
}

