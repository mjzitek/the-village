var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonEventSchema = new mongoose.Schema({
	personId:     { type: Schema.Types.ObjectId, ref: 'persons' },
	eventDate:    Date
});

mongoose.model('personevents', PersonEventSchema);