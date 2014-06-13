/* Unit and Intergration tests for various controller */
/* Create a family */

var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");


var config = require('../config/config');
var tMoment = require('../helpers/time.js');
var settings = require('../config/settings');
var names = require('../helpers/names');

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


var familyId;
var familyName;
var marriageId;
var fatherId;
var motherId;
var child1Id;
var child2Id;
var child3Id;
var babyId;

describe.only("Create A Family", function() {



	before(function(done) {
		time.set("1900-01-01", function(doc) {

		});

		persons.removeAll(function(doc) {});
		families.removeAll(function(doc) {});
		relationships.removeAll(function(doc) {});

		done();

	});

  	after(function(done){    
		time.set("1900-01-01", function(doc) {
		});


		persons.removeAll(function(doc) {});
		families.removeAll(function(doc) {});
		relationships.removeAll(function(doc) {});

  		done();
  	}); 

  	// Set clock




  	// Create family
	describe("#Create family", function() {
		it("should return family id", function(done) {

			families.create("", function(fam) {
				expect(fam._id).to.not.be.empty;
				familyId = fam._id;
				familyName = fam.familyName;

				done();
			});

		});
	});

	// Create father
	describe("#Create Father", function() {


		it("should return fatherId", function(done) {

			var personDad = {};

			personDad.familyInfo = familyId;
			personDad.firstName = "Dad";
			personDad.middleName = "T";
			personDad.lastName = familyName;
			personDad.gender = "M";
			personDad.dateOfBirth = "1879-12-04";
			personDad.dateOfDeath = null;
			personDad.headOfFamily = 1;
			personDad.fatherInfo = null;
			personDad.motherInfo = null;
			personDad.placeOfBirth = null;
			personDad.attributes = { married : false };
			personDad.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

			persons.create(personDad, function(id) {
				fatherId = id;
				expect(id).to.not.be.empty;
				done();
			}); 
		});
	});

	// Create mother
	describe("#Create Mother", function() {


		it("should return motherId", function(done) {

			var personMom = {};

			personMom.familyInfo = familyId;
			personMom.firstName = "Mom";
			personMom.middleName = "T";
			personMom.lastName = familyName;
			personMom.gender = "M";
			personMom.dateOfBirth = "1879-12-04";
			personMom.dateOfDeath = null;
			personMom.headOfFamily = 0;
			personMom.fatherInfo = null;
			personMom.motherInfo = null;
			personMom.placeOfBirth = null;
			personMom.attributes = { married : false };
			personMom.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

			persons.create(personMom, function(id) {
				motherId = id;
				expect(id).to.not.be.empty;
				done();
			}); 
		});
	});


	// Create marriage
	describe("#Create marriage", function() {
		it("should return marriage id", function(done) {
			relationships.performMarriage(fatherId, motherId, function(doc) {
				expect(doc).to.not.match(/Error:/);
				expect(doc).to.not.be.empty;
				marriageId = doc;
				done();
			});
		});
	});


	// Create child1
	describe("#Create Child #1", function() {


		it("should return child1Id", function(done) {

			var personChild1 = {};

			personChild1.familyInfo = familyId;
			personChild1.firstName = "Child1";
			personChild1.middleName = "T";
			personChild1.lastName = familyName;
			personChild1.gender = "M";
			personChild1.dateOfBirth = "1896-06-04";
			personChild1.dateOfDeath = null;
			personChild1.headOfFamily = 0;
			personChild1.fatherInfo = fatherId;
			personChild1.motherInfo = motherId;
			personChild1.placeOfBirth = null;
			personChild1.attributes = { married : false };
			personChild1.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

			persons.create(personChild1, function(id) {
				child1Id = id;
				expect(id).to.not.be.empty;
				done();
			}); 
		});
	});

	// Create child2
	describe("#Create Child #2", function() {
		it("should return child2Id", function(done) {

			var personChild2 = {};

			personChild2.familyInfo = familyId;
			personChild2.firstName = "Child2";
			personChild2.middleName = "T";
			personChild2.lastName = familyName;
			personChild2.gender = "F";
			personChild2.dateOfBirth = "1897-07-04";
			personChild2.dateOfDeath = null;
			personChild2.headOfFamily = 0;
			personChild2.fatherInfo = fatherId;
			personChild2.motherInfo = motherId;
			personChild2.placeOfBirth = null;
			personChild2.attributes = { married : false };
			personChild2.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

			persons.create(personChild2, function(id) {
				child2Id = id;
				expect(id).to.not.be.empty;
				done();
			}); 
		});
	});

	// Create child3
	describe("#Create Child #3", function() {
		it("should return child3Id", function(done) {

			var personChild3 = {};

			personChild3.familyInfo = familyId;
			personChild3.firstName = "Child3";
			personChild3.middleName = "T";
			personChild3.lastName = familyName;
			personChild3.gender = "F";
			personChild3.dateOfBirth = "1898-08-04";
			personChild3.dateOfDeath = null;
			personChild3.headOfFamily = 0;
			personChild3.fatherInfo = fatherId;
			personChild3.motherInfo = motherId;
			personChild3.placeOfBirth = null;
			personChild3.attributes = { married : false };
			personChild3.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}

			persons.create(personChild3, function(id) {
				child3Id = id;
				expect(id).to.not.be.empty;
				done();
			}); 
		});
	});

	// Check population count
	describe("#Count Population", function() {
		it("should return 5", function(done) {
			persons.count(function(popCount) {
				expect(popCount).to.equal(5);
				done();
			})
		});
	});

	// Get pregnant
	describe("#Get Pregnant", function() {
		it("should return error", function(done) {
			persons.setPregnant(fatherId, motherId, function(doc) {
				expect(doc).to.be.empty;
				done();
			});
		});
	});

	// Advance 9 months
	describe("#Advance clock 9 months", function() {
		it("should not return error", function(done) {
			time.set("1900-09-01", function(doc) {
				expect(doc).not.match(/Error:/);
				done();
			});
		});
	});


	// Have baby
	describe("#Have baby", function() {
		it("should return babyId", function(done) {
			persons.giveBirth(motherId, function(perId) {

				babyId = perId;

				expect(perId).to.not.be.empty;
				done();
			});
		});
	});


	// Check siblings
	describe("#Check baby's siblings", function() {
		it("should return 4", function(done) {
			persons.getSiblingsSameParents(babyId, function(pers) {
				expect(pers).to.have.length(4);
				done();
			});
		});
	});

	// Check parents
	describe("#Check baby's parents' id's", function() {
		it("should return parents' id's", function(done) {
			persons.getParents(babyId, function(per) {
				expect(per.fatherInfo).to.match(new RegExp(fatherId));
				expect(per.motherInfo).to.match(new RegExp(motherId));
				done();
			});
		});
	})

	// Kill Dad
	describe("#Kill Dad", function() {
		it("should not return error", function(done) {
			persons.kill(fatherId, function(doc) {
				expect(doc).match(new RegExp(fatherId + " has died at"));
				done();
			});
		});
	});

	// Check population count
	describe("#Count Population again", function() {
		it("should return 5", function(done) {
			persons.count(function(popCount) {
				expect(popCount).to.equal(5);
				done();
			})
		});
	});

//////////////////////////////////////////////////////////////////////////////////	
});

