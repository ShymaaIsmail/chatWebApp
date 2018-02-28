var express = require('express'),

 path = require("path");

 app = module.exports.app =express(),

 http = require('http');

server = http.createServer(app);

 cors = require('cors'),

 port = process.env.PORT || 9080,
  
 bodyParser = require('body-parser'),


 routes = require('./routes/routes.js'),
  
 db = require("./models/db.js") ;

 //body parser
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json());

//enable cors rigin request
 app.use(cors());


 console.log(__dirname);
// static folder for images and attachments
 app.use(express.static(__dirname + '/uploads/chatAttachments/'));

 app.use(express.static( __dirname +'/uploads/profileImages/'));
 

/////////////////////////////////Start Socket IO Registeration///////////////////////////////////////////////////////////////////////////////////////

if (require.main === module) {
  //Comment this app.start line and add following lines
  //app.start();
  app.io = require('socket.io').listen(server);
  require('socketio-auth')(app.io, {
    authenticate: function (socket, value, callback) {

        var AccessToken = app.models.AccessToken;
        //get credentials sent by the client
        var token = AccessToken.find({
          where:{
            and: [{ userId: value.userId }, { id: value.id }]
          }
        }, function(err, tokenDetail){
          if (err) throw err;
          if(tokenDetail.length){
            callback(null, true);
          } else {
            callback(null, false);
          }
        }); //find function..    
      } //authenticate function..
  });

  app.io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
  });
}

//////////////////////////////////End Socket IO Registeration////////////////////////////////////////////////////////////////////////////////////

//Routes Registeration 
  routes(app); //register the route

 
//handle FallBack Requests
  app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
  });
  app.listen(port);




	console.log('chat RESTful API server started on: ' + port);


