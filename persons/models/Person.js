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
	genome : {
				attributes: {
					intelligence : {
									value : Number
					           },
					strength : {
									value : Number
						   },
					kindness : {
									value : Number
							},
					furtility : {
									 value : Number
							}
				},

				genes : {
					eyes: {
								color: String,
								bey2 : {
											one: String, two: String
									   },
								gey :  {
											one: String, two: String
										}
						  },
					hair: {
								color: String,
								genes: {
											father : String,
											mother : String
									   }
					},
					skin: {
								shade: String,
								father: String,
								mother: String
					},
					height : {
									value : Number,
									father: Number,
									mother: Number
					},
					bodytype : {
									value :  Number,
									father : Number,
									mother : Number
					},
					attractiveness : {
									value : Number,
									father : Number,
									mother : Number
					}
				}	       
		 }
});

mongoose.model('persons', PersonSchema);

