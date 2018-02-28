angular.module('chatApp').factory('chatFactory', ['$http', '$rootScope', 'appConfigs', 'CRUDFactory', function ($http, $rootScope, appConfigs, CRUDFactory) {
    return {
        createChat: function (chat) {
            return CRUDFactory.add("chats", chat).success(function (data, status, headers, config) {
                    return data;
                });
        },

        getChatDetails: function (chatID, currentUserId) {

            var params =chatID+"/"+ currentUserId;
            return CRUDFactory.get("chats/chatDetails", params).success(function (data, status, headers, config) {
                return data;
            });
        },

        GetUserChats:function (userID) {
            return CRUDFactory.get("chats/userChats", userID).success(function (data, status, headers, config) {
                return data;
            });
        },

        GetContacts: function (userID) {
            return CRUDFactory.get("chats/contactList", userID).success(function (data, status, headers, config) {
                return data;
            });
        },

        GetChatByMemebrs: function (userID, otherContact) {

            var params = userID + "/" + otherContact;
            debugger;
            return CRUDFactory.get("chats/GetChatByMemebrs", params).success(function (data, status, headers, config) {
                return data;
            });
        }

    }
}]);

