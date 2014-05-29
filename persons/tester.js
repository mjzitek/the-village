 // var mongoose = require('mongoose'),
// 	Building = mongoose.model('buildings'),
// 	Item = mongoose.model('items'),
// 	Inventory = mongoose.model('playeritems'),
// 	Requirement = mongoose.model('requirements');

var mongoose = require('mongoose');
//var colors = require('colors');
var fs = require('fs');
var moment = require('moment');

var config = require('./config/config');
var tMoment = require('./helpers/time.js');

// var logging = require('./config/logger');
// var debuglogger = logging.Logging().get('debug');
// var datalogger = logging.Logging().get('data');
// var dblogger = logging.Logging().get('db');

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


// var items = require('./controllers/items');
// var inventory = require('./controllers/inventory');
// var buildings = require('./controllers/buildings');
// var users = require('./controllers/users');
// var villages = require('./controllers/villages');
var persons = require('./controllers/persons');
var families = require('./controllers/families');
var relationships = require('./controllers/relationships');
var gamesetting = require('./controllers/gamesettings');


/////////////////////////////////

var App = {
	intervalTime: 1,
	models: null,
	gameClock: moment("Jan 1, 1918")
};


function PersonsEngine() {

}


PersonsEngine.prototype.init = function() {
	console.log('Engine started...');
	that = this;
	//this.models = models;
	that.setAutoInterval();
	//console.log(models);
}

PersonsEngine.prototype.setAutoInterval = function() {
		that = this;

		//clearInterval(App.refreshIntervalId);
		that.automatedWorkers(that.models);
		App.refreshIntervalId = setInterval(function() {
			that.automatedWorkers(that.models);

			//console.log("Engine tick");
		}, App.intervalTime * 1000);
} 

PersonsEngine.prototype.automatedWorkers = function(models) {

	var that = this;

	console.log('=======================================');

	console.log("Game Clock: " + App.gameClock.format('MMM D, YYYY'));
	App.gameClock.add('M', 1);

	if(App.gameClock.format('YYYY') == "1950")
	{
		process.kill(0);
	}

	gamesetting.setValueByKey('time', App.gameClock, function() {});

	//diff = tMoment.getDifference(App.gameClock,new Date());

	//console.log('Y: ' + diff.years + ' / M: ' + diff.months + ' / D: ' + diff.days);

	persons.totalPopulation(function(c) {
		console.log('Total Population: ' + c);
	});


	//ObjectId("538261a8b77b80b59d2c4c53")
	fatherId = '5382617ab77b80b59d2c4c52';
	motherId = '538261a8b77b80b59d2c4c53';

	testId = fatherId;

	/////////////////////////////////////////////////////////////
	// Have Babies

 	relationships.getCouples(function (couples) {
 		couples.forEach(function(c) {

 			var ranNum = (Math.floor(Math.random() * 500));
			if(ranNum > 485)
			{
				persons.breed(c.person1, c.person2, function(d) {
					console.log("OE: " + d.haveKid);
				});
			}
 		});
 	});
	

	/////////////////////////////////////////////////////////////
	// Get Married


	persons.getSingles('M', function(singleMales) {
	console.log("Single Males: " + singleMales.length);
			
		persons.getSingles('F', function(singleFemales) {
		console.log("Single Females: " + singleFemales.length);

 			if((Math.floor(Math.random() * 10)) > 5)
 			{
				if((singleMales.length > 0) && (singleFemales.length > 0))
				{
					var ranNumM = (Math.floor(Math.random() * singleMales.length));
					var ranNumF = (Math.floor(Math.random() * singleFemales.length));


					selMale = singleMales[ranNumM];
					selFemale = singleFemales[ranNumF];

					console.log("++ MARRIAGE ++");
					console.log(selMale.firstName + " " + selMale.lastName);
					console.log(selFemale.firstName + " " + selFemale.lastName);


					relationships.performMarriage(selMale._id, selFemale._id, selMale._id, function() {
						console.log("Performing marriage and creating new family...");
						families.createNewFamily(selMale._id, selFemale._id, function(familyId) {
							
							persons.setMarried(selMale._id, familyId, function(d) { });	
							persons.setMarried(selFemale._id, familyId, function(d) { });

						});	


					});	

				}
			}	
		});
	});
	




}




var personsEngine = new PersonsEngine();



personsEngine.init();










	// console.log("====================================");

	// persons.getPerson(testId, function(per) {
	// 	console.log(per);
	// 	console.log(per.dateOfBirth);
	// });


	//ObjectId("5382617ab77b80b59d2c4c52")
	// persons.getAge(fatherId,1, function(age) {
	// 	console.log("ZZ AGE: ");
	// 	console.log(age);		
	// });

 	// families.getFamilyName('53826061b77b80b59d2c4c4c', function(fn) {
 	// 	console.log('Family Name: ' + fn);
 	// });
 	


	//console.log("====================================");


	// var ranNum = (Math.floor(Math.random() * 100));
	// if(ranNum > 95)
	// {
	// 	persons.breed(fatherId, motherId, function(d) {
	// 		console.log("OE: " + d.oldEnough);
	// 		console.log("OE: " + d.haveKid);
	// 	});
	// }



	//console.log("====================================");


	// var ranNum = (Math.floor(Math.random() * 100));
	// if(ranNum > 95)
	// {
	// 	persons.breed(fatherId, motherId, function(d) {
	// 		//console.log("OE: " + d.oldEnough);
	// 		//console.log("OE: " + d.haveKid);
	// 	});
	// }



	// persons.getPersons(function (pers){
	// 	//console.log(users);

	// 	pers.forEach(function(p) {



	// 		//console.log(p.firstName + ' ' + p.lastName);	
	// 		// if(p.headOfFamily == 1)
	// 		// {
	// 		// 	persons.giveBirth( 
	// 		// 					   p.familyInfo._id,
	// 		// 					   p.familyInfo.familyName, 
	// 		// 					   p._id,	// fatherId
	// 		// 					   '53825c9cb77b80b59d2c4c49'
	// 		// 					  );

	// 		// }		
	// 	});
	// });