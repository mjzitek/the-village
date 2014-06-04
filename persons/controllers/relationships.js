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

exports.performMarriage = function(personId1, personId2, headId, callback) {

// var inv = new Inventory({villageInfo: villageId, itemInfo: i._id, quantity: amount, level: 0 });

// 						//console.log("U:" + u);
// 						//console.log("I:" + i);
// 						//console.log("inv: " + inv);
// 						//self = this;

// 						inv.save(function (err) {


	// Check if people are already married


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
			console.log('marriage err: ' + err)
		} else {
			console.log("marriage id: " + marriage._id);
			callback(marriage._id);
		}
	});

}



exports.getHusband = function(wifeId, callback) {
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


exports.getWife = function(husbandId, callback) {
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