'use strict';
angular.module('chatApp')

//Here LoopBackAuth service must be provided as argument for authenticating the user
.factory('socket',
 ['appConfigs',

function (LoopBackAuth, appConfigs) {
    //Creating connection with server
    var socket = io.connect(appConfigs.apiBaseURL);

    //This part is only for login users for authenticated socket connection between client and server.
    //If you are not using login page in you website then you should remove rest piece of code..
    var id = LoopBackAuth.accessTokenId;
    var userId = LoopBackAuth.currentUserId;
    socket.on('connect', function () {
        socket.emit('authentication', { id: id, userId: userId });
        socket.on('authenticated', function () {
            // use the socket as usual
         });
    });
    return socket;

}]);