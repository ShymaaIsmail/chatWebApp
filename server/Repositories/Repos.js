'use strict';

const repo = require("mongoose-repository-pattern");
import { dbConfig } from "../config/database.config.js";


/*It is to generic load repository that is responsible for CRUD operations,
  For the corresponding Model which is passed as a parameter */
export default class repos {

    genericRepo(modelName) {
        //generic load model and repo
         
        var model=require('../models/'+modelName);
        var modelRepo = repo(model.default, dbConfig.dbUrl);
        return modelRepo;
    }
} 