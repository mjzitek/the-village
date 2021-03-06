
var mongoose = require('mongoose');
//var colors = require('colors');
var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var async = require('async');
//var memwatch = require('memwatch');

var config = require('./config/config');
var tMoment = require('./lib/time');
var genetics = require('./lib/genetics');
var settings = require('./config/settings');
var createPeople = require('./tester_lib/createDefaultPeople');

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

var persons = require('./controllers/persons');
var babies = require('./controllers/babies');
var families = require('./controllers/families');
var relationships = require('./controllers/relationships');
var gamesetting = require('./controllers/gamesettings');
var personevents = require('./controllers/personevents');
var time = require('./controllers/time');
var statshistory = require('./controllers/statshistory');

/////////////////////////////////

var startTime = argv.gamestart  || "Jan 1, 1918";


var App = {
	intervalTime: argv.clockinv || 1000,
	models: null,
	gameClock: moment(startTime),
	maxRunYears: argv.maxrun || '2100',
	babyRatioNum: 4000, // out of 5000   
	                    // Used with random number...rand num need 
					    // to be more than this (too tired for better name)
	marriageRatioNum: 2400,  // out of 5000		
    numOfCouples: 1    // Num of couples to pull to try to make a baby
};

console.log("CLOCKINV: " + App.intervalTime);
console.log("GAMESTART: " + App.gameClock.format("MMM DD, YYYY"));
console.log("MAXRUN: " + App.maxRunYears);

function PersonsEngine() {

}


