var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PersonEventSchema = new mongoose.Schema({
	persons:     [{ type: Schema.Types.ObjectId, ref: 'persons' }],
	eventType:    String,
	eventInfo:    String,
	eventDate:    Date,
	realworldDate: Date
});

mongoose.model('personevents', PersonEventSchema);