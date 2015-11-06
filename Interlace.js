Router.route('/', function () {
  //this.render('firstPage');
  this.render('firstPage');
});

Router.route('/quizQuestions');
Router.route('/editQuiz');
Router.route('/releaseQuiz');

Assignments = new Mongo.Collection("assignments");

if (Meteor.isClient) {
  Meteor.subscribe('getAssignment');

  Session.set('lecturer', false);

  var search = function () {
    var p = window.location.search.substr(1).split(/\&/), l = p.length, kv, r = {};
    while (l--) {
        kv = p[l].split(/\=/);
        r[kv[0]] = kv[1] || true; //if no =value just set it as true
    }
    return r;
  } ();

  //variable to store the Authentication Token
  var Token = "";

  var question_id = 0;
  var latest;

  var mcqOptionsArray = [];
  var questionArray = [];
  var answerArray = [];

  //check query string for search token
  if (search.token && search.token.length > 0 && search.token != 'undefined') {
      Token = search.token;
      setCookie('token', Token);
  }

  if (getCookie('token') === '')
    logout();

  Template.firstPage.events({
    'click #Announcement': function (e) {
      e.preventDefault();
      expand_box(document.getElementById('Announcement'));
    },
    'click #Forum': function (e) {
      e.preventDefault();
      expand_box(document.getElementById('Forum'));
    },
    'click #Multimedia': function (e) {
      e.preventDefault();
      expand_box(document.getElementById('Multimedia'));
    },
    'click #Files': function (e) {
      e.preventDefault();
      expand_box(document.getElementById('Files'));
    },
    'click #createQuiz': function(e) {
      e.preventDefault();
      window.location = 'quizQuestions';
    },
    'click #editQuiz': function(e) {
      e.preventDefault();
      window.location = 'editQuiz';
    },
    'click #releaseQuiz': function(e) {
      e.preventDefault();
      window.location = 'releaseQuiz';
    }
  });

  Template.hello.events({
    'click button': function () {
      if (Session.get('logincheck') === false)
        loginIVLE();
    },
    'click #logout': function () {
      logout();
    },
    'click #login': function () {
      loginIVLE();
    },
    'click #home': function () {
      window.location = "/"
    }
  });

  Template.hello.helpers({
    loginCheck: function () {
      return Session.get('logincheck');
    }
  });

  Template.firstPage.helpers({
    lecturerCheck: function() {
      return Session.get('lecturer');
    },
    studentCheck: function() {
      return Session.get('student');
    }
  });

  Template.quizQuestions.events({
    'click #add_mcq_question': function () {
      Blaze.renderWithData(Template.question_mcq, {my: "data"}, $("#quiz")[0]);
      return false;
    },
    'click #add_short_question': function () {
      Blaze.renderWithData(Template.question_short_answer, {my: "data"}, $("#quiz")[0]);
      return false;
    },
    'click #save_assignment': function (e) {
      e.preventDefault();

      saveAssignment(questionArray, answerArray, mcqOptionsArray, "new");
    }
  });

  Template.question_mcq.helpers({
    question_id: function() {
      var returnString = "question" + question_id.toString();
      return returnString;
    },
    same_name: function() {
      return question_id;
    },
    question_number: function() {
      question_id = question_id + 1;
      return question_id;
    }
  });

  Template.mcq_single.helpers({
    question_id: function() {
      var returnString = "question" + question_id.toString();
      return returnString;
    },
    same_name: function() {
      return latest;
    }
  });

  Template.question_short_answer.helpers({
    question_id: function() {
      var returnString = "question" + question_id.toString();
      return returnString;
    },
    question_number: function() {
      question_id = question_id + 1;
      return question_id;
    }
  });

  Template.question_mcq.events({
    'click .add_option': function (e) {
      e.preventDefault();
      var question = "#question" + e.currentTarget.id.toString();
      latest = e.currentTarget.id;
      Blaze.renderWithData(Template.mcq_single, {my: "data"}, $(question)[0]);
      return false;
    },
    'change .mcq_option': function (e) {
      var value = e.currentTarget.value;
      var classes = $(e.currentTarget).attr('class');
      var classArray = classes.split(' ');

      var found = 0;
      for (var i=0; i<mcqOptionsArray.length; i++) {
        if (mcqOptionsArray[i].question_number == classArray[1].substr(8, classArray[1].length) && mcqOptionsArray[i].valueNumber == classArray[2].substr(5, classArray[2].length)) {
          mcqOptionsArray[i].value = value;
          found = 1;
        } 
      }
      if (found == 0) {
        var options = {
          question_number: classArray[1].substr(8, classArray[1].length),
          valueNumber: classArray[2].substr(5, classArray[2].length),
          value: value
        };

        mcqOptionsArray.push(options);
      }

      console.log(mcqOptionsArray);
    },
    'change .mcq_question': function (e) {
      var value = e.currentTarget.value;
      var classes = $(e.currentTarget).attr('class');
      var classArray = classes.split(' ');

      var found = 0;
      for (var i=0; i<questionArray.length; i++) {
        if (questionArray[i].question_number == classArray[1].substr(8, classArray[1].length)) {
          questionArray[i].question = value;
          found = 1;
        } 
      }
      if (found == 0) {
        var options = {
          question_number: classArray[1].substr(8, classArray[1].length),
          question: value
        };

        questionArray.push(options);
      }

      console.log(questionArray);
    },
    'change .mcq_radio': function (e) {
      var value = e.currentTarget.value;
      var classes = $(e.currentTarget).attr('class');
      var classArray = classes.split(' ');

      var found = 0;
      for (var i=0; i<answerArray.length; i++) {
        if (answerArray[i].question_number == classArray[1].substr(8, classArray[1].length)) {
          answerArray[i].answer = value;
          found = 1;
        } 
      }
      if (found == 0) {
        var options = {
          type: 'MCQ',
          question_number: classArray[1].substr(8, classArray[1].length),
          answer: value
        };

        answerArray.push(options);
      }

      console.log(answerArray);
    } 
  });

Template.question_short_answer.events({
    'change .short_answer_question': function (e) {
      var value = e.currentTarget.value;
      var classes = $(e.currentTarget).attr('class');
      var classArray = classes.split(' ');

      var found = 0;
      for (var i=0; i<questionArray.length; i++) {
        if (questionArray[i].question_number == classArray[1].substr(8, classArray[1].length)) {
          questionArray[i].question = value;
          found = 1;
        } 
      }
      if (found == 0) {
        var options = {
          question_number: classArray[1].substr(8, classArray[1].length),
          question: value
        };

        questionArray.push(options);
      }

      console.log(questionArray);
    },
    'change .short_answer': function (e) {
      var value = e.currentTarget.value;
      var classes = $(e.currentTarget).attr('class');
      var classArray = classes.split(' ');

      var found = 0;
      for (var i=0; i<answerArray.length; i++) {
        if (answerArray[i].question_number == classArray[1].substr(8, classArray[1].length)) {
          answerArray[i].answer = value;
          found = 1;
        } 
      }
      if (found == 0) {
        var options = {
          type: 'short_answer',
          question_number: classArray[1].substr(8, classArray[1].length),
          answer: value
        };

        answerArray.push(options);
      }

      console.log(answerArray);
    }  
});

Template.editQuiz.events({
    'click #retrieve_ale': function (e) {
      e.preventDefault();
      var id = document.getElementById('module_id_get').value + '_' + document.getElementById('lecture_id_get').value + '_' + document.getElementById('assignment_id_get').value;
      var assignmentInfo = Assignments.find({_id: id}).fetch();

      console.log(assignmentInfo);

      for (var i=0; i<assignmentInfo[0].data.questions.length; i++) {

        var questionOption = {
          question_number: (i+1).toString(),
          question: assignmentInfo[0].data.questions[i].question
        };

        questionArray.push(questionOption);

        if (assignmentInfo[0].data.questions[i].type == "short_answer") {
          addShortAnswerQuestion();

          var questionClass = "short_answer_question question" + (i+1).toString();
          var question = document.getElementsByClassName(questionClass);
          question[0].value = assignmentInfo[0].data.questions[i].question;

          var answerClass = "short_answer question" + (i+1).toString();
          var answer = document.getElementsByClassName(answerClass);
          answer[0].value = assignmentInfo[0].data.questions[i].answer;

          var options = {
            type: 'short_answer',
            question_number: (i+1).toString(),
            answer: assignmentInfo[0].data.questions[i].answer
          };

          answerArray.push(options);
        } else {
          addMcqQuestion();

          var questionClass = "mcq_question question" + (i+1).toString();
          var question = document.getElementsByClassName(questionClass);
          question[0].value = assignmentInfo[0].data.questions[i].question;

          for (var j=0; j<assignmentInfo[0].data.questions[i].answer.length; j++) {
            var question_id = "question" + (i+1).toString();
            var answerClass = "mcq_option " + question_id +  " value" + (j+1).toString();
            var answer = document.getElementsByClassName(answerClass);
            answer[0].value = assignmentInfo[0].data.questions[i].answer[j].optionValue;

            var options = {
              question_number: (i+1).toString(),
              valueNumber: (j+1).toString(),
              value: assignmentInfo[0].data.questions[i].answer[j].optionValue
            };

            mcqOptionsArray.push(options);

            if (assignmentInfo[0].data.questions[i].answer[j].answer == 1) {
              var optionId = "mcq_radio_" + (j+1).toString() +  " question" + (i+1).toString();
              var option = document.getElementsByClassName(optionId);
              option[0].checked = true;

              var answerOption = {
                type: 'MCQ',
                question_number: (i+1).toString(),
                answer: (j+1).toString()
              };

              answerArray.push(answerOption);
            }
          
          }
        }
      }
    },
    'click #add_mcq_question': function () {
      Blaze.renderWithData(Template.question_mcq, {my: "data"}, $("#quiz_retrieved")[0]);
      return false;
    },
    'click #add_short_question': function () {
      Blaze.renderWithData(Template.question_short_answer, {my: "data"}, $("#quiz_retrieved")[0]);
      return false;
    },
    'click #save_assignment': function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to save the changes to the ALE?')) {
        saveAssignment(questionArray, answerArray, mcqOptionsArray, "edit");
      }
    }
});

