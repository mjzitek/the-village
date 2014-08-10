/*

	Functions used to set and get values having to do with the
	"genetics" of a person....appearance, attributes, etc


*/

var fs = require('fs');
var _ = require('underscore');


_.mixin({
	isCapital : function(char) {
		return (char === char.toUpperCase() ? true : false)  
	}
});



/**
*  Picks a random allele out of one or two
*  @param {Object} alleles Set of two alleles (one and two) 
*  @return {Object} Returns a random allete
*/
exports.getRandomAllele = getRandomAllele
function getRandomAllele(alleles) {

	var randNum = Math.round(Math.random());

	if(randNum === 0) {
		return alleles.one;
	} else {
		return alleles.two;
	}
}

/**
*  Gets an eye color and two alleles from parent's alleles 
*  based on the parent's alleles
*  @param {Object} dad 
*  @param {Object} mom
*  @return {Object} Returns eyes (color, bey2, gey)
*/
exports.eyeColor = eyeColor;
function eyeColor(dad, mom) {
	try {
		var dadEyeAlleleBey2 = getRandomAllele(dad.genome.genes.eyes.bey2);
		var dadEyeAlleleGey = getRandomAllele(dad.genome.genes.eyes.gey);

		var momEyeAlleleBey2 = getRandomAllele(mom.genome.genes.eyes.bey2);
		var momEyeAlleleGey = getRandomAllele(mom.genome.genes.eyes.gey);

		var bey2 = {
						one: dadEyeAlleleBey2,
						two: momEyeAlleleBey2
		}

		var gey = {
						one: dadEyeAlleleGey,
						two: momEyeAlleleGey
		}

		var color = determineEyeColor(bey2, gey);

		var eyes = { 
						color : color,
						bey2 : bey2,
						gey : gey,
			   }
    } catch (err) {
    	console.log(err);
    	console.log(dad);
    	console.log(mom);
    }

    //console.log(eyes);

	return eyes;
}

/**
*  Determines the eye color based on 2 alleles (bey2 and gey)
*  @param {Object} bey2 (one and two)
*  @param {Object} gey (one and two)
*  @return {String} Returns eye color
*/
exports.determineEyeColor = determineEyeColor;
function determineEyeColor(bey2, gey) {

	// brown-brown
	// brown-blue
	// blue-blue

	// green-green
	// green-blue
	// blue-blue

	if(bey2.one === "brown" || bey2.two === "brown") {
		return "brown";
	} else if (gey.one === "green" || gey.two === "green") {
		return "green";
	} else {
		return "blue";
	}

}

/**
*  Gets the skin color based on array number
*  @param {Integer} num 
*  @return {Object} Returns the RBG values for skin color
*/
exports.skinColors = skinColors;
function skinColors(num) {
	var colors = [
		{ R: 45, G: 34, B: 30 },		// 0
		{ R: 60, G: 46, B: 40 },		// 1
		{ R: 75, G: 57, B: 50 },		// 2
		{ R: 90, G: 69, B: 60 },		// 3
		{ R: 105, G: 80, B: 70 },		// 4
		{ R: 120, G: 92, B: 80 },		// 5
		{ R: 135, G: 103, B: 90 },		// 6
		{ R: 150, G: 114, B: 100 },		// 7
		{ R: 165, G: 126, B: 110 },		// 8
		{ R: 180, G: 138, B: 120 },		// 9
		{ R: 195, G: 149, B: 130 },		// 10
		{ R: 210, G: 161, B: 140 },		// 11
		{ R: 225, G: 172, B: 150 },		// 12
		{ R: 240, G: 184, B: 160 },		// 13
		{ R: 255, G: 195, B: 170 },		// 14
		{ R: 255, G: 206, B: 180 },		// 15
		{ R: 255, G: 218, B: 190 },		// 16
		{ R: 255, G: 229, B: 200 },		// 17
	];


	return colors[num];	
}

/**
*  Gets the hair color based on array number
*  @param {Integer} num 
*  @return {Object} Returns the RBG values for hair color
*/
exports.hairColors = hairColors;
function hairColors(num) {

	var colors = [
		{ R: 9,   G: 8,   B:6   },	
		{ R: 59,  G: 48,  B:36  },	
		{ R: 78,  G: 67,  B:63  },	
		{ R: 85,  G: 72,  B:56  },
		{ R: 106, G: 78,  B:66  },
		{ R: 167, G: 133, B:106 },
		{ R: 149, G: 83,  B:52	},
		{ R: 109, G: 41,  B:6	},
		{ R: 229, G: 110, B:51  },
		{ R: 242, G: 245, B:193 },
	];


	return colors[num];
}

