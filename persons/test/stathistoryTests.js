// var expect = require("chai").expect;
// var mongoose = require("mongoose");
// var fs = require("fs");


// var config = require('../config/config');
// var tMoment = require('../lib/time.js');
// var settings = require('../config/settings');

// require('../models/StatsHistory');

// var mockgoose = require('mockgoose');
// mockgoose(mongoose);

// var StatsHistory = mongoose.model('statshistories'),
//     ObjectId = mongoose.Types.ObjectId();

// var statshistory = require('../controllers/statshistory');

// //mongoose.Types.ObjectId();

// describe.only("Stats History", function () {

// 	before(function(done) {
// 		mockgoose.reset();

// 		StatsHistory.create( {
// 			_id: ObjectId,
// 			statType: "population",
// 			statValue: 1000, 
// 			statDate: new Date() 
// 		}, function(err, model) {
// 			done(err);
// 		});


// 	});

// 	after(function(done) {
// 		mockgoose.reset();
// 		done();
// 	});

// 	describe('#getStatHistory()', function () {
// 		it("should return array", function(done) {
// 			statshistory.getStatHistory("population",function(stats) {
// 				console.log(stats);
// 				expect(stats).to.not.be.empty;
// 				done();
// 			});
// 		});
// 	});

// });