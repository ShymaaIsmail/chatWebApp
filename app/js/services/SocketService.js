angular.module('chatApp').service('SocketService', ['socketFactory', 'appConfigs', function SocketService(socketFactory, appConfigs) {
    return socketFactory({
        ioSocket: io.connect(appConfigs.apiBaseURL)
    });
}]);