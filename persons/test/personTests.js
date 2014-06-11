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
		it("should equal Jones", function() {
			persons.getSurname("538925c7b77b80b59d2c4c60", function(surname) {
				expect(surname).to.equal("Jones");
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
	person["dateOfBirth"] = "1900-01-01";
	person["dateOfDeath"] = null;
	person["headOfFamily"] = 1;
	person["fatherInfo"] = null;
	person["motherInfo"] = null;
	person["placeOfBirth"] = null;
	person["attributes"] = { married : true };
	person["pregnancy"] = { pregnant : false, pregnancyDate: null, babyFatherId: null}

	////////////////////////////////////////
	describe("#createPerson()", function() {
		it("_id should not be empty", function() {
			persons.create(person, function(id) {
				personId = id;
				expect(id).to.not.be.empty;
			});

		});
	});

	////////////////////////////////////////
	describe("#getPerson()", function() {
		it("should equal Tester", function() {
			persons.get(personId, function(per) {
				expect(per.lastName).to.equal("Tester");
			});
		});
	});

	////////////////////////////////////////
	describe("#removePerson()", function() {
		it("should not return error", function() {
			persons.remove(personId, function(doc) {
				expect(doc).to.be.empty;
			});
		});
	});

	////////////////////////////////////////
	describe("#getRandomName()", function() {
		it("should not be empty", function() {
			var name = persons.getRandomName("M");
			expect(name.first).to.not.be.empty;
		});
	});

	////////////////////////////////////////
	describe("#getNameFromFile()", function() {
		it("should equal John", function() {
			var fileName = __dirname + "/test_names.txt";
			var lineNo = 1;
			var name = persons.getNameFromFile(fileName, lineNo);
			expect(name).to.equal("John");
		})
	})

});




