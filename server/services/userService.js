import mongoose from 'mongoose';
import user from "../models/userModel";
import repos from "../Repositories/Repos.js";

import db from "../models/db.js";


/*User is serviceis responsible for handling bussiness logic for  */
class userService {

  constructor() {
    this.userRepo = new repos().getUserRepo();
  }

  /**
   * Find all users that their name contains this keyword
   * @param {*} keyWord 
   */
  getUsersByKeyWord(keyWord) {

    var regularExpression = new RegExp(".*" + keyWord + ".*", "i");
    return this.userRepo.find({
      "name": regularExpression
    }).then(function (users) {
      return users;
    });
  };



  /**
   * Create new user
   * @param {*} new_user 
   */
  createUser(new_user) {

    return this.userRepo.add(new_user).then(function (user) {
      return user;

    });

  };



  /**
   * Authenticate user info
   * @param {*} user_to_login 
   */
  loginUser(user_to_login) {

    return this.userRepo.find({
      name: user_to_login.name,
      password: user_to_login.password
    }, null, null, 1, null).then(function (loggedUser) {

      return loggedUser;
    });
  };


  /**
   * 
   * Get User Info by id
   * @param {*} userId 
   */
  getUser(userId) {
    return this.userRepo.findByID(userId).then(function (err, user) {
      if (err)
        return err;

      return user;
    });
  };


  
  /**
   * 
   * Get User Info by id
   * @param {*} userId 
   */
  getAllUsers() {
    return this.userRepo.find({}).then(function (err, users) {
      if (err)
        return err;

      return users;
    });
  };
  /*
   * Take Array of users Ids and retrieve arry of objects for these users info.
   * @param {*} arrUserIds 
   */
  getMultipleUsers(arrUserIds) {
    var objecIdsType = [];
    for (var i = arrUserIds.length - 1; i >= 0; i--) {

      var objectid = mongoose.Types.ObjectId.createFromHexString(arrUserIds[i]);

      objecIdsType.push(objectid);

    }
    return this.userRepo.find({
      _id: objecIdsType
    }).then(function (loggedUser) {

      return loggedUser;
    });

  }
}

export default new userService();