Template.editQuiz.helpers({});

Template.releaseQuiz.events({
    'click #release_ale': function (e) {
      e.preventDefault();
      var id = document.getElementById('module_id_release').value + '_' + document.getElementById('lecture_id_release').value + '_' + document.getElementById('assignment_id_release').value;
      var assignmentInfo = Assignments.find({_id: id}).fetch();

      console.log(assignmentInfo);
    },
    'click #getALE': function (e) {
      var allALEs = Assignments.find().fetch();
      console.log(allALEs);
    }
});

  if (getCookie('token') != '') {
    Session.set('logincheck', true);
    Populate_UserName();
    //Populate_Module();
    Populate_UserId();
  }
}

function addMcqQuestion() {
  Blaze.renderWithData(Template.question_mcq, {my: "data"}, $("#quiz_retrieved")[0]);
  return false;
}

function addShortAnswerQuestion() {
  Blaze.renderWithData(Template.question_short_answer, {my: "data"}, $("#quiz_retrieved")[0]);
  return false;
}

function logout() {
  setCookie('token', '');
  setCookie('userName', '');
  setCookie('userId', '');
  Session.set('logincheck', false);
  Session.set('lecturer', false);
  Session.set('student', false);
}

function loginIVLE() {
  var APIKey = "HkwaOupOwuKRoKglP8Gep";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var returnURL = '';
  if (window.location.href.indexOf("localhost") > -1)
    returnURL = "localhost:3000";
  else if (window.location.href.indexOf("") > -1)
    returnURL = "interlace.meteor.com";

  var LoginURL = APIDomain + "api/login/?apikey=HkwaOupOwuKRoKglP8Gep&url=http%3A%2F%2F" + returnURL;

  window.location = LoginURL;
}

