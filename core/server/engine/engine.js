var App = {
	intervalTime: 30,
	castIntervalTime: 10,
	refreshIntervalId: null
};


var Engine = {

	init: function() {
		Engine.setInitialInventory();
		//alert("foobar");

		Engine.setAutoInterval();

		// Send data to cast
		var castInterval = setInterval(function() {
			Engine.sendDataToCast();
		}, App.castIntervalTime * 1000);
		
		

		Buttons.DisplayButtons(1);
	},

	setAutoInterval: function () {
		clearInterval(App.refreshIntervalId);

		App.refreshIntervalId = setInterval(function() {
			Engine.automatedWorkers();
			Engine.outputInventory(Inventory);
			Engine.outputBuildings();
			Engine.checkButtons();
			//console.log("add wood");
			
		}, App.intervalTime * 1000);
	},

	sendDataToCast: function() {
  		var input = {};
  		input.wood = Inventory["wood"];
  		input.food = Inventory["food"];
  		input.stone  = Inventory["stone"];

  		console.log(input);

		update(input);
	},

	setInitialInventory: function()
	{

		Engine.outputInventory(Inventory);
	},

	sendNotification: function(notificationMsg) {
		console.log("Notification: " + notificationMsg);
		$('#notifications').html(notificationMsg);

		//update(notificationMsg);
	},

	addItems: function(key, amount)
	{
		
		preValue = Inventory[key];
		//console.log('Previous '+key+': ' + preValue);

		Inventory[key] = preValue + amount;

		if(key == "food")
		{
			var leatherAmt = Math.floor((Math.random()*3));


			Inventory["leather"] = Inventory["leather"] + leatherAmt
		}


		Engine.outputInventory(Inventory);
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
			Engine.outputInventory(Inventory);
			Engine.checkButtons();
		} else {
			alert("Not enough "  + costItem[0]);
		}
	},


	outputInventory: function(inventory)
	{
		var output = "";

		for(var key in inventory) {
			output += key + ": " + inventory[key] + "<br />";

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
	},

	automatedWorkers: function() {

		// wood
		if(Buildings.Items.woodshack.cnt > 0)
		{
			Engine.chopWood();
		}

		// food

		// mining
		if(Buildings.Items.miningCamp.cnt > 0)
		{
			Engine.goMining();
		}


	},

	goMining: function() {
		if(this.eatFood('food'))
		{
			var mining = new Mining(Ores);
			var minedAmount = 1;
			var numOfMiningCamps = Buildings.Items.miningCamp.cnt;

			var itemMined = mining.GetMinedItem();	

			minedAmount = minedAmount * numOfMiningCamps;

			console.log('Mined: ' + itemMined);
			Engine.addItems(itemMined, minedAmount);
		} else {
			//alert('No Food');
			console.log('** No Food **');
		} 
	},

	chopWood: function() {
		if(this.eatFood('food'))
		{
			var numOfWoodShacks = Buildings.Items.woodshack.cnt;
			var woodChopped = 0;

			if(numOfWoodShacks == 0) {
				woodChopped = 5;
			} else {
				woodChopped = 5 * (numOfWoodShacks + 1);
			}
			console.log('Chopped: ' + woodChopped);
			Engine.addItems('wood', woodChopped);
		} else {
			//alert('No Food');
			console.log('** No Food **');
		} 
	},

	goHunting: function() {
		var food = 'food';
		var foodAmount = 5;

		console.log('Hunted: ' + food);
		Engine.addItems(food, foodAmount);


	},

	eatFood: function (foodType) {
		var preValue = Inventory[foodType];
		var eatenAmount = 1;

		if(preValue > 0)
		{
			Inventory[foodType] = preValue - eatenAmount;		
			return true;
		} else {
			return false;
		}


	}




};