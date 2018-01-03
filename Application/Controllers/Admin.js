registrationModule.controller("AdminController", ['$scope','Routes','Branches',
  function ($scope, Routes, Branches) {
      $scope.seletedBranch = null;
      $scope.branches = Branches.getBranches();
      $scope.selectedBranch = $scope.branches[0];
      $scope.Routes = function (branch, date) {
          $scope.routes = Routes.getRoutes(branch, date);
      };

  }]);