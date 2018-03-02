
angular.module('chatApp').controller('realtimeController', function ($scope, localStorageService, SocketService) {

    $scope.array = [];
    $scope.message = {};
    SocketService.emit('chat', { chatId: "5a9867e39f266731e02c8150" });

    $scope.add = function () {
        debugger;
        SocketService.emit('toBackEnd', { chatId: "5a9867e39f266731e02c8150", data: $scope.message, date: new Date() })
        $scope.array.push({ data: $scope.message, date: new Date() })
    }

    SocketService.on('message', function (msg) {
        $scope.array.push(msg)
    });

})