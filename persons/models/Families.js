var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FamilySchema = new mongoose.Schema({
	headOfFamily:   { type: Schema.Types.ObjectId, ref: 'persons' },
	familyName:     String,
	familyDateFrom: Date,
	familyDateTo:   Date,
	OtherFamilyDetails: String 
});

mongoose.model('families', FamilySchema);