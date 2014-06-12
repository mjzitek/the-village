var mongoose = require('mongoose'),
	Family = mongoose.model('families');

var persons = require('./persons');


exports.getFamilyName = function(familyId, callback) {

	Family.findOne({_id: familyId}, function(err, doc) {
		callback (doc.familyName);
	});
}

exports.createNewFamily = function(husbandId, wifeId, callback) {

	// headOfFamily:   { type: Schema.Types.ObjectId, ref: 'persons' },
	// familyName:     String,
	// familyDateFrom: Date,
	// familyDateTo:   Date,
	// OtherFamilyDetails: String 
	//console.log("Creating new family for " + husbandId + " & " + wifeId);

	persons.getSurname(husbandId, function(surname) {
		var family = new Family(
								{
									headOfFamily: husbandId,
									familyName: surname,
									familyDateFrom: new Date(),
									familyDateTo: null,
									OtherFamilyDetails: null

								}

						   );

		family.save(function(err) 
		{
			if(err) {
				console.log("err: " + err);
			} else {
				//console.log("** NEW FAMILY ** " + family._id + " | " + surname);
				callback(family._id);
			}
		});
	});



	// 	var marriage = new Relationship(
	// 									{   person1: personId1, 
	// 										person2: personId2, 
	// 										relationtype: "marriage", 
	// 										person1role: "husband", 
	// 										person2role: "wife", 
	// 										begindate: new Date()
	// 										enddate: null
	// 									});
	// marriage.save(function(err) {});
}



function GetRandomSurname() {

	var filename = './models/surnames.txt';

	var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
    var line_no = Math.floor(Math.random() * 600);

    line_no = line_no - 1;
    if(line_no < 0) line_no = 0;

    // if(lines[line_no] == '') 
    // {
    // 	GetRandomName()
    // }

    return lines[line_no];
}