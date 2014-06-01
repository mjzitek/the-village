 // var mongoose = require('mongoose'),
// 	Building = mongoose.model('buildings'),
// 	Item = mongoose.model('items'),
// 	Inventory = mongoose.model('playeritems'),
// 	Requirement = mongoose.model('requirements');

var mongoose = require('mongoose');
//var colors = require('colors');
var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var memwatch = require('memwatch');

var config = require('./config/config');
var tMoment = require('./helpers/time.js');
var settings = require('./config/settings');

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
	intervalTime: argv.clockinv || 1 * 1000,
	models: null,
	gameClock: moment(argv.gamestart)  || moment("Jan 1, 1918"),
	maxRunYears: argv.maxrun || '2100'

};

console.log("CLOCKINV: " + argv.clockinv);
console.log("GAMESTART: " + argv.gamestart);
console.log("MAXRUN: " + argv.maxrun);

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
		}, App.intervalTime);
} 

var countm = 0

PersonsEngine.prototype.automatedWorkers = function(models) {

	var stats = memwatch.gc();

	memwatch.on('leak', function(info) { 
		console.log(countm);
		console.log(info); 
		countm++;
	});

    //var hd = new memwatch.HeapDiff();

	var that = this;

	console.log('=======================================');

	console.log("Game Clock: " + App.gameClock.format('MMM D, YYYY'));
	App.gameClock.add('M', 1);

	if(App.gameClock.format('YYYY') == App.maxRunYears)
	{
	//	console.log(hd.end());
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

	// Check if any preg women are ready to pop
	persons.getPregnantWomen(function(preg) {
		console.log("Pregnant Women: " + preg.length);

		preg.forEach(function(p) {
		 	var gestationTime = GetAge(p.pregnancy.pregnancyDate);
		 	if(gestationTime.months >= 9) {
		 		console.log(p._id + " => it's been 9 months!!");
		 		persons.giveBirth(p.pregnancy.babyFatherId, p._id, function(pp) {
		 			console.log(pp);
		 		});
		 	}		
		});

	});

	// Make some babies
 	relationships.getCouples(function (couples) {
 		couples.forEach(function(c) {

 			var ranNum = (Math.floor(Math.random() * 500));
			if(ranNum > 485)
			{
				persons.breed(c.person1, c.person2, function(d) {
					//console.log("OE: " + d.haveKid);
				});
			}
 		});
 	});
	

	/////////////////////////////////////////////////////////////
	// Get Married

	persons.getSingles('M', function(singleMales) {
		persons.getSingles('F', function(singleFemales) {
			persons.getMarriageEligibleSingles(App.gameClock,'M', function(smeMales) {
				persons.getMarriageEligibleSingles(App.gameClock,'F', function(smeFemales) {
					console.log("Single Males: " + singleMales.length + " / " + smeMales.length);
					console.log("Single Females: " + singleFemales.length + " / " + smeFemales.length);
				});
			});
		});
	});	


	persons.getMarriageEligibleSingles(App.gameClock, 'M', function(singleMales) {
		//console.log("Single Eligible Males: " + singleMales.length);
			
		persons.getMarriageEligibleSingles(App.gameClock, 'F', function(singleFemales) {
			//console.log(singleFemales);
			//console.log("Single Eligible Females: " + singleFemales.length);

 			if((Math.floor(Math.random() * 10)) > 5)
 			{
				if((singleMales.length > 0) && (singleFemales.length > 0))
				{
					var ranNumM = (Math.floor(Math.random() * singleMales.length));
					var ranNumF = (Math.floor(Math.random() * singleFemales.length));
					//console.log("Trying marriage...");

					selMale = singleMales[ranNumM];
					selFemale = singleFemales[ranNumF];

					//console.log(selMale._id + ' => ' + selFemale._id);
					//console.log("F: " + selMale.familyInfo._id + ' => ' + selFemale.familyInfo._id);

					if(selMale.familyInfo._id != selFemale.familyInfo._id) // Prevent brother and sister marriage
					{
						var selMaleAge = GetAge(selMale.dateOfBirth);
						var selFemaleAge = GetAge(selFemale.dateOfBirth);

						//console.log(selMale._id + " => " + selMaleAge.years + " " + settings.minMarriageAge);


						if((selMaleAge.years >= settings.minMarriageAge) && (selFemaleAge.years >= settings.minMarriageAge) 
							&& (Math.abs(selMaleAge.years - selFemaleAge.years) <= 10)) // Make sure they are no older than 10 years apart
						{
							relationships.performMarriage(selMale._id, selFemale._id, selMale._id, function() {
								console.log("++ MARRIAGE ++ " + selMale.firstName + " " + selMale.lastName + " & " + selFemale.firstName + " " + selFemale.lastName);
								console.log("Performing marriage and creating new family...");
								families.createNewFamily(selMale._id, selFemale._id, function(familyId) {
									
									persons.setMarried(selMale._id, familyId, function(d) { });	
									persons.setMarried(selFemale._id, familyId, function(d) { });

								});	


							});	
						}
					}
				}
			}	
		});
	});
	
 	///////////////////////////////////////////////
 	// Kill off people

 	persons.getPersonsAlive(function(pers) {
 		//console.log(pers.length);
 		if(pers)
 		{
 			pers.forEach(function(p) {

 				var age = GetAge(p.dateOfBirth).years;
 				var kill = false;
 				var rndNum = (Math.floor(Math.random() * 1000))
 				//console.log('d: ' + rndNum);
 				if(age > 110) { kill = true;}
 				else if(age > 90) { if(rndNum > 800 ) { kill = true; } }
	 			else if(age > 70) { if(rndNum > 980 ) { kill = true; } }
 				else if (age > 35) { if(rndNum > 998 ) { kill = true; } }
 				//else { if(rndNum > 995 ) { kill = true; } }

 				if(kill) {
 					persons.killOff(p._id, function(r) {
 						console.log(r);
 					});
 				}
 			});
 		}
 	});



}




var personsEngine = new PersonsEngine();



personsEngine.init();






function GetAge(birthDate)
{
	curGameTime = moment(App.gameClock);
	birthDate = moment(birthDate);
			
	curAge = tMoment.getDifference(curGameTime, birthDate);

	return curAge;
}



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