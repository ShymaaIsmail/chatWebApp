
angular.module('chatApp').controller('botController',

    ['$cookieStore', '$rootScope', '$state', '$scope','appConfigs','$sce',

   function ($cookieStore, $rootScope, $state, $scope, appConfigs, $sce) {
        
       $scope.azureBotUrl = $sce.trustAsResourceUrl(appConfigs.azureBotUrl);

   }]);
