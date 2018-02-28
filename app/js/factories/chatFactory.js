angular.module('chatApp').factory('chatFactory', ['$http', '$rootScope', 'appConfigs', function ($http, $rootScope, appConfigs) {
    return {
        Login: function (username, password) {
            var result =
            $http({
                url: appConfigs.apiBaseURL + 'token',
                method: 'POST',
                data: "userName=" + username + "&password=" + password + "&grant_type=password"
            });
            return result;
        }
    }
}]);

