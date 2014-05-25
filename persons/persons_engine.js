 // var mongoose = require('mongoose'),
// 	Building = mongoose.model('buildings'),
// 	Item = mongoose.model('items'),
// 	Inventory = mongoose.model('playeritems'),
// 	Requirement = mongoose.model('requirements');

var mongoose = require('mongoose');
//var colors = require('colors');
var fs = require('fs');

var config = require('./config/config');

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

/////////////////////////////////

var App = {
	intervalTime: 10,
	models: null

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

	persons.totalPopulation(function(c) {
		console.log('Total Population: ' + c);
	});


	persons.getPersons(function (pers){
		//console.log(users);

		pers.forEach(function(p) {
			console.log(p.firstName + ' ' + p.lastName);			
		});
	});
}











var personsEngine = new PersonsEngine();



personsEngine.init();