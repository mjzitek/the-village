var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RelationshipSchema = new mongoose.Schema({
	person1:           { type: Schema.Types.ObjectId, ref: 'persons' },
	person2:           { type: Schema.Types.ObjectId, ref: 'persons' },
	relationtype:      String,
	person1role:        String,
    person2role:        String,
	begindate:         Date,
    enddate:           Date,
    active:            Boolean,
    notes: 			   String, 
});

mongoose.model('relationships', RelationshipSchema);