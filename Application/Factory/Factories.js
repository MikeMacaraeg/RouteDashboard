registrationModule.factory('Routes', function ($firebase) {
    var ref = new Firebase('https://branchdashboard.firebaseio.com/Testing');
    return {
        getRoutes: function (branch, date) {
            return $firebase(new Firebase(ref + '/' + branch + '/' + date + '/' + 'routes'));
        }
    }
});

registrationModule.factory('Albums', function ($firebase) {
    var ref = new Firebase('https://branchdashboard.firebaseio.com/Testing');
    return {
        getAlbum: function (branch, date, id) {
            return $firebase(new Firebase(ref + '/' + branch + '/' + date + '/' + 'routes' + '/' + id + '/' + 'stops'))           
        },
        getRoutesBy: function (branch, date, id) {
            return $firebase(new Firebase(ref + '/' + branch + '/' + date + '/' + 'routes' + '/' + id + '/'))
        }
    }
});

registrationModule.factory('Location', function ($firebase) {
    var ref = new Firebase('https://shining-fire-870.firebaseio.com/artists/artist1/albums/album1/');
    return {
        getLocation: function (id) {
            return $firebase(new Firebase(ref + '/' + id));
        }
    }
});

registrationModule.factory('Branches', function ($firebase) {
    var ref = new Firebase('https://branchdashboard.firebaseio.com/Branches');
    return {
        getBranches: function () {
            return $firebase(ref);
        }
    }
});

registrationModule.factory('weatherService', function ($http) {
    return {
        getWeather: function (branch) {
            var weather = { temp: {}, clouds: null };
            $http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+ branch +',at&units=metric&callback=JSON_CALLBACK').success(function (data) {
                if (data) {
                    if (data.main) {
                        weather.temp.current = data.main.temp;
                        weather.temp.min = data.main.temp_min;
                        weather.temp.max = data.main.temp_max;
                    }
                    weather.clouds = data.clouds ? data.clouds.all : undefined;
                }
            });

            return weather;
        }
    };
});
