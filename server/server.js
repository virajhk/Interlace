//Assignments = new Mongo.Collection("assignments");

if (Meteor.isServer) {

	Meteor.publish('getAssignment', function(){
		return Assignments.find({});
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
      }
    });
}