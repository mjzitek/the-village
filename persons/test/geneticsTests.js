var expect = require("chai").expect;

var genetics = require('../lib/genetics');


describe.only("Genetics", function() {

	describe("determineEyeColor()", function() {

		// brown-brown
		// brown-blue
		// blue-blue

		// green-green
		// green-blue
		// blue-blue

		checkResults({one: "brown", two: "brown"}, {one: "green", two: "green"}, "brown");
		checkResults({one: "brown", two: "brown"}, {one: "green", two: "blue"}, "brown");
		checkResults({one: "brown", two: "brown"}, {one: "blue", two: "blue"}, "brown");
		checkResults({one: "brown", two: "blue"}, {one: "green", two: "green"}, "brown");						
		checkResults({one: "brown", two: "blue"}, {one: "green", two: "blue"}, "brown");
		checkResults({one: "brown", two: "blue"}, {one: "blue", two: "blue"}, "brown");
		checkResults({one: "blue", two: "blue"}, {one: "green", two: "green"}, "green");
		checkResults({one: "blue", two: "blue"}, {one: "green", two: "blue"}, "green");
		checkResults({one: "blue", two: "blue"}, {one: "blue", two: "blue"}, "blue");

		function checkResults(bey2, gey, results) {
			describe("#determineEyeColor(" + bey2 + "," + gey + ")", function() {
				it("should return " + results, function () {
					var val = genetics.determineEyeColor(bey2, gey);
					expect(val).to.equal(results);
				});
			});		
		}

	});

	describe("determineHeight()", function() {
		checkResults(160, 170, 150, 180);
		checkResults(100, 200, 150, 180);
		checkResults(170, 180, 165, 185);		

		function checkResults(height1, height2, resultsLower, resultsHigher) {
			describe(height1 + " " + height2, function() {
				it("should return between " + resultsLower + " and " + resultsHigher, function() {
					var val = genetics.determineHeight(height1, height2);
					expect(val).to.be.within(resultsLower, resultsHigher);
				});
			});

		}


	});

});