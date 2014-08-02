var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatsHistorySchema = new mongoose.Schema({
			statType: String,
			statValue: Number, 
			statDate: Date 
});

mongoose.model('statshistories', StatsHistorySchema);