var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../lib/time');

 var mongoose = require('mongoose'),
	 PerfTracker = mongoose.model('perftracker');


exports.create = create;
function create(info, callback) {
	var perf = new PerfTracker({
					perfType: info.perfType,
					perfValue: info.perfValue, 
					perfDate: info.perfDate; 
			})

			perf.save(function(doc) {
				callback(doc);
			});		
		});


}