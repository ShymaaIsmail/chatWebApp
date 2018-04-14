angular.module('chatApp').controller('chatController',

    ['$cookieStore', '$rootScope', '$state', '$scope', 'userFactory', 'chatFactory', 'UploadFactory', 'appConfigs', '$timeout', 'SocketService','localStorageService',

   function ($cookieStore, $rootScope, $state, $scope, userFactory, chatFactory, UploadFactory, appConfigs, $timeout, SocketService, localStorageService) {
       
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
    $scope.NotificationMessage = null;
    $scope.IsHumanChat = true;
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
   
    $scope.ScrollDown = function () {
        $('.containerScroll').animate({ scrollTop: $('.containerScroll').height() * 1000 }, 800);

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
        $scope.IsHumanChat = true;

        var currentUserId = $rootScope.currentUser._id;
        var chat = {members:[memberid,currentUserId]};

        return chatFactory.createChat(chat).then(function (data) {
            if (data.data.length > 0) {
               
                $scope.ActiveChat = data.data;
                //append chat to chat list if not exist
                SocketService.emit('chat', { chatId: $scope.ActiveChat.chatID });

            } else {
                $scope.ActiveChat = {};
            }
        });
    }

    $scope.getChatDetails = function (chatId) {
        $scope.IsHumanChat = true;

        var currentUserId = $rootScope.currentUser._id;
        return chatFactory.getChatDetails(chatId, currentUserId).then(function (data) {
             
            if (data.data) {
                $scope.ActiveChat = data.data;
                $scope.ScrollDown();
                SocketService.emit('chat', { chatId: $scope.ActiveChat.chatID });

            } else {
                $scope.ActiveChat = {};
            }
        });

    }

    $scope.GetChats = function myfunction(IsActivate) {
        
        var currentUserId = $rootScope.currentUser._id;
        return chatFactory.GetUserChats(currentUserId).then(function (data) {
            if (data.data.length > 0) {
                $scope.ChatList = data.data;
                if (IsActivate == true) {
                    $scope.ActivateChat(data.data[0]);
                }

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

    $scope.ActivateChat = function (chat) {
        $scope.ActiveChat = chat;
        $scope.getChatDetails($scope.ActiveChat.chatID);
        SocketService.emit('chat', { chatId: $scope.ActiveChat.chatID });
    }

    $scope.StartChatWithUser = function (otherContact) {
        var currentUserId = $rootScope.currentUser._id;
        //get chat for these 2 users if exits, other wise creat it and get it too.
        return chatFactory.GetChatByMemebrs(currentUserId, otherContact).then(function (data) {
            if (data.data) {
                $scope.GetChats(false);
                $scope.ActivateChat( data.data);
            } else {
                $scope.ActiveChat = {};
            }
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
             SocketService.emit('toBackEnd', { chatId: $scope.ActiveChat.chatID, data: msg.data, date: new Date() })

             $scope.ActiveChat.messages.push(msg.data);
             $scope.ScrollDown();
            $scope.disableSendBtn = false;
            $scope.Message.Text = "";
            $scope.AttachmentPath = "";
            $scope.attachmet = {};

        });
    }

    $scope.IsValidMessage = function () {
        debugger;
        return ($scope.attachmet.file) || ($scope.AttachmentPath != undefined && $scope.AttachmentPath.length > 0) || ($scope.Message.Text != undefined && $scope.Message.Text.length > 0);
    }
    ////////////////////////////////File Upload Section/////////////////////////////////////////////////////////////////////////////////
    $scope.UploadAttachment = function () {  
         if ($scope.attachmet.file) { //check if file is selected
          return  $scope.upload($scope.attachmet.file); //call upload function
        }
    }

    $scope.upload = function (file) {
        
        return UploadFactory.upload(file).then(function (data) {
             $scope.AttachmentPath=  data.data.filePath;
         });
        
    };


    //////////////////////////Bot Web Chat////////////////////////////////////////////////////////////
    $scope.openBotWebChat = function () {
        $scope.IsHumanChat = false;
        $scope.ActiveChat = {};
        $scope.ActiveChat.member = {};
        $scope.ActiveChat.member.name = "Reservation Bot";
    }

    //////////////////////////////Initilization/////////////////////////////////////////////////////
    $scope.Initialize = function () {
        $rootScope.currentUser = $cookieStore.get('key');

        $scope.GetChats(true);
        $scope.GetContacts();


    }

    $scope.Initialize();
    ////////////////// Listener for message Event ///////////////////////////
    SocketService.on('message', function (msg) {
        debugger;
        if ($scope.ActiveChat.chatID == msg.chatID) {
            $scope.ActiveChat.messages.push(msg);
            $scope.ScrollDown();

            $scope.NotificationMessage = null;
        } else {
          return  userFactory.GetUser(msg.SenderID).then(function (user) {
                $scope.NotificationMessage = msg;
                $scope.NotificationMessage.SenderName = user.data.name;

                $(".NotificationMessage").css('transition', '2s');
                $(".NotificationMessage").css('left',0);
               
                $timeout(function () {
                    $scope.NotificationMessage = null;

                    $(".NotificationMessage").css('transition', '3s');
                    $(".NotificationMessage").css('left', -1000);
                }, 3000);

            });
            
        }
    });
}]);
