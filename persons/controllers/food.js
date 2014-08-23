/*

	This controller is for the handling of food items as
	related to inventories, doing things with food, etc
	where as the fooditem controller is primarily for interfacing
	with the FoodItems collection

*/


function addToVillagersInventory() {}

function removeFromVillagersInventory() {}

function eatFoodItem() {}

function addToStructuresInventory() {}

function removeFromStructuresInventory() {}

/**
 *  "Prepares" a food item (cook)
 *  @param {ObjectId} personId
 *  @param {ObjectId} foodItem
 *  @param {Object} ingredients items needed to make foodItem
 *  @return {Array/Object} Returns FoodItem object
 */
function prepareFoodItem(personId, foodItem, ingredients, callback) {

	// Check receipe for needed items and compare to ingredients passed
	// if not all ingredients that are needed are passed, return false




}

