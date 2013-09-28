

$(function() {
	
	Engine.init();


	$('#button-area').on('click', '#btnAddWood', function() {
			Engine.addItems("wood", 5);

	});

	$('#button-area').on('click', '#btnHuntFood', function() {
			Engine.addItems("food", 5);
			//alert("Hunting");
	});


	$('#button-area').on('click', '#btnBuildWoodShack', function() {
			Engine.addBuilding("woodshack", 1);
			//alert("Hunting");
	});

	$('#button-area').on('click', '#btnBuildMiningCamp', function() {
			Engine.addBuilding("miningCamp", 1);
			//alert("Hunting");
	});

	$('#button-area').on('click', '#btnMineRock', function() {
			Engine.addItems("rock", 1);
			//alert("Hunting");
	});
});