
var chatApp = angular.module("chatApp", [
    "ui.router",
     "oc.lazyLoad",
    "ngSanitize",
     'ngCookies',
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
 

  
 
 
 
/* Init global settings and run the app */
chatApp.run(["$rootScope",  "$state",  "$cookieStore", "$window", "$http",  function($rootScope,  $state, $cookieStore, $window, $http) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        // redirect to login page if not logged in    
        $rootScope.ValidateLoggedInUser(event, toState, toParams, fromState, fromParams);
    });

    $rootScope.ValidateLoggedInUser = function(event, toState, toParams, fromState, fromParams) {
        //if not logged in
        if (!$cookieStore.get('key')) {
             window.location = "#/login.html";
        }
    }
    
}]);