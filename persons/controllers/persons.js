 var mongoose = require('mongoose'),
	Person = mongoose.model('persons');



exports.getPersons = function(callback) {
	Person.find({}, function(err, doc) {
		callback (doc);
	});

}

exports.totalPopulation = function(callback) {
	// userModel.count({name: 'anand'}, function(err, c)
	Person.count({}, function(err, c) { callback(c); });
}

// exports.getVillages = function(callback) {

// 	Village.find({}, function(err,doc) {
// 			callback(doc);
// 	});

// };