(function() {
	var app = angular.module("personsViewer", []);

	var MainController = function($scope, $http, $log) {

		var onPersonComplete = function(response) {
			console.log(response);
			$scope.data = response.data;
		}

		var onError = function(reason) {
			$scope.error = reason;
		}

		var url = "http://localhost:8989/details/53a1db468073b19a23d4c9b1?callback=JSON_CALLBACK"

		$http.jsonp(url)
			 .then(onPersonComplete, onError);

		$scope.message = "Hello";

	}



	app.controller("MainController", ["$scope", "$http", MainController]);

}());