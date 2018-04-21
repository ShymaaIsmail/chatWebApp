'use strict';

import repo from "mongoose-repository-pattern";
import {
    dbConfig
} from "../config/database.config.js";
import user from "../models/userModel";
import chat from "../models/chatModel";
import message from "../models/messageModel";
import reservation from "../models/reservationModel";


export default class repos {

    constructor(params) {
        //user model and repo
        this.userRepo = repo(user, dbConfig.dbUrl);
        //chat model and repo
        this.chatRepo = repo(chat, dbConfig.dbUrl);
        //message model and repo
        this.messageRepo = repo(message, dbConfig.dbUrl);
        //reservation model and repo
        this.reservationRepo = repo(reservation, dbConfig.dbUrl);
    }
    getUserRepo() {
        return this.userRepo;
    }

    getChatRepo() {
        return this.chatRepo;
    }
    getMessageRepo() {
        return this.messageRepo;
    }
    getResevationRepo() {
        return this.reservationRepo;
    }

}