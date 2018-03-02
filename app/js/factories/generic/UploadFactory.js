angular.module('chatApp').factory('UploadFactory', ['$http', '$rootScope', '$cookieStore', '$location', 'RequestFactory', 'Upload', 'appConfigs',function ($http, $rootScope, $cookieStore, $location, RequestFactory, Upload, appConfigs) {
        return {
            upload: function (file) {
                 return RequestFactory.upload('POST', appConfigs.apiBaseURL + 'upload', null, file, null);
            }

        }
    }]);

