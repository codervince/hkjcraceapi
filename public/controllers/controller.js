var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    //console.log("Hello World from controller");

    var refresh = function(){
    	$http.get('/horselist').success(function(response){
            //console.log(response);
            $scope.horses = response;

    	});
    };

	refresh();
}]);