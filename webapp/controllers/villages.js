var mongoose = require('mongoose'),
	Village = mongoose.model('villages');






exports.getVillages = function(callback) {

	Village.find({}, function(err,doc) {
			callback(doc);
	});

};

exports.getVillageInfo = function(villageId, callback) {
	Village.findOne({_id: villageId}, function(err, vill) {
		callback(vill);
	})
}

exports.getVillageForUser = function(userId, callback) {

	Village.find({owner: userId}, function(err, vill) {
		callback(vill);
	})


}


exports.setTotalPopulation = function(villageId, population, callback) {
	Village.update({_id: villageId}, { $set: { population: { total: population}}}, function(err, v) {
		if(err) {
			console.log("Error updating population for " + villageId);
		} else
		{
			callback("Village " + villageId + " set to " + population);
		}
	})
}
