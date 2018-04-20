import {dbConfig} from "../config/database.config.js";
import mongoose from 'mongoose';



//connect to mongoose ORM For db communication
mongoose.Promise = global.Promise;
 try {
    mongoose.connect(dbConfig.dbUrl);
}catch(err) {
    console.log(JSON.stringify(err));
    mongoose.createConnection(dbConfig.dbUrl); //- starting another db connection
}
