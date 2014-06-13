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


/***************************************************************************************
 *	
 *	Get Info
 *
 *
 ***************************************************************************************/

/* Individuals */

exports.get = getPerson;
exports.getPerson = getPerson;
function getPerson(personId, callback) {
	Person.findOne({_id: personId}).populate('familyInfo').exec(function(err, doc) {
		callback (doc);
	});

}

exports.getPersonFiltered = getPersonFiltered
function getPersonFiltered(query, fields, callback) {
	Person.findOne(query, fields).populate('familyInfo').exec(function(err, doc) {
		callback (doc);
	});

}


exports.age = getAge;
exports.getAge = getAge;
function getAge(personId, callback) {
	Person.findOne({_id: personId}, function(err, per) {
			gameSettings.getValueByKey('time', function(time) {
				curGameTime = moment(time.setvalue);
				birthDate = moment(per.dateOfBirth);

				curAge = tMoment.getDifference(curGameTime, birthDate);

				callback(curAge);
			});
	});
}

// var GetAge = function(gameClock, birthDate)
// {
// 	curGameTime = moment(gameClock);
// 	birthDate = moment(birthDate);
			
// 	curAge = tMoment.getDifference(curGameTime, birthDate);

// 	return curAge;
// }

exports.getSurname = function(personId, callback) {
	Person.findOne({_id: personId}).populate('familyInfo').exec(function(err, doc) {
		if(doc)
		{
			callback(doc.lastName);
		} else {
			callback(personId + " not found");
		}
	});

}

/* Group */

exports.getPersons = function(callback) {
	Person.find({}).populate('familyInfo').sort( { dateOfBirth: 1 } ).exec(function(err, doc) {
		callback (doc);
	});

}

exports.getRandomPerson = getRandomPerson;
function getRandomPerson(query, fields, callback) {

	//console.log(query);

	populationCountFiltered(query, function (persCount) {


			var ranNum = (Math.floor(Math.random() * persCount))
			//console.log(ranNum);
			Person.findOne(query, fields).skip(ranNum).limit(1).exec(function(err, per) {
					callback(per);
			});

	});

}


// Return a random marriage eligible single person based on gender given
exports.getMarriageEligibleSingle = getMarriageEligibleSingle
function getMarriageEligibleSingle(gender, familyId, callback) {
	//console.log(gender);
	//console.log(familyId);

	var query = {};
	var fields = {};

	query["gender"] = gender;
	query["attributes"] = { married: false };
	query["dateOfDeath"] = null;

	if(familyId != "") {
		query["familyInfo"] = { "$ne" : familyId };
	}

	fields["firstName"] = 1;
	fields["lastName"] = 1;
	fields["familyInfo"] = 1;

	try {

		time.getGameClock(function(gClock) {

			var gC = moment(gClock);
			var minMarriageDate = gC.subtract("y", settings.minMarriageAge).format('YYYY-MM-DD');

			query["dateOfBirth"] = { $lt : minMarriageDate }
			//console.log(query);

			populationCountFiltered(query, function(persCount) {
				var ranNum = (Math.floor(Math.random() * persCount))
				//console.log(ranNum);
				Person.findOne(query, fields).skip(ranNum).exec(function(err, per) {
					callback(per);
				});
			});
		});
	}
	catch (e) {
		callback(e);
	}
}

exports.getMarriageEligibleSingles = getMarriageEligibleSingles;
function getMarriageEligibleSingles(gender, callback) {

	var query = {};
	var fields = {};

	query["gender"] = gender;
	query["attributes"] = { married: false };
	query["dateOfDeath"] = null;


	fields["firstName"] = 1;
	fields["lastName"] = 1;
	fields["familyInfo"] = 1;

	time.getGameClock(function(gClock) {

		var gC = moment(gClock);
		var minMarriageDate = gC.subtract("y", settings.minMarriageAge).format('YYYY-MM-DD');

		query["dateOfBirth"] = { $lt : minMarriageDate }
		//console.log(query);

		populationCountFiltered(query, function(persCount) {
			//console.log(ranNum);
			Person.find(query, fields).exec(function(err, pers) {
				callback(pers);
			});
		});
	});
}


