﻿'use strict';
chatApp.controller('userController', userController);

userController.$inject = ['$scope', '$rootScope', '$location', 'userFactory','$cookieStore'];

function userController($scope, $rootScope, $location, userFactory,$cookieStore) {
    // reset login status
   
    $scope.login = function () {
         
        if ($scope.form.$valid){
            userFactory.Login($scope.username, $scope.password).success(function (data, status, headers, config) {
                debugger;
                if (data.length > 0) {
                    $cookieStore.put('key', data[0]._id);
                    $rootScope.currentUser = data[0];
                    window.location = "#/chat.html";

                } else {
                    $scope.error = 'wrong authentication';
                    $rootScope.currentUser = null;

                }
            })
            .error(function (data, status, headers, config) {
                $scope.error = 'wrong authentication';
                $rootScope.currentUser = null;
            });

    }
    };


    $scope.signup = function () {

        if ($scope.form.$valid) {
            userFactory.SignUp($scope.username, $scope.password, 'dummy').success(function (data, status, headers, config) {
                 if (data!=undefined) {
                    $cookieStore.put('key', data._id);
                    $rootScope.currentUser = data;
                    window.location = "#/chat.html";

                } else {
                    $scope.error = 'wrong authentication';
                    $rootScope.currentUser = null;

                }
            })
            .error(function (data, status, headers, config) {
                $scope.error = 'wrong authentication';
                $rootScope.currentUser = null;
            });

        }
    };


}

 