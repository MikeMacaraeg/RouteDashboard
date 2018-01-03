'use strict';
registrationModule.controller("StopController", ['$scope', 'Albums', '$routeParams',
function ($scope, Albums, $routeParams) {
        init();
        $scope.p = plumb();
        $scope.date = getDate;
        $scope.plum = getPlumb;
        $scope.classDur = DurClass;
        $scope.classTime = TimeClass;
        $scope.showStopgliphi = gliphiStop;
        $scope.projectSummary = projectDur;
        $scope.acutalSummarys = acutalDur;
        $scope.summary = {keren: 0};
        $scope.AcutalDuration = 0;
        $scope.errorGliphi = errorGliphi;

        function init() {

            var id = $routeParams.id;
            var branch = $routeParams.branch;
            var date = $routeParams.date;
            var dateMom = new moment(date, "YYYYMMDD");
            $scope.id = id;
            $scope.dateMom = dateMom;
            $scope.branch = branch;
            $scope.dates = date;
            $scope.toggle = true;
            $scope.stops = Albums.getAlbum(branch, date, id);       
            $scope.route = Albums.getRoutesBy(branch, date, id);
        }

        $scope.lat = undefined;
        $scope.lng = undefined;

        $scope.$on('gmPlacesAutocomplete::placeChanged', function () {
            var location = $scope.autocomplete.getPlace().geometry.location;
            $scope.lat = location.lat();
            $scope.lng = location.lng();
            $scope.$apply();
        });

        $scope.$on('ngRepeatFinished', function () {

            $('.mapLoading').delay(1000).fadeOut('slow');

            // Google maps multiple markers for Route Dashboard
            var locations = [];
            var newLat = null;
            var newLng = null;

            jQuery('#projected tbody tr').each(function (index, value) {
                var company = $(this).find('td:eq(2)').text();
                var lat = $(this).find('td:eq(3)').text();
                var lng = $(this).find('td:eq(4)').text();
                var actualStop = $.trim($(this).find('td:eq(6)').text());

                var array = [company, lat, lng, actualStop];
                var newArray = array.filter(function (value) { return value !== '' });
                locations.push(newArray);
            });

            // Initialize map
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 0,
                center: new google.maps.LatLng(0, 0),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            // Create variable for map
            var infowindow = new google.maps.InfoWindow();
            var latlngbounds = new google.maps.LatLngBounds();
            var mapMarker;

            // Display pinpoints & title for location
            jQuery.each(locations, function (index, pinpoint) {

                var mapIcon;
                var actualStop = pinpoint[3] || null;

                if (pinpoint.length > 3) {
                    mapIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + actualStop + '|2fa4e7|000000'
                } else {
                    mapIcon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=?|ee3c51|000000'
                }

                mapMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(pinpoint[1], pinpoint[2]),
                    map: map,
                    icon: mapIcon
                });

                google.maps.event.addListener(mapMarker, 'click', (function (marker, index) {
                    return function () {
                        infowindow.setContent(pinpoint[0]);
                        infowindow.open(map, marker);
                    }
                })(mapMarker, index));

                latlngbounds.extend(new google.maps.LatLng(pinpoint[1], pinpoint[2]));
            });

            // Readjust map zoom based on pinpoints
            map.fitBounds(latlngbounds);

            // Adds new markers & titles when submitted by user
            function placeMarker() {
                var newLat = jQuery('.newLat').val();
                var newLng = jQuery('.newLng').val();
                var newCompany = jQuery('.newCompany').val();

                var newMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(newLat, newLng),
                    map: map
                });

                var infowindow = new google.maps.InfoWindow({
                    content: newCompany
                });

                google.maps.event.addListener(newMarker, 'click', function () {
                    infowindow.open(map, newMarker);
                });
            }

            // Highlights input field red when company/title is empty
            jQuery('#addNewCoordinates').on('click', function () {
                if (jQuery('.newCompany').val() == "") {
                    jQuery('.newCompany').css('border-color', 'red');
                } else {
                    jQuery('.newCompany').css('border-color', 'rgb(238, 238, 238)');
                    placeMarker();
                }
            });
        });

        function errorGliphi(acutalStart,actualEnd)
        {
            if (acutalStart != null && actualEnd != null) {
                return "fa fa-exclamation-triangle";
            }
            else
                
                return "fa fa-question-circle";
        }

        function projectDur (obj) {
            var k = $scope.summary;

            if (typeof obj == 'object') {
                k.keren += parseInt(obj.ServiceDuration);
            } else {
                return k;
            }
        }

        function acutalDur(obj) {
            if (obj != null) {
                $scope.AcutalDuration += parseInt(obj);
            }
            else
                return 0;
         
        }

        function plumb () {
            jsPlumb.bind("ready", function () {
                jsPlumb.bind("connection", function (info) {
                    $scope.$apply(function () {
                        jsPlumb.Defaults.Container = $("#canvas");

                        jsPlumb.registerConnectionTypes({
                            "basic": {
                                paintStyle: {
                                    strokeStyle: "yellow",
                                    lineWidth: 5
                                },
                                hoverPaintStyle: {
                                    strokeStyle: "red",
                                    lineWidth: 7
                                },
                                cssClass: "connector-normal"
                            }
                        });
                    });
                });
            });
        }

        function getPlumb(stopnum) {
            var firstInstance = jsPlumb.getInstance();
            jsPlumb.Defaults.Container = $("#canvas");
            firstInstance.importDefaults({
                Connector: ["Straight", { curviness: 0 }],
                Endpoint: ["Dot", { radius: 5 }],
                Anchors: ["Center", "Center"]
            });

            var c1 = firstInstance.connect({
                target: 'act-' + stopnum,
                source: 'plan-' + stopnum,
                scope: "",
                type: ""        
            });

            var lobj = $('#plan-' + stopnum).postion();
            var robj = $('#act-' + stopnum).postion();
            $scope.lxy = lobj.x + "," + lobj.y;
            $scope.rxy = robj.x + "," + robj.y;

            console.log(lobj);
            console.log(robj);


        
            c1.toggleType("selected");

        }
       
        function getDate(date1, date2) {
            var plannedDate1 = new moment(date1);
            var actualDate2 = new moment(date2);
           
            var result = plannedDate1.diff(actualDate2,'minutes');
            if (result == 0)
            {
                return null;
            }

            return result;
        }

        function DurClass(planned, actual, end) {
            if (actual == null)
                return " ";
            else if (planned > actual)
                return 'alert alert-dismissable alert-success'
            else if (planned < actual)
                return "alert alert-dismissable alert-danger";
            else if (planned == actual)
                return "alert alert-dismissable alert-info";
            else
                return " ";
        }

        function TimeClass(planned, actual, end) {
              if (planned > actual)
                    return 'alert alert-dismissable alert-success';
                else if (planned < actual)
                    return "alert alert-dismissable alert-danger";                              
                else if (planned == actual)
                    return "alert alert-dismissable alert-info";
                else
                    return " ";
        }

        function gliphiStop(date) {
            if (date == null) {
                return true;
            }
            else
                return false;
        };
    }
    
     
]);


