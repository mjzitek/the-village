var mongoose = require('mongoose'),
	Family = mongoose.model('families');

var persons = require('./persons');

var names = require('../helpers/names');

exports.get = getFamilyRecord;
exports.getFamilyRecord = getFamilyRecord;
function getFamilyRecord(familyId, callback) {
	Family.findOne({_id: familyId}, function(err, fam) {
		callback (fam);
	});
}



exports.getFamilyName = getFamilyName;
function getFamilyName(familyId, callback) {

	Family.findOne({_id: familyId}, function(err, doc) {
		callback (doc.familyName);
	});
}

exports.create = createFamilyRecord;
exports.createFamilyRecord = createFamilyRecord;
function createFamilyRecord(familyName, callback) {

	var name;


	if(familyName === "")
	{
		name = names.getRandomName("S");
	} else {
		name= familyName;
	}

	var family = new Family(
							{
								familyName: name,
								familyDateFrom: new Date(),
								familyDateTo: null,
								OtherFamilyDetails: null

							}

					   );

	family.save(function(err) 
	{
		if(err) {
			console.log("err: " + err);
			callback("Error: " + err);
		} else {
			//console.log("** NEW FAMILY ** " + family._id + " | " + name);
			callback(family);
		}
	});

}

exports.remove = removeFamilyRecord;
exports.removeFamilyRecord = removeFamilyRecord;
function removeFamilyRecord(familyId, callback) {
	Family.remove( { _id : familyId}, function(err, doc) {
		if(err) {
			callback("Error: " + err);
		} else
		{
			callback();
		}
	});

}

