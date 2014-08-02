var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../lib/time');

 var mongoose = require('mongoose'),
	 StatsHistory = mongoose.model('statshistories');

// Controllers
var gameSettings = require('./gamesettings');
var persons = require('./persons');
var time = require('./time');
var families = require('./families');
var relationships = require('./relationships');

exports.recordStats = recordStats;
function recordStats() {
	updatePopulation(function() {});
}

function updatePopulation(callback) {
	gameSettings.getValueByKey('time', function(time) {				
		curGameTime = moment(time.setvalue);

		persons.populationCountAlive(function(popCount) {

			var stat = new StatsHistory({
					statType: "population",
					statValue: popCount, 
					statDate: curGameTime 
			})

			stat.save(function(doc) {
				callback(doc);
			});		
		});

	});
} 

/////////////////////////////////////////////////////////////

/**
 * Retrieves the stat history for given type
 *
 *   @statType {String}
 *   @range {JSON} (Optional) Can be a range of dates, time period etc 
 *                            If nothing is give returns everyting
 *   @return {JSON}
 */
exports.getStatHistory = getStatHistory;
function getStatHistory(statType, range, callback) {
	// range is optional
	if (typeof callback === 'undefined') {
	    callback = range;
	    range = null;
	  }	

	/*
	   Range format

	   { type: "years", length: 10 }
       { beginDate: '1900-01-01', endDate: '1952-01-01' }


	*/

	var filter = {};

	filter.statType = statType;

	console.log(filter);

	StatsHistory.find(filter).sort({'statDate' : -1}).exec(function(err,stats) {
		var statsData = [];

		stats.forEach(function(stat) {
			statsData.push({date: moment(stat.statDate).format("YYYY-MM-DD"), value: stat.statValue });
		});

		callback(statsData);
	});

}



exports.removeAll = removeAllRecords;
exports.removeAllRecords = removeAllRecords;
function removeAllRecords(callback) {
	StatsHistory.remove({}, function(err, doc) {
		if(err) {
			callback("Error: " + err);
		} else
		{
			callback();
		}
	});

}