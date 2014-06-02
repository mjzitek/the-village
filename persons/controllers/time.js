var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings.js');
var tMoment = require('../helpers/time.js');


 var mongoose = require('mongoose'),
	GameSettings = mongoose.model('gamesettings');



exports.getGameClock = getGameClock;
function getGameClock(callback) {

	GameSettings.findOne({ setkey: "time" }, function(err, gClock) {
		callback(gClock.setvalue);
	});

}