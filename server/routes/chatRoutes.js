import chatList from '../controllers/chatController';

///////////////////////chat ENDPOINT route/////////////////////////////////////////////////////////////

export default class chatRoutes {

    constructor(app) {
        // chats Routes
        app.route('/chats')
            .post(chatList.create_chat);


        app.route('/chats/GetChatByMemebrs/:loggedInUser/:otherContact')
            .get(chatList.create_get_chat);

        app.route('/chats/userChats/:userId')
            .get(chatList.chats_by_memberUserID);

        app.route('/chats/contactList/:userId')
            .get(chatList.contact_list);

        app.route('/chats/chatDetails/:chatId/:loggedUserID')
            .get(chatList.chat_details);


    }
}