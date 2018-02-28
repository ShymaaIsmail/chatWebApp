var express = require('express'),
 path = require("path");

  app = express(),

    cors = require('cors'),

  port = process.env.PORT || 9080,
  
  bodyParser = require('body-parser'),


   routes = require('./routes/routes.js'),
  
   db = require("./models/db.js") ;
 
  //socket loading
   var http = require('http').Server(app);
   var io = require('socket.io')(http);

 //body parser
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

//enable cors rigin request
 app.use(cors());


console.log(__dirname);
// static folder for images and attachments
app.use(express.static(__dirname + '/uploads/chatAttachments/'));

app.use(express.static( __dirname +'/uploads/profileImages/'));
 


//Routes Registeration 
  routes(app); //register the route


//Socket Routes
//   app.get('/', function(req, res){
//   res.sendfile(path.join(__dirname+'/index.html'));
// });

io.on('connection', function(socket){
  console.log('user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
// http.listen(8080, function(){
//   console.log('listening on *:3000');
// });
//handle FallBack Requests
  app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
  });
  app.listen(port);




	console.log('chat RESTful API server started on: ' + port);