function Populate_UserName() {
  var APIKey = "HkwaOupOwuKRoKglP8Gep";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var Token = getCookie('token');
  var url = APIUrl + "UserName_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + Token;

  jQuery.getJSON(url, function (data) {
      document.cookie="userName="+data;
      $('#lbl_Name').html(data);
  });
}

function Populate_UserId() {
  var APIKey = "HkwaOupOwuKRoKglP8Gep";
  var APIDomain = "https://ivle.nus.edu.sg/";
  var APIUrl = APIDomain + "api/lapi.svc/";
  var Token = getCookie('token');
  var url = APIUrl + "UserID_Get?output=json&callback=?&APIKey=" + APIKey + "&Token=" + Token;

  jQuery.getJSON(url, function (data) {
      document.cookie="userId="+data;
      
      if (/^[a-zA-Z]+$/.test(data)) {
          Session.set('lecturer', true);
      } else {
          Session.set('student', true);
      }
  });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (1*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function Populate_Module() {
    var APIKey = "HkwaOupOwuKRoKglP8Gep";
    var APIDomain = "https://ivle.nus.edu.sg/";
    var APIUrl = APIDomain + "api/lapi.svc/";
    var Token = getCookie('token');
    
    var Profile = APIUrl + "Profile_View?APIKey=" + APIKey + "&AuthToken=" + Token + "&Duration=1&IncludeAllInfo=false&output=json&callback=?";
    
    jQuery.getJSON(Profile, function (data) {
        console.log(data);
    });

    var ModuleURL = APIUrl + "Modules?APIKey=" + APIKey + "&AuthToken=" + Token + "&Duration=1&IncludeAllInfo=false&output=json&callback=?";
    //Get all the modules belonging to me
    jQuery.getJSON(ModuleURL, function (data) {
        //console.log(data);

        var lbl_Module = "";
        for (var i = 0; i < data.Results.length; i++) {
            var m = data.Results[i];

            document.cookie="module" + (i+1).toString() + "=" + m.CourseCode;
            //output the course code, acadyear and coursename
            lbl_Module += m.CourseCode + " " + m.CourseAcadYear + " - " + m.CourseName;
            lbl_Module += "<br />";
        }
    });
}

function expand_box(element) {
    if(element.offsetWidth == 200) {
      element.setAttribute("style", "width:1068px; height:600px");
    } else {
      element.setAttribute("style", "width:200px; height:100px");
    }
}

function saveAssignment(questionArray, answerArray, mcqOptionsArray, source) {
  var module;
  var lecture;
  var assignment;

  if (source == "new") {
    module = document.getElementById('module_id').value;
    lecture = document.getElementById('lecture_id').value;
    assignment = document.getElementById('assignment_id').value;
  } else if(source == "edit") {
    module = document.getElementById('module_id_get').value;
    lecture = document.getElementById('lecture_id_get').value;
    assignment = document.getElementById('assignment_id_get').value;
  }

  var allQuestions = [];

  var question_number = 0;

  for (var i=0; i<questionArray.length; i++) {
    var question;
    var answerType;
    var answer;
    var mcq_options = [];

    if ((i+1) == questionArray[i].question_number) {
      question_number = questionArray[i].question_number;
      question = questionArray[i].question;

      for (var j=0; j<answerArray.length; j++) {
        if (question_number == answerArray[j].question_number) {
          answerType = answerArray[j].type;

          if (answerType == 'short_answer') {
            answer = answerArray[j].answer;
            var questionObject = {
              type: answerType,
              question: question,
              answer: answer
            };
            allQuestions.push(questionObject);
            break;
          } else if (answerType == 'MCQ') {
            answer = answerArray[j].answer;
            for (var k=0; k<mcqOptionsArray.length; k++) {
              if (question_number == mcqOptionsArray[k].question_number) {
                var mcqAnswer;
                if (answer == mcqOptionsArray[k].valueNumber) {
                  mcqAnswer = 1;
                } else {
                  mcqAnswer = 0;
                }
                var option = {
                  optionValue: mcqOptionsArray[k].value,
                  answer: mcqAnswer
                };
                mcq_options.push(option);
              }
            }

            var questionObject = {
              type: answerType,
              question: question,
              answer: mcq_options
            };

            allQuestions.push(questionObject);
            break;
          }
        }
      }
    } 
  }

  var ale = {
    module_id: module,
    lecture_id: lecture,
    assignment_id: assignment,
    questions: allQuestions
  };

  var id = ale.module_id + '_' + ale.lecture_id + '_' + ale.assignment_id;
  var exists = Assignments.find({_id: id}).fetch();
  
  if (exists.length == 0)
    Meteor.call('saveAssignment', id, ale);
  else
    Meteor.call('editAssignment', id, ale);
  
  console.log(ale);
}
