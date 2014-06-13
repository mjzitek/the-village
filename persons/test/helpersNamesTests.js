var expect = require("chai").expect;

var names = require('../helpers/names');


describe("Helpers - Names", function() {

	////////////////////////////////////////
	describe("#getNameFromFile()", function() {
		it("should equal John", function(done) {
			var fileName = __dirname + "/test_names.txt";
			var lineNo = 1;
			var name = names.getNameFromFile(fileName, lineNo);
			expect(name).to.equal("John");
			done();
		});
	});

 	////////////////////////////////////////
	describe("#getRandomName(M)", function() {
		it("should not be empty", function(done) {
			var name = names.getRandomName("M");
			expect(name.first).to.not.be.empty;
			done();
		});
	});

 	////////////////////////////////////////
	describe("#getRandomName(F)", function() {
		it("should not be empty", function(done) {
			var name = names.getRandomName("F");
			expect(name.first).to.not.be.empty;
			done();
		});
	});

 	////////////////////////////////////////
	describe("#getRandomName(S)", function() {
		it("should not be empty", function(done) {
			var name = names.getRandomName("S");
			expect(name).to.not.be.empty;
			done();
		});
	});		




});


