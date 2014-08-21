
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../lib/time');


 var mongoose = require('mongoose'),
	 FoodItems = mongoose.model('foodItems');


/**
 *  Gets food item by it's common name ("Apple Pie")
 *  @param {String} itemName
 *  @return {Object} Returns FoodItem object
 */
exports getByName = getByName;
function getByName(itemName, callback) {
	FoodItems.findOne({ name: itemName}).exec(function(err,foodItem) {
		callback(foodItem);
	})

}

/**
 *  Gets food item by it's formal name ("apple_pie")
 *  @param {String} itemName
 *  @return {Object} Returns FoodItem object
 */
exports getByFormalName = getByFormalName;
function getByFormalName(itemName, callback) {
	FoodItems.findOne({ nameFormal: itemName}).exec(function(err,foodItem) {
		callback(foodItem);
	})

}

/**
 *  Gets food item by it's ObjectId
 *  @param {ObjectId} itemId
 *  @return {Object} Returns FoodItem object
 */
exports getById = getById;
function getById(itemId, callback) {
	FoodItems.findOne({ _id: itemId}).exec(function(err,foodItem) {
		callback(foodItem);
	})

}

/**
 *  Creates new FoodItem
 *  @param {Object} FoodItem object
 *  @return {Object/Int} callback is either err message, 0, or 1
 */
exports addItem = addItem;
function addItem(foodItem, callback) {

	var food = new FoodItems(foodItem);

	food.save(function (err, doc) {
		if(err) {
			callback(err);
		} else {
			callback(doc);
		}
	});

}
