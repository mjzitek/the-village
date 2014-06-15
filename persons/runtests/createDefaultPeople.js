
var mongoose = require("mongoose");
var fs = require("fs");
var moment = require('moment');
var async = require('async');
var chance = require('chance');

var config = require('../config/config');
var tMoment = require('../helpers/time.js');
var settings = require('../config/settings');
var names = require('../helpers/names');

var models_path = __dirname + '/../models';

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


var persons = require('../controllers/persons');
var families = require('../controllers/families');
var gameSettings = require('../controllers/gamesettings');
var time = require('../controllers/time');
var relationships = require('../controllers/relationships');



// var person1 = {};

// person1.familyInfo;
// person1.firstName = "";
// person1.middleName = "";
// person1.lastName = "Smith";
// person1.gender = "M";
// person1.dateOfBirth = "1879-12-04";
// person1.dateOfDeath = null;
// person1.headOfFamily = 1;
// person1.fatherInfo = null;
// person1.motherInfo = null;
// person1.placeOfBirth = null;
// person1.attributes = { married : false };
// person1.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}


exports.createPeople = createPeople;
function createPeople(numOfPeople, numOfCouples, maxNumOfChildren, callback) {

	for(var i = 0; i < numOfCouples; i++) 
	{
		var familyId = "";
		var familyName = "";
		var husbandId = "";
		var wifeId = "";


		async.series({
			familyInfo: function(callback) 
			{
				families.create("", function(fam) {
					familyId = fam._id;
					familyName = fam.familyName;
					callback(null, familyId);
				});
			}, 
			createHusband: function(callback)
			{
				// Create Husband
				var husbandName = names.getRandomName("M");

				var husband = {};

				husband.familyInfo = familyId;
				husband.firstName = husbandName.first;
				husband.middleName = husbandName.middle;
				husband.lastName = familyName;
				husband.gender = "M";
				husband.dateOfBirth = tMoment.randomDate("1-1-1900", "1-1-1907");
				husband.dateOfDeath = null;
				husband.headOfFamily = 1;
				husband.fatherInfo = null;
				husband.motherInfo = null;
				husband.placeOfBirth = null;
				husband.attributes = { married : true };
				husband.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

				persons.create(husband, function(perId) { 
					husbandId = perId; 
					callback(null, husbandId);
				});
			},
			createWife: function(callback)
			{
				// Create Wife
				var wifeName = names.getRandomName("F");

				var wife = {};

				wife.familyInfo = familyId;
				wife.firstName = wifeName.first;
				wife.middleName = wifeName.middle;
				wife.lastName = familyName;
				wife.gender = "F";
				wife.dateOfBirth = tMoment.randomDate("1-1-1900", "1-1-1907");
				wife.dateOfDeath = null;
				wife.headOfFamily = 0;
				wife.fatherInfo = null;
				wife.motherInfo = null;
				wife.placeOfBirth = null;
				wife.attributes = { married : true };
				wife.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

				persons.create(wife, function(perId) { 
					wifeId = perId; 
					callback(null, wifeId);
				});

				
			}


		},
		function(err, results) {

	    	//console.log(results);
	    	if(err) {
	    		callback(err);
	    	} else
	    	{
				relationships.performMarriage(results.createHusband, results.createWife, function(doc) {
					//console.log(husbandId + " => " + wifeId);
					callback(doc);
				});  		
	    	}

		});
	}

	var remPers = numOfPeople - (numOfCouples*2);

	if(remPers > 0) {
		for(var i = 0; i < remPers; i++)
		{
			var familyId;
			var familyName;

			async.series({
				familyInfo: function(callback) 
				{
					families.create("", function(fam) {
						familyId = fam._id;
						familyName = fam.familyName;
						callback(null, familyId);
					});
				}, 
				createPersons: function(callback)
				{
					var gender = persons.pickGender();
					var personName = names.getRandomName(gender);
					var personId;

					var person = {};

					person.familyInfo = familyId;
					person.firstName = personName.first;
					person.middleName = personName.middle;
					person.lastName = familyName;
					person.gender = gender;
					person.dateOfBirth = tMoment.randomDate("1-1-1900", "1-1-1907");
					person.dateOfDeath = null;
					person.headOfFamily = 1;
					person.fatherInfo = null;
					person.motherInfo = null;
					person.placeOfBirth = null;
					person.attributes = { married : false };
					person.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

					persons.create(person, function(per) { personId = per._id; callback(null, personId) });

				}
			},
			function(err, results) {

		    	//console.log(results);
		    	if(err) {
		    		callback(err);
		    	} else
		    	{
		    		callback(results);    		
		    	}

			});
		}
	}

} 



