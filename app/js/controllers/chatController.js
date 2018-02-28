angular.module('chatApp').controller('chatController', ['$rootScope', '$state', '$scope', 'userFactory', 'chatFactory', function ($rootScope, $state, $scope, userFactory,chatFactory) {
       
    $scope.searchUser = function (keyWord) {
        return userFactory.SearchUser(keyWord).then(function (data) {
            $scope.users = data;
        });
    }

    $scope.createChat = function (chatId) {
        var currentUserId = $rootScope.currentUser._id;

    }

    $scope.getChatDetails = function (chatId) {
        var currentUserId = $rootScope.currentUser._id;


    }

    $scope.GetChats = function myfunction() {
        var currentUserId = $rootScope.currentUser._id;


    }


    $scope.GetContacts = function myfunction() {
        var currentUserId = $rootScope.currentUser._id;


    }




}]);
