(function() {
	var app = angular.module("personsViewer", []);

	var MainController = function($scope, $http, $log, $interval) {

		var onPersonComplete = function(response) {
			console.log(response);
			$scope.data = response.data;
		}

		var onSummaryComplete = function(response) {
			$scope.summaryData = response.data;
		}

		var onEventsComplete = function(response) {
			console.log(response);
			$scope.eventData = response.data;
		}

		var onError = function(reason) {
			console.log(reason);
			$scope.error = reason;
		}

		var url = "http://" + Config.hostserver + ":" + Config.hostport + "/summary/?callback=JSON_CALLBACK"


		var getSummary = function() {
			$http.jsonp(url)
				 .then(onSummaryComplete, onError);
		}

		var summaryInterval = null;

		summaryInterval = setInterval(getSummary, 1000);

		getSummary();


		var lastEventId = 0;
		var limitAmount = 20;

		var urlEvents = "http://" + Config.hostserver + ":" + Config.hostport + "/events/" + lastEventId + "/" + limitAmount + "?callback=JSON_CALLBACK"

		$http.jsonp(urlEvents)
			 .then(onEventsComplete, onError);
	}

	app.controller("MainController", ["$scope", "$http", "$interval", MainController]);

}());


$(function() {

	var loadEvents = setInterval(getEvents, 10000);

	$(".main-center-data").on("click", "#eventsTable tr", function() {
		getEventDetails($(this).data("id"));
	});

});



function getEvents() {

		var limitAmount = 20;
		var lastEventId = $("#lastEventId").val();

		if(!lastEventId) {
			lastEventId = 0;
		}

		$.ajax({
            dataType: 'jsonp',
            //data: data,
            type: "GET",
            //jsonp: 'jsonp_callback',
            url: "http://" + Config.hostserver + ":" + Config.hostport + "/events/" + lastEventId + "/" + limitAmount,
            success: function (res) {
               // console.log(res.text);
                loadEvents(res);
            },
            error: function( xhr, status, errorThrown ) {
                //alert( "Sorry, there was a problem!" );
                console.log( "Error: " + errorThrown );
               //console.log( "Status: " + status );
                //console.dir( xhr );
            } 

        });
}

function loadEvents(events) {

	if(events[0]) {
		$("#lastEventId").val(events[0]._id);
	}

	$.each(events, function(index, event) {
		var found = false;

		$.each($('#eventsTable tr:lt(20)'), function(index, rows) {
			if($(this).data("id") === event._id) {
				found = true;
			} 
		});

		if(!found)
		{
			//console.log(event);
			setTimeout(function() {
				$("#eventsTable").prepend(
					"<tr data-id='" + event._id +"'><td>" + moment(event.eventDate).format("MMM D, YYYY") + "</td>" +
					"<td>" + event.eventInfo + "</td></tr>"
				);
			}, 500 * index);			
		}
 
	});
}

function getEventDetails(eventId) {
		$.ajax({
            dataType: 'jsonp',
            //data: data,
            type: "GET",
            //jsonp: 'jsonp_callback',
            url: "http://" + Config.hostserver + ":" + Config.hostport + "/events/details/" + eventId,
            success: function (res) {
               // console.log(res.text);
                loadEventDetails(res);
            },
            error: function( xhr, status, errorThrown ) {
                //alert( "Sorry, there was a problem!" );
                console.log( "Error: " + errorThrown );
               //console.log( "Status: " + status );
                //console.dir( xhr );
            } 
        });
}

function loadEventDetails(eventDetails) {
	console.log(eventDetails);

	// #main-right
	$('.main-right-details').html("");


	eventDetails.persons.forEach(function(eventPerson) {
		var details;

		details = "<div class='main-right-details-box'>" +
				  	"<div><label>Name:</label> " + eventPerson.firstName + " " + eventPerson.lastName + "</div>" +
		          	"<div><label>Birth Date:</label> " + moment(eventPerson.dateOfBirth).format("MMM D, YYYY") + "</div>" +
		          	"<div><label>Eye Color:</label> " + eventPerson.genome.genes.eyes.color + "</div>"
		          "</div>";


		$('.main-right-details').append(details);
	});
}