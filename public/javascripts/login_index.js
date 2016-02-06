/**
 * Created by KH9143 on 27-12-2015.
 */
angular.module('toolbarDemo1', ['ngMaterial','ngRoute'])
    .controller('AppCtrl', function($scope,$timeout, $mdSidenav, $log,$http) {
        console.log("loaded");

        $scope.toggleLeft = buildToggler('left');
        $scope.isOpenLeft = function(){
            return $mdSidenav('left').isOpen();
        };
        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }
        function buildToggler(navID) {
            return function() {
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

        $scope.getData = function(){
            $http.post('http://localhost:3000/login/companies').success(function(response){
                //$scope.signupResponse = response.success;
                console.log(response);
                $scope.x = response;
                console.log(response,"success");

            });
            console.log(new Date());

        };
        $scope.intervalFunction = function(){
            $timeout(function() {
                $scope.getData();
                $scope.intervalFunction();
            }, 1000)
        };

        // Kick off the interval
        $scope.intervalFunction();
        console.log("hi");


    })
    .config(function($mdThemingProvider,$routeProvider) {




        $routeProvider

        // route for the home page
            .when('/', {

                templateUrl : '/default.html',
                controller  : 'AppCtrl'
            })
            .when('/w', {

                templateUrl : '/contact.html',
                controller  : 'AppCtrl'
            });

        // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();

    })
    .controller('AppCtrlp', function($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
    })

    .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.close = function () {
            $mdSidenav('left').close()
                .then(function () {
                    $log.debug("close LEFT is done");
                    console.log("close LEFT is done");

                });
        };
    });