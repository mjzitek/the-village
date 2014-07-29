var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonSchema = new mongoose.Schema({
	familyInfo:   	{ type: Schema.Types.ObjectId, ref: 'families' },
	firstName:  	String,
	middleName: 	String,
	lastName:   	String,
	gender: 		String,
	dateOfBirth:  	Date,
	placeOfBirth: 	{ type: Schema.Types.ObjectId, ref: 'villages' },
	dateOfDeath: 	Date, 
	headOfFamily:   Number,
	fatherInfo:       { type: Schema.Types.ObjectId, ref: 'persons' },
	motherInfo:       { type: Schema.Types.ObjectId, ref: 'persons' },
	attributes:     {
						married: Boolean,
						job: { type: Schema.Types.ObjectId, ref: 'jobs' },
					},
	pregnancy: {
        			pregnant: Boolean,
        			pregnancyDate: Date,
        			babyFatherId : { type: Schema.Types.ObjectId, ref: 'persons' }  
    },
});

mongoose.model('persons', PersonSchema);

