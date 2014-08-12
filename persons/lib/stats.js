var async = require('async'),
	fs = require('fs'),
	moment = require('moment');

var persons = require('../controllers/persons');
var families = require('../controllers/families');
var relationships = require('../controllers/relationships');
var gamesetting = require('../controllers/gamesettings');
var personevents = require('../controllers/personevents');




exports.getSummaryData = getSummaryData;
function getSummaryData(callback) {
	var data = {
			clock: null,
			population: null,
			men: null,
			women: null,
			dead: null,
			married: null,
			singles: null,
			singlesMen: null,
			singlesWomen: null,
			children: null,
			adults: null,
			recentBirths: null,
			childCutoffDate: null,
			pregnant: null,
			eyes: null
	};

	data.eyes = { brown: null, blue: null, green: null }


	async.waterfall([
		// clock
		function(callback) {
			gamesetting.getValueByKey('time', function(clock) {
				data.clock = moment(clock.setvalue);
				callback(null,data);
			});
		},
		// population
		function(data, callback) {
			persons.populationCountAlive(function(popCount) {
				data.population = popCount;
				callback(null, data);
			});
		},
		// males
		function(data, callback) {
			var filter = {
				gender: "M",
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popCountMales) {
				data.men = popCountMales;
				callback(null, data);
			});
		},
		// females
		function(data, callback) {
			var filter = {
				gender: "F",
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popCountFemales) {
				data.women = popCountFemales;
				callback(null, data);
			});
		},
		// dead
		function(data, callback) {
			var filter = {
				dateOfDeath: { $ne : null } 
			}

			persons.populationCountFiltered(filter, function(popCountDead) {
				data.dead = popCountDead;
				callback(null, data);
			});
		},
		// single
		function(data, callback) {
			var filter = {
				attributes : { married : false },
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				data.singles = popSingle;
				callback(null, data);
			});
		},
		// singlesMen
		function(data, callback) {
			var filter = {
				attributes : { married : false },
				gender: "M",				
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				data.singlesMen = popSingle;
				callback(null, data);
			});
		},
		// singlesWomen
		function(data, callback) {
			var filter = {
				attributes : { married : false },
				gender: "F",				
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popSingle) {
				data.singlesWomen = popSingle;
				callback(null, data);
			});
		},
		// married
		function(data, callback) {
			var filter = {
				attributes : { married : true },
				dateOfDeath: null
			}

			persons.populationCountFiltered(filter, function(popMarried) {
				data.married = popMarried;
				callback(null, data);
			});
		},
		// childCutoffDate
		function(data, callback) {
			var c2 = moment(data.clock);

			var childCutoffDate = c2.subtract("y", 18).format('YYYY-MM-DD');
			data.childCutoffDate = childCutoffDate;
			callback(null, data)
		},
		// children
		function(data, callback) {

			var filter = {
				dateOfDeath: null,
				dateOfBirth: { $gt : data.childCutoffDate}
			}

			persons.populationCountFiltered(filter, function(children) {
				data.children = children;
				callback(null, data);
			});
		},
		// adults
		function(data, callback) {

			var filter = {
				dateOfDeath: null,
				dateOfBirth: { $lte : data.childCutoffDate}
			}

			persons.populationCountFiltered(filter, function(adults) {
				data.adults = adults;
				callback(null, data);
			});
		},
		// recentBirths
		function(data, callback) {

			var c2 = moment(data.clock);

			var recentBirthCutoffDate = c2.subtract("y", 1).format('YYYY-MM-DD');			

			var filter = {
				dateOfDeath: null,
				dateOfBirth: { $gte : recentBirthCutoffDate}
			}

			persons.populationCountFiltered(filter, function(recentBirths) {
				data.recentBirths = recentBirths
				callback(null, data);
			});
		},
		// pregnant
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"pregnancy.pregnant" : true
			}

			persons.populationCountFiltered(filter, function(preg) {
				data.pregnant = preg
				callback(null, data);
			});			
		},
		// Eye Color - Brown
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"genome.genes.eyes.color" : "brown"
			}

			persons.populationCountFiltered(filter, function(eyesBrown) {
				data.eyes.brown = eyesBrown;
				callback(null, data);
			});			
		},		
		// Eye Color - Green
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"genome.genes.eyes.color" : "green"
			}

			persons.populationCountFiltered(filter, function(eyesGreen) {
				data.eyes.green = eyesGreen;
				callback(null, data);
			});			
		},
		// Eye Color - Blue
		function(data, callback) {
			var filter = {
				dateOfDeath: null,
				"genome.genes.eyes.color" : "blue"
			}

			persons.populationCountFiltered(filter, function(eyesBlue) {
				data.eyes.blue = eyesBlue;
				callback(null, data);
			});			
		},																									
	],
	function(err, data) {

		data.clock = data.clock.format('MMM DD, YYYY');

		callback(data);
	});
}

