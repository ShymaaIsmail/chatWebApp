angular.module('chatApp').factory('RequestFactory', ['$http', '$rootScope',  '$cookieStore', '$location',  'Upload', function ($http, $rootScope,  $cookieStore, $location,  Upload) {
    return {
        SendRequest: function (method, url, data, responseType) {

            var header = {};
            header['method'] = method;
            header['url'] = url;  

                if (data) {
                    header['data'] = data;
                }
                if (responseType) {
                    header['responseType'] = responseType;
                }

             
                var result = $http(header).success(function () {
                    
                }).error(function (data, status, headers, config) {
                     
                   
                    if (status === 401)
                    {
                        window.location = "login.html";
                    }
                    else if (status === 400)
                    {
                        $rootScope.submitted = false;
                        
                    }
            });
            return result;
        },
        upload: function (method, url, data, file, responseType) {

            var header = {};
            header['method'] = method;
            header['url'] = url;

            if (data) {
                header['fields'] = data;
            }
            if (file) {
                header['file'] = file;
            }
            if (responseType) {
                header['responseType'] = responseType;
            }

            var result = Upload.upload(header).error(function (data, status, headers, config) {
                if (status == 401)
                    window.location = "login.html";
                else if (status == 500)
                    alert("upload failed");
            });
            return result;
        }
    }
}]);
 
