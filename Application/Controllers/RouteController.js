'use strict';
registrationModule.controller("RouteController", ['$scope', 'Routes', 'Albums', 'weatherService', '$routeParams', '$modal', 'Branches', '$filter', 
  function ($scope, Routes, Albums, weatherService, $routeParams, $modal, Branches, $filter) {

      init();
      $scope.open = open;
      $scope.changeClass = onclass;
      $scope.changeHover = onHover;
      $scope.changeSummary = onSummary;
      $scope.changeBox = onBox;
      $scope.changeWindow = onWindow;
      $scope.on = onWeather;
      $scope.humanize = humanize;
      $scope.humanizeShow = humanizeShow;
      $scope.Complete = adminComplete;
      $scope.Last = adminLast;
      $scope.today = today;
      $scope.today();
      $scope.clear = clear;
      $scope.open = open;
      $scope.toggleMin = minmaxDate;
      $scope.toggleMin();
      $scope.disabled = disableCalander;
      $scope.totalStops = acutalDur;
      $scope.totalRoute = routeCount;
      $scope.alert = alert;
      $scope.obj = objectLength;
      $scope.changeHeader = showHeader;
      $scope.showDetails = showDetails;
      $scope.routeDetailsOpen = routeDetailsOpen;
      $scope.routeDetailsClose = routeDetailsClose;      
      $scope.toggleShow = toggleShow;
      $scope.toggleAppear = toggleAppear;      
      $scope.stopsCompleted = stopsCompleted;
      $scope.stopsNotCompleted = stopsNotCompleted;
      $scope.knownCheck = knownCheck;      
      $scope.percentStopsComplete = percentStopsComplete;
      $scope.getDuration = getDuration;
      $scope.totalPlannedDuration = totalPlannedDuration;
      $scope.totalCompletedActualDuration = totalCompletedActualDuration;
      $scope.remainingPlannedDurationLeft = remainingPlannedDurationLeft;           
      ngPlannedDurationLeft: 0;

      $scope.ll = 'true';



      function init() {
          var date = $routeParams.date;
          var dateMom = new moment(date, "YYYYMMDD");
          var branch = $routeParams.branch;
          
          $scope.dateMom = dateMom;
          $scope.date = date;
          $scope.branch = branch;          
          $scope.Routes = Routes.getRoutes(branch, date);
          $scope.weather = weatherService.getWeather(branch);
          $scope.class = 'col-lg-3';
          $scope.hover = 'hover1';          
          $scope.box = 'box';
          $scope.summary = 'summary1';
          $scope.window = 'window';
          $scope.limitNumber = 1;
          $scope.showModal = true;
          $scope.headerShow = true;
          $scope.admin = false;
          $scope.showBody = true;
          $scope.scroll = '';
          $scope.AcutalDuration = 0;
          
          $scope.routeCount = 0;         
          
          $scope.seletedBranch = null;
          $scope.branches = Branches.getBranches();
          $scope.selectedBranch = $scope.branches[0];         

          $scope.dateOptions = {
              formatYear: 'yy',
              startingDay: 1
          };        
          
      }        

      function stopsCompleted(obj)
      {          
          if (obj) {
              var completed = 0;
              Object.keys(obj).forEach(function (key) {
                  var stop = obj[key];
                  if (stop.Status == "Complete") {
                      completed += 1;
                  }                  
              });
              return completed;
          }
          return 0;
      }

      function stopsNotCompleted(obj)
      {                    
          if (obj) {
              var notCompleted = 0;
              Object.keys(obj).forEach(function (key) {
                  var stop = obj[key];
                  if (stop.Status == "New") {
                      notCompleted += 1;
                  }
              });
              return notCompleted;
          }
          return 0;
      }

      function totalPlannedDuration(obj) {
          if (obj) {
              var totalDuration = 0;
              Object.keys(obj).forEach(function (key) {
                  var stop = obj[key];
                  if (stop.ServiceDuration)
                  {
                    totalDuration += parseInt(stop.ServiceDuration);
                  }                  
              });
              return totalDuration;
          }
          return "Unknown";
      }
      
      function totalCompletedActualDuration(obj) {          
          if (obj) {
              var totalDuration = 0;
              Object.keys(obj).forEach(function (key) {
                  var stop = obj[key];
                  if (stop.Status == "Complete") {                      
                      totalDuration += getDuration(stop.ActualEndDate, stop.ActualStartDate);
                  }
              });
              return totalDuration;
          }
          return 'Unknown';
      }

      function remainingPlannedDurationLeft(obj) {
          if (obj) {
              var totalDuration = 0;
              Object.keys(obj).forEach(function (key) {
                  var stop = obj[key];
                  if (stop.Status == "New") {
                      totalDuration += parseInt(stop.ServiceDuration);
                  }
              });
              return totalDuration;
          }
          return 'Unknown';
      }

      function knownCheck(obj) {          
          if (obj == null) {
              return 'Unknown';
          }
          else
              return obj;
      };      

      function percentStopsComplete(obj) {          
          if (obj == null || isNaN(obj)) {              
              return 0;
          }
          else
              return obj;
      };

      function getDuration(date1, date2) {
          var plannedDate1 = new moment(date1);
          var actualDate2 = new moment(date2);

          var result = plannedDate1.diff(actualDate2, 'minutes');
          if (result == 0) {
              return null;
          }

          return result;
      }

      function toggleAppear(num)
      {
          $('#route' + num).fadeIn('slow');
      }

      function toggleShow(num)
      {
          $('#route' + num).fadeOut('slow');
          
      }

      function routeDetailsOpen(num)
      {
          $('#fancy' + num).fadeIn('slow');
      }

      function routeDetailsClose(num) {
          $('#fancy' + num).fadeOut('slow', function () {
              $('#bank' + num).fadeIn('slow');
          });
      }

      function showHeader()
      {
          if($scope.headerShow === true)
              return $scope.headerShow = false;
          else
              return $scope.headerShow = true;
      }

      function showDetails() {
          if ($scope.showBody === true)
              return $scope.showBody = false;
          else
              return $scope.showBody = true;
      }

      function routeCount(obj) {
          if (obj != null) {
              $scope.routeCount += 1;
          }
          else
              return 0;

      }

      function objectLength(object) {
          var count = Object.keys(object).length;
          return count;
      };

      function acutalDur(obj) {
          if (obj != null) {
              $scope.AcutalDuration += parseInt(obj);
          }
          else
              return 0;

      };

      function knownDriver(obj) {
          if (obj == null) {
              return 'Unknown Driver'
          }
          else
              return obj;

      };

      function alert(obj)
      {
          if (obj == 0)
          {
              return true
          }
          return false;
      }

      function disableCalander(date, mode) {
          return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
      };

      function minmaxDate() {
          $scope.minDate = $scope.minDate ? null : new Date();
      };

      function open($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
      };

     function clear() {
          $scope.dt = null;
      };

      function today() {
          $scope.dt = new moment().format('YYYY-MM-DD');
      };

      function adminComplete(item) {
          item.ll = "Complete"
          $scope.Routes.$save(item);
      };

      function adminLast(item) {
          item.ll = "New"
          $scope.Routes.$save(item);
      };

      function onWeather(date) {
          var now = new moment();
          var update = new moment(date);        
          var result = now.diff(update, "minutes");
          if (result < 1440 && result > 0){
              return true;
          }
          else
              return false;
      };

      function onclass() {
          if ($scope.class === 'col-lg-3')
              $scope.class = 'col-lg-2';
              else
              $scope.class = 'col-lg-3';

      };

      function onHover() {
          if ($scope.hover === 'hover')
              $scope.hover = 'hover1';
          else
              $scope.hover = 'hover';
      };

      

      function onBox(hoverType) {
          if (hoverType == 'hover')
              return true
          else
              return false
      }

      function onSummary() {
          if ($scope.summary === 'summary'){
             $scope.summary = 'summary1';
             $scope.scroll = '';
          }              
          else {
              $scope.summary = 'summary';
              $scope.scroll = 'no-scroll';
          }              
      };

      function onWindow(summaryType) {
          alert(summaryType);
          if (summaryType == 'summary')
              return true
          else
              return false
      }

      function open() {

          var modalInstance = $modal.open({
              templateUrl: 'myModalContent.html',
              controller: "RouteController"
          });
      };

      function humanize(date) {
          var now = new moment();
          var update = new moment(date);        
          var result = now.diff(update);

          var result1 = moment.duration(result).humanize();
          return result1;

      };

      function humanizeShow(date) {
          if (date == null) {
              return false;
          }
          else
              return true;

      };  
  }
]);

