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
            }, 10000)
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
            .when('/attendance', {

                templateUrl : '/attendance_table.html',
                controller  : 'Attendance_AppCtrl'
            })
            .when('/profile', {

                templateUrl : '/profile.html',
                controller  : 'Profile_AppCtrl'
            })
            .when('/marks',{

                templateUrl : '/marks.html',
                controller : 'Marks_AppCtrl'
            });

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();

    })
    .controller('Attendance_AppCtrl',['$scope', function($scope) {


        $scope.companies = [
            {
                thumb:'https://lh3.googleusercontent.com/-5NfcdlvGQhs/AAAAAAAAAAI/AAAAAAAAABY/ibGrApGYTuQ/photo.jpg',
                company_name: 'Bruno Mars',
                placed: 'Yes',
                attendance: 'Absent'
            },{
                thumb:'https://lh3.googleusercontent.com/-5NfcdlvGQhs/AAAAAAAAAAI/AAAAAAAAABY/ibGrApGYTuQ/photo.jpg',
                company_name: 'Bruno Mars',
                placed: 'Yes',
                attendance: 'Absent'
            },{
                thumb:'https://lh3.googleusercontent.com/-5NfcdlvGQhs/AAAAAAAAAAI/AAAAAAAAABY/ibGrApGYTuQ/photo.jpg',
                company_name: 'Bruno Mars',
                placed: 'Yes',
                attendance: 'Absent'
            },{
                thumb:'https://lh3.googleusercontent.com/-5NfcdlvGQhs/AAAAAAAAAAI/AAAAAAAAABY/ibGrApGYTuQ/photo.jpg',
                company_name: 'Bruno Mars',
                placed: 'Yes',
                attendance: 'Absent'
            },{
                thumb:'https://lh3.googleusercontent.com/-5NfcdlvGQhs/AAAAAAAAAAI/AAAAAAAAABY/ibGrApGYTuQ/photo.jpg',
                company_name: 'Bruno Mars',
                placed: 'Yes',
                attendance: 'Absent'
            }
        ];

    }])


    .controller('Profile_AppCtrl', function($scope,$mdDialog, $mdMedia) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $scope.go = function(){
            console.log("go is hit()");
        };
        $scope.states = ('Haryana-Punjab-Goa-Chhattisgarh-Kerala-Karnatka-Bihar-Tamil Nadu-Chandigarh-Jammu and Kashmir-Dadra and Nagar Haveli-Jharkhand-Meghalaya-Delhi-Assam-Madhya Pradesh-West Bengal-Rajasthan-Uttar Pradesh-Manipur-Uttarakhand-Andhra Pradesh-Himachal Pradesh-Nagaland-Gujarat-Arunachal Pradesh-Maharashtra-Tripura-Telangana-Puducherry-Karnataka-Mizoram-Odisha-Andaman and Nicobar Islands').split('-').sort().map(function(state) {
            return {abbrev: state};
        })

        $scope.showAdvanced = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                    controller: DialogController,
                    templateUrl: '/profile_confirm.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen
                })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function DialogController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }
    })
    .controller('Marks_AppCtrl', function($scope) {
        // create a message to display in our view
        var tabs = [
            { title: '10th class', content: "Tabs will become paginated if there isn't enough room for them."},
            { title: '12th class', content: "You can swipe left and right on a mobile device to change tabs."},
            { title: '1st Sem', content: "Tabs will become paginated if there isn't enough room for them."},
            { title: '2nd Sem', content: "You can swipe left and right on a mobile device to change tabs."},
            { title: '3rd Sem', content: "You can bind the selected tab via the selected attribute on the md-tabs element."},
            { title: '4th Sem', content: "If you set the selected tab binding to -1, it will leave no tab selected."},
            { title: '5th Sem', content: "If you remove a tab, it will try to select a new one."},
            { title: '6th Sem', content: "There's an ink bar that follows the selected tab, you can turn it off if you want."},
            { title: '7th Sem', content: "If you set ng-disabled on a tab, it becomes unselectable. If the currently selected tab becomes disabled, it will try to select the next tab."},
            { title: '8th Sem', content: "If you look at the source, you're using tabs to look at a demo for tabs. Recursion!"}
        ];

        $scope.tabs = tabs;
        $scope.mobileNumber = "hi";
        $scope.go = function()
        {
            $scope.mobileNumber = $scope.mobileNumber;
            console.log($scope.mobileNumber);
        };
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