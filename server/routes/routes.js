'use strict';

module.exports = function(app) {
  var userList = require('../controllers/userController');

///////////////////////////users list routes//////////////////////////////////////////////////////
  app.route('/users')
    .get(userList.list_all_users)
    .post(userList.create_a_user);

  app.route('/users/:userId')
    .get(userList.read_a_user)
    .put(userList.update_a_user)
    .delete(userList.delete_a_user);

    app.route('/users/login')
     .post(userList.login_a_user);



  app.route('/users/search/:keyword')
     .get(userList.search_users);

///////////////////////////chat list routes//////////////////////////////////////////////////////
  var chatList = require('../controllers/chatController');

  // chats Routes
  app.route('/chats')
    .get(chatList.list_all_chats)
    .post(chatList.create_chat);


  app.route('/chats/GetChatByMemebrs/:loggedInUser/:otherContact')
     .get(chatList.create_get_chat);

    


  app.route('/chats/userChats/:userId')
    .get(chatList.chats_by_memberUserID);

 
 

  app.route('/chats/contactList/:userId')
    .get(chatList.contact_list);

 

  app.route('/chats/chatDetails/:chatId/:loggedUserID')
    .get(chatList.chat_details);

};

///////////////////////messagges routes/////////////////////////////////////////////////////////////

  var chatList = require('../controllers/messageController');

  // chats Routes
  app.route('/messages')
    .post(chatList.create_message);

