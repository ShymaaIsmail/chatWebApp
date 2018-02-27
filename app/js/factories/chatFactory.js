chatApp.factory('chatFactory', ['$http', '$rootScope',  function ($http, $rootScope) {
    return {
        Login: function (username, password) {
            var result =
            $http({
                url: initContext.get().apiBaseURL + 'token',
                method: 'POST',
                data: "userName=" + username + "&password=" + password + "&grant_type=password"
            });
            return result;
        }
    }
}]);

