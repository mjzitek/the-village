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
	intervalTime: argv.clockinv || 10,
	models: null,
	gameClock: moment(argv.gamestart)  || moment("Jan 1, 1918"),
	maxRunYears: argv.maxrun || '2100',
	babyRatioNum: 400  // Used with random number...rand num need 
					   // to be more than this (too tired for better name)

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
	that.tester();
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


var counter1 = 0;
var counter2 = 0;

PersonsEngine.prototype.automatedWorkers = function(models) {
		
	//persons.getMarriageEligibleSingle("M", "", function(pers) {});
	var query = {};
	var fields = {};

		// var per = new Person({ 
		// 					   familyInfo: results.mother.familyInfo._id, 
		// 					   firstName: results.name.first,
		// 					   middleName:  results.name.middle,
		// 					   lastName: results.familyName,
		// 					   gender: results.gender,
		// 					   dateOfBirth: results.curDate,
		// 					   placeOfBirth: null,
		// 					   dateOfDeath: null,
		// 					   headOfFamily: 0,
		// 					   fatherInfo: fatherId, 
		// 					   motherInfo: motherId,
		// 					   attributes: {
		// 					   					married: false
		// 					   			   },
		// 					   pregnancy: {
		// 					   					pregnant: false,
		// 					   					pregnancyDate: null,
		// 					   					babyFatherId: null
		// 					   }

		// 					});



	//console.log(tMoment.randomDate("2/1/1900", "3/1/2000").format("MMM DD, YYYY"));



}

PersonsEngine.prototype.tester = function(models)  {

	
	persons.removeAll(function(doc) {});
	families.removeAll(function(doc) {});
	relationships.removeAll(function(doc) {});

	createPeople.createPeople(120,50,0, function(doc) {
		//console.log(doc);
	});

	//tMoment.randomDate("1/1/1900", "2/1/1900");

	// var person = {};

	// person.familyInfo = null;
	// person.firstName = "Charlesx";
	// person.middleName = "Henry";
	// person.lastName = "Seikox";
	// person.gender = "M";
	// person.dateOfBirth = "1939-12-04";
	// person.dateOfDeath = null;
	// person.headOfFamily = 1;
	// person.fatherInfo = null;
	// person.motherInfo = null;
	// person.placeOfBirth = null;
	// person.attributes = { married : true };
	// person.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

	// console.log(person);


	// persons.createPerson(person, function(id) {
	// 	persons.get(id, function(per) {
	// 		console.log(per);
	// 	});
	// });

 //  	// persons.getMarriageEligibleSingle("M", "", function(per) {
 //  	// 	console.log(per);
 //  	// })

	// 	persons.getRandomBabyReadyWomen(false, 1, function(per) {
	// 		console.log(per);
	// 	});
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
