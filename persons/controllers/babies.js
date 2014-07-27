var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../helpers/time');
var names = require('../helpers/names');


 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');


// Controllers
var gameSettings = require('./gamesettings');
var time = require('./time');
var families = require('./families');
var relationships = require('./relationships');


exports.getPregnantWomen = getPregnantWomen;
function getPregnantWomen(callback) {
	Person.find({ "pregnancy.pregnant" : true, dateOfDeath: null }).populate('familyInfo').exec(function(err, preg) {
		callback(preg);
	});
}


exports.breed = breed;
function breed(fatherId, motherId, callback) {

	var frAge;
	var mrAge;
	var minAge = settings.minBreedAge;
	var maxAge = settings.maxBreedAgeFemale;
	var oldEnough;
	var tooOld;
	var fatherStatus = false;
	var motherStatus = false;
	//var r;

	async.series({
		fatherAge: function(callback) {
			exports.getAge(fatherId, function(a) {
				//console.log("breed: " + fatherId);
				//console.log("breed: ");
				//console.log(a);
				frAge = a.years;
				callback(null, frAge);
			});
			
		},
		fatherStatus: function(callback) {
			exports.getPerson(fatherId, function(f) {
				if(f.dateOfDeath === null) { fatherStatus = true; callback(null, true);}
				else { callback(null, false);}
			});
		},
		motherAge: function(callback) {
			exports.getAge(motherId, function(a) {
				mrAge = a.years;
				callback(null, mrAge);
			});
		},
		motherStatus: function(callback) {
			exports.getPerson(motherId, function(m) {
				if(m.dateOfDeath === null && m.pregnancy.pregnant === false) 
				{ motherStatus = true; 

					callback(null, true);
				}
				else { callback(null, false);}
			});
		},		
		oldEnough: function(callback) {
			if((frAge >= minAge) && (mrAge >= minAge)) {
				oldEnough = true;
			} else {
				oldEnough = false;
			}
			callback(null, oldEnough);
		},
		tooOld: function(callback) {
			if(mrAge <= maxAge)
			{
				tooOld = false;
			} else {
				tooOld = true;
			}

			callback(null, tooOld);
		},
		haveKid: function(callback) {
			//console.log("oldEnough: " + oldEnough + " | tooOld: " + tooOld + 
			//			" | fatherStatus : " + fatherStatus + " | motherStatus: " + motherStatus)
			if(oldEnough && !tooOld && fatherStatus && motherStatus) {
				// giveBirth(fatherId, motherId, function() {
				// 	callback();
				
				// });

				// Get pregnant
				//console.log(motherId + " => is pregnant!!");
				
				setPregnant(fatherId, motherId, function() {
					//callback();
				});

				callback(null, '** New Baby **');
			}
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


exports.setPregnant = setPregnant;
function setPregnant(fatherId, motherId, callback) {
	gameSettings.getValueByKey('time', function(time) {				
		curGameTime = moment(time.setvalue);

		Person.update({_id: motherId }, { pregnancy: { pregnant: true, pregnancyDate: curGameTime, babyFatherId: fatherId }}, function(err, doc) {
			if(err)
			{
				callback(err)
			} else {
				callback();
			}

		});
	});
}

//giveBirth = function(familyId, familyName, fatherId, motherId, callback) {
exports.giveBirth = giveBirth;
function giveBirth(motherId, callback) {

	var gender = "";
	var name;
	var mother;
	var familyName;
	var curDate;
	//console.log("++++++++++++++++++++++++++++++")
	//console.log("Giving birth");

	async.waterfall([
		function(callback) {
			gender = pickGender();
			//console.log(gender);
			callback(null,gender);
		},
		// Get Gender
		function(gender,callback) {

			name = names.getRandomName(gender);
			//console.log(name);
			callback(null, gender, name);
		},
		// Get Mom
		function(gender, name, callback) {
			getPerson(motherId, function(mom) {
				//console.log(mom._id + " " + mom.firstName + " " + mom.lastName);

					callback(null, gender, name, mom);

			});
		},	
		// Get Dad	
		function(gender, name, mom, callback) {
			getPerson(mom.pregnancy.babyFatherId, function(dad) {
				//console.log(mom._id + " " + mom.firstName + " " + mom.lastName);
				callback(null, gender, name, mom, dad);
			});
		},
		// Get current date
		function(gender, name, mom, dad, callback) {
			time.getGameClock(function(gameTime) {
				callback(null, gender, name, mom, dad, gameTime);
			});
		},
		// Genetics
		function(gender, name, mom, dad, gameTime, callback) {
			var looks = {};

			looks.eye = "blue";

			callback(null, gender, name, mom, dad, gameTime, looks);
		}
		// Update mom status
		function(gender, name, mom, dad, gameTime, looks, callback) {
			Person.update({_id: motherId }, { pregnancy: { pregnant: false, pregnancyDate: null, babyFatherId: null }}, function(err, doc) {
				callback(null, gender, name, mom, dad, gameTime);
			});
		}
	],
	function(err, gender, name, mom, dad, gameTime, looks) {
		var per = new Person({ 
							   familyInfo: mom.familyInfo._id, 
							   firstName: name.first,
							   middleName:  name.middle,
							   lastName: mom.lastName,
							   gender: gender,
							   dateOfBirth: gameTime,
				 			   placeOfBirth: null,
							   dateOfDeath: null,
							   headOfFamily: 0,
							   fatherInfo: results.mother.pregnancy.babyFatherId, 
							   motherInfo: motherId,
							   attributes: {
							   					married: false
							   			   },
							   pregnancy: {
							   					pregnant: false,
							   					pregnancyDate: null,
							   					babyFatherId: null
							   },
							   appearances: 	looks

							});

		// console.log("***************************************************");
		// console.log("** NEW BABY: " + results.name.first + " " + results.familyName + " / " + gender);
		// console.log("***************************************************");



		per.save(function (err) {
			if(err) {
				callback(err);
			} else {
    			callback(per._id);				
			}
		});

	});

	
}