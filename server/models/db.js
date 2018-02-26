

var  config = require("../config/database.config.js") ;
 
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.dbUrl);
