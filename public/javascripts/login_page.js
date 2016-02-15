/**
 * Created by KH9143 on 27-12-2015.
 */
angular.module('Login', ['ngMaterial','ngRoute'])
    .controller('AppCtrl', function($scope,$timeout, $mdSidenav, $log,$http) {
        console.log("loaded");
        var go = function()
        {
            console.log($scope.pin);
            console.log($scope.password);
        };



    })
    .config(function($mdThemingProvider) {
        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
    });

