/**
 * Created by KH9143 on 27-12-2015.
 */
angular.module('toolbarDemo1', ['ngMaterial','ngRoute'])
    .controller('AppCtrl', function($scope,$timeout, $mdSidenav, $log,$http,$window,$mdDialog) {
        console.log("loaded");

        $scope.toggleLeft = buildToggler('left');
        $scope.x;
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
            $http.post('/login/companies').success(function(response){
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
        $scope.logout = function() {
            $window.location.href = "/";

        };

        $scope.dialog_1 = function()
        {
            $mdDialog.show(
                $mdDialog.alert()
                    //.targetEvent(originatorEv)
                    .clickOutsideToClose(true)
                    .parent('body')
                    .title('Traning and placement contact details')
                    .textContent('HOD,TNP : 8989897667\nFC, IT: 9911223344\nTPO, TNP: 9087654321')
                    .ok('Okay')
            );
        };

        $scope.dialog_company = function(index)
        {

            console.log($scope.x);
            console.log(index);
            console.log($scope.x[index]);
            $scope.dialog_content = $scope.x[index];
            console.log("yes",$scope.dialog_content.company_name);
            var useFullScreen = true;
            $mdDialog.show({
                    //.targetEvent(originatorEv)
                scope:$scope,
                controller: DialogController,
                templateUrl: 'dialog.html',
                parent: angular.element(document.body),

                clickOutsideToClose:true,
                fullscreen: useFullScreen
        });
        };
        // Kick off the interval
        $scope.intervalFunction();
        console.log("hi");
        function DialogController($scope, $mdDialog) {
            $scope.hide = function () {
                $mdDialog.hide();
            };
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
            $scope.answer = function (answer) {
                $mdDialog.hide(answer);
            };
        }
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
    .controller('Attendance_AppCtrl', function($scope,$http,$window) {


        $scope.companies = [
            {
                company_name: 'Bruno Mars',

                attendance: 'Absent'
            },{

                company_name: 'Bruno Mars',

                attendance: 'Absent'
            },{

                company_name: 'Bruno Mars',

                attendance: 'Absent'
            },{

                company_name: 'Bruno Mars',

                attendance: 'Absent'
            },{

                company_name: 'Bruno Mars',

                attendance: 'Absent'
            }
        ];

        $scope.update = function(){

            present_list = {value:"abc"};
            $http({
                method: 'POST',
                url: '/login/attendance',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : present_list
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                //$window.alert("Success");
                console.log(response);
                $scope.companies_list = Object.keys(response.data.op);
                $scope.companies_dict = response.data.op;
                for(i in $scope.companies)
                {
                    console.log(i);
                }
            }, function errorCallback(response) {
                console.log("HTTP:ERROR CALLBACK");
            });
        };
        $scope.update();
    })


    .controller('Profile_AppCtrl', function($scope,$mdDialog, $mdMedia,$http,$window) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $scope.go = function(){
            console.log("go is hit()");
        };
        $scope.states = ('Haryana-Punjab-Goa-Chhattisgarh-Kerala-Karnatka-Bihar-Tamil Nadu-Chandigarh-Jammu and Kashmir-Dadra and Nagar Haveli-Jharkhand-Meghalaya-Delhi-Assam-Madhya Pradesh-West Bengal-Rajasthan-Uttar Pradesh-Manipur-Uttarakhand-Andhra Pradesh-Himachal Pradesh-Nagaland-Gujarat-Arunachal Pradesh-Maharashtra-Tripura-Telangana-Puducherry-Karnataka-Mizoram-Odisha-Andaman and Nicobar Islands').split('-').sort().map(function(state) {
            return {abbrev: state};
        });

        $scope.doSave = function() {

            profile = {
                updated_profile : $scope.user
            };

            $http({
                method: 'POST',
                url: '/login/profileupdate',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : profile
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                $window.alert("Success");
            }, function errorCallback(response) {
                console.log("HTTP:ERROR CALLBACK");
            });
        };

        $scope.getProfileData = function () {

            console.log("loading profile data");
            $http.post('/login/getprofiledata').success(function(response){
                //$scope.signupResponse = response.success;
                console.log(response);
                $scope.user = response.op;
                $scope.user.dateOfBirth = new Date(response.op.dateOfBirth);
                console.log(response,"success");

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
        $scope.getProfileData();
    })
    .controller('Marks_AppCtrl', function($scope,$http,$window) {
        // create a message to display in our view


        $scope.getMarks = function()
        {
            console.log("loading marks data");
            $http.post('/login/getmarks').success(function(response){
                //$scope.signupResponse = response.success;
                console.log(response);
                $scope.user_marks = response.op;

                console.log(response,"success");

            });
            $scope.user_marks = "{}";
        };

        $scope.updateMarks = function () {
            profile = {
                updated_marks : $scope.user_marks
            };

            $http({
                method: 'POST',
                url: '/login/marksupdate',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : profile
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                $window.alert("Success");
            }, function errorCallback(response) {
                console.log("HTTP:ERROR CALLBACK");
            });

            $scope.getMarks();
        };

        $scope.getMarks();
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