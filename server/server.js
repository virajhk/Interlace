// Assignments = new Mongo.Collection("assignments");

if (Meteor.isServer) {

  var fs = Npm.require('fs');

	Meteor.publish('getAssignment', function(){
		return Assignments.find({});
	});


    Meteor.methods({
      saveAssignment: function(id, data) {
        Assignments.insert({
        	_id: id,
          	data: data
        });
        createFile(id);
      },
      editAssignment: function(id, data) {
      	Assignments.update({_id: id}, {data: data});
      }
    });



    fs.writeFile('C:/Users/Gaurav/backend/test.txt', write, function(err){
      if(err)
        throw err;
      console.log("Done");
    }


}