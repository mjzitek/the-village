
var Engine = {

	init: function() {
		Engine.setInitialInventory();
		//alert("foobar");


		setInterval(function() {
			Engine.addItems('wood',5);
			Engine.outputInventory();
			Engine.outputBuildings();
			Engine.checkButtons();
			console.log("add wood");


		}, 60 * 1000);

		Buttons.DisplayButtons();
	},

	setInitialInventory: function()
	{
		Inventory = {};


		Inventory["wood"] = 5;
		Inventory["food"] = 5;
		Inventory["leather"] = 0;
		Inventory["rock"] = 0;

		Engine.outputInventory();
	},

	addItems: function(key, amount)
	{
		
		preValue = Inventory[key];
		console.log('Previous '+key+': ' + preValue);

		Inventory[key] = preValue + amount;

		if(key == "food")
		{
			var leatherAmt = Math.floor((Math.random()*3));


			Inventory["leather"] = Inventory["leather"] + leatherAmt
		}


		Engine.outputInventory();
		Engine.outputBuildings();
		Engine.checkButtons();
	},

	addBuilding: function(key, amount)
	{

		var costItem = Buildings.Items[key].cost().split(':');


		if(Inventory[costItem[0]] >= costItem[1])
		{

			Inventory[costItem[0]] = Inventory[costItem[0]] - costItem[1];
			Buildings.Items[key].cnt = Buildings.Items[key].cnt + amount;

			//alert(costItem);

			Engine.outputBuildings();
			Engine.outputInventory();
		} else {
			alert("Not enough "  + costItem[0]);
		}
	},


	outputInventory: function()
	{
		var output = "";

		for(var key in Inventory) {
			output += key + ": " + Inventory[key] + "<br />";

		}

		$("#area-right #inventory").html(output);

	},

	outputBuildings: function()
	{
		var output = "";
		for(var key in Buildings.Items)
		{
			if(Buildings.Items[key].cnt > 0)
				output += key + ": " + Buildings.Items[key].cnt + "<br />"
		}

		$("#area-right #buildings").html(output);

	},

	checkButtons: function()
	{
			if(Inventory["wood"] >= 100)
			{
				Buttons.AllButtons.huntFood.active = 1;
				//Buttons.AddButton("huntFood");
				//alert("Wood = 100")
			}

			if(Inventory["wood"] >= 200 && Inventory["food"] >= 100)
			{
				Buttons.AllButtons.buildWoodShack.active = 1
			}


			if(Inventory["wood"] >= 200 && Inventory["food"] >= 100 && Inventory["leather"] >= 50)
			{
				Buttons.AllButtons.buildMiningCamp.active = 1
			}

			if(Buildings.Items.miningCamp.cnt > 0)
			{
				Buttons.AllButtons.mineRock.active = 1;
			}


			Buttons.DisplayButtons();
	}




};