PersonsEngine.prototype.init = function() {
	console.log('Engine started...');
	that = this;
	//this.models = models;

	async.series({
		setUp: function(callback) {
			time.set(App.gameClock, function(doc) {
				console.log("Setting game clock to " + App.gameClock.format('MMM DD, YYYY'));
				callback(null,null);
			});

		},
		cleanUp: function(callback) {
			async.series({
				persons: function(callback) {
					persons.removeAll(function(doc) {
						callback(null,null);
					} );
				},
				families: function(callback) {
					families.removeAll(function(doc) {callback(null,null);});
				},
				relationships: function(callback) {
					relationships.removeAll(function(doc) {callback(null,null);});
				},
				personevents: function(callback) {
					personevents.removeAll(function(doc) {callback(null,null);});
				},
				statshistory: function(callback) {
					statshistory.removeAll(function(doc) {callback(null,null);});
				}
			},
			function(err,results) {
				console.log("Clearing old population...");
				callback(null, null);	
			});
			
						
		},
		createInitialPopulation: function(callback) {
			
			console.log("Creating initial population...");
			
			createPeople.createPeople(120,50,0, App.gameClock, function(doc) {
				callback(null, null);
			});
		},
		settingInitialHeights: function(callback) {
			persons.getPersons(function(pers){
				//console.log(pers.length);
				if(pers) {
					var persCount = pers.length;

					pers.forEach(function(person) {
						persCount--;
						createPeople.setInitalHeights(person, App.gameClock, function(doc) {});
					});
				}

				if(pers <= 0) callback(null,null);
			});			
		},
		setAutoInterval: function(callback) {
			that.setAutoInterval();
			callback(null, null);
		}
	});


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

	var that = this;



	async.series({

		gameClock: function(callback) {
			App.gameClock.add('days', 1);
			

			if(App.gameClock.format('YYYY') == App.maxRunYears)
			{
				process.kill(0);
			}

			gamesetting.setValueByKey('time', App.gameClock, function() {
				callback(null, App.gameClock);

			});

		},
		popCount: function(callback) {
			persons.populationCountAlive(function(popCount) {

				callback(null,popCount);
			});
		},
		/////////////////////////////////////////////////////////////
		// Have Babies

		// Check if any preg women are ready to pop		
		haveBabies: function(callback) {
			babies.getPregnantWomen(function(preg) {
				//console.log("Pregnant Women: " + preg.length);
				var pregCount = preg.length;

				while(pregCount > 0) {
					preg.forEach(function(p) {
					 	var gestationTime = GetAge(p.pregnancy.pregnancyDate);
					 	if(gestationTime.months >= 9) {
					 		console.log(p._id + " => it's been 9 months!!");
					 		babies.giveBirth(p._id, function(pp) {});
					 	}		
					 	pregCount--;
					});
				}	

				if(pregCount === 0) {
					callback(null, preg.length);	
				}	
			});
		},
		///////////////////////////////////////////////
		// Make some babies
		makeBabies: function(callback) {
			//console.log("makeBabies");
			var randBabyNum = Math.random() * 5000;
			//console.log(randBabyNum + " / " + App.babyRatioNum);
			if(randBabyNum > App.babyRatioNum) {

				persons.getRandomBabyReadyWomen(true, 1, function(pers) {
					console.log("Baby Ready Women: " + pers.length);
					var persCount = pers.length;

					while(persCount > 0) {
						pers.forEach(function(p) {
							persCount--;
							//console.log(pers);
							relationships.getCouple(p._id, function(c) {
								//console.log("making babies: " + p._id);
								if(c)
								{
									babies.breed(c.person1, c.person2, function(d) {
										callback(null, d);
									});
								} else {
									callback(null,"");
								}
							});
						});
					}

					if(persCount === 0) {
						callback(null, null);
					}
				});
			} else {
				callback(null, null);
			}
		},
	 	///////////////////////////////////////////////
	 	// Marriage
	 	performMarriage : function(callback) {

			var randMarriageNum = Math.random() * 5000;
			//console.log(randMarriageNum + " / " + App.marriageRatioNum);
			if(randMarriageNum > App.marriageRatioNum) {
				persons.performMarriage(function(d) {
					callback(null, d);
				});
			} else {
				callback(null,null);
			}
		},
	 	///////////////////////////////////////////////
	 	// Kill off people
	 	killPeople: function(callback) {
	 		//console.log("killPeople");

	 		var filter = {
	 			dateOfDeath: null
	 		}

	 		var fields = {};

	 		var count = 50;

		 	persons.getRandomPeople(filter, fields, count, function(pers) {
		 		//console.log(pers.length);
		 		if(pers)
		 		{
		 			//console.log("Persons to kill: " + pers.length);
		 			var persCount = pers.length;

		 			while(persCount > 0) {

			 			pers.forEach(function(p) {

		 					persCount--;

			 				var age = GetAge(p.dateOfBirth).years;
			 				var kill = false;
			 				var rndNum = (Math.floor(Math.random() * 5000))
			 				//console.log('d: ' + rndNum);
			 				if(age > 110) { kill = true;}
			 				else if(age > 90) { if(rndNum > 2500 ) { kill = true; } }
				 			else if(age > 70) { if(rndNum > 4000 ) { kill = true; } }
			 				else if (age > 35) { if(rndNum > 4900 ) { kill = true; } }
			 				//else { if(rndNum > 995 ) { kill = true; } }

			 				if(kill) {
			 					persons.killOff(p._id, function(r) {
			 						console.log(r);

			 						persons.get(p._id, function(p) {

			 							var pers = [];
			 							pers.push(p);

			 							var info = {
			 								persons: pers,
			 								eventType: 'death',
			 								eventDate: App.gameClock,
			 								realworldDate: new Date()
			 							}


			 							personevents.add(info, function(doc) {

			 							});
			 						});
			 						
			 					});
			 				}
			 			});
					}

					if(persCount === 0) {
						callback(null, null);
					}
		 		} else {
		 			callback(null, null);
		 		}
		 	});
		},
		updateHeights: function(callback) {
			if(App.gameClock.format("MMM DD") == "Dec 31")
			{
				console.log("** Updating Heights")
				var c2 = moment(App.gameClock);
				var c3 = moment(App.gameClock);

				var date20yo = c2.subtract("y", 20).format('YYYY-MM-DD');
				var date1yo = c2.subtract("y", 1).format('YYYY-MM-DD');

				//console.log(date20yo);

				var filter = {
		 			dateOfDeath: null,
		 			dateOfBirth: { $gte : date20yo }
		 		}

		 		var fields = {};

		 		persons.getPersonsFiltered(filter, fields, function(pers) {
		 			//console.log(pers.length);
		 			var persCount = pers.length;

		 			if(pers) {
		 				pers.forEach(function(person) {
		 					persCount--;

		 					var age = GetAge(person.dateOfBirth,App.gameClock).years;
							if(age > 20) age = 20;
		 					
							if(age >= 1) {
		 					genetics.determineNewHeight(
		 						person.genome.genes.height.currentHeight,
								person.genome.genes.height.heightBias,
								age,person.gender,0, function(newHeight) {
									persons.updateHeight(person._id, newHeight, function(doc){
									});
								});
		 					}

		 					//console.log(persCount);			
							if(persCount <= 0) {
								callback(null, null);
							}
						});
		 			}
	 			});
			} else {
				callback(null, null);
			}



		} 
	},
	function(err, results) {
		//console.log(results);

		console.log('=======================================');
		console.log("Game Clock: " + results.gameClock.format('MMM D, YYYY'));
		console.log('Total Population: ' + results.popCount);
    	//console.log(results);
    	if(err) {
    		console.log(err);
    	} else
    	{
			   		
    	}

	});

}

var personsEngine = new PersonsEngine();

// Start the engine
personsEngine.init();



function GetAge(birthDate)
{
	curGameTime = moment(App.gameClock);
	birthDate = moment(birthDate);
			
	curAge = tMoment.getDifference(curGameTime, birthDate);

	return curAge;
}


