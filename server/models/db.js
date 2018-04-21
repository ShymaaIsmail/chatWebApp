import {
    dbConfig
} from "../config/database.config.js";
import mongoose from 'mongoose';

class dbConnector {

    constructor(params) {
        this.connect();
    }

    connect() {

        //connect to mongoose ORM For db communication
        mongoose.Promise = global.Promise;
        try {
            mongoose.disconnect();
            mongoose.connect(dbConfig.dbUrl);

        } catch (err) {
            mongoose.disconnect();

            mongoose.createConnection(dbConfig.dbUrl); //- starting another db connection
        }

    }

    disConnect() {
        mongoose.disconnect();
    }

    getMongoose(){
        return mongoose;
    }

}

export default new dbConnector();