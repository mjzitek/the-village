/* Unit and Intergration tests for families controller */

var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");


var config = require('../config/config');
var tMoment = require('../lib/time.js');
var settings = require('../config/settings');

//var db = mongoose.connect(config.db);

var models_path = __dirname + '/../models';
require(models_path + "/GameSettings");

var time = require('../controllers/time');


describe("Time", function() {

	var curTime = "1910-01-01";

  	after(function(done){    
			time.set("1900-01-01", function(doc) {
				done();
			});
  	}); 


	describe("#set()", function() {
		it("should not return error", function(done) {
			time.set(curTime, function(doc) {
				expect(doc).not.match(/Error:/);
				done();
			});
		});
	});


	describe("#get()", function() {
		it("should return datetime", function(done) {
			time.get(function(doc) {
				expect(doc).match(new RegExp(curTime));
				done();
			});
		});
	});

	describe("#randomDate()", function() {
		it("should return a number", function(done) {
			var randDate = tMoment.randomDate("1/1/1900", "1/1/1901");
			expect(randDate).not.empty;
			done();
		})
	});

});