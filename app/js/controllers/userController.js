'use strict';
chatApp.controller('userController', userController);

userController.$inject = ['$scope', '$rootScope', '$location', 'userFactory'];

function userController($scope, $rootScope, $location, userFactory) {
    // reset login status
   
    $scope.login = function () {

        userFactory.Login($scope.username, $scope.password).success(function (data, status, headers, config) {
            $cookieStore.put('key', data.access_token);
            
            window.location = "index.html";
        })
        .error(function (data, status, headers, config) {
            $scope.error = data.error_description;
            bootbox.alert({
                message: 'wrong authentication',
                buttons: {
                    ok: {
                        label: 'close'
                    }
                },
                callback: function () {
                    return;
                }
            });
        });
    };
}

 