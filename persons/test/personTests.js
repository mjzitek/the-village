/* Unit and Intergration tests for persons controller */

var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");


var config = require('../config/config');
var tMoment = require('../helpers/time.js');
var settings = require('../config/settings');

var db = mongoose.connect(config.db);

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
 

// ===================================================


describe("Person", function() {

	////////////////////////////////////////
	describe("#getSurname()", function() {
		it("should equal Jones", function(done) {
			persons.getSurname("538925c7b77b80b59d2c4c60", function(surname) {
				expect(surname).to.equal("Jones");
				done();
			});
		});
	});


	var person = {};
	var personId;

	person["familyInfo"] = null;
	person["firstName"] = "Test";
	person["middleName"] = "T";
	person["lastName"] = "Tester";
	person["gender"] = "M";
	person["dateOfBirth"] = "1880-01-01";
	person["dateOfDeath"] = null;
	person["headOfFamily"] = 1;
	person["fatherInfo"] = null;
	person["motherInfo"] = null;
	person["placeOfBirth"] = null;
	person["attributes"] = { married : false };
	person["pregnancy"] = { pregnant : false, pregnancyDate: null, babyFatherId: null}

	////////////////////////////////////////
	describe("#createPerson()", function() {
		it("_id should not be empty", function(done) {
			persons.create(person, function(id) {
				personId = id;
				expect(id).to.not.be.empty;
				done();
			});

		});
	});

	////////////////////////////////////////
	describe("#getPerson()", function() {
		it("should equal Tester", function(done) {
			persons.get(personId, function(per) {
				expect(per.lastName).to.equal("Tester");
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getPersonFiltered()", function() {
		it("should return Tester", function(done) {
			var query = {};
			query["_id"] = personId;
			var fields = {};
			persons.getPersonFiltered(query,fields, function(per) {
				expect(per.lastName).to.equal("Tester");
				done();
			});
		})
	})

	////////////////////////////////////////
	describe("#getRandomName()", function() {
		it("should not be empty", function(done) {
			var name = persons.getRandomName("M");
			expect(name.first).to.not.be.empty;
			done();
		});
	});

	////////////////////////////////////////
	describe("#getNameFromFile()", function() {
		it("should equal John", function(done) {
			var fileName = __dirname + "/test_names.txt";
			var lineNo = 1;
			var name = persons.getNameFromFile(fileName, lineNo);
			expect(name).to.equal("John");
			done();
		});
	});

	////////////////////////////////////////
	describe("#getMarriageEligibleSingle()", function() {
		it("should return a person", function(done) {
			persons.getMarriageEligibleSingle("M", "", function(per) {
				expect(per.firstName).to.equal("Test");
				done();
			});
		});
	});


	describe("#getMarriageEligibleSingles()", function() {
		it("should return persons", function(done) {
			persons.getMarriageEligibleSingles("M", function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	describe("#getAge()", function() {
		it("should return 20", function(done) {
			persons.getAge(personId, function(age) {
				expect(age.years).to.equal(20);
				done();
			})
		})
	})



	////////////////////////////////////////
	////////////////////////////////////////
	describe("#removePerson()", function() {
		it("should not return error", function(done) {
			persons.remove(personId, function(doc) {
				expect(doc).to.be.empty;
				done();
			});
		});
	});

/////////////////////////////
});




