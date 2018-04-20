'use strict';
import chat from "../models/chatModel";
 import chatService from "../services/chatService.js";

/*Chat Controlleer is responsible for handling incoming requestes related to chat like get,post,put,delete  */
class chatController {

    constructor() {
     }

    /**
     * Get aconversation history
     * @param {*} req 
     * @param {*} res 
     */
    chat_details(req, res) {
         chatService.getChatDetails(req.params.chatId, req.params.loggedUserID).then(function (chats) {
            res.json(chats);
        }).catch(function (err) {});
    }

    /**
     * create new chat between multiple memebers
     * @param {*} req 
     * @param {*} res 
     */
    create_chat(req, res) {
        var new_chat = new chat(req.body);
         chatService.createChat(new_chat).then(function (chat) {
            res.json(chat);
        }).catch(function (err) {


        });
    }

    /**
     * get a user chats that he was a member in them
     * @param {get } req 
     * @param {*} res 
     */
    chats_by_memberUserID(req, res) {

        var tt =  chatService.getChatsByMemberUserID(req.params.userId);
         chatService.getChatsByMemberUserID(req.params.userId).then(function (chats) {
            res.json(chats);
        }).catch(function (err) {});
    }


    /**
     * get all contacts of a user
     * @param {*} req 
     * @param {*} res 
     */
    contact_list(req, res) {
         chatService.getContactList(req.params.userId).then(function (chats) {
            res.json(chats);
        }).catch(function (err) {});
    }




    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    create_get_chat(req, res) {

        var loggedInUser = req.params.loggedInUser;

        var otherContact = req.params.otherContact;

        var members = [otherContact, loggedInUser];

        chatService.getCreateChatByMembers(members, loggedInUser).then(function (chat) {
            res.json(chat);
        }).catch(function (err) {});
    }

}
export default new chatController();