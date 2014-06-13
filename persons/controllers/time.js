var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings.js');
var tMoment = require('../helpers/time.js');


 var mongoose = require('mongoose'),
	GameSettings = mongoose.model('gamesettings');


exports.get = getGameClock;
exports.getGameClock = getGameClock;
function getGameClock(callback) {

	GameSettings.findOne({ setkey: "time" }, function(err, gClock) {
		callback(gClock.setvalue);
	});

}

exports.set = setGameClock;
exports.setGameClock = setGameClock;
function setGameClock(time, callback) {
	GameSettings.update({ setkey: "time"}, { setvalue : time }, function(err, doc) {
		if(err) {
			callback("Error: " + err);
		} else {
			callback("updated");
		}
	});
}