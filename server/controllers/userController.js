'use strict';
 const user = require("../models/userModel")
  
var  userService = require("../services/userService.js") ;
 

exports.list_all_users = function(req, res) {
userService.getAllUsers().then(function(users){
  console.log(users); //Return all user entries 
  res.json(users);
}).catch(function(err) {
  console.log(err.message);
});
};


exports.search_users = function(req, res) {

userService.getUsersByKeyWord(req.params.keyword).then(function(users){
  console.log(users); //Return all user entries 
  res.json(users);
}).catch(function(err) {
  console.log(err.message);
});
};


exports.create_a_user = function(req, res) {
   var new_user = new user(req.body);
  
userService.createUser(new_user).then(function(user) {
  console.log(user._id); // Prints newly added useres' id.
   res.json(user._id);

}).catch(function(err) {
  console.log(err.message);
});

};

exports.login_a_user = function(req, res) {
  var user_to_login = new user(req.body);
userService.loginUser( user_to_login).then(function(loggedUser){
  console.log(loggedUser); 

  res.json(loggedUser);
}).catch(function(err) {
  console.log(err.message);
});

 };

 


exports.read_a_user = function(req, res) {
  userService.getUser(req.params.userId).then(function(user){
  console.log(user); 

  res.json(user);
}).catch(function(err) {
  console.log(err.message);
});

};


exports.update_a_user = function(req, res) {
  userService.updateUser(req.params.userId).then(function(user){
  console.log(user); 

  res.json(user);
}).catch(function(err) {
  console.log(err.message);
});

};


exports.delete_a_user = function(req, res) {
  userService.deleteUser(req.params.userId).then(function(msg){
   res.json({ message: msg});
}).catch(function(err) {
  console.log(err.message);
});
}
  