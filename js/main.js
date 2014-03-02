

$(function() {
	
	Engine.init();


	$('#button-area').on('click', '#btnAddWood', function() {
			Engine.chopWood();

	});

	$('#button-area').on('click', '#btnHuntFood', function() {
			Engine.addItems("food", 5);

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
});