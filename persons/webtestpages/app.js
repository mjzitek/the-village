 $(function() {

 	GetPeople();


 	$('#main').on('click','.details', function() {

 		$('#details-part1').html("");
 		$('#details-part2').html("");
 		$('#details-part3').html("");

 		var data = $(this).data("key");

	    $.ajax({
	        dataType: 'jsonp',
	        //data: data,
	        type: "GET",
	        //jsonp: 'jsonp_callback',
	        url: 'http://localhost:8989/details/' + data,
	        success: function (res) {
	        	//console.log( response );

	        	var output = "";

	        	//response.forEach(function(p) {
	        		output = 
	        			"<div>First Name: " + res.firstName + "</div>" +
	        			"<div>Middle Name: " + (res.middleName == null ? "" : res.middleName) + "<div>" +
	        			"<div>Last Name: " + res.lastName + "</div>";
	        			console.log("Married: " + res.attributes.married);
	        			if(res.attributes.married == true) {
	        				var spouse = GetSpouse(res._id, res.gender);	
	        			}
	        			GetChildren(res._id, res.gender);

	        	//});

	        	$("#details-part1").html(output);
	            
	        },
	    	error: function( xhr, status, errorThrown ) {
	        	alert( "Sorry, there was a problem!" );
	        	console.log( "Error: " + errorThrown );
	        	console.log( "Status: " + status );
	        	console.dir( xhr );
	    	} 

	    });

  		// $('.authors-list tr').each(function (i, row) {
 		$('#personlist tbody tr').each(function (i, row) {
 			// var a = $('td:first', $(this).parents('tr')).text();
 			//var datakey = $('td:first .details', $(this).parents('tr')).data("key");
 			var col = $('td.data-td').parents(row);
 			console.log(col);
 			var datakey = $(col).data("key");
 			console.log(datakey);
 			$(row).addClass('sel-person');
 		});

 	})

 });


 function GetPeople() {
    $.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://localhost:8989',
        success: function (response) {
        	console.log( response );

        	var gameClock = moment("Jan 1, 1950")	

        	var output = "";

        	response.forEach(function(p) {
        		var bd =  moment(p.dateOfBirth);
        		output += "<tr><td class='details-td'><span class='details' data-key='" + p._id + "'>Details</span>" 
        		+"<td>" + p.firstName + "</td><td>" + p.lastName + "</td><td style='width: 160px'>" 
        		+ bd.format("MMM D, YYYY") + " (" + getDifference(gameClock, bd).years +")" +"</td><td>" + p.attributes.married + "</td></tr>";
        	});

        	output = "<table id='personlist'><thead><tr><th></th><th>First Name</th><th>Last Name</th><th>Birth Date</th><th>Married</th>" +
        			 "</tr></thead><tbody>" + output + "</tbody></table>";

            $("#main").html(output);
        },
    	error: function( xhr, status, errorThrown ) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	} 

    });




 }

function GetSpouse(personId, gender) {
	$.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://localhost:8989/relationships/' + personId + "/" + gender,
        success: function (res) {
        	console.log( res );

        	$("#details-part2").html("Spouse: " + res.firstName + " " + res.lastName);

        },
    	error: function( xhr, status, errorThrown ) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	} 

    });
}

function GetChildren(personId, gender) {
	// /details/children
	$.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://localhost:8989/details/children/' + personId + "/" + gender,
        success: function (res) {
        	console.log( res );

        	var output = "<div>Children:</div>";

        	res.forEach(function(c) {
        		output += "<div>- " + c.firstName + " " + c.lastName + "</div>";
        	});

        	$("#details-part3").html(output);

        },
    	error: function( xhr, status, errorThrown ) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	} 

    });
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


