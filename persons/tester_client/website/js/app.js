 $(function() {
 	//$('input:radio[name="filter-rows"]').val('showall').prop('checked',true);
    refreshPage();

    Engine.setAutoInterval();

 	$('input:radio[name="filter-rows"]').change(function() {
 		
		
		if ($(this).is(':checked') && $(this).val() == 'filter') {
 			$('#personlist tbody tr').each(function (i, row) {
 				if(!$(row).hasClass('selected'))
 				{
	 					$(row).hide();
	 			}
	 		});
	 	} else {
	 		$('#personlist tbody tr').show();
	 	}
 	});

    $('#filter-rows').click(function() {
        $('#personlist tbody tr').each(function (i, row) {
            if(!$(row).hasClass('selected'))
            {
                    $(row).hide();
            }
        });
    });

    $('#filter-show-all-rows').click(function() {
        $('#personlist tbody tr').show();        
    });

    $('#filter-show-men').click(function() {
        $('#personlist tbody tr').show();

        $('#personlist tbody tr').each(function (i) {
            
            if($('tr:nth-child('+(i+1)+')>td:nth-child(4)').html() == "F")
            {
                    $('tr:nth-child('+(i+1)+')').hide();
            }
        });
    });

    $('#filter-show-women').click(function() {
        $('#personlist tbody tr').show();

        $('#personlist tbody tr').each(function (i) {

            if($('#personlist tbody tr:nth-child('+(i+1)+')>td:nth-child(4)').html() == "M")
            {
                    $('#personlist tbody tr:nth-child('+(i+1)+')').hide();
            }
        });
    });



    $('#header-1').click(function() {
        refreshPage();
    });


 	$('#persons-listing').on('click','.details', function() {
        App.selectedRow = this;
        var data = $(this).data("key");
        getDetails(data);
        App.offset = $(this).offset();
    });


    $('.navbar-nav li a').click(function() {
        var that = this;
        $('.navbar-nav li').each(function (index) {
            $(this).children("a").removeClass("selected");
        });

        $(that).addClass("selected");

    });


    $('.details-section-info').on("mouseenter ", ".details-info", 
        function() {
            //alert("alert");
            $( this ).append("<span class='details-extra-search fa fa-search-plus'></span>");
          }
    );
// 
    $('.details-section-info').on("mouseleave ", ".details-info", 
        function() {
           $( this ).find( "span:last" ).remove();
        }
    );

    $('.details-section-info').on("click", ".details-info",
        function() {
            var id = $(this).data("personid");
            getDetails(id);
        }

    );

    // Go to family tree details
    $('#details-part1').on("click", "#details-family-tree",
        function() {
            console.log('tree clicked');
            getGraphData($(this).data("personid"));

            $('#basic-modal-content').modal();

        }
    );

 });

