var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var RequirementSchema = new mongoose.Schema({
	requirementInfo: String,
	itemsNeeded: [{
		itemInfo: { type: Schema.Types.ObjectId, ref: 'items' },
		quantity: Number,
		payment: Boolean
	}],
	skillsRequired: [{
		skillInfo: { type: Schema.Types.ObjectId, ref: 'skills' },
		skillLevel: Number 
	}]
});


mongoose.model('requirements', RequirementSchema);