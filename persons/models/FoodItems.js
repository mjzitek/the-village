var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodItemSchema = new mongoose.Schema({
		name:        String,
		nameFormal:  String,
		portions:    Number,
		stats:  {
					hunger: 			Number,
					thirst:				Number,
					stamina: 			Number,
					hungerSaturation: 	Number,
					happiness: 			Number	
				},
		cooked:      Boolean,
		complex:     Boolean,
		ingredients: [
				{
					foodItem: { type: Schema.Types.ObjectId, ref: 'fooditems' },
					quantity: Number
				}
			]
});

mongoose.model('fooditems', FoodItemSchema);