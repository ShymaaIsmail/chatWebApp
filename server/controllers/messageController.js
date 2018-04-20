'use strict';
import message from "../models/messageModel";
import messageService from "../services/messageService.js";


/*messae Controller is responsible for handling incoming requestes related to message like post  */

class messageController{

constructor() {
  
}
  /**
   * Add New Message to a chat 
   * @param {*} req 
   * @param {*} res 
   */
  create_message  (req, res) {
    var new_nessage = new message(req.body);
    messageService.createMessage(new_nessage).then(function (msg) {
      res.json(msg);
    }).catch(function (err) {});
  }

}
export default new messageController();