/**
*  Gets an skin color and two alleles from parent's alleles 
*  based on the parent's alleles
*  @param {Object} dad 
*  @param {Object} mom
*  @return {Object} Returns eyes (color, bey2, gey)
*/
exports.skinColor = skinColor;
function skinColor(dad, mom) {
	var dadSkinAllele = getRandomAllele(dad.genome.genes.skin);
	var momSkinAllele = getRandomAllele(mom.genome.genes.skin);

	var skin = {};

	skin.one = dadSkinAllele;
	skin.two = momSkinAllele;
	skin.color = determineSkinColor(dadSkinAllele, momSkinAllele);

	//console.log(skin);

	return skin;
}


/**
*  Determines the skin color based on 2 skin color inputs
*  @param {Object} input1 RGB color value for skin  
*  @param {Object} input2 RGB color value for skin
*  @return {Object} Returns skin color (RGB)
*/
exports.determineSkinColor = determineSkinColor
function determineSkinColor(input1, input2) {


	var newBlueValue = Math.floor((input1.B + input2.B) / 2);

	var randSkinBias = Math.floor(Math.random() * 10);
	var newBlueValue = newBlueValue - randSkinBias;


    var skin = {};
    
    skin.R = Math.floor(newBlueValue * 1.5);
    skin.G = Math.floor(newBlueValue * 1.15);
    skin.B = newBlueValue;
    
    if(skin.R > 255) skin.R = 255;
    if(skin.G > 255) skin.G = 255;
    if(skin.B > 255) skin.B = 255;
    

    return skin;

}

/**
*  Gets an hair color and two alleles from parent's alleles 
*  based on the parent's alleles
*  @param {Object} dad 
*  @param {Object} mom
*  @return {Object} Returns hair (color, one, two)
*/
exports.hairColor = hairColor;
function hairColor(dad, mom) {

	var dadHairAllele = getRandomAllele(dad.genome.genes.hair);
	var momHairAllele = getRandomAllele(mom.genome.genes.hair);	

	var hair = {};

	hair.one = dadHairAllele;
	hair.two = momHairAllele;
	hair.color = getRandomAllele(hair);	

	return hair;

}

/**
*  Gets an height from parent's height
*  based on the parent's alleles
*  @param {Object} dad 
*  @param {Object} mom
*  @return {Object} Returns height value (height, one, two)
*/
exports.height = height;
function height(dad, mom) {
	var dadHeightAllele = getRandomAllele(dad.genome.genes.height);
	var momHeightAllele = getRandomAllele(mom.genome.genes.height);	


	var height = {};

	height.one = dadHeightAllele;
	height.two = momHeightAllele;
	height.height = determineHeight(dadHeightAllele, momHeightAllele);

	return height;
}

/**
*  Picks a random set given two inputs 
*  @param {String} input1 a height in inches
*  @param {String} input2 a height in inches
*  @return {String} Returns one of the two inputed objects
*/
exports.determineHeight = determineHeight;
function determineHeight(input1, input2) {

	var height = (parseInt(input1) + parseInt(input2)) / 2;
	var heightBias = Math.floor(getBaseLog((Math.floor(Math.random() * 13)+2), 10));

	height = height + heightBias;

	return height;

}

/**
*  Picks the dominate gene based on capital letters
*  @param {String} input1 A gene
*  @param {String} input
*  @return {String} Returns one of the two inputed objects
*/
exports.determineDominance = determineDominance;
function determineDominance(input1, input2) {
	if(_(input1).isCapital() && !_(input2).isCapital)
	{
		return input1;
	} else if (!_(input1).isCapital() && _(input2).isCapital())
	{
		return input2;
	} else {
		return input1;
	}
}





/**
*  Picks a random set given two inputs 
*  @param {Object} set1 A gene object
*  @param {Object} set2 A gene object
*  @return {Object} Returns one of the two inputed objects
*/
exports.pickRandomGeneSet = pickRandomGeneSet;
function pickRandomGeneSet(set1, set2) {
	// var ranNum = (Math.floor(Math.random() * 100));
	if((Math.floor(Math.random() * 2) === 1)) {
		return set1;
	} else {
		return set2;
	}
}



function getBaseLog(x, y) {
    return Math.log(y) / Math.log(x);
}

function getBMI(height, weight) {

	// [Weight in Pounds ÷ (Height in inches)2] × 703

	// 	<18.5 = Underweight
	// 18.5 - 24.9 = Normal Weight
	// 25 - 29.9 = Overweight
	// BMI of 30 or greater = Obesity
}


 
