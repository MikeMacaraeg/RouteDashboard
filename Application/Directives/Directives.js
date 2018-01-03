registrationModule.directive('clock', ['dateFilter', '$timeout',
    function (dateFilter, $timeout) {
    return {
        restrict: 'E',
        scope: {
            format: '@'
        },
        link: function (scope, element, attrs) {
            var updateTime = function () {
                var now = Date.now();
                element.html(dateFilter(now, scope.format));
                $timeout(updateTime, now % 1000);
            };
            updateTime();
        }
    };
}]);

registrationModule.directive('progressBar',
    function () {
        var success = 'progress-bar progress-bar-success';
        var warning = 'progress-bar progress-bar-warning';
        var danger = 'progress-bar progress-bar-danger';

        var setCssStyling = function (width) {
            if (width >= 50) {
                return success;
            } else if (width >= 20) {
                return warning;
            } else {
                return danger;
            }
        }

        var formatWidth = function (width) {
            return 'width:' + width + '%';
        }

        return {
            restrict: 'E',
            scope: { width: '=' },
            template: '<div class="progress progress-striped active">' +
                '<div ng-class="cssStyle" role="progressbar" style="{{ cssWidth }}">{{ percentage }}</div>' +
                '</div>',
            link: function (scope, element, attrs) {
                scope.cssWidth = '';
                scope.$watch('width', function (newVal) {
                    scope.cssWidth = formatWidth(newVal);
                    scope.cssStyle = setCssStyling(newVal);
                    scope.percentage = newVal + '%';
                });
            }
        }

    });

registrationModule.directive('chart',
    function () {
        var success = 'label label-success';
        var warning = 'label label-warning';
        var danger = 'label label-danger';
        var def = 'label label-default';

        var plus = 'glyphicon glyphicon-plus';
        var minus = 'glyphicon glyphicon-minus';

        var setCssStyling = function (width) {
            if (width >= 15) {
                return success;
            } else if (width >= 5) {
                return warning;
            } else if (width < -10) {
                return danger;
            }
            else {
                return def;
            }
        }



        var gliph = function (width) {
            if (width >= 0) {
                return plus;
            }
            else {
                return minus;
            }
        }

        return {
            restrict: 'E',
            scope: { width: '=' },
            template: 
                '<span ng-class="cssStyle"> <span ng-class="gli"></span> <span class="glyphicon glyphicon-time"> </span> {{ percentage }}</span>',
            link: function (scope, element, attrs) {
                scope.cssWidth = '';
               
                scope.$watch('width', function (newVal) {
                    scope.cssStyle = setCssStyling(newVal);
                    scope.gli = gliph(newVal);
                    scope.percentage = newVal +' '+'Mins';
                });
            }
        }

    });

registrationModule.directive('lastUpdated',
    function () {
        var success = 'label label-success';
        var warning = 'label label-warning';
        var danger = 'label label-danger';
        var def = 'label label-default';

        var setCssStyling = function (width) {
            if (width >= 15) {
                return success;
            } else if (width >= 5) {
                return warning;
            } else if (width < -10) {
                return danger;
            }
            else {
                return def;
            }
        }

        return {
            restrict: 'E',
            scope: { width: '=' },
            template:
                '<span ng-class="cssStyle">Last Updated {{ percentage }}</span>',
            link: function (scope, element, attrs) {
                scope.cssWidth = '';

                scope.$watch('width', function (newVal) {
                    scope.cssStyle = setCssStyling(newVal);
                    scope.percentage = newVal + ' ' + 'Mins';
                });
            }
        }

    });

registrationModule.filter('moment',
    function () {
        return function (dateString, format) {
            if (dateString == null) {
                return " ";
            }
            return moment(dateString).format(format);
        }
    });

registrationModule.filter('temp',
    function ($filter) {
    return function (input, precision) {
        if (!precision) {
            precision = 1;
        }
        var numberFilter = $filter('number');
        var F = numberFilter(input, precision) * 9 / 5 + 32;
        return Math.round(F) + " \u00b0" + "F";
    };
});

registrationModule.filter('dateFormat',
    function ($filter) {
    return function (input, dateFmter) {
        if (!dateFmter) {
            dateFmter = "MM/DD/YYYY";
        }
        return input.format(dateFmter);
    };
});

registrationModule.filter('myLimitTo',
    [function () {
    return function (obj, limit) {
        var keys = Object.keys(obj);
        if (keys.length < 1) {
            return [];
        }

        var ret = new Object,
        count = 0;
        angular.forEach(keys, function (key, arrayIndex) {
            if (count >= limit) {
                return false;
            }
            ret[key] = obj[key];
            count++;
        });
        return ret;
    };
    }]);

registrationModule.directive('onFinishRender',
    function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        }
    });
