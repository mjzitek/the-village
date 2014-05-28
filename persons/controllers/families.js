var mongoose = require('mongoose'),
	Family = mongoose.model('families');



exports.getFamilyName = function(familyId, callback) {

	Family.findOne({_id: familyId}, function(err, doc) {
		callback (doc.familyName);
	});
}

