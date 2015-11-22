// Assignments = new Mongo.Collection("assignments");

if (Meteor.isServer) {

  var fs = Npm.require('fs');

	Meteor.publish('getAssignment', function(){
		return Assignments.find({});
	});

  Meteor.publish('getAnswers', function(){
    return Answers.find({});
  });

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