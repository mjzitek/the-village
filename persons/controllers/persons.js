var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings.js');
var tMoment = require('../helpers/time.js');


 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');


// Controllers
var gameSettings = require('./gamesettings');
var time = require('./time');
var families = require('./families');

/***************************************************************************************
 *	
 *	Get Info
 *
 *
 ***************************************************************************************/

/* Individuals */



exports.getPerson = function(personId, callback) {
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




exports.getAge = function(personId, yearsOld, callback) {
	Person.findOne({_id: personId}, function(err, per) {
		// Get current game datetime
		//console.log('getAge: ' + personId);
		//console.log('getAge: ' + yearsOld);
		//if(per)
		//{
			gameSettings.getValueByKey('time', function(time) {
				curGameTime = moment(time.setvalue);
				birthDate = moment(per.dateOfBirth);
				
				// console.log("XX " + personId);
				// console.log("XX Birth Date: " + per.dateOfBirth + ' | ' + birthDate);
				// console.log("XX Current Game Time: " +  time.setvalue + ' | ' + curGameTime);

				curAge = tMoment.getDifference(curGameTime, birthDate);

				callback(curAge);

			});
		//}
		//callback();
	});
}

exports.getSurname = function(personId, callback) {
	Person.findOne({_id: personId}).populate('familyInfo').exec(function(err, doc) {
		callback (doc.lastName);
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
			Person.find(query, fields).skip(ranNum).limit(1).exec(function(err, per) {
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



	time.getGameClock(function(gClock) {

		var gC = moment(gClock);
		var minMarriageDate = gC.subtract("y", settings.minMarriageAge).format('YYYY-MM-DD');

		query["dateOfBirth"] = { "$lt" : minMarriageDate }
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

exports.getPersonsAlive = function(callback) {
	Person.find({ dateOfDeath: null }).populate('familyInfo').sort( { dateOfBirth: 1 } ).exec(function(err, doc) {
		callback (doc);
	});

}

exports.populationCountTotal = populationCountTotal
function populationCountTotal(callback) {
	Person.count({ dateOfDeath: null }, function(err, c) { callback(c); });
}


exports.populationCountAlive = populationCountAlive
function populationCountAlive(callback) {
	Person.count( { dateOfDeath: null }, function(err, c) { callback(c); });
}

exports.populationCountFiltered = populationCountFiltered;
function populationCountFiltered(filter, callback) {
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

exports.getMarriageEligibleSingles = function(gender, callback) {

	Person.find({ gender: gender, attributes: {married: false}, dateOfDeath: null }).populate('familyInfo').sort( { dateOfBirth: 1 } ).exec( function(err, sme) {
		var age = 0;
		var meSingles = [];
		if(sme) {
			sme.forEach(function(sngl) {
				age = GetAge(gameClock, sngl.dateOfBirth);
				//console.log(sngl._id + " => " + age.years + " / " + settings.minMarriageAge)	
				if(age.years >= settings.minMarriageAge)
				{
					meSingles.push(sngl);
				}
			});

		}	
		callback(meSingles);
		
	})
}




exports.getSiblingsSameParents = function(personId, callback) {
	Person.findOne({ _id: personId}, function(err, per) {
		Person.find( { $or: [ { fatherInfo: per.fatherInfo, motherInfo: per.motherInfo }, { $ne: {fatherInfo: null }}]}, function(err, sibs) {
			callback(sibs);
		});
	});
}


// exports.breed = function(personId, callback) {
// 	var minAge = settings.minBreedAge;
// 	var age;
// 	var oldEnough;

// 	// Person.findOne({ _id: personId }, function(err, per) {
// 	// 	exports.getAge(personId, 1, function (perAge){ 
				
// 	// 		console.log("Min age: " + minAge);
// 	// 		console.log("Per age: " + perAge.years);
	
// 	// 		if(perAge.years >= minAge) {
// 	// 			oldEnough = true;
// 	// 		} else {
// 	// 			oldEnough = false;
// 	// 		}
			
// 	// 		callback(oldEnough);
// 	// 	});
// 	// });

// 	// persons.getAge(testId,1, function(age) {
// 	// 	console.log("ZZ AGE: ");
// 	// 	console.log(age);		
// 	// });


// 	exports.getAge(personId, 1, function(age) {
// 		callback("blue");
// 	});
// }

exports.breed = function(fatherId, motherId, callback) {

	var frAge;
	var mrAge;
	var minAge = settings.minBreedAge;
	var maxAge = settings.maxBreedAgeFemale;
	var oldEnough;
	var tooOld;
	var fatherAlive = false;
	var motherAlive = false;
	var r;

	async.series({
		fatherAge: function(callback) {
			exports.getAge(fatherId, 1, function(a) {
				//console.log("breed: " + fatherId);
				//console.log("breed: ");
				//console.log(a);
				frAge = a.years;
				callback(null, frAge);
			});
			
		},
		fatherAlive: function(callback) {
			exports.getPerson(fatherId, function(f) {
				if(f.dateOfDeath == null) { fatherAlive = true; callback(null, true);}
				else { callback(null, false);}
			});
		},
		motherAge: function(callback) {
			exports.getAge(motherId, 1, function(a) {
				mrAge = a.years;
				callback(null, mrAge);
			});
		},
		motherAlive: function(callback) {
			exports.getPerson(motherId, function(m) {
				if(m.dateOfDeath == null) { motherAlive = true; callback(null, true);}
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
			if(oldEnough && !tooOld && fatherAlive && motherAlive) {
				// giveBirth(fatherId, motherId, function() {
				// 	callback();
				
				// });

				// Get pregnant
				setPregnant(fatherId, motherId, function() {
					callback();
				});

				callback(null, '** New Baby **');
			}
		} 
	},
	function(err, results) {

    	//console.log(results);
    	callback(results);
	});
}

/***************************************************************************************
 *	
 *	Actions
 *
 *
 ***************************************************************************************/

setPregnant = function(fatherId, motherId, callback) {
	gameSettings.getValueByKey('time', function(time) {
		console.log()				
		curGameTime = moment(time.setvalue);

		Person.update({_id: motherId }, { pregnancy: { pregnant: true, pregnancyDate: curGameTime, babyFatherId: fatherId }}, function(err, doc) {
			callback('pregnant');
		});
	});
}

//giveBirth = function(familyId, familyName, fatherId, motherId, callback) {
exports.giveBirth = function(fatherId, motherId, callback) {

	gender = PickGender();

	name = GetName(gender);

	exports.getPerson(fatherId, function(father) {
  						
			families.getFamilyName(father.familyInfo._id, function(famName) {				

						//console.log(name);
						gameSettings.getValueByKey('time', function(time) {
						
							curGameTime = moment(time.setvalue);
							var per = new Person({ familyInfo: father.familyInfo._id, 
												   firstName: name.first,
												   middleName:  name.middle,
												   lastName: famName,
												   gender: gender,
												   dateOfBirth: curGameTime,
												   placeOfBirth: null,
												   dateOfDeath: null,
												   headOfFamily: 0,
												   fatherInfo: fatherId, 
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


							console.log("***************************************************");
							console.log("** NEW BABY: " + name.first + " " + famName + " / " + gender);
							console.log("***************************************************");

							per.save(function (err) {


							});

								Person.update({_id: motherId }, { pregnancy: { pregnant: false, pregnancyDate: null, babyFatherId: null }}, function(err, doc) {
									if(err)
									{
										console.log(err);
									} else {
										callback(motherId + ' no longer pregnant');
									}
								});

							
						});
			});	
		});	
}

exports.setMarried = setMarried;
function setMarried(personId, familyId, callback) {

	console.log("Setting married: " + personId + "(" + familyId + ")");
	Person.update({_id: personId }, { attributes: { married: true}, familyInfo: familyId }, function(err,doc) {
		if(err) {
			console.log("Error updating married: " + err)
		} else {
			callback('updated');
		}
	});

}

exports.getMarried = getMarried;
function getMarried() {
	getMarriageEligibleSingle("M", "", function(mPer) {
		getMarriageEligibleSingle("F", mPer.familyInfo, function(fPer) {
			//relationships.performMarriage(selMale._id, selFemale._id, selMale._id, function() {
								console.log("++ MARRIAGE ++ " + mPer.firstName + " " + mPer.lastName + " & " + fPer.firstName + " " + fPer.lastName);
								console.log("Performing marriage and creating new family...");

								// families.createNewFamily(selMale._id, selFemale._id, function(familyId) {
									
								// 	setMarried(selMale._id, familyId, function(d) { 
								// 		persons.setMarried(selFemale._id, familyId, function(d) { callback() });
								// 	});	
									
		

		});
	});


}

exports.killOff = function(personId, callback) {
	gameSettings.getValueByKey('time', function(time) {
						
		curGameTime = moment(time.setvalue);
		Person.update( { _id: personId} , { dateOfDeath: curGameTime}, function (err, doc) {
			if(err) console.log(err);
			callback(personId + ' has died at ' + curGameTime);
		});
	});
}

function PickGender()
{
	var ranNum = (Math.floor(Math.random() * 100));

	if(ranNum < 50) {
		return 'M';
	} else
	{
		return 'F';
	}
}



function GetRandomName(filename, line_no) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    line_no = line_no - 1;
    if(line_no < 0) line_no = 0;

    // if(lines[line_no] == '') 
    // {
    // 	GetRandomName()
    // }

    return lines[line_no];
}


function GetName(gender) {

	var nameFile;

	if(gender == "M")
	{
		nameFile = 'male_names.txt';
	} else if (gender == "F")
	{
		nameFile = 'female_names.txt';
	}

	var first = GetRandomName('./models/' + nameFile, (Math.floor(Math.random() * 200)));
	var middle = GetRandomName('./models/' + nameFile, (Math.floor(Math.random() * 200)));

	var name = { first: first, middle: middle };

	return name;
}


function OldEnoughToBreed(curAge)
{
	var minAge = settings.minBreedAge;

	var oldEnough;

	if(curAge >= minAge) {
		oldEnough = true;
	} else {
		oldEnough = false;
	}

	return oldEnough;

}

var GetAge = function(gameClock, birthDate)
{
	curGameTime = moment(gameClock);
	birthDate = moment(birthDate);
			
	curAge = tMoment.getDifference(curGameTime, birthDate);

	return curAge;
}

// var GetAge = function(personId, yearsOld, callback) {

// 	Person.findOne({_id: personId}, function(err, per) {
// 		// Get current game datetime

// 		gameSettings.getValueByKey('time', function(time) {
// 			curGameTime = moment(time.setvalue);
// 			birthDate = moment(per.dateOfBirth);
// 			//console.log(time);
// 			//console.log("XX Birth Date: " + per.dateOfBirth + ' | ' + birthDate);
// 			//console.log("XX Current Game Time: " +  time.setvalue + ' | ' + curGameTime);
// 			curAge = tMoment.getDifference(curGameTime, birthDate);

// 			callback(curAge);

// 		});
// 	});
// }

