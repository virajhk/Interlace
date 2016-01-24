/*Router.route('/', function () {
  //this.render('firstPage');
  this.render('firstPage');
});*/

Router.route('/', function () {
  //this.render('firstPage');
  if (Meteor.userId() != null && getCookie('lecturer') == "true") {
    this.render('firstPage');
  } else if (Meteor.userId() != null && getCookie('student') == "true") {
    this.render('home');
  } else {
    this.render('commonLanding');
  }
});

Router.route('/quizQuestions');
Router.route('/editQuiz');
Router.route('/releaseQuiz');
Router.route('/modelAnswers');
Router.route('/d3vis');
Router.route('/answerAnalysis');

// Break line
/*Router.route('/', {
  name: 'home',
  template: 'home'
});*/

Router.route('/news');
Router.route('/inclassactivity');
Router.route('/archive');
Router.route('/activity1');
Router.route('/activity2');

//Questions = new Mongo.Collection("questions");
Groups = new Mongo.Collection("tasks");
// Break line

Assignments = new Mongo.Collection("assignments");
Answers = new Meteor.Collection("answers");
BrowserNotifications = new Mongo.Collection("browserNotifications");

var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
 stores: [imageStore]
});

Images.allow({
 insert: function(){
  return true;
 },
 update: function(){
  return true;
 },
 remove: function(){
  return true;
 },
 download: function(){
  return true;
 }
});