function getGraphData(id)
{

        $.ajax({
            dataType: 'jsonp',
            //data: data,
            type: "GET",
            //jsonp: 'jsonp_callback',
            url: 'http://' + Config.hostserver +  ':8989/graphdata/' + id,
            success: function (res) {
                console.log(res);
                loadGraph(res);
            },
            error: function( xhr, status, errorThrown ) {
                alert( "Sorry, there was a problem!" );
                console.log( "Error: " + errorThrown );
                console.log( "Status: " + status );
                console.dir( xhr );
            } 

        });


}

 function getDetails(personId) {
    $('#details').show(); 
        $('#details-part1').html("");
        $('#details-part2').html("");
        $('#details-part3').html("");
        /* $('#details-part4').html(""); */

        $('#personlist tbody tr').show();
        //$('input:radio[name="filter-rows"]').val('showall').prop('checked',true);

        var data = personId;

        var gameClock = $("#game-clock").html();

        if(gameClock === "") { gameClock = "Jan 1, 2000"; }


        $.ajax({
            dataType: 'jsonp',
            //data: data,
            type: "GET",
            //jsonp: 'jsonp_callback',
            url: 'http://' + Config.hostserver +  ':8989/details/' + data,
            success: function (res) {
                //console.log( response );

                var output = "";

                var bd =  moment(res.dateOfBirth);

                //response.forEach(function(p) {
                    output = 
                        "<div id='details-family-tree' data-personid='" + res._id + "'><span class='fa fa-tree'></span></div>" +
                        "<div><label>Name:</label> " + res.firstName + " " + (res.middleName == null ? "" : res.middleName) + " " + res.lastName + "</div>" +
                        "<div><label>Birthdate:</label> " + bd.format("MMM D, YYYY") + 
                            " (" + (res.dateOfDeath == null ? getDifference(gameClock, bd).years : getDifference(res.dateOfDeath, bd).years )  +
                            (res.dateOfDeath != null ? " - Deceased" : "")
                            +")<div>" +
                        "<div><label>Married:</label> " + (res.attributes.married == true ? "Yes" : "No") + "</div>";

                    
                        //console.log("Married: " + res.attributes.married);
                        
                        getSpouse(res._id, res.gender); 
                        getChildren(res._id, res.gender);
                        getSiblings(res._id);
                        getParents(res);
                


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
            $(row).removeClass('selected');
            $(row).removeClass('sel-person');
            $(row).removeClass('sel-person-spouse');
            $(row).removeClass('sel-person-children');
            $(row).removeClass('sel-person-siblings');
            $(row).removeClass('sel-person-parents');            

            var rdata = $(row).find('td:first-child').find('.details').data('key');
            
            if(rdata == data) {
                console.log("Selected: " + rdata);
                $(row).addClass('sel-person');
                $(row).addClass('selected');
            }
        });

 }

 function getPeople() {
    $.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://' + Config.hostserver +  ':8989',
        success: function (response) {
        	console.log( response );

        	var output = "";
            var gameClock = $("#game-clock").html();

            if(gameClock === "") { gameClock = "Jan 1, 2000"; }
            var total = 0;

        	response.forEach(function(p) {
                total++;
        		var bd =  moment(p.dateOfBirth);
                var alive = (p.dateOfDeath === null ? true : false);


        		output += "<tr class='" + (alive === false ? "per-dead" : "") + "'><td class='details-td'><span class='details ' data-key='" + p._id + "'><i class='get-details fa fa-search-plus'></i></span>" 
        		+"<td>" + p.firstName + "</td><td>" + p.lastName + "</td><td style='width: 55px; text-align: center'>" + p.gender 
                + "</td><td style='width: 150px'>" + bd.format("MMM D, YYYY") + "</td>"
                + "<td style='text-align: center; width: 55px'>" + (p.dateOfDeath == null ? getDifference(gameClock, bd).years : getDifference(p.dateOfDeath, bd).years )  + "</td>"
                + "<td style='width: 55px; text-align: center'>" + (p.dateOfDeath == null ? "Yes" : "")
                + "</td><td style='width: 70px; text-align: center'>" + (p.attributes.married == true ? "Yes" : "") + "</td></tr>";
        	});

        	output = "<table id='personlist'><thead><tr><th></th><th>First Name</th><th>Last Name</th><th >Gender</th>" +
        			 "<th >Birth Date</th><th>Age</th><th>Alive</th><th>Married</th>" +
        			 "</tr></thead><tbody>" + output + "</tbody></table>";

            $('#summary-total').html(total);
            $("#persons-listing").html(output);
        },
    	error: function( xhr, status, errorThrown ) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	} 

    });




 }

function getSpouse(personId, gender) {
	$.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://' + Config.hostserver +  ':8989/relationships/' + personId + "/" + gender,
        success: function (res) {
        	console.log( res );

            var output = "";

            output = "<label>Spouse:</label> "

            if(res)
            {
                output += "<span  class='details-info' data-personid='" + res._id + "'>" + res.firstName + " " + res.lastName + " </span>";



                var rdata = null;

                $('#personlist tbody tr').each(function (i, row) {

                    rdata = $(row).find('td:first-child').find('.details').data('key');
                
                    if(rdata == res._id) {
                        console.log(rdata + " => " + res._id);
                        $(row).addClass('sel-person-spouse');
                        $(row).addClass('selected');
                    }
                });
            }

            $("#details-part2").html(output);


        },
    	error: function( xhr, status, errorThrown ) {
        	alert( "Sorry, there was a problem!" );
        	console.log( "Error: " + errorThrown );
        	console.log( "Status: " + status );
        	console.dir( xhr );
    	} 

    });
}

