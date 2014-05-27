var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings.js');
var tMoment = require('../helpers/time.js');


 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');

var gameSettings = require('./gamesettings');


/***************************************************************************************
 *	
 *	Get Info
 *
 *
 ***************************************************************************************/

exports.getPersons = function(callback) {
	Person.find({}).populate('familyInfo').exec(function(err, doc) {
		callback (doc);
	});

}

exports.getPerson = function(personId, callback) {
	Person.findOne({_id: personId}).populate('familyInfo').exec(function(err, doc) {
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
	Person.find({ motherId: motherId}, function(err, children) {
		callback(children);
	});
}


exports.getAge = function(personId, yearsOld, callback) {
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

exports.breed = function(personId, callback) {

	var age;
	var minAge = settings.minBreedAge;
	var oldEnough;
	var r;

	async.series({
		age: function(callback) {
			exports.getAge(personId, 1, function(a) {
				age = a.years;
				callback(null, age);
			})
			
		},
		oldEnough: function(callback) {
			if(age >= minAge) {
				oldEnough = true;
			} else {
				oldEnough = false;
			}
			callback(null, oldEnough);
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



exports.giveBirth = function(familyId, familyName, fatherId, motherId, callback) {

						gender = 'M';

						name = GetName(PickGender());
  						
					

						//console.log(name);

						var per = new Person({ familyInfo: familyId, 
											   firstName: name.first,
											   middleName:  name.middle,
											   lastName: familyName,
											   gender: gender,
											   dateOfBirth: new Date(),
											   placeOfBirth: null,
											   headOfFamily: 0,
											   fatherInfo: fatherId, 
											   motherInfo: motherId
										     });

						//console.log("U:" + u);
						//console.log("I:" + i);
						//console.log("inv: " + inv);
						//self = this;

						per.save(function (err) {

							// if (err) {
							//  	//console.log("Error Code: " + err);
							//  	// Unique key violation
			    // 				if (11001 === err.code || 11000 === err.code) {

			    // 					Inventory.update({villageInfo: villageId, itemInfo: i._id}, 
							// 			{'$inc': { quantity: amount }, lastUpdated: new Date()}, function( err, doc) {
							// 			//console.log('Updating ' + itemName + ' for ' + u.username);
							// 			callback({messageType: "Updated", message: ""});
							// 		});

									
			    // 				}
			    			
			    // 			} else {
			    // 				//console.log('Added ' + itemName + ' for ' + u.username);
							//	callback({messageType: "Added", message: ""});
			    			//}


						});

}

function PickGender()
{
	var ranNum = (Math.floor(Math.random() * 100));

	if(ranNum < 60) {
		return 'M';
	} else
	{
		return 'F';
	}
}



function GetRandomName(filename, line_no) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");

    if(+line_no > lines.length){
      throw new Error('File end reached without finding line');
    }

    line_no = line_no - 1;

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

	var first = getRandomName('./models/' + nameFile, (Math.floor(Math.random() * 100)));
	var middle = getRandomName('./models/' + nameFile, (Math.floor(Math.random() * 100)));

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