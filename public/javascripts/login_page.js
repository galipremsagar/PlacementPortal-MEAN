/**
 * Created by KH9143 on 27-12-2015.
 */
angular.module('Login', ['ngMaterial','ngRoute'])
    .controller('AppCtrl', function($scope,$timeout, $mdSidenav, $log,$http,$window) {
        console.log("loaded");
        $scope.pin;
        $scope.password;
        $scope.go = function()
        {
            console.log("entered");
            console.log($scope.pin);
            console.log($scope.password);
            credentials = {
                pin : $scope.pin,
                password : $scope.password
            };
            $http({
                method: 'POST',
                url: '/auth',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : credentials
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("success");
                console.log(response);
                $window.location.href = response.data.redirect;

            }, function errorCallback(response) {
                alert("WRONG CREDENTIALS");
            });
        };



    })
    .config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });

