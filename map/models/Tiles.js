var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TileSchema = new mongoose.Schema({
		position : { x: Number, y: Number },
		type: { type: Schema.Types.ObjectId, ref: 'tiletypes' },
		explored: Boolean,
		buildings: [{ type: Schema.Types.ObjectId, ref: 'buildings' }],
		resources: [
						{
							type: { type: Schema.Types.ObjectId, ref: 'resources' },
							amount: Number
						}
		]
});

mongoose.model('tiles', TileSchema);