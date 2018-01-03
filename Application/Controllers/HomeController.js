    "use strict";
    registrationModule.controller("HomeController",
        function ($scope, $filter, Branches) {
 
            $scope.today = function () {
                var date = new Date();
                $scope.dt = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };
            
            $scope.format = 'shortDate';

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.seletedBranch = null;
            $scope.branches = Branches.getBranches();
            $scope.selectedBranch = $scope.branches[0];

          
    
    });

  