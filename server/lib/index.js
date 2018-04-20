/////////////////////////////Loading Required Modules and libraries////////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
import path from  "path";
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '../routes/routes.js';
import db from "../models/db.js";
var app = module.exports.app = express();
var port = process.env.PORT || 9080;
var server = app.listen(port);

 
var clientUrl = "http://localhost:32772";
///////////////////////////////Enable cors rigin request///////////////////////////////////////////////////////////////////////
 app.use(cors());
 app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", clientUrl);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

//////////////////////////////// =static folder for images and attachments//////////////////////////
 app.use('/uploads/chatAttachments',express.static(__dirname+'/uploads/chatAttachments'));
 app.use('/uploads/profileImages',express.static(__dirname+'/uploads/profileImages'));
 app.use(express.static('../app'));
app.use('/uploads',express.static(__dirname + '/uploads'));

 ////////////////////////////////Body parser///////////////////////////////////////////////////////////////////////////////////////////////////////
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());


//////////////////////////////////Upload Global Settings///////////////////////////////////////////////////////////////////////////////////////////////////

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, '../uploads/chatAttachments/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
             cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {

        upload(req,res,function(err){
 
            if(err){
                 res.json({error_code:1,err_desc:err,filePath:'dd'});
                 return;
            }
             res.json({error_code:0,err_desc:null,filePath:req.file.path});
        });
    });

   
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////Start Socket IO Registeration///////////////////////////////////////////////////////////////////////////////////////

var io = require('socket.io').listen(server);
io.on('connection', function(client) {
    client.on('disconnect', function() {
     });
    client.on('chat', function(data) {
         client.join(data.chatId);
 
    });
    client.on('toBackEnd', function(data) {
    client.in(data.chatId).emit('message', data.data);
    })
});

//////////////////////////////////End Socket IO Registeration////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////Routes Registeration ///////////////////////////////////////////////////////////////////////////
  routes(app); //register the route


  ////////////////////////////////////handle FallBack Requests////////////////////////////////////////////////////////////////////
  app.use(function (req, res) {
      res.status(404).send({ url: req.originalUrl + ' not found' })
  });
  //app.listen(port);
  /////////////////////////////////////log startup message///////////////////////
 