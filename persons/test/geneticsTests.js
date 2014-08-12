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


	describe("determineHeightBias()", function() {
		checkResults(1,10);
		checkResults(5,5);
		checkResults(8,5);
		checkResults(10,1);
		checkResults(7,3);
		checkResults(1,1);
		checkResults(0,40);  // Way outside the max bias level
				

		function checkResults(dadBias, momBias) {
			describe(dadBias + " " + momBias, function() {
				it("should return between 1 and 10", function() {
					var heightBias = genetics.determineHeightBias(dadBias, momBias);
					expect(heightBias).to.be.within(1, 10);
				});
			});

		}
	});

	describe("determineNewHeight()", function() {

		describe("** Average Heights", function() {
			checkResults(20,5,1,"M",0,30);
			checkResults(70,5,19,"M",0,70);
			checkResults(64,5,19,"F",0,64);
		});

		describe("** Extreme Heights", function() {
			checkResults(60,1,19,"M",0,60);
			checkResults(90,10,19,"M",0,90);
		});

		describe("** Misc Heights", function() {
			checkResults(56,5,12,"M",0,58);
			checkResults(68,5,16,"M",0,70);
			checkResults(0,5,12,"M",0,58);
		});		


		function checkResults(currentHeight,heightBias,age,gender,healthBias, result) {
			describe("  " + gender + " => Current Height: " + currentHeight + " / Age: " + age, function() {
				it("should return ~" + result, function(done) {
					genetics.determineNewHeight(currentHeight,heightBias,age,gender,healthBias, function(newHeight) {
						expect(newHeight).to.be.within(result-2,result+2);
						done();
					});
					
				});
			})
		}

	});

});