exports.getRandomBabyReadyWomen = getRandomBabyReadyWomen;
function getRandomBabyReadyWomen(married, persAmount, callback) {
	var query = {};
	var fields = {};

	query["attributes"] = { married: married };
	query["dateOfDeath"] = null;
	query["gender"] = "F";

	fields["firstName"] = 1;
	fields["lastName"] = 1;
	fields["familyInfo"] = 1;



	time.getGameClock(function(gClock) {

		var gC = moment(gClock);
		var gC2 = moment(gClock);

		var minBirthDate = gC.subtract("y", settings.minBreedAge).format('YYYY-MM-DD');
		var maxBirthDate = gC2.subtract("y", settings.maxBreedAgeFemale).format('YYYY-MM-DD');

	
		query["dateOfBirth"] = { '$lt' :  minBirthDate, '$gte' : maxBirthDate }
		///console.log(query);

		Person.count(query).exec(function(err, persCount) {
			var ranNum = (Math.floor(Math.random() * persCount))
			//console.log("PC " + persCount);
			Person.find(query, fields).skip(ranNum).limit(persAmount).exec(function(err, per) {
				//console.log(per);
				callback(per);
			});
		});
	});	


}


exports.getPersonsAlive = function(callback) {
	Person.find({ dateOfDeath: null }).populate('familyInfo').sort( { dateOfBirth: 1 } ).exec(function(err, doc) {
		callback (doc);
	});

}

exports.populationCountTotal = populationCountTotal
function populationCountTotal(callback) {
	Person.count({}, function(err, c) { callback(c); });
}


exports.count = populationCountAlive;
exports.populationCountAlive = populationCountAlive
function populationCountAlive(callback) {
	Person.count( { dateOfDeath: null }, function(err, c) { callback(c); });
}

exports.populationCountFiltered = populationCountFiltered;
function populationCountFiltered(filter, callback) {
	//console.log(filter);
	Person.count(filter, function(err, c) { callback(c); });
}



exports.getPregnantWomen = function(callback) {
	Person.find({ "pregnancy.pregnant" : true, dateOfDeath: null }).populate('familyInfo').exec(function(err, preg) {
		callback(preg);
	});
}

exports.getChildrenByFather = function(fatherId, callback) {
	Person.find({ fatherInfo: fatherId }, function(err, children) {
		callback(children);
	});
}



exports.getChildrenByMother = function(motherId, callback) {
	Person.find({ motherInfo: motherId}, function(err, children) {
		callback(children);
	});
}

exports.getSingles = function(gender, callback) {
	Person.find({ gender: gender, attributes: {married: false}, dateOfDeath: null }).populate('familyInfo').sort( { dateOfBirth: 1 } ).exec(function(err, singles) {

		callback(singles);
	})
}






exports.getSiblingsSameParents = function(personId, callback) {
	Person.findOne({ _id: personId}, function(err, per) {
		//console.log(per);
		Person.find( { $or: [ { fatherInfo: per.fatherInfo, motherInfo: per.motherInfo }, 
					 { $ne: {fatherInfo: null }}]}, function(err, sibs) {
			if(err) {
				callback(err);
			} else {
				callback(sibs);
			}		 	 
			
		});
	});
}


