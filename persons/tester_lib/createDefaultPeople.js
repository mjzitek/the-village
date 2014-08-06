
var mongoose = require("mongoose");
var fs = require("fs");
var moment = require('moment');
var async = require('async');
var chance = require('chance');

var config = require('../config/config');
var tMoment = require('../lib/time.js');
var settings = require('../config/settings');
var names = require('../lib/names');
var genetics = require('../lib/genetics');

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
var babies = require('../controllers/babies');
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


		var family;
		var familyName = "";
		var husbandId = "";
		var wifeId = "";


		async.series({
			familyInfo: function(callback) 
			{
				families.create("", function(fam) {
					familyId = fam._id;
					familyName = fam.familyName;
					callback(null, fam);
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
				husband.attributes = { married : false };
				husband.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}


				husband.genome = { 
						genes : { 
							eyes : generateRandomEyeColor(),
							skin : generateRandomSkinColor(),
							hair : generateRandomHairColor()
						}
				};


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
				wife.attributes = { married : false };
				wife.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

				wife.genome = { 
						genes : { 
							eyes : generateRandomEyeColor(),
							skin : generateRandomSkinColor(),
							hair : generateRandomHairColor()
						}
				};

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
					persons.setMarried(results.createHusband, results.familyInfo._id, "", function(d) { 
						persons.setMarried(results.createWife, results.familyInfo._id, results.familyInfo.familyName, function(d) {callback(d);});
							callback(doc);
					});	
					
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
					var gender = babies.pickGender();
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

					person.genome = { 
						genes : { 
							eyes : generateRandomEyeColor(),
							skin : generateRandomSkinColor(),
							hair : generateRandomHairColor()
						}
					};

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


var bey2 = [
		{ one: "brown", two: "brown" },
		{ one: "brown", two: "blue" },
		{ one: "blue", two: "blue" }
	]

var gey = [
		{ one: "green", two: "green" },
		{ one: "green", two: "blue" },
		{ one: "blue", two: "blue" }
]


function generateRandomEyeColor() {

	var eyes = {}

	// Random bey2
	eyes.bey2 = bey2[(Math.round(Math.random() * 2))];
	eyes.gey = gey[(Math.round(Math.random() * 2))];

	eyes.color = genetics.determineEyeColor(eyes.bey2, eyes.gey);
    
    return eyes;
    
}

function generateRandomSkinColor() {
	var skin = {};

	skin.one = genetics.skinColors(Math.floor(Math.random() * 17));
	skin.two = genetics.skinColors(Math.floor(Math.random() * 17));

	skin.color = genetics.determineSkinColor(skin.one, skin.two);

	//console.log(skin);

	return skin;
}

function generateRandomHairColor() {
	var hair = {};

	hair.one = genetics.hairColors(Math.floor(Math.random() * 10));
	hair.two = genetics.hairColors(Math.floor(Math.random() * 10));

	hair.color = genetics.getRandomAllele(hair);	

	return hair;

}

