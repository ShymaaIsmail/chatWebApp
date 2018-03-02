 
/* Setup Rounting For Front End Pages */
chatApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login.html");


    $stateProvider

        .state('login', {
            url: "/login.html",
            templateUrl: "views/login.html",
            data: { pageTitle: 'Login' },
            controller: "userController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'chatApp',
                        files: [
                            'js/factories/userFactory.js',

                            'js/controllers/userController.js'
                        ]
                    }]);
                }]
            }
        })

        .state('signUp', {
            url: "/signup.html",
            templateUrl: "views/signUp.html",
            data: { pageTitle: 'signUp' },
            controller: "userController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'chatApp',
                        files: [
                            'js/controllers/userController.js',
                            'js/factories/userFactory.js'
                        ]
                    }]);
                }]
            }
        })

        .state('chat', {
            url: "/chat.html",
            templateUrl: "views/chat/chat.html",
            data: { pageTitle: 'chat' },
            controller: "chatController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'chatApp',
                        files: [
                            'js/controllers/chatController.js',
                            'js/factories/chatFactory.js',
                             'js/factories/userFactory.js',
                             'js/factories/generic/UploadFactory.js'
                        ]
                    }]);
                }]
            }
        })


    .state('testRealTime', {
        url: "/testRealTime.html",
        templateUrl: "views/chat/testRealTime.html",
        data: { pageTitle: 'chat' },
        controller: "realtimeController",
        resolve: {
            deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'chatApp',
                    files: [
                        'js/controllers/realtimeController.js'  
                    ]
                }]);
            }]
        }
    })

    


}]);