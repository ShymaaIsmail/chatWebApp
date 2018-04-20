import {dbConfig} from "../config/database.config.js";
import mongoose from 'mongoose';



//connect to mongoose ORM For db communication
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.dbUrl);
