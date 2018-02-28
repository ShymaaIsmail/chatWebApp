angular.module('chatApp').factory('CRUDFactory', ['$http', '$rootScope', '$cookieStore', '$location', 'RequestFactory', 'appConfigs', function ($http, $rootScope, $cookieStore, $location, RequestFactory, appConfigs) {
    return {
        getList: function(ControllerName) {
            return RequestFactory.SendRequest('GET', appConfigs.apiBaseURL + ControllerName, null, null);
        },
        getPaginatedList: function(ControllerName, filterObject) {
            filterObject.PageSize = settings.pageSize;
            return RequestFactory.SendRequest('POST', appConfigs.apiBaseURL + ControllerName + "/FilteredList", filterObject, null);
        },
        get: function(ControllerName, id) {
            return RequestFactory.SendRequest('GET', appConfigs.apiBaseURL + ControllerName + '/' + id, null, null);
        },
        add: function(ControllerName, addedObject) {
            return RequestFactory.SendRequest('POST', appConfigs.apiBaseURL + ControllerName, addedObject, null);
        },
        edit: function(ControllerName, editedObject, id) {
            return RequestFactory.SendRequest('PUT', appConfigs.apiBaseURL + ControllerName + '/' + id, editedObject, null);
        },
        delete: function(ControllerName, id) {
            return RequestFactory.SendRequest('DELETE', appConfigs.apiBaseURL + ControllerName + '/' + id, null, null);
        },
        getPaginated: function (ControllerName, filterObject) {
            filterObject.PageSize = settings.pageSize;
            return RequestFactory.SendRequest('POST', appConfigs.apiBaseURL + ControllerName + "/FilteredList/DTO", filterObject, null);
        }
    }
}]);