exports.getParents = getParents
function getParents(personId, callback) {
	Person.findOne({ _id: personId}, { fatherInfo: 1, motherInfo : 1}, function(err, per) {
		callback(per);
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

/***************************************************************************************
 *	
 *	Actions
 *
 *
 ***************************************************************************************/

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

	async.series({
		gender: function(callback) {
			gender = pickGender();
			//console.log(gender);
			callback(null,gender);
		},
		name: function(callback) {

			name = names.getRandomName(gender);
			//console.log(name);
			callback(null, name);
		},
		mother: function(callback) {
			getPerson(motherId, function(mom) {
				//console.log(mom._id + " " + mom.firstName + " " + mom.lastName);
				if(mom)
				{
					mother = mom;
					callback(null, mom);
				} else
				{
					callback(null, null);
				}
			});
		},
		familyName: function(callback) {
			families.getFamilyName(mother.familyInfo._id, function(famName) {
				//console.log(famName);
				if(famName)
				{
					callback(null, famName)
				} else
				{
					callback(null, null);
				}
			});
		},
		curDate: function(callback) {
			time.getGameClock(function(gameTime) {
				if(gameTime)
				{
					callback(null, gameTime);
				} else
				{
					callback(null, null);
				}
			});
		},
		motherStatus : function(callback) {
			Person.update({_id: motherId }, { pregnancy: { pregnant: false, pregnancyDate: null, babyFatherId: null }}, function(err, doc) {
				if(err)
				{
					callback(null, err)
				} else {
					callback(null, motherId + ' no longer pregnant');
				}
			});
		}
	},
	function(err, results) {
		var per = new Person({ 
							   familyInfo: results.mother.familyInfo._id, 
							   firstName: results.name.first,
							   middleName:  results.name.middle,
							   lastName: results.familyName,
							   gender: results.gender,
							   dateOfBirth: results.curDate,
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
							   }

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

exports.setMarried = setMarried;
function setMarried(personId, familyId, callback) {

	//console.log("Setting married: " + personId + "(" + familyId + ")");
	Person.update({_id: personId }, { attributes: { married: true}, familyInfo: familyId }, function(err,doc) {
		if(err) {
			console.log("Error updating married: " + err)
			callback(err);
		} else {
			callback('updated');
		}
	});

}

exports.performMarriage = performMarriage;
function performMarriage(callback) {
	getMarriageEligibleSingle("M", "", function(mPer) {
		if(mPer)
		{
			getMarriageEligibleSingle("F", mPer.familyInfo, function(fPer) {
				if(fPer)
				{
					relationships.performMarriage(mPer._id, fPer._id, function() {
										//console.log("++ MARRIAGE ++ " + mPer.firstName + " " 
										//			+ mPer.lastName + " & " + fPer.firstName + " " + fPer.lastName);
										//console.log("Performing marriage and creating new family...");

										families.createFamilyRecord(mPer.lastName, function(familyId) {
											
											setMarried(mPer._id, familyId, function(d) { 
												setMarried(fPer._id, familyId, function(d) {callback(d);});
											});	
										});						
					});
				} else {
					callback('marriage not performed - no female');
				}
			});
		} else {
			callback('marriage not performed - no male');			
		}

	});

}

exports.kill = killOff;
exports.killOff = killOff;
function killOff(personId, callback) {
	gameSettings.getValueByKey('time', function(time) {
						
		curGameTime = moment(time.setvalue);
		Person.update( { _id: personId} , { dateOfDeath: curGameTime}, function (err, doc) {
			if(err)
			{
				console.log(err);
				callback(err);
			} else 
			{

				relationships.endRelationship(personId, 'death of spouse', function(c) {
					callback(personId + ' has died at ' + curGameTime);
				});
			}
			
		});
	});
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




// Creates a new perons and returns _id;
// params:  person - JSON formatted Person object
exports.create = createPerson
exports.createPerson = createPerson
function createPerson(person, callback) {

		var per = new Person(person);
		var personId = per._id;

		per.save(function (err) {
			callback(personId);
		});

}

exports.remove = removePerson
exports.removePerson = removePerson
function removePerson(personId, callback) {
	Person.remove( { _id : personId}, function(err, doc) {
		if(err) {
			callback(err);
		} else
		{
			callback();
		}
	});
}

exports.removeAll = removeAllPersons;
exports.removeAllPersons = removeAllPersons;
function removeAllPersons(callback) {
	Person.remove({}, function(err, doc) {
		if(err) {
			callback(err);
		} else
		{
			callback();
		}		
	});
}