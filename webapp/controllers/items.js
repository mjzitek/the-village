var mongoose = require('mongoose'),
	Items = mongoose.model('items');

exports.getItems = function(callback) {

	Items.find({}, function(err,doc) {
			callback(doc);
			//console.log(doc);
	});

};


exports.getItem = function(id, callback) {

	Items.find({itemId:id}, function(err,doc) {
			callback(doc);
			console.log(doc);
	});

};	


exports.getBuildings = function(callback) {

	Items.find({type: "building"}, function(err,doc) {
			callback(doc);
	});

};	
