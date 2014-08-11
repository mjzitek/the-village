var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../lib/time');
var names = require('../lib/names');
var genetics = require('../lib/genetics');

 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');


// Controllers
var gameSettings = require('./gamesettings');
var persons = require('./persons');
var time = require('./time');
var families = require('./families');
var relationships = require('./relationships');
var personevents = require('./personevents');



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
			persons.getAge(fatherId, function(a) {
				frAge = a.years;
				callback(null, frAge);
			});
			
		},
		fatherStatus: function(callback) {
			persons.getPerson(fatherId, function(f) {
				if(f.dateOfDeath === null) { fatherStatus = true; callback(null, true);}
				else { callback(null, false);}
			});
		},
		motherAge: function(callback) {
			persons.getAge(motherId, function(a) {
				mrAge = a.years;
				callback(null, mrAge);
			});
		},
		motherStatus: function(callback) {
			persons.getPerson(motherId, function(m) {
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
	 		 	persons.getPerson(motherId, function(p) {
		 			var pers = [];
					pers.push(p);

					var info = {
						persons: pers,
						eventType: 'pregnancy',
						eventDate: curGameTime,
						realworldDate: new Date()
					}

					personevents.add(info, function(doc) {
						callback();
					});
				});
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
	try {
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
				persons.getPerson(motherId, function(mom) {
					//console.log(mom._id + " " + mom.firstName + " " + mom.lastName);

						callback(null, gender, name, mom);
						//console.log(mom);

				});
			},	
			// Get Dad	
			function(gender, name, mom, callback) {
				persons.getPerson(mom.pregnancy.babyFatherId, function(dad) {
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
				var genes = {};

				////////////////
				// Eyes
				
					genes.eyes = genetics.eyeColor(dad, mom);
					
					var skin = genetics.skinColor(dad, mom);	

					genes.skin = {
									color : skin.color,
									one: { R: skin.one.R, G: skin.one.G, B: skin.one.B},
									two: { R: skin.two.R, G: skin.two.R, B: skin.two.B}
					}

					var hair = genetics.hairColor(dad, mom);

					console.log(hair);

					genes.hair = {
									color : { R: hair.color.R, G: hair.color.G, B: hair.color.B},
									one: { R: hair.one.R, G: hair.one.G, B: hair.one.B},
									two: { R: hair.two.R, G: hair.two.R, B: hair.two.B}
					}

					// var height = genetics.height(dad, mom);

					// genes.height = {
					// 				height : height.height,
					// 				one : height.one,
					// 				two : height.two
					// }

					callback(null, gender, name, mom, dad, gameTime, genes);
			},
			// Update mom status
			function(gender, name, mom, dad, gameTime, genes, callback) {
				Person.update({_id: motherId }, { pregnancy: { pregnant: false, pregnancyDate: null, babyFatherId: null }}, function(err, doc) {
					callback(null, gender, name, mom, dad, gameTime, genes);
				});
			}
		],
		function(err, gender, name, mom, dad, gameTime, genes) {
			if(mom && dad && mom.familyInfo && dad.familyInfo) {

				//console.log(looks);
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
									   fatherInfo: mom.pregnancy.babyFatherId, 
									   motherInfo: motherId,
									   attributes: {
									   					married: false
									   			   },
									   pregnancy: {
									   					pregnant: false,
									   					pregnancyDate: null,
									   					babyFatherId: null
									   },
									   genome: 	{ genes : genes }

									});

				// console.log("***************************************************");
				// console.log("** NEW BABY: " + results.name.first + " " + results.familyName + " / " + gender);
				// console.log("***************************************************");



				per.save(function (err) {
					if(err) {
						callback(err);
					} else {
						gameSettings.getValueByKey('time', function(time) {
							
							curGameTime = moment(time.setvalue);
							var pers = [];
							pers.push(per);

							var info = {
								persons: pers,
								eventType: 'birth',
								eventDate: curGameTime,
								realworldDate: new Date()
							}

							personevents.add(info, function(doc) {
								callback(per._id);	
							});
						});		
					}
				});

			} else {
				console.log("****** MISSING MOM OR DAD ********")
				console.log(motherId);
				console.log(mom);
				console.log(dad);

				console.log("**********************************");
				callback(null);
			}

		});
	} catch (err) {
		console.log(err);
		console.log("Mom:");
		console.log(mom);
		console.log("Dad:");
		console.log(dad);

	}
	
}


exports.pickGender = pickGender;
function pickGender()
{
	var ranNum = (Math.floor(Math.random() * 100));

	if(ranNum < 50) {
		return 'M';
	} else
	{
		return 'F';
	}
}
