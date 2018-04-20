'use strict';
import message from "../models/messageModel";
import messageService from "../services/messageService.js";



exports.create_message = function (req, res) {
  var new_nessage = new message(req.body);
  messageService.createMessage(new_nessage).then(function (msg) {
    res.json(msg);
  }).catch(function (err) {});
};