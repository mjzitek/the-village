/* Unit and Intergration tests for various controller */
/* Create a family */

var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");


var config = require('../config/config');
var tMoment = require('../helpers/time.js');
var settings = require('../config/settings');

var models_path = __dirname + '/../models';

var walk = function(path) {
	fs.readdirSync(path).forEach(function(file) {
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()) {
			if(/(.*)\.(js$|coffee$)/.test(file)) {
				require(newPath);
			}
		} else if (stat.isDirectory) {
			walk(newPath);
		}
	});
}

walk(models_path);

var persons = require('../controllers/persons');
var families = require('../controllers/families');
var gameSettings = require('../controllers/gamesettings');
var time = require('../controllers/time');
var relationships = require('../controllers/relationships');


describe.only("Create A Family", function() {

	var fatherId;
	var motherId;
	var child1Id;
	var child2Id;
	var child3Id;
	var child4Id;

	before(function(done) {
		time.set("1900-01-01", function(doc) {
			done();
		});
	});

  	after(function(done){    
		time.set("1900-01-01", function(doc) {
			done();
		});
  	}); 

  	describe("#Test1" , function() {
  		it("should equal 1", function(done) {
  			expect(1).to.equal(1);
  			done();
  		});
  	});

});

// Set clock

// Create father
// Create mother
// Create child1
// Create child2
// Create child3

// Get pregnant

// Advance 9 months

// Have baby