/////////////////////////////Loading Required Modules and libraries////////////////////////////////////////////////////////////////////////////////////////////
 var express = require('express'),

 path = require("path"),

 app = module.exports.app =express(),

 multer = require('multer'),

 //http = require('http'),

// server = http.createServer(app),

 cors = require('cors'),

 port = process.env.PORT || 9080,

 server = app.listen(port);
  
 bodyParser = require('body-parser'),

 routes = require('./routes/routes.js'),
  
 db = require("./models/db.js") ;


var clientUrl="http://localhost:32772";
///////////////////////////////Enable cors rigin request///////////////////////////////////////////////////////////////////////
 app.use(cors());
 app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", clientUrl);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

//////////////////////////////// static folder for images and attachments//////////////////////////
 app.use(express.static('./uploads/chatAttachments/'));
 app.use(express.static('./uploads/profileImages/'));
 app.use(express.static('../app'));

 ////////////////////////////////Body parser///////////////////////////////////////////////////////////////////////////////////////////////////////
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());


//////////////////////////////////Upload Global Settings///////////////////////////////////////////////////////////////////////////////////////////////////

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/chatAttachments/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            console.log('file   :  '+file);
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
/////////////////////////////////Start Socket IO Registeration///////////////////////////////////////////////////////////////////////////////////////

var io = require('socket.io').listen(server);
io.on('connection', function(client) {
    client.on('disconnect', function() {
    console.log("disconnected")
    });
    client.on('chat', function(data) {
      console.log('chat is '+data.chatId);
        client.join(data.chatId);
        console.log(' Client joined the room and client id is '+ client.id);

    });
    client.on('toBackEnd', function(data) {
      console.log('messsage'+data);
               client.in(data.chatId).emit('message', data.data);
    })
});

// if (require.main === module) {
//   //Comment this app.start line and add following lines
//   //app.start();
//   app.io = require('socket.io').listen(server);
//   require('socketio-auth')(app.io, {
//     authenticate: function (socket, value, callback) {

//         var AccessToken = app.models.AccessToken;
//         //get credentials sent by the client
//         var token = AccessToken.find({
//           where:{
//             and: [{ userId: value.userId }, { id: value.id }]
//           }
//         }, function(err, tokenDetail){
//           if (err) throw err;
//           if(tokenDetail.length){
//             callback(null, true);
//           } else {
//             callback(null, false);
//           }
//         }); //find function..    
//       } //authenticate function..
//   });

//   app.io.on('connection', function(socket){
//     console.log('a user connected');
//     socket.on('disconnect', function(){
//         console.log('user disconnected');
//     });
//   });
// }

//////////////////////////////////End Socket IO Registeration////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////Routes Registeration ///////////////////////////////////////////////////////////////////////////
  routes(app); //register the route

 
////////////////////////////////////handle FallBack Requests////////////////////////////////////////////////////////////////////
  app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
  });
  //app.listen(port);
/////////////////////////////////////log startup message///////////////////////
	console.log('chat RESTful API server started on: ' + port);


