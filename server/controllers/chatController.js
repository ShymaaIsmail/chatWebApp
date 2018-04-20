'use strict';
import chat from "../models/chatModel";

import chatService from "../services/chatService.js";


exports.list_all_chats = function (req, res) {
    chatService.getAllChats().then(function (chats) {
        res.json(chats);
    }).catch(function (err) {});
};


exports.create_chat = function (req, res) {
    var new_chat = new chat(req.body);

    chatService.createChat(new_chat).then(function (chat) {
        res.json(chat);
    }).catch(function (err) {});
};


exports.chats_by_memberUserID = function (req, res) {

    var tt = chatService.getChatsByMemberUserID(req.params.userId);
    chatService.getChatsByMemberUserID(req.params.userId).then(function (chats) {
        res.json(chats);
    }).catch(function (err) {});
};

exports.contact_list = function (req, res) {
    chatService.getContactList(req.params.userId).then(function (chats) {
        res.json(chats);
    }).catch(function (err) {});
};


exports.chat_details = function (req, res) {

    chatService.getChatDetails(req.params.chatId, req.params.loggedUserID).then(function (chats) {
        res.json(chats);
    }).catch(function (err) {});

};

exports.create_get_chat = function (req, res) {

    var loggedInUser = req.params.loggedInUser;

    var otherContact = req.params.otherContact;

    var members = [otherContact, loggedInUser];

    chatService.getCreateChatByMembers(members, loggedInUser).then(function (chat) {
        res.json(chat);
    }).catch(function (err) {});
};