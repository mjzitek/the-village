var mongoose = require('mongoose'),
	Relationship = mongoose.model('relationships'),
	Family = mongoose.model('families'),
	Person = mongoose.model('persons');


// Retrieve Info
exports.getCouples = function(callback) {
	Relationship.find({ relationtype: 'marriage', enddate: null}, function(err, couples) {
		callback(couples);
	});
}



// Actions
exports.performMarriage = function(personId1, personId2, headId, callback) {

	// Check if people are already married


	// Marry them

}



exports.getHusband = function(wifeId, callback) {



}


exports.getWife = function(husbandId, callback) {
	Relationship.findOne( { $or: [ {person1: husbandId }, { person2: husbandId}], relationtype: 'marriage', enddate: null }, function(err, wife) {

		var wifeId;
		 
		if(wife.person2role == "wife") {
 			wifeId = wife.person2;
 		} else 
 		{
 			wifeId = wife.person1;
 		}
		callback(wifeId);
	} );
}