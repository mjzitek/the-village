var mongoose = require('mongoose');
//var colors = require('colors');
var fs = require('fs');
var moment = require('moment');


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
var families = require('./controllers/families');



////////////////////////////////////////////////////////
//
//	Variables

var gameClock = moment("Jan 1, 1900");

////////////////////////////////////////////////////////



// persons.getPersons(function (pers){
// 		//console.log(users);

// 		pers.forEach(function(p) {
// 			console.log(p.firstName + ' ' + p.lastName);	
// 			if(p.headOfFamily == 1)
// 			{
// 				persons.giveBirth( 
// 								   p.familyInfo._id,
// 								   p.familyInfo.familyName, 
// 								   p._id,	// fatherId
// 								   '53825c9cb77b80b59d2c4c49'
// 								  );

// 			}		
// 		});
// });

persons.getChildrenByFather('5382617ab77b80b59d2c4c52', function(pers) {
	console.log(gameClock.format('MMM d, YYYY'));

	pers.forEach(function(c) {
		console.log(c.firstName + ' ' + c.lastName);
	});
});








function updateGameCal() {

}