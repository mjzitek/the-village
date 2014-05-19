
$(function() {

	$('#button-area').on('click', '#btnBuildWoodShack', function() {
			$.post("/buildings/build/" + $("#village-id").val() + "/woodshack", function(data) {
				showMessage(data);
			});

			buttonTimer(this);


	});

	$('#button-area').on('click', '#btnBuildWoodCamp', function() {
			$.post("/buildings/build/" + $("#village-id").val() + "/woodcamp", function(data) {
				showMessage(data);
			});

		buttonTimer(this);	
	});

	$('#button-area').on('click', '#btnBuildHuntingCamp', function() {
			$.post("/buildings/build/" + $("#village-id").val() + "/huntingcamp", function(data) {
				showMessage(data);
			});

		buttonTimer(this);	
	});

	$('#button-area').on('click', '#btnBuildMiningCamp', function() {
			$.post("/buildings/build/" + $("#village-id").val() + "/miningcamp", function(data) {
				showMessage(data);
			});

		buttonTimer(this);
	});

			

});

function buttonTimer(btn) {
	$(btn).prop('disabled', true);
	console.log("button disabled");			
	

	setTimeout(function() { 
		$(btn).prop('disabled', false);
		console.log("button enabled"); 
	}, 60000);
}

function showMessage(data) {


	var message = null;
	var time = moment().format('MMMM Do YYYY, h:mm:ss a');

	message = data.message;

	if(data.messageType == "Error") message = message.red;
	$("#message-area-messages").prepend("<div>" + time + " - " + message + "</div>");

}