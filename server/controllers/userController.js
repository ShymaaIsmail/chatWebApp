
import user from "../models/userModel";
import userService from "../services/userService.js";

export function list_all_users(req, res) {
    userService.getAllUsers().then(users => {
        res.json(users);
    }).catch(err => {
    });
}

export function search_users(req, res) {

    userService.getUsersByKeyWord(req.params.keyword).then(users => {
        res.json(users);
    }).catch(err => {
    });
}

export function create_a_user(req, res) {
    const new_user = new user(req.body);

    userService.createUser(new_user).then(user => {
        res.json(user);

    }).catch(err => {
    });

}

export function login_a_user(req, res) {
    const user_to_login = new user(req.body);
    userService.loginUser(user_to_login).then(loggedUser => {
        res.json(loggedUser);
    }).catch(err => {
    });

}

export function read_a_user(req, res) {
    userService.getUser(req.params.userId).then(user => {
        res.json(user);
    }).catch(err => {
    });

}

export function update_a_user(req, res) {
    userService.updateUser(req.params.userId).then(user => {

        res.json(user);
    }).catch(err => {
    });

}

export function delete_a_user(req, res) {
    userService.deleteUser(req.params.userId).then(msg => {
        res.json({ message: msg });
    }).catch(err => {
    });
}

//'use strict';
//const user = require("../models/userModel")

//var userService = require("../services/userService.js");


//exports.list_all_users = function (req, res) {
//    userService.getAllUsers().then(function (users) {
//        res.json(users);
//    }).catch(function (err) {
//    });
//};


//exports.search_users = function (req, res) {

//    userService.getUsersByKeyWord(req.params.keyword).then(function (users) {
//        res.json(users);
//    }).catch(function (err) {
//    });
//};


//exports.create_a_user = function (req, res) {
//    var new_user = new user(req.body);

//    userService.createUser(new_user).then(function (user) {
//        res.json(user);

//    }).catch(function (err) {
//    });

//};

//exports.login_a_user = function (req, res) {
//    var user_to_login = new user(req.body);
//    userService.loginUser(user_to_login).then(function (loggedUser) {
//        res.json(loggedUser);
//    }).catch(function (err) {
//    });

//};




//exports.read_a_user = function (req, res) {
//    userService.getUser(req.params.userId).then(function (user) {
//        res.json(user);
//    }).catch(function (err) {
//    });

//};


//exports.update_a_user = function (req, res) {
//    userService.updateUser(req.params.userId).then(function (user) {

//        res.json(user);
//    }).catch(function (err) {
//    });

//};


//exports.delete_a_user = function (req, res) {
//    userService.deleteUser(req.params.userId).then(function (msg) {
//        res.json({ message: msg });
//    }).catch(function (err) {
//    });
//}
