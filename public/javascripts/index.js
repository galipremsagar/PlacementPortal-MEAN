/**
 * Created by KH9143 on 20-12-2015.
 */
angular
    .module('MyApp',['ngMaterial', 'ngMessages'])
    .controller('DemoCtrl', function($scope,$http,$mdDialog,$timeout) {

        $scope.alertOpen = function(signupResponse,signupMessage) {
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Opening from the left'+signupResponse)
                    .textContent(signupMessage)
                    .ariaLabel('Left to right demo')
                    .ok('Nice!')
                    // You can specify either sting with query selector
                    .openFrom('#SignupButton')
                    // or an element
                    .closeTo(angular.element(document.querySelector('#SignupButton')))
            );
        };

        $scope.user = {
            title: 'Developer',
            email: 'xyz@domain.com',
            firstName: '',
            lastName: '',
            company: 'Google',
            address: '',
            city: '',
            state: '',
            biography: 'Write something about yourself',
            postalCode: '',
            submissionDate : new Date("1994")
        };
        console.log($scope);
        $scope.states = ('Haryana-Punjab-Goa-Chhattisgarh-Kerala-Karnatka-Bihar-Tamil Nadu-Chandigarh-Jammu and Kashmir-Dadra and Nagar Haveli-Jharkhand-Meghalaya-Delhi-Assam-Madhya Pradesh-West Bengal-Rajasthan-Uttar Pradesh-Manipur-Uttarakhand-Andhra Pradesh-Himachal Pradesh-Nagaland-Gujarat-Arunachal Pradesh-Maharashtra-Tripura-Telangana-Puducherry-Karnataka-Mizoram-Odisha-Andaman and Nicobar Islands').split('-').sort().map(function(state) {
            return {abbrev: state};
        })
        $scope.go = function () {
            console.log($scope.user.state);
            $http.post('/signup',{'name': $scope.user.state}).success(function(response){
                $scope.signupResponse = response.success;
                console.log(response.success,"success");
                $scope.alertOpen(response.success,response.reason);
            });
        }


        $scope.getData = function(){
            $scope.user.firstName = new Date();
            console.log('Fetched data!');

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
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();

    });