

const user = require("../models/userModel")

var mongoose = require('mongoose');  
var  repos = require("../Repositories/Repos.js") ;


var userRepo = repos.userRepo;


  function getAllUsers() {
 return userRepo.find().then(function(users){
    return users;
});
};



  function getUsersByKeyWord(keyWord) {

  	var regularExpression = new RegExp(".*"+keyWord+".*","i"); 
  return userRepo.find({"name": regularExpression}).then(function(users){
    return users;
});
};


function createUser(new_user) {
  
return userRepo.add(new_user).then(function(user) {
   return user;

});

};


 function loginUser(user_to_login) {
   
return userRepo.find({name: user_to_login.name, password:user_to_login.password},null,null,1,null).then(function(loggedUser){
   
   return loggedUser;
});
 };


function getUser(userId) {
return  userRepo.findByID(userId).then(function(err, user) {
    if (err)
     return err;
     
     return user;
  });
};


function getMultipleUsers(arrUserIds){
  var objecIdsType=[];
for (var i = arrUserIds.length - 1; i >= 0; i--) {
   
  var objectid=mongoose.Types.ObjectId.createFromHexString(arrUserIds[i]);
  
  objecIdsType.push(objectid);
 
}
return userRepo.find({_id: objecIdsType}).then(function(loggedUser){
   
   return loggedUser;
});

}

  function updateUser(userId, obj) {
 return userRepo.findOneAndUpdate({_id:userId}, obj, {new: true}, function(err, user) {
    if (err)
      return err;
    return user;
  });
};


 function deleteUser(userId) {

 return userRepo.remove(userId).then(function(err, user) {
    if (err)
     return err;
    return  'user successfully deleted';
  });
};



module.exports={

getAllUsers: function(){ return getAllUsers();},

getMultipleUsers:function(arrUserIds){ return getMultipleUsers(arrUserIds);},

getUsersByKeyWord: function(keyWord){ return getUsersByKeyWord(keyWord);},

createUser: function(newUser){ return createUser(newUser);},

loginUser: function(userToLogin){ return loginUser(userToLogin);},

getUser: function(userId){ return getUser(userId);},

updateUser: function(userId, obj){ return updateUser(userId, obj);},

deleteUser: function(userId){ return deleteUser(userId);}

}