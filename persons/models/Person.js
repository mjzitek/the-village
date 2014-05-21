var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonSchema = new mongoose.Schema({
	
});

var Persons = mongoose.model('persons', PersonSchema);



exports.getAllPeople = function(callback) {

	Persons.find({}, function(err,doc) {
			callback(doc);
			//console.log(doc);
	});

};