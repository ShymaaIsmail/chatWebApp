import messageList from '../controllers/messageController';

///////////////////////message ENDPOINT route/////////////////////////////////////////////////////////////

export default class messageRoutes {

    constructor(app) {
        app.route('/messages')
        .post(messageList.create_message);
  

    }

}