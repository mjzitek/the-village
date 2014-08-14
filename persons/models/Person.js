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
    health : {
    	hunger : 		Number,
    	thirst : 		Number,
    	stamina:        Number,
    	bmi:            Number,
    	inShape:        Number,
    	illness: 		Number,
    	bodyTemp:  		Number,
    	sleepiness: 	Number
    }
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
								color:  { R: Number, G: Number, B: Number },
								one:  { R: Number, G: Number, B: Number },
								two:  { R: Number, G: Number, B: Number },
					},
					skin: {
								color: { R: Number, G: Number, B: Number },
								one:  { R: Number, G: Number, B: Number },
								two:  { R: Number, G: Number, B: Number },
					},
					height : {
								currentHeight : Number,
								heightBias: Number,
								one: Number,
								two: Number
					},
					weight : {
								weight : Number,
								weightBias: Number,
								one: Number,
								two: Number
					},
					bodytype : {
								value :  Number,
								one: Number,
								two: Number
					},
					attractiveness : {
								value : Number,
								one: Number,
								two: Number
					}
				}	       
		 }
});

mongoose.model('persons', PersonSchema);

