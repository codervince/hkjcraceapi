// var myApp = angular.module('myApp', ['ngRoute']);
// myApp.config(function($routeProvider) {
//     $routeProvider
//         .when("/", {
//             templateUrl  : "../templates/start/index.html"
//         })
//         .when("/part_two", {
//             templateUrl  : "../templates/new/index.html"
//         })
//         .otherwise({
//             templateUrl  : "../templates/start/index.html"
//         });
// });
// myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
//     //console.log("Hello World from controller");
//     var refresh = function(){
//     	$http.get('/horselist').success(function(response){
//             //console.log(response);
//             $scope.horses = response;

//         });
//     };
// 	refresh();

//     $scope.findTable = function () {
//         $scope.newLoding = true;
//         $( "#download-json" ).empty();
//         var res = $scope.url_address.substring( $scope.url_address.length - 13);
//         var replace =  res.replace(/\//g , "_");
//         //console.log(res,replace);
//         var data = {
//             url: $scope.url_address
//         };
//         $http.post('/newrequest', data).success(function (res) {
//             //console.log(res);
//             if(res){
//                 $scope.newLoding = false;
//                 $scope.newHorses = res;
//                 var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.newHorses));
//                 $('<a href="data:' + data + '" download="'+replace+'.json">download JSON</a>').appendTo('#download-json');
//             }
//         })
//     }
// }]);

var myApp = angular.module('myApp', ['ngRoute']);
myApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "../templates/start/index.html"
        })
        .when("/part_two", {
            templateUrl: "../templates/new/index.html"
        })
        .otherwise({
            templateUrl: "../templates/start/index.html"
        });
});
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Hello World from controller");
    var refresh = function() {
        $http.get('/horselist').success(function(response) {
            //console.log(response);
            $scope.horses = response;

        });
    };
    refresh();

    $scope.findTable = function() {
        $scope.newLoding = true;
        $("#download-json").empty();
        var res = $scope.url_address.substring($scope.url_address.length - 13);
        var replace = res.replace(/\//g, "_");
        //console.log(res,replace);
        var data = {
            url: $scope.url_address
        };
        $http.post('/newrequest', data).success(function(res) {
            //console.log(res);
            if (res) {
                $scope.newLoding = false;
                $scope.newHorses = res;
                var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify($scope.newHorses));
                $('<a href="data:' + data + '" download="' + replace + '.json">download JSON</a>').appendTo('#download-json');
            }
        })
    }
}]);