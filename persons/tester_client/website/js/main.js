(function() {
	var app = angular.module("personsViewer", []);

	var MainController = function($scope, $http, $log, $interval) {

		var onPersonComplete = function(response) {
			//console.log(response);
			$scope.data = response.data;
		}

		var onSummaryComplete = function(response) {
			//console.log(response);
			$scope.summaryData = response.data;
		}

		var onEventsComplete = function(response) {
			//console.log(response);
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
	$("#eyecolors-expand-btn").click(showEyesExpanded);

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
	//console.log(events);

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
	//console.log(eventDetails);

	// #main-right
	$('.main-right-details').html("");


	eventDetails.persons.forEach(function(eventPerson) {
		var details;

		var bd =  moment(eventPerson.dateOfBirth);

		var gameClock = $(".main-left-section-date").html();

		// Blue: 1a66ae
		// Brown: 2c1608
		// Green: 468017

		var eyeColor;

		switch(eventPerson.genome.genes.eyes.color) {
			case "blue":
				eyeColor = '#1a66ae';
				break;
			case "brown":
				eyeColor = '#2c1608';
				break;
			case "green":
				eyeColor = '#468017';
				break;
		}


		details = "<div class='main-right-details-section'><div class='main-right-details-section-person'>" +
				  	"<div><label>Name:</label> " + eventPerson.firstName + " " + eventPerson.lastName + "</div>" +
		          	"<div><label>Birth Date:</label> " + bd.format("MMM D, YYYY") + 
                      " (" + (eventPerson.dateOfDeath == null ? getDifference(gameClock, bd).years : getDifference(eventPerson.dateOfDeath, bd).years ) +
                      ")" +
                      (eventPerson.dateOfDeath != null ? " - Deceased" : "") +
                    "</div>" +
		          	"<div><label>Eye Color:</label> " + 		          		
		          		"<span class='skin-color-box' style='background-color: " + eyeColor + "'></span>" +
		          	"</div>" +
		          	"<div><label>Skin Color:</label>" + 
		          		"<span class='skin-color-box' style='background-color: rgb(" +
		          												eventPerson.genome.genes.skin.color.R + ", " +
		          												eventPerson.genome.genes.skin.color.G + ", " +
		          												eventPerson.genome.genes.skin.color.B + ")'" +
		          		"></span>" +
		            "</div>" +
		          	"<div><label>Hair Color:</label>" + 
		          		"<span class='skin-color-box' style='background-color: rgb(" +
		          												eventPerson.genome.genes.hair.color.R + ", " +
		          												eventPerson.genome.genes.hair.color.G + ", " +
		          												eventPerson.genome.genes.hair.color.B + ")'" +
		          		"></span>" +
		            "</div>" +		            
		          "</div>";


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

function showEyesExpanded() {

	if($("#eyecolors-expand-btn").hasClass("fa-plus-square")) {
		$("#eyecolors-expand-btn").removeClass("fa-plus-square");
		$("#eyecolors-expand-btn").addClass("fa-minus-square");

		$("#eyecolors-expanded").show();
	} else {
		$("#eyecolors-expand-btn").addClass("fa-plus-square");
		$("#eyecolors-expand-btn").removeClass("fa-minus-square");	
		$("#eyecolors-expanded").hide();	
	}
}

function getDifference(olderDate, newerDate) {

	var then = moment(olderDate);
	var to = moment(newerDate);

	//console.log('Then: ' + then);

	var timeDiff = {};

    // get the difference from now to then in ms
    ms = then.diff(to, 'milliseconds', true);

    //console.log('ms: ' + ms);

    // Years
    timeDiff.years = Math.floor(moment.duration(ms).asYears());
    then = then.subtract('years', timeDiff.years);

    ms = then.diff(to, 'milliseconds', true);

    // Months
    timeDiff.months = Math.floor(moment.duration(ms).asMonths());
    then = then.subtract('months', timeDiff.months).subtract('days', 1);

    ms = then.diff(to, 'milliseconds', true);

    // Days
    timeDiff.days = Math.floor(moment.duration(ms).asDays());
    then = then.subtract('days', timeDiff.days);


    ms = then.diff(to, 'milliseconds', true);

    // Hours
    timeDiff.hours = Math.floor(moment.duration(ms).asHours());
    then = then.subtract('hours', timeDiff.hours);


    ms = then.diff(to, 'milliseconds', true);

    // Minutes
    timeDiff.minutes = Math.floor(moment.duration(ms).asMinutes());
    then = then.subtract('minutes', timeDiff.minutes);

    ms = then.diff(to, 'milliseconds', true);
    timeDiff.seconds = Math.floor(moment.duration(ms).asSeconds());

    return timeDiff;

  }