/**
 * Created by KH9143 on 27-12-2015.
 */
angular.module('toolbarDemo1', ['ngMaterial','ngRoute'])
    .controller('AppCtrl', function($scope,$timeout, $mdSidenav, $log,$http,$q,$window) {
        console.log("loaded");
        $scope.ctc = " ";
        $scope.jobDescription = " ";
        $scope.driveProcess = " ";
        $scope.companyDescription = " ";
        $scope.cutoff_cgpa = 0;

        $scope.send = function()
        {
            console.log("----------------------");
            console.log(new_tabs);
            console.log("----------------------");

            company_eligibles = {
                companyName : $scope.companyName,
                array_of_students : []
            };

            for (i in new_tabs)
            {
                for(j in new_tabs[i].students)
                {
                    if(new_tabs[i].students[j].eligible==true)
                    {
                        company_eligibles.array_of_students.push({pin:new_tabs[i].students[j].pin,attendance:false,hiring_decision:false});
                    }
                }
            }
            console.log("<--------------->");
            console.log(company_eligibles);
            console.log("<--------------->");

            $http({
                method: 'POST',
                url: '/adminlogin/drive',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : company_eligibles
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                $window.alert("Success");
            }, function errorCallback(response) {
                console.log("HTTP:ERROR CALLBACK");
            });
        };

        $scope.get_list = function()
        {
            drive_data = {
                companyName : $scope.companyName,
                ctc :  parseInt($scope.ctc , 10),
                logoUrl: $scope.logoUrl,
                dateOfPlacementDrive : $scope.dateOfPlacementDrive,
                companyType : $scope.companyType,
                jobRole : $scope.jobRole,
                jobDescription: $scope.jobDescription,
                driveProcess: $scope.driveProcess,
                venue: $scope.venue,
                reportingTime: $scope.reportingTime,
                companyDescription : $scope.companyDescription,
                branchNames: $scope.branchNames,
                cutoff_cgpa: $scope.cutoff_cgpa
            };
            console.log(drive_data);
            $http({
                method: 'POST',
                url: '/adminlogin/companies',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : drive_data
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("OUTSIDE LOOP.........");
                console.log(response.data.result);
                new_tabs = [
                    { title: 'CSE', students:[]  },
                    { title: 'IT', students:[]  },
                    { title: 'MECH', students:[]  },
                    { title: 'EEE', students:[]  },
                    { title: 'CIVIL', students:[]  },
                    { title: 'ECE', students:[]  }
                ];
                for(i in response.data.result)
                {
                    console.log("IN LOOP.........");
                    console.log(response.data.result[i].branch);
                    console.log(new_tabs);
                    switch (response.data.result[i].branch)
                    {
                        case 'CSE':
                            index = 0;
                            break;
                        case 'IT':
                            index = 1;
                            break;
                        case 'MECH':
                            index = 2;
                            break;
                        case 'EEE':
                            index = 3;
                            break;
                        case 'CIVIL':
                            index = 4;
                            break;
                        case 'ECE':
                            index = 5;
                            break;
                    }

                    console.log(new_tabs[index].students.push({name:response.data.result[i]['last name'],eligible:true,pin:parseInt(response.data.result[i].pin, 10) }));
                }
                $scope.branches = new_tabs;

            }, function errorCallback(response) {
                console.log("HTTP:ERROR CALLBACK");
            });


        };


        $scope.toggleLeft = buildToggler('left');
        $scope.isOpenLeft = function(){
            return $mdSidenav('left').isOpen();
        };

        $scope.pr = function(student)
        {
            console.log(student);
            console.log($scope.branches);
        };

        // Lists of fruit names and Vegetable objects
        $scope.fruitNames = ['CSE', 'IT', 'MECH','EEE','ECE',];
        $scope.branchNames = angular.copy($scope.fruitNames);
        $scope.tags = [];
        $scope.vegObjs = [
            {
                'name' : 'Broccoli',
                'type' : 'Brassica'
            },
            {
                'name' : 'Cabbage',
                'type' : 'Brassica'
            },
            {
                'name' : 'Carrot',
                'type' : 'Umbelliferous'
            }
        ];

        $scope.getSelectedChipIndex = function(event) {
            console.log("event..................");
            var selectedChip = angular.element(event.currentTarget).controller('mdChips').selectedChip;

        };

        $scope.newVeg = function(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
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
                //$scope.intervalFunction();
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

                templateUrl : '/admin_default.html',
                controller  : 'AppCtrl'
            })
            .when('/admin_attendance', {

                templateUrl : '/admin_attendance.html',
                controller  : 'admin_attendance_AppCtrl'
            })
            .when('/approvals',{

                templateUrl : '/approvals.html',
                controller : 'approvals_AppCtrl'
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

    .controller('admin_attendance_AppCtrl', function($scope,$http,$window) {
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
        $scope.branches;
        $scope.go = function(){
            drive_json = {
                drive: $scope.selected_drive
            };
            $http({
                method: 'POST',
                url: '/adminlogin/students',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : drive_json
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("OUTSIDE LOOP.........");
                console.log(response.data.result);
                console.log(response.data.company_related_info);
                new_tabs = [
                    { title: 'CSE', students:[]  },
                    { title: 'IT', students:[]  },
                    { title: 'MECH', students:[]  },
                    { title: 'EEE', students:[]  },
                    { title: 'CIVIL', students:[]  },
                    { title: 'ECE', students:[]  }
                ];
                for(i in response.data.result)
                {
                    console.log("IN LOOP.........");
                    console.log(response.data.result[i].branch);
                    console.log(new_tabs);
                    switch (response.data.result[i].branch)
                    {
                        case 'CSE':
                            index = 0;
                            break;
                        case 'IT':
                            index = 1;
                            break;
                        case 'MECH':
                            index = 2;
                            break;
                        case 'EEE':
                            index = 3;
                            break;
                        case 'CIVIL':
                            index = 4;
                            break;
                        case 'ECE':
                            index = 5;
                            break;
                    }

                    console.log(new_tabs[index].students.push({name:response.data.result[i]['last name'],attendance:response.data.company_related_info[i].attendance,pin:parseInt(response.data.result[i].pin, 10)}));
                }
                $scope.branches = new_tabs;

            }, function errorCallback(response) {
                alert("HTTP:ERROR CALLBACK");
            });

        };
        $scope.drives;
        $scope.refresh = function()
        {
            $http({
                method: 'GET',
                url: '/adminlogin/companies'
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log("THIS IS RESP OF COMPANY LISTS"+response.data.result);
                $scope.drives = response.data.result;

            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.refresh();


        $scope.publish = function()
        {
            console.log("----------------------");
            console.log(new_tabs);
            console.log("----------------------");

            present_list = {
                companyName : $scope.selected_drive,
                array_of_students : []
            };

            for (i in new_tabs)
            {
                for(j in new_tabs[i].students)
                {
                    if(new_tabs[i].students[j].attendance==true)
                    {
                        present_list.array_of_students.push({pin:new_tabs[i].students[j].pin,attendance:true});
                    }
                }
            }
            console.log("<--------------->");
            console.log(present_list);
            console.log("<--------------->");

            $http({
                method: 'POST',
                url: '/adminlogin/update_attendance',
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                data : present_list
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available

                $window.alert("Success");
            }, function errorCallback(response) {
                console.log("HTTP:ERROR CALLBACK");
            });
        };


    })
    .controller('approvals_AppCtrl', function($scope,$http,$window) {
        // create a message to display in our view
        $scope.getApprovals = function(){
            $http.post('/adminlogin/getapprovals').success(function(response){
                //$scope.signupResponse = response.success;
                console.log(response);
                $scope.users_approval = response;
                console.log(response,"success");

            });
            console.log(new Date());

        };
        $scope.reject = function (index) {
            console.log($scope.users_approval[index]);
            profile = {
                pin_num : $scope.users_approval[index].pin
            };
            console.log(profile);
            $http({
                method: 'POST',
                url: '/adminlogin/reject',
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
            $scope.getApprovals();
        };

        $scope.accept = function (index) {
            console.log($scope.users_approval[index]);
            profile = {
                pin_num : $scope.users_approval[index].pin
            };
            console.log(profile);
            $http({
                method: 'POST',
                url: '/adminlogin/accept',
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

            $scope.reject(index);
            $scope.getApprovals();
        };
    $scope.getApprovals();
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