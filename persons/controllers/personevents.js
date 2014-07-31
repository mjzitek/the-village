var fs = require('fs');
var moment = require('moment');
var async = require('async');

var settings = require('../config/settings');
var tMoment = require('../helpers/time');

 var mongoose = require('mongoose'),
	PersonEvents = mongoose.model('personevents');

// Controllers
var gameSettings = require('./gamesettings');
var persons = require('./persons');
var time = require('./time');
var families = require('./families');
var relationships = require('./relationships');


exports.add = addEvent;
exports.addEvent = addEvent;
function addEvent(info, callback) {

	//console.log(info);

	switch(info.eventType) {
		case 'pregnancy':
			info.text =  info.persons[0].firstName + ' ' + info.persons[0].lastName + ' is now pregnant';
			break;
		case 'birth':
			info.text =  info.persons[0].firstName + ' ' + info.persons[0].middleName + ' ' + info.persons[0].lastName + ' was born';
			break;
		case 'death':
			info.text =  info.persons[0].firstName + ' ' + info.persons[0].lastName + ' has died';
			break;
		case 'marriage':
			info.text = info.persons[0].firstName + ' ' + info.persons[0].lastName + ' has married ' + 
						info.persons[1].firstName + ' ' + info.persons[1].lastName
			break;

	}


	var pEvent = new PersonEvents({
		persons: 		info.persons,
		eventType:      info.eventType, 
		eventInfo: 		info.text || null,
		eventDate: 		info.eventDate,
		realworldDate: 	new Date()

	});


	pEvent.save(function(err, doc) {
		callback(doc);
	});

}

exports.get = getEvents;
exports.getEvents = getEvents;
function getEvents(lastId, limitAmount, callback) {
	console.log('Getting Events ' + lastId + " | " + limitAmount)

	var filter = {}

	if(lastId != 0) {
		filter._id = { $gt : lastId};
	}

	//console.log(filter);


	PersonEvents.find(filter).limit(limitAmount).sort({ _id: -1 }).exec(function(err, events) {
		//console.log(events);
		callback(events);
	});

}


exports.removeAll = removeAllEventRecords;
exports.removeAllEventRecords = removeAllEventRecords;
function removeAllEventRecords(callback) {
	PersonEvents.remove({}, function(err, doc) {
		if(err) {
			callback("Error: " + err);
		} else
		{
			callback();
		}
	});

}

exports.getEventDetails = getEventDetails;
function getEventDetails(eventId, callback) {
	console.log('Getting Event Details ' + eventId);

	PersonEvents.findOne({ _id: eventId}).populate("persons").exec(function(err, events) {
		callback(events);
	});
}