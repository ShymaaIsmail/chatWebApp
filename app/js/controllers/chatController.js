angular.module('chatApp').controller('chatController', ['$cookieStore', '$rootScope', '$state', '$scope', 'userFactory', 'chatFactory', function ($cookieStore,$rootScope, $state, $scope, userFactory, chatFactory) {
       
    //memebers
    $scope.search = [];
    $scope.users = [];
    $scope.ActiveChat = {};
    $scope.ChatList = [];
    $scope.ContactList = [];

    ///////////////////////////////////UI Helpers/////////////////////////////////////////////////////////////////////

    $scope.setMessagePosition = function (SenderID) {
        var currentUserId = $rootScope.currentUser._id;
        var ClassName = "msg-left";
        if (SenderID != currentUserId) {
            ClassName = "msg-right";
        }
        return ClassName;
    }

    $scope.setDefaultMemebers = function (SenderID) {
        var currentUserId = $rootScope.currentUser._id;
        var imgSrc = "./imgs/man03.png";
        if (SenderID != currentUserId) {
            imgSrc = "./imgs/man02.png";
        }
        return imgSrc;
    }
   


    ///////////////////////////////////Events Handelers Function/////////////////////////////////////////////////////
    $scope.searchUser = function () {
        
        return userFactory.SearchUser($scope.search.keyWord).then(function (data) {
            if (data.data.length > 0) {
                $scope.users = data.data;
            } else {
                $scope.users = [];
            }
        });
    }

    $scope.createChat = function (memberid) {
        var currentUserId = $rootScope.currentUser._id;
        var chat = {members:[memberid,currentUserId]};

        return chatFactory.createChat(chat).then(function (data) {
            if (data.data.length > 0) {
                $scope.ActiveChat = data.data;
            } else {
                $scope.ActiveChat = {};
            }
        });
    }

    $scope.getChatDetails = function (chatId) {
        var currentUserId = $rootScope.currentUser._id;
        return chatFactory.getChatDetails(chatId, currentUserId).then(function (data) {
            debugger;

            if (data.data) {
                $scope.ActiveChat = data.data;
            } else {
                $scope.ActiveChat = {};
            }
        });

    }

    $scope.GetChats = function myfunction() {
        
        var currentUserId = $rootScope.currentUser._id;
        return chatFactory.GetUserChats(currentUserId).then(function (data) {
            if (data.data.length > 0) {
                $scope.ChatList = data.data;
                $scope.ActiveChat = data.data[0];
            } else {
                $scope.ChatList = [];
                $scope.ActiveChat = {};
            }
        });
    }


    $scope.GetContacts = function myfunction() {
        var currentUserId = $rootScope.currentUser._id;
        return chatFactory.GetContacts(currentUserId).then(function (data) {
            if (data.data.length > 0) {
                $scope.ContactList = data.data;
            } else {
                $scope.ContactList = [];
            }
        });

    }

    $scope.StartChatWithUser = function (otherContact) {
        var currentUserId = $rootScope.currentUser._id;
        //get chat for these 2 users if exits, other wise creat it and get it too.
        return chatFactory.GetChatByMemebrs(currentUserId, otherContact).then(function (data) {
            if (data.data.length > 0) {
                $scope.ActiveChat = data.data;
            } else {
                $scope.ActiveChat = {};
            }

            //jump on first tab

            $("#tab1").click();
        });


    }

    $scope.Initialize = function () {
        $rootScope.currentUser = $cookieStore.get('key');

        $scope.GetChats();
        $scope.GetContacts();
    }
    ///////////////////////////////Initilization/////////////////////////////////////////////////////
    $scope.Initialize();


}]);
