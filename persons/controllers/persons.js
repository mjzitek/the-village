var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../lib/time');
var names = require('../lib/names');


 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');


// Controllers
var gameSettings = require('./gamesettings');
var time = require('./time');
var families = require('./families');
var relationships = require('./relationships');
var personevents = require('./personevents');


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
		if(per) {
			gameSettings.getValueByKey('time', function(time) {
				curGameTime = moment(time.setvalue);
				birthDate = moment(per.dateOfBirth);

				curAge = tMoment.getDifference(curGameTime, birthDate);

				callback(curAge);
			});
		}
	});
}


exports.getSurname = getSurname;
function getSurname(personId, callback) {
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

exports.getPersons = getPersons;
function getPersons(callback) {
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

exports.getPersonsAlive = getPersonsAlive
function getPersonsAlive(callback) {
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




exports.getChildrenByFather = getChildrenByFather
function getChildrenByFather(fatherId, callback) {
	Person.find({ fatherInfo: fatherId }, function(err, children) {
		callback(children);
	});
}


exports.getChildrenByMother = getChildrenByMother;
function getChildrenByMother(motherId, callback) {
	Person.find({ motherInfo: motherId}, function(err, children) {
		callback(children);
	});
}

exports.getChildrenGrandchildren = getChildrenGrandchildren;
function getChildrenGrandchildren(personId, callback) {
		var data = {}
		var children = [];
		console.log("Getting data for " + personId);
		async.waterfall([
			function(callback) {
				  	getPerson(personId, function(per) {
				  		callback(null, per);
				  	});
			},
			function(per, callback)
			{
				var data = {}
				data['id'] = per._id;
				data['name'] = per.firstName + ' ' + per.lastName;
				callback(null, per, data)
			},
			function(person, data, callback)
			{

				if(person.gender == "M")
				{
					getChildrenByFather(person._id, function(children) {
						callback(null, person, children, data);
					});
				} else if (person.gender == "F")
				{
					getChildrenByMother(person._id, function(children) {
						callback(null, person, children, data);
					});
				}
			},
			function(person, children, data, callback)
			{
				var waiting = 0;
				var childrenArray = [];

				children.forEach(function(c) {
					waiting++;
					var grandchildrenArray = [];
					console.log("waiting++ " + waiting);
					if(c.gender == "M")
					{
						getChildrenByFather(c._id, function(gc) {
							
							gc.forEach(function(gcc) {
								console.log('gc: ' + gcc._id);
								grandchildrenArray.push({ 'id' : gcc._id, 'name' : gcc.firstName + ' ' + gcc.lastName, 'gender' : gcc.gender, 
														  'relation' : 'grandchild' });
							});
							waiting--;
							console.log("waiting-- " + waiting);
								childrenArray.push({ 'id' : c._id, 'name' : c.firstName + ' ' + c.lastName, 'gender' : c.gender, 
												     'relation': 'child', 'children' : grandchildrenArray });
							if(waiting == 0)
							{
								console.log(childrenArray);
								callback(null, person, childrenArray, data);
							}

						});
					} else if (c.gender == "F")
					{
						getChildrenByMother(c._id, function(gc) {
							
							gc.forEach(function(gcc) {
								console.log('gc: ' + gcc._id);
								grandchildrenArray.push({ 'id' : gcc._id, 'name' : gcc.firstName + ' ' + gcc.lastName, 'gender' : gcc.gender, 
														  'relation' : 'grandchild' });
							});
							waiting--;
							console.log("waiting-- " + waiting);
								childrenArray.push({ 'id' : c._id, 'name' : c.firstName + ' ' + c.lastName, 'gender' : c.gender, 
												     'relation': 'child', 'children' : grandchildrenArray });
							if(waiting == 0)
							{
								console.log(childrenArray);
								callback(null, person, childrenArray, data);
							}

						});
					}
				});

			}
		],
		function(err, per, childrenArray, data) {

			data['children'] = childrenArray;
	    	if(err) {
	    		callback(err);
	    	} else
	    	{
	    		console.log(data);
	    		callback(data);    		
	    	}

		});

}

exports.getSingles = getSingles;
function getSingles(gender, callback) {
	Person.find({ gender: gender, attributes: {married: false}, dateOfDeath: null }).populate('familyInfo').sort( { dateOfBirth: 1 } ).exec(function(err, singles) {

		callback(singles);
	})
}





exports.getSiblingsSameParents = getSiblingsSameParents;
function getSiblingsSameParents(personId, callback) {
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


exports.getParents = getParents;
function getParents(personId, callback) {
	Person.findOne({ _id: personId}, { fatherInfo: 1, motherInfo : 1}).populate('fatherInfo motherInfo').exec(function(err, per) {
		//console.log(per);
		callback(per);
	});
}

exports.getParentsGrandparents = getParentsGrandparents;
function getParentsGrandparents(personId, callback) {

		console.log("Getting Parent/Grandparent data for " + personId);
		async.waterfall([
			// Get Person
			function(callback) {
				getPerson(personId, function(per) {
				  	callback(null, per);
				});
			},
			// Get Person's Parents
			function(person, callback)
			{
				getParents(personId, function(parents) {
					callback(null, person, parents);
				});
			},

			// Get Person's Father's Parents
			function(person, parents, callback)
			{
				getParents(parents.fatherInfo._id, function(fatherParents) {
					callback(null, person, parents, fatherParents);
				});
			},	

			// Get Person's Mother's Parents
			function(person, parents, fatherParents, callback)
			{
				getParents(parents.motherInfo._id, function(motherParents) {
					callback(null, person, parents, fatherParents, motherParents);
				});				
			}

		],
		function(err, person, parents, fatherParents, motherParents) {
		var data = {}
		
	    	if(err) {
	    		console.log(err);
	    		callback(err);
	    	} else
	    	{
	    		data["person"] = person;
	    		data["parents"] = parents;
	    		data["fatherParents"] = fatherParents;
	    		data["motherParents"] = motherParents;

	    		callback(data);    		
	    	}

		});
}





/***************************************************************************************
 *	
 *	Actions
 *
 *
 ***************************************************************************************/



exports.setMarried = setMarried;
function setMarried(personId, familyId, familyName, callback) {

	var updates = {};
	updates.attributes = { married: true }
	updates.familyInfo = familyId;

	if(familyName != "") {
		updates.lastName = familyName;
	}

	console.log("Setting married: " + personId + "(" + familyName + ")");
	Person.update({_id: personId }, updates, function(err,doc) {
		if(err) {
			console.log("Error updating married: " + err)
			callback(err);
		} else {
			callback('updated');
		}
	});

}

exports.performMarriage = performMarriage;
function performMarriage(callback) 
{
	console.log("performMarriage");
	getMarriageEligibleSingle("M", "", function(mPer) {
		//console.log(mPer);
		if(mPer)
		{
			getMarriageEligibleSingle("F", mPer.familyInfo, function(fPer) {
				//console.log(fPer)
				if(fPer)
				{
					relationships.performMarriage(mPer._id, fPer._id, function() {
										//console.log("++ MARRIAGE ++ " + mPer.firstName + " " 
										//			+ mPer.lastName + " & " + fPer.firstName + " " + fPer.lastName);
										//console.log("Performing marriage and creating new family...");

										families.createFamilyRecord(mPer.lastName, function(familyId) {
											
											setMarried(mPer._id, familyId, "", function(d) { 
												setMarried(fPer._id, familyId, mPer.lastName, function(d) {
													gameSettings.getValueByKey('time', function(time) {

														curGameTime = moment(time.setvalue);

							 							var pers = [];
							 							pers.push(mPer);
							 							pers.push(fPer);

							 							var info = {
							 								persons: pers,
							 								eventType: 'marriage',
							 								eventDate: curGameTime,
							 								realworldDate: new Date()
							 							}


							 							personevents.add(info, function(doc) {
							 								//console.log(doc);
															callback(d);
							 							});
													});
												});
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