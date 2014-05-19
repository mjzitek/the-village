
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var InventorySchema = new mongoose.Schema({
	villageInfo:  { type: Schema.Types.ObjectId, ref: 'villages' },
	itemInfo: 	  { type: Schema.Types.ObjectId, ref: 'items' },		
	quantity:     { type: Number },
	level:        { type: Number },
	lastUpdated:  { type : Date, default: Date.now }
});


mongoose.model('villageitems', InventorySchema);




