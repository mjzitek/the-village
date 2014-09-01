var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BuildingSchema = new mongoose.Schema({
	maxOccupants:    { type: Number },
	type:            { type: String },
	efficiency:    { type: Number },
	itemInfo:        { type: Schema.Types.ObjectId, ref: 'items' },
	requirementInfo: { type: Schema.Types.ObjectId, ref: 'requirements' }
});

mongoose.model('buildings', BuildingSchema);



