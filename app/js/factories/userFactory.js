angular.module('chatApp').factory('userFactory',
    ['$http', '$rootScope', 'appConfigs', 'CRUDFactory',
   function ($http, $rootScope, appConfigs, CRUDFactory) {
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
            var userToAdd={ name: username, password: password, imagePath: imagePath };
            return CRUDFactory.add("users", userToAdd).success(function (data, status, headers, config) {
                return data;
            });
        },
        SearchUser: function (keyWord) {
            return CRUDFactory.get("users/search", keyWord).success(function (data, status, headers, config) {
                return data;
            });
        }
    }
}]);

