
angular.module('chatApp').controller('realtimeController', function ($scope, localStorageService, SocketService) {

    $scope.array = [];
    $scope.message = {};
    SocketService.emit('room', { roomId: "temp" });

    $scope.add = function () {
        debugger;
        SocketService.emit('toBackEnd', { roomId: 'temp', data: $scope.message.input, date: new Date() })
        //$scope.array.push({ data: $scope.message, date: new Date() })
    }

    SocketService.on('message', function (msg) {
        $scope.array.push(msg)
    });

})