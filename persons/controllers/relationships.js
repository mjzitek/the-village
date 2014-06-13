var mongoose = require('mongoose'),
	Relationship = mongoose.model('relationships');


var families = require('./families'),
    persons = require('./persons');



// Retrieve Info
exports.getCouple = getCouple;
function getCouple(personId, callback) {

	getCouplesCountActive(function(rCount) { 
		var ranNum = (Math.floor(Math.random() * rCount))

		Relationship.findOne({ "$or" : [{ person1 : personId }, { person2: personId }], 
							  relationtype: 'marriage', enddate: null}).limit(1).exec(function(err, couple) {
			callback(couple);
		})
	});
}


exports.getCouples = getCouples;
function getCouples(numOfCouples, callback) {

	getCouplesCountActive(function(rCount) { 
		var ranNum = (Math.floor(Math.random() * rCount))

		Relationship.find({ relationtype: 'marriage'}).exec(function(err, couples) {
			callback(couples);
		})
	});
}

exports.getCouplesRandomActive = getCouplesRandomActive;
function getCouplesRandomActive(numOfCouples, callback) {

	getCouplesCountActive(function(rCount) { 
		var ranNum = (Math.floor(Math.random() * rCount))

		Relationship.find({ relationtype: 'marriage', enddate: null}).skip(ranNum).limit(numOfCouples).exec(function(err, couples) {
			callback(couples);
		})
	});
}


exports.getCouplesCountActive = getCouplesCountActive;
function getCouplesCountActive(callback)
{
	Relationship.count({ relationtype: 'marriage', enddate: null}, function(err, c) { callback(c); });
}


// Actions

exports.endRelationship = endRelationship;
function endRelationship(personId, notes, callback) {

	Relationship.update({ "$or" : [{ person1 : personId }, { person2: personId }]}, { active: false, enddate: new Date(), notes: notes}, 
		function(err, doc) {
			callback(doc);
		});

}


exports.performMarriage = performMarriage;
function performMarriage(personId1, personId2, callback) {


	// Marry them
	var marriage = new Relationship(
										{   person1: personId1, 
											person2: personId2,
											relationtype: "marriage", 
											person1role: "husband", 
											person2role: "wife", 
											begindate: new Date(),
											enddate: null,
											active: true
										});
	marriage.save(function(err) {
		if(err) {
			console.log('Error: ' + err)
		} else {
			//console.log("marriage id: " + marriage._id);
			callback(marriage._id);
		}
	});

}


exports.getHusband = getHusband;
function getHusband(wifeId, callback) {
	Relationship.findOne( { $or: [ {person1: wifeId }, { person2: wifeId}], relationtype: 'marriage', enddate: null }, function(err, husband) {

		var husbandId;
		 
		if(husband)
			{
			if(husband.person2role == "husband") {
	 			husbandId = husband.person2;
	 		} else 
	 		{
	 			husbandId = husband.person1;
	 		}
 		}
		callback(husbandId);
	});


}

exports.getWife = getWife;
function getWife(husbandId, callback) {
	Relationship.findOne( { $or: [ {person1: husbandId }, { person2: husbandId}], relationtype: 'marriage', enddate: null }, function(err, wife) {

		var wifeId;
		
		if(wife)
			{
			if(wife.person2role == "wife") {
 				wifeId = wife.person2;
 			} else 
 			{
 				wifeId = wife.person1;
 			}


		}

		callback(wifeId);
	});
}

exports.remove = removeRelationship;
exports.removeRelationship = removeRelationship;
function removeRelationship(relationshipId, callback) {
	Relationship.remove({ _id: relationshipId}, function(err, doc) {
		if(err) {
			callback(err);
		} else {
			callback(doc);
		}
	});
}

exports.removeAll = removeAllRelationships;
exports.removeAllRelationships = removeAllRelationships;
function removeAllRelationships(callback) {
	Relationship.remove({}, function(err, doc) {
		if(err) {
			callback(err);
		} else {
			callback(doc);
		}
	});
}