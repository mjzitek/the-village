/* Unit and Intergration tests for persons controller */

var expect = require("chai").expect;
var mongoose = require("mongoose");
var fs = require("fs");


var config = require('../config/config');
var tMoment = require('../lib/time.js');
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

	var person2Id;
	var personKidId;

	before(function(done){    
		/////
		var person2 = {};

		person2.familyInfo = "53826054b77b80b59d2c4c4b";
		person2.firstName = "Test2";
		person2.middleName = "T2";
		person2.lastName = "Tester2";
		person2.gender = "M";
		person2.dateOfBirth = "1879-12-04";
		person2.dateOfDeath = null;
		person2.headOfFamily = 1;
		person2.fatherInfo = null;
		person2.motherInfo = null;
		person2.placeOfBirth = null;
		person2.attributes = { married : false };
		person2.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}


		persons.create(person2, function(id) {
			person2Id = id;
			done();
		}); 
  	}); 
  	
  	after(function(done){    
		persons.remove(person2Id, function(doc) {
//			done();
		});	
		persons.remove(personKidId, function(doc) {

		});

		db.connection.close();

		done();
  

  	}); 


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

	person.familyInfo = "53825c9cb77b80b59d2c4c49";
	person.firstName = "Test";
	person.middleName = "T";
	person.lastName = "Tester";
	person.gender = "F";
	person.dateOfBirth = "1880-01-01";
	person.dateOfDeath = null;
	person.headOfFamily = 1;
	person.fatherInfo = null;
	person.motherInfo = null;
	person.placeOfBirth = null;
	person.attributes = { married : false };
	person.pregnancy = { pregnant : false, pregnancyDate: null, babyFatherId: null}




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
		});
	});

	////////////////////////////////////////
	describe("#getPersons()", function() {
		it("should not be empty", function(done) {
			persons.getPersons(function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getRandomPerson()", function() {
		it("should not be empty", function(done) {
			var query = {};
			var fields = {};
			persons.getRandomPerson(query, fields, function(per) {
				expect(per.firstName).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getPersonsAlive()", function() {
		it("should not be empty", function(done) {
			persons.getPersonsAlive(function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getMarriageEligibleSingle()", function() {
		it("should return 'Test'", function(done) {
			persons.getMarriageEligibleSingle("F", "", function(per) {
				expect(per.firstName).to.equal("Test");
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getMarriageEligibleSingles()", function() {
		it("should return persons", function(done) {
			persons.getMarriageEligibleSingles("F", function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getRandomBabyReadyWomen()", function() {
		it("should return Tester", function(done) {
			persons.getRandomBabyReadyWomen(false, 1, function(per) {
				expect(per[0].lastName).to.equal("Tester");
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getAge()", function() {
		it("should return 20", function(done) {
			persons.getAge(personId, function(age) {
				expect(age.years).to.equal(20);
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#pickGender()", function() {
		it("should be M or F", function(done) {
			var gender = persons.pickGender();
			expect(gender).to.match(/M|F/);
			done();
		});
	});

	////////////////////////////////////////
	describe("#populationCountTotal()", function () {
		it("should be greater than 0", function(done) {
			persons.populationCountTotal(function(popCount) {
				expect(popCount).to.be.least(1);
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#populationCountAlive()", function () {
		it("should be greater than 0", function(done) {
			persons.populationCountAlive(function(popCount) {
				expect(popCount).to.be.least(1);
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#populationCountFiltered()", function () {
		it("should be greater than 0", function(done) {
			var filter = {};
			persons.populationCountFiltered(filter, function(popCount) {
				expect(popCount).to.be.least(1);
				done();
			});
		});
	});



	////////////////////////////////////////
	describe("#getSingles()", function() {
		it("should return at least 1", function(done) {
			persons.getSingles("F", function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});


	describe("#getParents()", function() {
		it("should equal personKidId", function(done) {
			persons.getParents(personKidId, function(per) {
				expect(per.motherInfo).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#performMarriage()", function() {
		//this.timeout(15000);
		it("should not return error", function(done) {
			persons.performMarriage(function(doc) {
				expect(doc).to.equal('updated');
				done();
			});
		});
	});


	////////////////////////////////////////
	describe("#setMarried()", function() {
		it("should return 'updated'", function(done) {
			persons.setMarried(personId, "53825c9cb77b80b59d2c4c49", function(doc) {
				expect(doc).to.equal('updated');
				done();
			});
		});
	});



	////////////////////////////////////////
	describe("#getChildrenByFather", function() {
		it("should not be empty", function(done) {
			persons.getChildrenByFather(person2Id, function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#getChildrenByMother", function() {
		it("should not be empty", function(done) {
			persons.getChildrenByMother(personId, function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	describe("#getSiblingsSameParents()", function() {
		it("should not be empty", function(done) {
			persons.getSiblingsSameParents(personKidId, function(pers) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	describe("#getChildrenGrandchildren()", function() {
		it("should not return empty", function(done) {
			persons.getChildrenGrandchildren(personId, function(doc) {
				expect(pers).to.not.be.empty;
				done();
			});
		});
	});

	////////////////////////////////////////
	describe("#kill()", function() {
		it("should not return error", function(done) {
			persons.kill(personId, function(doc) {
				expect(doc).match(new RegExp(personId + " has died at"));
				done();
			});
		});
	});


	//////////////////////////////////////
	//////////////////////////////////////
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




