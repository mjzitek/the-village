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

require('nodetime').profile({
	accountKey: '1205486b4221354f8721bb0ba0a64539f6e8c0e2',
	appName: 'village-person-tester'
});


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
	intervalTime: argv.clockinv || 100,
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

	persons.getRandomBabyReadyWomen(true, 1, function (pers) {
 	 	console.log("_______________________________________________")	
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
