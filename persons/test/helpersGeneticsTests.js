var expect = require("chai").expect;

var genetics = require('../helpers/genetics');


describe("Helpers - Genetics", function() {
	describe("#determineDominance(A, a)", function() {
		it("should return 'A'", function(done) {
			var dominant = genetics.determineDominance("A", "a");
			expect(dominant).to.equal("A");
			done();
		});
	});

	describe("#determineDominance(a, A)", function() {
		it("should return 'A'", function(done) {
			var dominant = genetics.determineDominance("a", "A");
			expect(dominant).to.equal("A");
			done();
		});
	});

	describe("#determineDominance(A, A)", function() {
		it("should return 'A'", function(done) {
			var dominant = genetics.determineDominance("A", "A");
			expect(dominant).to.equal("A");
			done();
		});
	});

	describe("#determineDominance(a, a)", function() {
		it("should return 'a'", function(done) {
			var dominant = genetics.determineDominance("a", "a");
			expect(dominant).to.equal("a");
			done();
		});
	});

});