if (Meteor.isClient) {
  //Break Line
  Session.setDefault('studentId', 'A0105522W');
  Session.setDefault('studentName', 'Xu Chen');
  Session.setDefault('isGroupCreator', false);
  Session.setDefault('hasGroup', false);
  Session.setDefault('numOfGroups', 3);

  Template.StudentNameDisplay.helpers({
    getStudentName: function () {
      return Session.get('studentName');
    }
  });

  Template.DateDisplay.helpers({
    getDate: function () {
      var date = new Date();
      var begun = moment(date).format("DD-MMM-YYYY");

      return begun;
    }
  });

  Template.TodaySchedule.helpers({
    getTodaySchedule: function () {
      return "Today Schedule";
    }
  });

  Template.Announcement.helpers({
    getAnnouncement: function () {
      return "Announcement";
    }
  });

  Template.GroupListDisplay.helpers({
    groups: function () {
      return Groups.find({});
    },
    isInGroup: function () {
      return Session.get('hasGroup');
    }
  });

  Template.groupActive.events({
    "click .join": function (event) {
      event.preventDefault();

      Session.set('hasGroup', true);
    }
  });

  Template.groupDisabled.events({
    "click .quit": function (event) {
      event.preventDefault();

      Session.set('hasGroup', false);
    }
  });

  Template.activity2.helpers({
    questions: function () {
      // QuestionNum = Questions.find().count();
      // return Questions.find({});
      //var id = ale.module_id + '_' + ale.lecture_id + '_' + ale.assignment_id;
      var id = "1_1_1";
      var tuple = Assignments.find({_id: id}).fetch();
      var data = tuple[0].data;
      var questionList = data.questions;  

      //console.log("data");
      //console.log(questionList);
      return questionList;
    },

    isMCQ: function (Question_type) {
      return Question_type === "MCQ";
    },

    isShortQuestion: function (Question_type) {
      return Question_type === "ShortQuestion";
    }
  });

  Template.image.helpers({
    emptyURL: function (url) {
      return url === "";
    }
  });

  Template.activity2.events({
    "submit .quiz": function (event) {
      event.preventDefault();

      $('.xxx:checked').each(function() {
        console.log($(this).val());
      });

      $('input[class="sq"], textarea').each(function(){  
        console.log($(this).val());
      });
    }
  });

  Template.GroupCreate.events({
    "click #create_group": function (event) {
      event.preventDefault();
      // console.log("xc testing");

      Session.set('numOfGroups', Session.get('numOfGroups') + 1);
      var groupName = "Group " + Session.get('numOfGroups');
      Groups.insert({
        text: groupName,
        createdAt: new Date()
      });
    }
  })
  //Break Line
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
  //console.log(Meteor.userId());

  Meteor.subscribe('getAssignment');
  Meteor.subscribe('getAnswers');
  Meteor.subscribe('getNotifications');
  Meteor.subscribe('images');

  //Meteor.call('createNotification');

  if (getCookie('firstLogin') == null) {
    setCookie('firstLogin', true);
  }

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
  var analysis_question = 0;
  var latest;
  var curr_question;
  var graph_module, graph_lecture, graph_assignment;

  var mcqOptionsArray = [];
  var questionArray = [];
  var answerArray = [];
  var mcqQuestions = [];
  var imageArray = [];

  //check query string for search token
  if (search.token && search.token.length > 0 && search.token != 'undefined') {
    Token = search.token;
    setCookie('token', Token);
  }

  if (getCookie('token') === '')
    logout();

  Template.firstPage.events({
    /*'click #Announcement': function (e) {
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
    },*/
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
    },
    'click #getModelAnswers': function(e) {
      e.preventDefault();
      window.location = 'modelAnswers';
    },
    'click #getAnalysis': function(e) {
      e.preventDefault();
      window.location = 'answerAnalysis';
    }/*,
    'change .myFileInput': function(event, template) {
      var source;
      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {
          if (err){
            // handle error
            console.log('error');
          } else {
            console.log('success');
            Meteor.setTimeout( function () { 
              source = fileObj.url('images');
              $("#imageTest").attr("src", source);
            }, 3000);
          }
        });
      });
    }*/
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
      window.location = "/";
    },
    'click #existing': function () {
      setCookie('firstLogin', false);
      window.location.reload(true);
    }
  });

  Template.hello.helpers({
    loginCheck: function () {
      return Session.get('logincheck');
    },
    firstLogin: function() {
      return getCookie('firstLogin');
    }
  });

  Template.firstPage.helpers({
    lecturerCheck: function() {
      return getCookie('lecturer');
    },
    studentCheck: function() {
      return getCookie('student');
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

      saveAssignment(questionArray, answerArray, mcqOptionsArray, imageArray, "new");
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
    },
    'change .mcq_myFileInput': function(event, template) {
      var source;
      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {
          if (err){
            // handle error
            console.log('error');
          } else {
            console.log('success');
            Meteor.setTimeout( function () { 
              source = fileObj.url('images');

              var classes = $(event.currentTarget).attr('class');
              var classArray = classes.split(' ');

              var targetClasses = ".preview" + "." + classArray[1];
              console.log(source);
              $(targetClasses).attr("href", source);

              var found = 0;
              for (var i=0; i<imageArray.length; i++) {
                if (imageArray[i].question_number == classArray[1].substr(8, classArray[1].length)) {
                  imageArray[i].url = source;
                  found = 1;
                } 
              }
              if (found == 0) {
                var options = {
                  type: 'mcq',
                  question_number: classArray[1].substr(8, classArray[1].length),
                  url: source
                };

                imageArray.push(options);
              }

              console.log(imageArray);
            }, 5000);
          }
        });
      });
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
    },
    'change .short_answer_myFileInput': function(event, template) {
      var source;
      FS.Utility.eachFile(event, function(file) {
        Images.insert(file, function (err, fileObj) {
          if (err){
            // handle error
            console.log('error');
          } else {
            console.log('success');
            Meteor.setTimeout( function () { 
              source = fileObj.url('images');

              var classes = $(event.currentTarget).attr('class');
              var classArray = classes.split(' ');

              var targetClasses = ".preview" + "." + classArray[1];
              console.log(source);
              $(targetClasses).attr("href", source);

              var found = 0;
              for (var i=0; i<imageArray.length; i++) {
                if (imageArray[i].question_number == classArray[1].substr(8, classArray[1].length)) {
                  imageArray[i].url = source;
                  found = 1;
                } 
              }
              if (found == 0) {
                var options = {
                  type: 'short_answer',
                  question_number: classArray[1].substr(8, classArray[1].length),
                  url: source
                };

                imageArray.push(options);
              }

              console.log(imageArray);
            }, 5000);
          }
        });
      });
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
        saveAssignment(questionArray, answerArray, mcqOptionsArray, imageArray, "edit");
      }
    }
});

Template.editQuiz.helpers({});

