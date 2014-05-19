var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VillageSchema = new mongoose.Schema({
	owner: 		{ type: Schema.Types.ObjectId, ref: 'users' },
	name: 		String,
	regionId: 	{ type: Schema.Types.ObjectId, ref: 'regions' },
	population: {
					total: Number,
					farmer: Number,
					hunter: Number,
					miner: Number,
					logger: Number
				}
});

var Villages = mongoose.model('villages', VillageSchema);



exports.getAllVillages = function(callback) {

	Villages.find({}, function(err,doc) {
			callback(doc);
			//console.log(doc);
	});

};


exports.getVillageByUserId = function(id, callback) {

	Villages.find({owner:id}, function(err,doc) {
			callback(doc);
			console.log(doc);
	});

};	