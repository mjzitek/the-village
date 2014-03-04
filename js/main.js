

$(function() {
	
	Engine.init();

	if(querystring('d') == '1')
	{
		$('#area-debug').show();
	} else {
		$('#area-debug').hide();
	}


	$('#button-area').on('click', '#btnAddWood', function() {
			Engine.chopWood();

	});

	$('#button-area').on('click', '#btnHuntFood', function() {
			Engine.goHunting();

	});


	$('#button-area').on('click', '#btnBuildWoodShack', function() {
			Engine.addBuilding("woodshack", 1);

	});

	$('#button-area').on('click', '#btnBuildMiningCamp', function() {
			Engine.addBuilding("miningCamp", 1);

	});

	$('#button-area').on('click', '#btnMineRock', function() {
			Engine.goMining();

	});

	// debug area
	$('#area-debug').on('click', '#set-interval', function() {
			App.intervalTime = $('#debug-interval').val();
			Engine.setAutoInterval();

	});

	$('#area-debug').on('click', '#master-reset', function() {
			//Engine.init();
			location.reload();
			console.log('** RESET **');
	});
});


function querystring(key) {
   var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r=[], m;
   while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
   return r;
}