Template.modelAnswers.events({
    'click #get_model_answers': function (e) {
      e.preventDefault();
      var id = document.getElementById('module_id_model').value + '_' + document.getElementById('lecture_id_model').value + '_' + document.getElementById('assignment_id_model').value;
      Meteor.call('modelAnswerFile', id);
    }
});

Template.answerAnalysis.events({
    'click #get_answer_analysis': function (e) {
      e.preventDefault();
      if (document.getElementById('module_id_analysis').value != '' && document.getElementById('lecture_id_analysis').value != '' && document.getElementById('assignment_id_analysis').value != '') {
        document.getElementById('analysisTable').style.display = "block";
      }
      var id = document.getElementById('module_id_analysis').value + '_' + document.getElementById('lecture_id_analysis').value + '_' + document.getElementById('assignment_id_analysis').value;
      assignment = Assignments.find({_id:id}).fetch();

      graph_module = document.getElementById('module_id_analysis').value;
      graph_lecture = document.getElementById('lecture_id_analysis').value;
      graph_assignment = document.getElementById('assignment_id_analysis').value;

      for (var i=0; i<assignment[0].data.questions.length; i++) {
        Blaze.renderWithData(Template.addAccordionField, {my: "data"}, $("#accordion")[0]);
      }

      var answers = Answers.find({module_code:graph_module, lecture_id:graph_lecture, assignment_id:graph_assignment}).fetch();
      var questionFound = 0;
      for (var i=0; i<answers.length; i++) {
        if (answers[i].type == "MCQ") {
          if (mcqQuestions.length == 0)
            mcqQuestions.push(answers[i].question_id);
          else {
            for (var j=0; j<answers.length; j++) {
              if (answers[i].question_id == mcqQuestions[j]) {
                questionFound = 1;
                break;
              }
            }
            if (questionFound == 0) {
              mcqQuestions.push(answers[i].question_id);
            }
          }
        }
        questionFound = 0;
      }
    }
});

Template.addAccordionField.events({
  'click .click' :function (e) {
    e.preventDefault();
    var id = "#body" + e.currentTarget.id;
    curr_question = wordsToNumber(e.currentTarget.id);
    if (assignment[0].data.questions[curr_question-1].type == "MCQ") {
      for (var i=0; i<assignment[0].data.questions[curr_question-1].answer.length; i++) {
        if (assignment[0].data.questions[curr_question-1].answer[i].answer == 1) {
          model_answer = "Option " + (i+1).toString();
          break;
        }
      }
    } else {
      model_answer = assignment[0].data.questions[curr_question-1].answer;
    }
    var questionFound = 0;
    for (var i=0; i<mcqQuestions.length; i++) {
      if (curr_question-1 == mcqQuestions[i]) {
        questionFound = 1;
        break;
      }
    }
    if (e.currentTarget.attributes[6].nodeValue == "false") {
      if (questionFound == 1) {
        var element = document.getElementById("d3vis");
        if (element != undefined || element != null) {
          element.parentNode.removeChild(element);
        }
        Blaze.renderWithData(Template.d3vis, {my: "data"}, $(id)[0]);
      } else {
        var element = document.getElementById("notice");
        if (element != undefined || element != null) {
          element.parentNode.removeChild(element);
        }
        Blaze.renderWithData(Template.notice, {my: "data"}, $(id)[0]);
      }
    }
    else {
      var element = document.getElementById("d3vis");
      if (element != undefined || element != null) {
        element.parentNode.removeChild(element);
      }
      element = document.getElementById("notice");
      if (element != undefined || element != null) {
        element.parentNode.removeChild(element);
      }
    }
  }
});

Template.addAccordionField.helpers({
  question_number: function() {
    analysis_question = analysis_question + 1;
    return analysis_question;
  },
  heading: function() {
    return "heading" + numberToWords(analysis_question+1);
  },
  collapse: function() {
    return "collapse" + numberToWords(analysis_question+1);
  },
  second_heading: function() {
    return "heading" + numberToWords(analysis_question);
  },
  second_collapse: function() {
    return "collapse" + numberToWords(analysis_question);
  },
  body_question: function(){
    return "body" + numberToWords(analysis_question);
  },
  click_question: function(){
    return numberToWords(analysis_question+1);
  }
});

