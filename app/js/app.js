
var chatApp = angular.module("chatApp", [
    "ui.router",
     "oc.lazyLoad",
    "ngSanitize",
     'ngCookies',
    'sharedModule',
    'ngFileUpload',
     "oc.lazyLoad" 
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
chatApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
     });
}]);
  

//AngularJS v1.3.x workaround for old style controller declarition in HTML
chatApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);
 

 
/* Setup App Main Controller */
chatApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents();  
     });
}]);
 

/* Setup Layout Part - Header */
chatApp.controller('HeaderController', ['$scope', '$rootScope', 'UsersFactory', 'initContext', function($scope, $rootScope, UsersFactory, initContext) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
        UsersFactory.getCurrentUser().success(function(data, status, headers, config) {
            $rootScope.user = data;
        });
    });
    $scope.Logout = initContext.Logout;
    
}]);
 

chatApp.service('initContext', function ($rootScope, $window, $cookieStore, $http) {
    var sharedSettings = {
        apiBaseURL: '/apiUrl/',
        imagesBaseURL: '/imageurl'
    };
    $window.rootScopes = $window.rootScopes || [];
    $window.rootScopes.push($rootScope);

    if (!!$window.sharedService) {
        return $window.sharedService;
    }

    $window.sharedService = {
        change: function(newSettings) {
            sharedSettings = newSettings;
            angular.forEach($window.rootScopes, function(scope) {
                if (!scope.$$phase) {
                    scope.$apply();
                }
            });
        },
        get: function() {
            return sharedSettings;
        },
        Logout: function() {
            $cookieStore.remove("key");
            //window.location = "/views/login.html";
        }
    }
    return $window.sharedService;
});
/* Init global settings and run the app */
chatApp.run(["$rootScope",  "$state",  "$cookieStore", "$window", "$http", "initContext", function($rootScope,  $state, $cookieStore, $window, $http, initContext) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        // redirect to login page if not logged in    
        $rootScope.ValidateLoggedInUser(event, toState, toParams, fromState, fromParams);
    });

    $rootScope.ValidateLoggedInUser = function(event, toState, toParams, fromState, fromParams) {
        //if not logged in
        if (!$cookieStore.get('key')) {
            //window.location = "/views/login.html";
        }
    }
    
}]);