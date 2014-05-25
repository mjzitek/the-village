var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonSchema = new mongoose.Schema({
	familyId:   	{ type: Schema.Types.ObjectId, ref: 'families' },
	firstName:  	String,
	middleName: 	String,
	lastName:   	String,
	gender: 		String,
	dateOfBirth:  	Date,
	placeOfBirth: 	{ type: Schema.Types.ObjectId, ref: 'villages' },
	headOfFamily:   Number,
	fatherId:       { type: Schema.Types.ObjectId, ref: 'persons' },
	motherId:       { type: Schema.Types.ObjectId, ref: 'persons' }
});

mongoose.model('persons', PersonSchema);

