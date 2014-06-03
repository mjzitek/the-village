db.persons.remove({ __v : 0 })
db.persons.update({}, { $set: {dateOfDeath : null, pregnancy : { pregnant : false, pregnancyDate : null, babyFatherId : null }}}, { multi : true })

db.relationships.remove({ __v : 0 })
db.relationships.update({}, { $set: {notes: null, enddate: null, active: true}}, { multi: true })

db.families.remove({ __v : 0 })

db.gamesettings.update({ setkey : "time"}, { $set :  { setvalue : "1900-01-01" }}, { multi : false })