function getChildren(personId, gender) {
	// /details/children
	$.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://' + Config.hostserver +  ':8989/details/children/' + personId + "/" + gender,
        success: function (res) {
        	console.log( res );

        	var output = "<div><label>Children:</label> </div><ul>";

        	res.forEach(function(c) {
        		output += "<li class='details-info' data-personid='" + c._id + "'>" + c.firstName + " " + c.lastName + " </li>";

        		var rdata = null;

        		$('#personlist tbody tr').each(function (i, row) {

 					rdata = $(row).find('td:first-child').find('.details').data('key');
 			
 					if(rdata == c._id) {
 						console.log(rdata + " => " + c._id);
 						$(row).addClass('sel-person-children');
 						$(row).addClass('selected');
 					}

 				});
        	});

            output += "</ul>";

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

function getSiblings(personId) {
    // /siblings/sameparents/:id

        $.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://' + Config.hostserver +  ':8989/siblings/sameparents/' + personId,
        success: function (res) {
            console.log( res );

            var output = "<div><label>Siblings:</label> </div><ul>";

            res.forEach(function(c) {
                if(c.fatherInfo != null)
                {
                    if(c._id != personId)
                    {
                        output += "<li  class='details-info' data-personid='" + c._id + "'> " + c.firstName + " " + c.lastName + "</li>";
                    }
                    var rdata = null;

                    $('#personlist tbody tr').each(function (i, row) {

                        rdata = $(row).find('td:first-child').find('.details').data('key');
                
                        if(rdata == c._id) {
                            console.log(rdata + " => " + c._id);
                            if(rdata != personId)
                            {
                                $(row).addClass('sel-person-siblings');
                                $(row).addClass('selected');
                            }
                        }

                    });
                }
            });

            output += "</ul>"

            $("#details-part4").html(output);

        },
        error: function( xhr, status, errorThrown ) {
            alert( "Sorry, there was a problem!" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.dir( xhr );
        } 

    });
}


function getParents(person) {
        $('#personlist tbody tr').each(function (i, row)  {         

            var rdata = $(row).find('td:first-child').find('.details').data('key');
            
            if(rdata === person.fatherInfo || rdata === person.motherInfo) {
                console.log(rdata);
                $(row).addClass('sel-person-parents');
                $(row).addClass('selected');
            }
        });



        $.ajax({
            dataType: 'jsonp',
            data: '',
            type: "GET",
            //jsonp: 'jsonp_callback',
            url: 'http://' + Config.hostserver +  ':8989/parents/' + person._id,
            success: function (res) {
                console.log( res );


                var output = "<div><label>Parents:</label> </div><ul>";

                if(res.fatherInfo) output += "<li  data-personid='" + res.fatherInfo._id + "' class='details-info'> " + res.fatherInfo.firstName + " " + res.fatherInfo.lastName + "</li> ";
                if(res.motherInfo) output += "<li  data-personid='" + res.motherInfo._id + "' class='details-info'> " + res.motherInfo.firstName + " " + res.motherInfo.lastName + "</li> ";

                // res.forEach(function(c) {
                //         output += "<li> " + c.firstName + " " + c.lastName + "</li>";
                // });
                 output += "</ul>"
                $("#details-part5").html(output);
            }
        });






        

}

function getGameClock() {
    // var endTime = "Jan 1, 2100"
    $.ajax({
        dataType: 'jsonp',
        data: '',
        type: "GET",
        //jsonp: 'jsonp_callback',
        url: 'http://' + Config.hostserver +  ':8989/gameclock/',
        success: function (res) {
            console.log( res );

            var gc = moment(res.setvalue);
            console.log(gc);
            $("#game-clock").html(gc.format("MMM D, YYYY"));

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


function filterSelected() {


}




function refreshPage() {
    getGameClock();
    getPeople();
    if(App.selectedRow != null) {
        getDetails(App.selectedRow);
        $(App.selectedRow).addClass('sel-person');
        $(App.selectedRow).addClass('selected');
    }
}


var App = {
    intervalTime: 12,
    refreshIntervalId: null,
    selectedRow: null,
    offset: null
};



var Engine = {
    setAutoInterval: function () {
        clearInterval(App.refreshIntervalId);

        App.refreshIntervalId = setInterval(function() {
            if($('#refresh').hasClass('selected')) {
                refreshPage();
                console.log('refresh');
            }
        }, App.intervalTime * 1000);
    },
    clearAutoInterval: function() {
        clearInterval(App.refreshIntervalId);
    }

}