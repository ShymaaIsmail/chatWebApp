angular.module('chatApp').factory('CRUDFactory', ['$http', '$rootScope', '$cookieStore', '$location', 'RequestFactory', 'appConfigs', function ($http, $rootScope, $cookieStore, $location, RequestFactory, appConfigs) {
    return {
        getList: function(ControllerName) {
            return RequestFactory.SendRequest('GET', appConfigs.apiBaseURL + ControllerName, null, null);
        },
        get: function(ControllerName, id) {
            return RequestFactory.SendRequest('GET', appConfigs.apiBaseURL + ControllerName + '/' + id, null, null);
        },
        add: function(ControllerName, addedObject) {
            return RequestFactory.SendRequest('POST', appConfigs.apiBaseURL + ControllerName, addedObject, null);
        },
        edit: function(ControllerName, editedObject, id) {
            return RequestFactory.SendRequest('PUT', appConfigs.apiBaseURL + ControllerName + '/' + id, editedObject, null);
        }
    }
}]);