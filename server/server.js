// Assignments = new Mongo.Collection("assignments");

if (Meteor.isServer) {

  var fs = Npm.require('fs');

	Meteor.publish('getAssignment', function(){
		return Assignments.find({});
	});

    fs.writeFile('C:/Users/Gaurav/backend/test.txt', write, function(err){
      if(err)
        throw err;
      console.log("Done");
    }

  Meteor.methods({
    saveAssignment: function(id, data) {
      Assignments.insert({
        _id: id,
        data: data
      });
    },
    editAssignment: function(id, data) {
    	Assignments.update({_id: id}, {data: data});
    },
    modelAnswerFile: function(id) {
      createFile(id);
    }
  });
}

function createFile(id) {
  console.log("Entered here");
}