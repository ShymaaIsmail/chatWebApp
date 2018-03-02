angular.module('chatApp').controller('chatController', ['$cookieStore', '$rootScope', '$state', '$scope', 'userFactory', 'chatFactory', 'UploadFactory', 'appConfigs', '$timeout', function ($cookieStore, $rootScope, $state, $scope, userFactory, chatFactory, UploadFactory, appConfigs, $timeout) {
       
    //memebers
    $scope.search = [];
    $scope.users = [];
    $scope.ActiveChat = {};
    $scope.ChatList = [];
    $scope.ContactList = [];
    $scope.Message = [];
    $scope.attachmet = {};
    $scope.validMessage = true;
    $scope.serverUrl = appConfigs.apiBaseURL;

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
        var imgSrc = "../imgs/man03.png";
        if (SenderID != currentUserId) {
            imgSrc = "../imgs/man02.png";
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
                $scope.getChatDetails($scope.ActiveChat.chatID);
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
            if (data.data) {
                $scope.ActiveChat = data.data;
            } else {
                $scope.ActiveChat = {};
            }
            console.log($scope.ActiveChat);
            //jump on first tab

            $("#tab1").click();
        });


    }

    $scope.SendTextMessage = function () {
        $scope.validMessage=$scope.IsValidMessage();
        if ($scope.validMessage) {
            $scope.disableSendBtn = true;
            if ($scope.attachmet.file) {
                $scope.UploadAttachment().then(function () {
                    return    sendMessage();
                });
            }else{
                return  sendMessage();
            }
         }
    }

    function sendMessage() {
        var message = { SenderID: $rootScope.currentUser._id, chatID: $scope.ActiveChat.chatID, Text: $scope.Message.Text, AttachmentPath: $scope.AttachmentPath };
        return chatFactory.SendTextMessage(message).then(function (msg) {
            $scope.ActiveChat.messages.push(msg.data);
            $scope.disableSendBtn = false;
            $scope.Message.Text = "";
            $scope.AttachmentPath = "";
            $scope.attachmet = {};

        });
    }

    $scope.IsValidMessage = function () {

        return ($scope.AttachmentPath !=undefined&& $scope.AttachmentPath.length > 0) || ($scope.Message.Text != undefined && $scope.Message.Text.length > 0);
    }
    ////////////////////////////////File Upload Section/////////////////////////////////////////////////////////////////////////////////
    $scope.UploadAttachment = function () {  
         if ($scope.attachmet.file) { //check if file is selected
          return  $scope.upload($scope.attachmet.file); //call upload function
        }
    }

    $scope.upload = function (file) {
        
        return UploadFactory.upload(file).then(function (data) {
            console.log(data);

            $scope.AttachmentPath=  data.data.filePath;
            alert(data);
        });
        
    };

    $scope.Initialize = function () {
        $rootScope.currentUser = $cookieStore.get('key');

        $scope.GetChats();
        $scope.GetContacts();

        //var counter = 11;
        //function addItem() {
        //    $scope.ActiveChat.messages.push({ Text: ++counter });
        //    $timeout(addItem, 1000);
        //}

        //$timeout(addItem, 1000);
    }
    ///////////////////////////////Initilization/////////////////////////////////////////////////////
    $scope.Initialize();


}]);
