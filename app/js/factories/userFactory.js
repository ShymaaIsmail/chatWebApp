angular.module('chatApp').factory('userFactory', ['$http', '$rootScope', 'appConfigs', function ($http, $rootScope, appConfigs) {
    return {
        Login: function (username, password) {
            var result = 
            $http({
                url: appConfigs.apiBaseURL + 'users/login',
                method: 'POST',
                data: {name : username ,password: password }
            });
            return result;
        },

        SignUp:function (username, password,imagePath) {
            var result = 
            $http({
                url: appConfigs.apiBaseURL + 'users',
                method: 'POST',
                data: { name: username, password: password, imagePath: imagePath }
            });
            return result;
        }
    }
}]);