Template.d3vis.helpers({
  'model_answer': function() {
    return model_answer;
  }
});

Template.notice.helpers({
  'model_answer': function() {
    console.log(model_answer)
    return model_answer;
  }
});

/*Template.releaseQuiz.events({
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
});*/

Template.d3vis.onRendered(function () {

  //Answers.insert({module_code:'1', lecture_id:'1', assignment_id:'1', type:"MCQ", question_id:0, answer_content:3, student_id:'A0105278A'});
    // Defer to make sure we manipulate DOM
    _.defer(function () {
      // Use this as a global variable 
      window.d3vis = {}
      Deps.autorun(function () {
        
        // On first run, set up the visualiation
        if (Deps.currentComputation.firstRun) {
          window.d3vis.margin = {top: 15, right: 5, bottom: 5, left: 5},
          window.d3vis.width = 600 - window.d3vis.margin.left - window.d3vis.margin.right,
          window.d3vis.height = 120 - window.d3vis.margin.top - window.d3vis.margin.bottom;

          window.d3vis.x = d3.scale.ordinal()
              .rangeRoundBands([0, window.d3vis.width], .1);

          window.d3vis.y = d3.scale.linear()
              .range([window.d3vis.height-2, 0]);

          window.d3vis.color = d3.scale.category10();

          window.d3vis.svg = d3.select('#d3vis')
              .attr("width", window.d3vis.width + window.d3vis.margin.left + window.d3vis.margin.right)
              .attr("height", window.d3vis.height + window.d3vis.margin.top + window.d3vis.margin.bottom)
            .append("g")
              .attr("class", "wrapper")
              .attr("transform", "translate(" + window.d3vis.margin.left + "," + window.d3vis.margin.top + ")");
        }

        answers = Answers.find({}).fetch();
        var answersToShow = [];
        var currQuestion = curr_question-1;
        var module_code = graph_module;
        var lecture_id = graph_lecture;
        var assignment_id = graph_assignment;

        for (var i=0; i<4; i++) {
          answersToShow[i] = {};
          answersToShow[i].option = i;
          answersToShow[i].value = 0;
        }

        for (var i=0; i<answers.length; i++) {
          if (answers[i].type == "MCQ" && answers[i].question_id == currQuestion && module_code == answers[i].module_code && lecture_id == answers[i].lecture_id && assignment_id == answers[i].assignment_id) {
            if (answers[i].answer_content == 1)
              answersToShow[0].value++;
            else if (answers[i].answer_content == 2)
              answersToShow[1].value++;
            else if (answers[i].answer_content == 3)
              answersToShow[2].value++;
            else if (answers[i].answer_content == 4)
              answersToShow[3].value++;
          }
        }
        console.log(answersToShow);

        window.d3vis.color.domain(answersToShow.map(function(d) { return d.option}));

        window.d3vis.x.domain(answersToShow.map(function(d) { return d.option}));
        window.d3vis.y.domain([0, d3.max(answersToShow, function(d) { return d.value; })]);

        var bar_selector = window.d3vis.svg.selectAll(".bar")
          .data(answersToShow, function (d) {return d.option})
        var text_selector = window.d3vis.svg.selectAll(".bar_text")
          .data(answersToShow, function (d) {return d.option})

        bar_selector
          .enter().append("rect")
          .attr("class", "bar")
        bar_selector
          .transition()
          .duration(100)
          .attr("x", function(d) { return window.d3vis.x(d.option);})
          .attr("width", window.d3vis.x.rangeBand())
          .attr("y", function(d) { return window.d3vis.y(d.value); })
          .attr("height", function(d) { return window.d3vis.height - window.d3vis.y(d.value); })
          .style("fill", function(d) { return window.d3vis.color(d.option);})

        text_selector
          .enter().append("text")
          .attr("class", "bar_text")
        text_selector
          .transition()
          .duration(100)
          .attr()
          .attr("x", function(d) { return window.d3vis.x(d.option) + 10;})
          .attr("y", function(d) { return window.d3vis.y(d.value) - 2; })
          .text(function(d) {return d.value;})
          .attr("height", function(d) { return window.d3vis.height - window.d3vis.y(d.value); })
      });  
    });
  });

  if (getCookie('token') != '') {
    Session.set('logincheck', true);
    setCookie('firstLogin', false);
    Populate_UserName();
    //Populate_Module();
    Populate_UserId();
  }

  window.onload = function(){
    if (search.token && search.token.length > 0 && search.token != 'undefined') {
      document.getElementById('login-sign-in-link').click();
      document.getElementById('signup-link').click();
      var userName = getCookie("userId");
      document.getElementById('login-username').value = userName;
    }
    else if (getCookie('firstLogin') == 'false' && Meteor.userId() == null) {
      document.getElementById('login-sign-in-link').click();
    }

    /* Sending notifications to students about ALE */
    setInterval(function() { 
      var notifications = BrowserNotifications.find({userId: Meteor.userId()}).fetch();

      //console.log(notifications);

      if (Notification.permission !== "granted")
        Notification.requestPermission();
      else {
        if (notifications.length > 0) {
          for (var i=0; i<notifications.length; i++) {
            if (notifications[i].shown == false) {
              var notification = new Notification(notifications[i].title, {
                icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                body: notifications[i].body,
              });

              notification.onclick = function () {
                window.open(notifications[i].url);      
              };

              Meteor.call('markNotificationAsTrue', notifications[i]._id, notifications[i].userId, notifications[i].title, notifications[i].body, notifications[i].url);
            }
          }
        }
      } 

    }, 1000);
    /* Notifications end */

  };
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
  setCookie('lecturer', false);
  setCookie('student', false);
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
      setCookie('userName', data);    //document.cookie="userName="+data;
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
      setCookie('userId', data);    //document.cookie="userId="+data;
      
      if (/^[a-zA-Z]+$/.test(data)) {
          setCookie('lecturer', true);
      } else {
          setCookie('student', true);
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

function saveAssignment(questionArray, answerArray, mcqOptionsArray, imageArray, source) {
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

      for (var k=0; k<imageArray.length; k++) {
        if (question_number == imageArray[k].question_number) {
          allQuestions[question_number-1].imageURL = imageArray[k].url;
          break;
        }
        if (k == imageArray.length-1) {
          allQuestions[question_number-1].imageURL = null;
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

function numberToWords(num) {
  var a = ['','One','Two','Three','Four', 'Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
  if ((num = num.toString()).length > 9) return 'overflow';
  n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return; var str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str;
}

function wordsToNumber(s) {
  var Small = {
    'Zero': 0,
    'One': 1,
    'Two': 2,
    'Three': 3,
    'Four': 4,
    'Five': 5,
    'Six': 6,
    'Seven': 7,
    'Eight': 8,
    'Nine': 9,
    'Ten': 10,
    'Eleven': 11,
    'Twelve': 12,
    'Thirteen': 13,
    'Fourteen': 14,
    'Fifteen': 15,
    'Sixteen': 16,
    'Seventeen': 17,
    'Eighteen': 18,
    'Nineteen': 19,
    'Twenty': 20,
    'Thirty': 30,
    'Forty': 40,
    'Fifty': 50,
    'Sixty': 60,
    'Seventy': 70,
    'Eighty': 80,
    'Ninety': 90
  };

  var Magnitude = {
      'thousand':     1000,
      'million':      1000000,
      'billion':      1000000000,
      'trillion':     1000000000000,
      'quadrillion':  1000000000000000,
      'quintillion':  1000000000000000000,
      'sextillion':   1000000000000000000000,
      'septillion':   1000000000000000000000000,
      'octillion':    1000000000000000000000000000,
      'nonillion':    1000000000000000000000000000000,
      'decillion':    1000000000000000000000000000000000,
  };

  var a, n, g;

  a = s.toString().split(/[\s-]+/);
  n = 0;
  g = 0;
  a.forEach(feach);
  return n + g;

  function feach(w) {
      var x = Small[w];
      if (x != null) {
          g = g + x;
      }
      else if (w == "hundred") {
          g = g * 100;
      }
      else {
          x = Magnitude[w];
          if (x != null) {
              n = n + g * x
              g = 0;
          }
          else { 
              //alert("Unknown number: "+w); 
          }
      }
  }
}


