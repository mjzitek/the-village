(function() {
	var app = angular.module("personsViewer", []);

	var MainController = function($scope, $http, $log) {

		var onPersonComplete = function(response) {
			console.log(response);
			$scope.data = response.data;
		}

		var onSummaryComplete = function(response) {
			$scope.summaryData = response.data;
		}

		var onError = function(reason) {
			$scope.error = reason;
		}

		var url = "http://localhost:8989/summary/?callback=JSON_CALLBACK"

		$http.jsonp(url)
			 .then(onSummaryComplete, onError);

		$scope.message = "Hello";

	}



	app.controller("MainController", ["$scope", "$http", MainController]);

}());