(function() {
	var app = angular.module("personsViewer", []);

	var MainController = function($scope, $http, $log, $interval) {

		var onPersonComplete = function(response) {
			console.log(response);
			$scope.data = response.data;
		}

		var onSummaryComplete = function(response) {
			console.log(response);
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

		summaryInterval = setInterval(getSummary, 10000);

		getSummary();


		var lastEventId = 0;
		var limitAmount = 20;

		var urlEvents = "http://" + Config.hostserver + ":" + Config.hostport + "/events/" + lastEventId + "/" + limitAmount + "?callback=JSON_CALLBACK"

		// $http.jsonp(urlEvents)
		// 	 .then(onEventsComplete, onError);
	}

	app.controller("MainController", ["$scope", "$http", "$interval", MainController]);

}());


$(function() {

	getEvents();

	var loadEvents = setInterval(getEvents, 10000);

	$(".main-center").on("click", ".event-line", function() {
		getEventDetails($(this).data("id"));
	});

	$("#singles-expand-btn").click(showSinglesExpanded);

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
	console.log(events);

	if(events[0]) {
		$("#lastEventId").val(events[events.length-1]._id);
	}

	$.each(events, function(index, event) {
		var found = false;
		var eventIcon = "";

		$.each($('#eventsTable tr:lt(20)'), function(index, rows) {
			if($(this).data("id") === event._id) {
				found = true;
			} 
		});

		if(!found)
		{
			//console.log(event);
			if(event.eventType === "marriage") {
				eventIcon = "fa-heart";
			} else if (event.eventType === "birth") {
				eventIcon = "fa-child";
			}

			setTimeout(function() {
				$(".main-center-data").append(
					"<div class='event-line' data-id='" + event._id +"'><span class='event-date'>" + moment(event.eventDate).format("MMM D, YYYY") + "</span>" +
					"<span class='event-icon fa " + eventIcon + "'></span><span class='event-text'>" + event.eventInfo + "</span></div>"
				);
				$(".main-center").animate({ scrollTop: $(".main-center-data")[0].scrollHeight}, 500);
			}, 400 * index);			
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

		details = "<div class='main-right-details-section'><div class='main-right-details-section-person'>" +
				  	"<div><label>Name:</label> " + eventPerson.firstName + " " + eventPerson.lastName + "</div>" +
		          	"<div><label>Birth Date:</label> " + moment(eventPerson.dateOfBirth).format("MMM D, YYYY") + "</div>" +
		          	"<div><label>Eye Color:</label> " + eventPerson.genome.genes.eyes.color + "</div>"
		          "</div></div>";


		$('.main-right-details').append(details);
	});
}

function showSinglesExpanded() {

	if($("#singles-expand-btn").hasClass("fa-plus-square")) {
		$("#singles-expand-btn").removeClass("fa-plus-square");
		$("#singles-expand-btn").addClass("fa-minus-square");

		$("#singles-expanded").show();
	} else {
		$("#singles-expand-btn").addClass("fa-plus-square");
		$("#singles-expand-btn").removeClass("fa-minus-square");	
		$("#singles-expanded").hide();	
	}
}


