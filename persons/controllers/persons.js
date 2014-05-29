var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings.js');
var tMoment = require('../helpers/time.js');


 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');



var gameSettings = require('./gamesettings');
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





exports.getAge = function(personId, yearsOld, callback) {
	Person.findOne({_id: personId}, function(err, per) {
		// Get current game datetime

		gameSettings.getValueByKey('time', function(time) {
			curGameTime = moment(time.setvalue);
			birthDate = moment(per.dateOfBirth);
			
			// console.log("XX " + personId);
			// console.log("XX Birth Date: " + per.dateOfBirth + ' | ' + birthDate);
			// console.log("XX Current Game Time: " +  time.setvalue + ' | ' + curGameTime);

			curAge = tMoment.getDifference(curGameTime, birthDate);

			callback(curAge);

		});
	});
}

exports.getSurname = function(personId, callback) {
	Person.findOne({_id: personId}).populate('familyInfo').exec(function(err, doc) {
		callback (doc.lastName);
	});

}

/* Group */

exports.getPersons = function(callback) {
	Person.find({}).populate('familyInfo').exec(function(err, doc) {
		callback (doc);
	});

}

exports.totalPopulation = function(callback) {
	Person.count({}, function(err, c) { callback(c); });
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
	Person.find({ gender: gender, attributes: {married: false}}, function(err, singles) {
		callback(singles);
	})
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
	var r;

	async.series({
		fatherAge: function(callback) {
			exports.getAge(fatherId, 1, function(a) {
				frAge = a.years;
				callback(null, frAge);
			});
			
		},
		motherAge: function(callback) {
			exports.getAge(motherId, 1, function(a) {
				mrAge = a.years;
				callback(null, mrAge);
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
			if(oldEnough && !tooOld) {
				giveBirth(fatherId, motherId, function() {
					callback();
				
				});
				callback(null, '** New Baby **');
			}
		} 
	},
	function(err, results) {

    	console.log(results);
    	callback(results);
	});
}

/***************************************************************************************
 *	
 *	Actions
 *
 *
 ***************************************************************************************/


//giveBirth = function(familyId, familyName, fatherId, motherId, callback) {
giveBirth = function(fatherId, motherId, callback) {

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
												   headOfFamily: 0,
												   fatherInfo: fatherId, 
												   motherInfo: motherId,
												   attributes: {
												   					married: false
												   			   }
											     });


							console.log("******************************************");
							console.log(father.familyInfo._id);
							console.log(famName);
							console.log(gender);
							console.log(name.first);
							console.log("******************************************");

							per.save(function (err) {});


							
						});
			});	
		});	
}

exports.setMarried = function(personId, familyId, callback) {

	console.log("Setting married: " + personId + "(" + familyId + ")");
	Person.update({_id: personId }, { attributes: { married: true}, familyInfo: familyId }, function(err,doc) {
		if(err) {
			console.log("Error updating married: " + err)
		} else {
			callback('updated');
		}
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

var GetAge = function(personId, yearsOld, callback) {

	Person.findOne({_id: personId}, function(err, per) {
		// Get current game datetime

		gameSettings.getValueByKey('time', function(time) {
			curGameTime = moment(time.setvalue);
			birthDate = moment(per.dateOfBirth);
			//console.log(time);
			console.log("XX Birth Date: " + per.dateOfBirth + ' | ' + birthDate);
			console.log("XX Current Game Time: " +  time.setvalue + ' | ' + curGameTime);
			curAge = tMoment.getDifference(curGameTime, birthDate);

			callback(curAge);

		});
	});

}