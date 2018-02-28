angular.module('chatApp').factory('UploadFactory', ['$http', '$rootScope', 'settings', '$cookieStore', '$location', 'RequestFactory', 'Upload', function ($http, $rootScope, settings, $cookieStore, $location,  RequestFactory, Upload) {
        return {
            upload: function (file, path) {
                var data = {path: path};
                return RequestFactory.upload('POST', appConfigs.apiBaseURL + 'Upload?path=' + path, data, file, null);
            },
            importExcelProducts: function (categoryId, excelFile) {     
                return RequestFactory.upload('POST', appConfigs.apiBaseURL + 'Upload/ImportExcel/' + categoryId, null, excelFile, null);
            }

        }
    }]);

