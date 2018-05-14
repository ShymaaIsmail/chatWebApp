/////////////////////////////Loading Required Modules and libraries////////////////////////////////////////////////////////////////////////////////////////////
import express from 'express';
import path from "path";
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from '../routes/routes.js';
import socket from 'socket.io';

class chatApp {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 9080;
        this.server = this.app.listen(this.port);
        this.clientUrl = "http://localhost:32772";
    }


    initialize() {
        /*1-Enable cors rigin request*/

        this.enableCorsOrigin();


        /*2-Open static Attachments and images Folder for accesibility and Upload Global Settings */

        this.openUploadAttachmentsSettings();

        /*3-Body parser Settings*/

        this.parseRequestBody();

        /*4-Real Time Messaging Setting using Socket IO Registeration*/

        this.registerSocketIOSettings();

        /*5-Routes Registeration*/

        new routes(this.app); //register the route


        /*6-handle FallBack Requests*/

        this.handleRequestsFallBack();
    }

  /*Enable cors rigin requests for pre-defined local host, it has to be chnaged on deployment*/
    enableCorsOrigin() {

        var clientUrl = this.clientUrl;
        this.app.use(cors());
        this.app.use(function (req, res, next) { //allow cross origin requests
            res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
            res.header("Access-Control-Allow-Origin", clientUrl);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

    }

        /* -Open static Attachments and images Folder for accesibility 
           - Upload Global Settings and create a general upload route that takes folder name as param to save uploaded on in it       
        */
    openUploadAttachmentsSettings() {
        //Open static Attachments and images Folder for accesibility
        this.app.use('/lib/uploads/chatAttachments', express.static(__dirname + '/uploads/chatAttachments'));
        this.app.use('/lib/uploads/profileImages', express.static(__dirname + '/uploads/profileImages'));
        this.app.use(express.static('../app'));
        this.app.use('/lib/uploads', express.static(__dirname + '/uploads'));

        this.app.use('/uploads/chatAttachments', express.static(__dirname + '/uploads/chatAttachments'));
        this.app.use('/uploads/profileImages', express.static(__dirname + '/uploads/profileImages'));
        this.app.use(express.static('../app'));
        this.app.use('/uploads', express.static(__dirname + '/uploads'));


        // Upload Global Settings 
        var storage = multer.diskStorage({ //multers disk storage settings
            destination: function (req, file, cb) {
                cb(null, 'lib/uploads/chatAttachments/');
            },
            filename: function (req, file, cb) {
                var datetimestamp = Date.now();
                cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
            }
        });

        var upload = multer({ //multer settings
            storage: storage
        }).single('file');

        /**Register API path that will upload the files */
        this.app.post('/upload', function (req, res) {
            upload(req, res, function (err) {
                if (err) {
                    res.json({
                        error_code: 1,
                        err_desc: err,
                        filePath: 'dd'
                    });
                    return;
                }
                res.json({
                    error_code: 0,
                    err_desc: null,
                    filePath: req.file.path
                });
            });
        });
    }

   /*Body parser Settings to render body as json format*/
    parseRequestBody() {
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.json());
    }

    /*Real Time Messaging Setting using Socket IO Registeration*/
    registerSocketIOSettings() {
        var io = socket.listen(this.server);
         io.on('connection', function (client) {
            client.on('disconnect', function () {});
            client.on('chat', function (data) {
                client.join(data.chatId);

            });
            client.on('toBackEnd', function (data) {
                client.in(data.chatId).emit('message', data.data);
            })
        });
    }
   
    /*handle FallBack Requests*/
    handleRequestsFallBack() {
        this.app.use(function (req, res) {
            res.status(404).send({
                url: req.originalUrl + ' not found'
            })
        });
    }
}

///////////////////////Initilize and configure node server/////////////////////////////////////

new chatApp().initialize();