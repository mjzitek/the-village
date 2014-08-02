var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");




var config = require('../config/config');
var tMoment = require('../lib/time.js');
var settings = require('../config/settings');

require('../models/Person');

var mockgoose = require('mockgoose');
mockgoose(mongoose);

var GameSession = mongoose.model('gamesession'),
	User = mongoose.model('users'),
    ObjectId = mongoose.Types.ObjectId();

var persons = require('../controllers/persons');

//mongoose.Types.ObjectId();

describe("Game Session", function () {

	before(function(done) {
		mockgoose.reset();

		// Create mock mother;

		// Create mock father;


		// Create mock gameClock;



	});



	after(function(done) {
		mockgoose.reset();
		done();
	});








	////////////////////////////////////////
	describe("#setPregnant()", function() {
		it("should not return error", function(done) {
			persons.setPregnant("538925c7b77b80b59d2c4c60", personId, function(doc) {
				expect(doc).to.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getPregnantWomen()", function() {
		it("should not be empty", function(done) {
			persons.getPregnantWomen(function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#giveBirth()", function() {
		it("should not be empty", function(done) {
			persons.giveBirth(personId, function(per) {
				personKidId = per;
				expect(per).to.not.be.empty;
				done();
			});
		});
	});


	////////////////////////////////////////
	describe("#breed()", function() {
		it("should not be empty", function(done) {
			persons.breed(person2Id, personId, function(per) {
				//console.log(per);
				expect(per.haveKid).to.equal("** New Baby **");
				done();
			});
		});
	});	

});