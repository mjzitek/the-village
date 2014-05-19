// var mongoose = require('mongoose'),
// 	Building = mongoose.model('buildings'),
// 	Item = mongoose.model('items'),
// 	Inventory = mongoose.model('playeritems'),
// 	Requirement = mongoose.model('requirements');

var mongoose = require('mongoose');
var colors = require('colors');
var fs = require('fs');

var config = require('./config/config');

var logging = require('./config/logger');
var debuglogger = logging.Logging().get('debug');
var datalogger = logging.Logging().get('data');
var dblogger = logging.Logging().get('db');

///////////////////////
// DB Set up


//var mongoose = require("./core/server/models/db");
var db = mongoose.connect(config.db);

var models_path = __dirname + '/models';

var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()) {
			if(/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath);
			}
		} else if (stat.isDirectory) {
			walk(newPath);
		}
	});
}

walk(models_path);


var items = require('./controllers/items');
var inventory = require('./controllers/inventory');
var buildings = require('./controllers/buildings');
var users = require('./controllers/users');
var villages = require('./controllers/villages');


/////////////////////////////////

var App = {
	intervalTime: 10,
	models: null

};


function Engine() {

}


Engine.prototype.init = function() {
	console.log('Engine started...');
	that = this;
	//this.models = models;
	that.setAutoInterval();
	//console.log(models);
}

Engine.prototype.setAutoInterval = function() {
		that = this;

		//clearInterval(App.refreshIntervalId);
		that.automatedWorkers(that.models);
		App.refreshIntervalId = setInterval(function() {
			that.automatedWorkers(that.models);
			//console.log("Engine tick");
		}, App.intervalTime * 1000);
} 

Engine.prototype.automatedWorkers = function(models) {

	var that = this;

	villages.getVillages(function (vills){
		//console.log(users);

		vills.forEach(function(v) {
			console.log(v);			
			
			checkPopulation(v);

			var totalPopulation = v.population.total;
			var hunters = 1;
			var loggers = 1;
			var miners = 1;

			if(totalPopulation > 1 ) {
				// Divide up population
				hunters = Math.floor(totalPopulation * .6);
				loggers = Math.floor(totalPopulation * .2);
				miners = Math.floor(totalPopulation * .2);

			}

			console.log("Total Pop: " + totalPopulation + " | H: " + hunters + " | L: " + loggers + " | M: " + miners);

			updateWood(v._id, loggers);
			updateFood(v._id, hunters);
			updateMining(v._id, miners);

			var foodBias = 0;
			var randomFood = 1;

			if(totalPopulation == 1) {
				foodBias = 1;
			} else {
				var rand1 = Math.floor((Math.random()*19)+1)
				if(rand1 < 6) { // 0 - 5
					randomFood = 1; 
				} else if (rand1 >=6 && rand1 < 11)  { // 6, 7, 8, 9, 10
					randomFood = 2;
				} else if (rand1 >=11 && rand1 < 15)  { // 11, 12, 13, 14
				    randomFood = 3;	
				} else if (rand1 >=16 && rand1 < 19)  { // 16, 17, 18
				    randomFood = 3;	
				}  else if (rand1 == 19)  { // 19
				    randomFood = 5;	
				}

				foodBias = totalPopulation * 0.8 * randomFood;
			}

			if(Math.floor((Math.random()*5)+1) == 1) {
				console.log(' ** NOM NOM NOM ** ');
				eatFood(v._id, Math.ceil(foodBias));
			}

			

		});	
	});
}
					

var engine = new Engine();



engine.init();

function updateWood(villageId, loggers) {

	//inventory.addItemToInventory(villageId, "wood", totalPopulation, function() {});

		buildings.getBuildingsForVillageByType(villageId, 'logging', function(bldgs) {

		var totalEff = 0;
		var totalToAdd = 0;
	
		if(bldgs) {
			totalEff = calcTotalBuildingsEff(bldgs);
		}

		if(totalEff == 0) totalEff = 1;
		totalToAdd = (Math.ceil(loggers) * 0.5) + Math.round((loggers/totalEff) * 0.4);
		console.log('Adding ' + totalToAdd + ' wood');
		inventory.addItemToInventory(villageId, "wood", Math.ceil(totalToAdd), function() {});
	})
}

function updateFood(villageId, hunters) {
	// Get ids of "food" buildings
	var foodBuildings = [];
	
	//bldg = this;
	
	// inventory.addItemToInventory(villageId, "food", totalPopulation, function() {});



	buildings.getBuildingsForVillageByType(villageId, 'food', function(bldgs) {

		var totalEff = 0;
		var totalToAdd = 0;
	
		if(bldgs) {
			totalEff = calcTotalBuildingsEff(bldgs);
		}

		if(totalEff == 0) totalEff = 1;
		totalToAdd = (Math.ceil(hunters) * 0.5) + Math.round((hunters/totalEff) * 0.4);
		console.log('Adding ' + totalToAdd + ' food');

		inventory.addItemToInventory(villageId, "food", Math.ceil(totalToAdd), function() {});
	})
	
}


function updateMining(villageId, miners) {
	var miningBuildings = [];

	// Get all buildings for user

	// Find out which ones are related to mining

	// Calculate "score"  (number of each type * eff)

	buildings.getBuildingsForVillageByType(villageId, 'mining', function(bldgs) {

		var totalEff = 0;
		var totalToAdd = 0;
	
		if(bldgs) {
			totalEff = calcTotalBuildingsEff(bldgs);
		}

		totalToAdd = (totalEff * miners);

		inventory.addItemToInventory(villageId, "stone", totalToAdd, function() {});
	})

}


function calcTotalBuildingsEff(bldgs) {
	var totalEff = 0;
	bldgs.forEach(function(b) {
		totalEff += (b.efficiency * b.quantity);
	});

	return totalEff;
}

function checkPopulation(village) {

	// check housing limit levels against current population
	buildings.getBuildingsForVillageByType(village._id, 'housing', function(bldgs) {
		//console.log("HOUSING FOR " + village.name +": ");
		//console.log(bldgs);

		var totalPopAllowed = 0;

		bldgs.forEach(function(b) {
			totalPopAllowed += (b.quantity * b.maxOccupants);
		});

		if(totalPopAllowed == 0) { totalPopAllowed = 1;}

		console.log("Total Population Allowed for " + village.name + ": " + totalPopAllowed);

		villages.setTotalPopulation(village.id, totalPopAllowed, function(doc) {
			console.log(doc);
		});
	});

}


function eatFood(village, amount) {
	dblogger.info('food',{village: village, quantity: amount});
	console.log("Village " + village + " ate " + amount + " of food");
	inventory.payItemFromInventory(village, '532a1f8e05e7e28a6593dd1b', amount);
}

