angular.module('chatApp').factory('UploadFactory', ['$http', '$rootScope', 'settings', '$cookieStore', '$location', 'initContext', 'RequestFactory', 'Upload', function ($http, $rootScope, settings, $cookieStore, $location, initContext, RequestFactory, Upload) {
        return {
            upload: function (file, path) {
                var data = {path: path};
                return RequestFactory.upload('POST', initContext.get().apiBaseURL + 'Upload?path=' + path, data, file, null);
            },
            importExcelProducts: function (categoryId, excelFile) {     
                return RequestFactory.upload('POST', initContext.get().apiBaseURL + 'Upload/ImportExcel/' + categoryId, null, excelFile, null);
            }

        }
    }]);

