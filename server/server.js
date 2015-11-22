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
    },
    editAssignment: function(id, data) {
    	Assignments.update({_id: id}, {data: data});
    },
    modelAnswerFile: function(id) {
      createFile(id);
    }
  });

  function createFile(id) {
  var exists = Assignments.find({_id: id}).fetch();
  var data = exists[0].data;
  console.log(data);
  var write = 'Module:';
  var module = data.module_id;
  write += module;
  write += '\r\n';
  write += 'Lecture:';
  var lecture = data.lecture_id;
  write += lecture;
  write += '\r\n';
  write += 'Assignment:';
  var assignment_no = data.assignment_id;
  write += assignment_no;
  write += '\r\n';
  write += '\r\n';
  var qn = data.questions;

  for(var i=0; i<qn.length;i++)    
  {
      var qn_temp = qn[i];

      if(qn_temp.type == 'short_answer')
      { 
        write+= 'Question:';
        write+= qn_temp.question;
        write+= '\r\n';
        write+= 'Answer:';
        write+= qn_temp.answer;
        write+= '\r\n';
        console.log(write);
      }

      if(qn_temp.type == 'MCQ')
      { 
        write+= 'Question:';
        write+= qn_temp.question;
        write+= '\r\n';
        for(var i=0; i<qn_temp.answer.length; i++)
        {
          var answerVal = qn_temp.answer[i];
          if(answerVal.answer == 1)
          {
            write+= 'Answer:';
            write+= answerVal.optionValue;
          }

          else
          {
            console.log('wrong answer');
          }
          
        }
        write+= '\r\n';
        console.log(write);
      }
      
  }
  console.log("Entered here");

  var filepath = 'C://Users//Public/Downloads/' + 'model_answers_' + data.module_id + '_' + data.lecture_id + data.assignment_id + '.txt';

  fs.writeFile(filepath, write, function(err){
      if(err)
        throw err;
      console.log("Done");
    })
  }

}
