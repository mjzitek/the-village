
var mongoose = require('mongoose');
//var colors = require('colors');
var fs = require('fs');
var moment = require('moment');
var argv = require('optimist').argv;
var async = require('async');
//var memwatch = require('memwatch');

var config = require('./config/config');
var tMoment = require('./helpers/time.js');
var settings = require('./config/settings');
var createPeople = require('./runtests/createDefaultPeople');

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

/////////////////////////////////

var startTime = argv.gamestart  || "Jan 1, 1918";


var App = {
	intervalTime: argv.clockinv || 1000,
	models: null,
	gameClock: moment(startTime),
	maxRunYears: argv.maxrun || '2100',
	babyRatioNum: 1450, // Used with random number...rand num need 
					   // to be more than this (too tired for better name)
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
				console.log("Setting game clock to " + App.gameClock);
			});

			persons.removeAll(function(doc) { console.log("Clearing old population...")});
			families.removeAll(function(doc) {});
			relationships.removeAll(function(doc) {});
			personevents.removeAll(function(doc) {});

			createPeople.createPeople(120,50,0, function(doc) {
				console.log("Creating initial population...");
			});
			callback(null,null);
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

	console.log('=======================================');

	App.gameClock.add('days', 1);
	console.log("Game Clock: " + App.gameClock.format('MMM D, YYYY'));


	if(App.gameClock.format('YYYY') == App.maxRunYears)
	{
		process.kill(0);
	}

	gamesetting.setValueByKey('time', App.gameClock, function() {});


	persons.populationCountAlive(function(c) {
		console.log('Total Population: ' + c);
	});


	/////////////////////////////////////////////////////////////
	// Have Babies

	// Check if any preg women are ready to pop
	babies.getPregnantWomen(function(preg) {
		console.log("Pregnant Women: " + preg.length);

		preg.forEach(function(p) {
		 	var gestationTime = GetAge(p.pregnancy.pregnancyDate);
		 	if(gestationTime.months >= 9) {
		 		console.log(p._id + " => it's been 9 months!!");
		 		babies.giveBirth(p._id, function(pp) {
		 			//console.log(pp);
		 		});
		 	}		
		});

	});

	///////////////////////////////////////////////
	// Make some babies

	var randBabyNum = Math.random() * 5000;

	if(randBabyNum > 4500) {
		persons.getRandomBabyReadyWomen(true, 1, function(pers) {
			pers.forEach(function(p) {
				//console.log(pers);
				relationships.getCouple(p._id, function(c) {
					//console.log("making babies: " + p._id);
					if(c)
					{
						babies.breed(c.person1, c.person2, function(d) {
						//console.log("OE: " + d.haveKid);
						});
					}
				});
			});
		});
	}


	

 	///////////////////////////////////////////////
 	// Marriage

	var randMarriageNum = Math.random() * 5000;

	if(randMarriageNum > 3500) {
		persons.performMarriage(function(d) {});
	}

 	///////////////////////////////////////////////
 	// Kill off people

 	persons.getPersonsAlive(function(pers) {
 		//console.log(pers.length);
 		if(pers)
 		{
 			pers.forEach(function(p) {

 				var age = GetAge(p.dateOfBirth).years;
 				var kill = false;
 				var rndNum = (Math.floor(Math.random() * 5000))
 				//console.log('d: ' + rndNum);
 				if(age > 110) { kill = true;}
 				else if(age > 90) { if(rndNum > 4000 ) { kill = true; } }
	 			else if(age > 70) { if(rndNum > 4680 ) { kill = true; } }
 				else if (age > 35) { if(rndNum > 4998 ) { kill = true; } }
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


