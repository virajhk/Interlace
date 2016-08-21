Router.route('/', function () {
  //this.render('firstPage');
  this.render('firstPage');
});

/*Router.route('/', function () {
  //this.render('firstPage');
  if (Meteor.userId() != null && getCookie('lecturer') == "true") {
    this.render('firstPage');
  } else if (Meteor.userId() != null && getCookie('student') == "true") {
    this.render('home');
  } else {
    this.render('commonLanding');
  }
});*/

Router.route('/quizQuestions');
Router.route('/editQuiz');
Router.route('/releaseQuiz');
Router.route('/modelAnswers');
Router.route('/d3vis');
Router.route('/answerAnalysis');
Router.route('/designThinkingActivity');
Router.route('/solveDesignThinking');
Router.route('/studentGroups');
Router.route('/faqs');
Router.route('/about');
Router.route('/contact');

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
Router.route('/lecture1');

//Questions = new Mongo.Collection("questions");
Groups = new Mongo.Collection("tasks");
// Break line

Assignments = new Mongo.Collection("assignments");
Answers = new Meteor.Collection("answers");
BrowserNotifications = new Mongo.Collection("browserNotifications");

DesignThinking = new Mongo.Collection("designThinking");

Messages = new Meteor.Collection('messages');

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

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-75937195-1', 'auto');
  ga('send', 'pageview');

  //Break Line
  Session.setDefault('studentId', 'A0105522W');
  Session.setDefault('assignment_id', '1')
  Session.setDefault('studentName', 'Xu Chen');
  Session.setDefault('isGroupCreator', false);
  Session.setDefault('hasGroup', false);
  Session.setDefault('numOfGroups', 3);
  Session.setDefault('moduleId', '3');
  Session.setDefault('lectureId', '2');
  Session.setDefault('activityId', '1');
  var questionIdCounter = 1;

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

  Template.mcq.helpers({
    question_id: function () {
      var id = questionIdCounter;
      questionIdCounter = questionIdCounter + 1;
      return id;
    }
  });

  Template.short_question.helpers({
    question_id: function () {
      var id = questionIdCounter;
      questionIdCounter = questionIdCounter + 1;
      return id;
    },

    question_id_get: function () {
      return questionIdCounter - 1;
    }
  });

  Template.lecture1.events({
    "click": function() {
      var id = Session.get('moduleId') + "_" + Session.get('lectureId') + "_" + Session.get('activityId');
      console.log(id);
      //Meteor.call('createFile', id);
    }
  });

  Template.activity2.helpers({
    questions: function () {
      var id = Session.get('moduleId') + "_" + Session.get('lectureId') + "_" + Session.get('activityId');
      var tuple = Assignments.find({_id: id}).fetch();
      var data = tuple[0].data;
      var questionList = data.questions;  
      
      return questionList;
    },

    isMCQ: function (Question_type) {
      return Question_type === "MCQ";
    },

    isShortQuestion: function (Question_type) {
      return Question_type === "short_answer";
    }
  });

  Template.activity2.events({
    "submit .quiz": function (event) {
      event.preventDefault();
      var count = 1;

      //$('.xxx:checked').each(function() {
      $('.xxx').each(function() {
        if (this.checked == true) {
          //var user_answer = $(this).val();
          var question_id = parseInt(this.name.substr(8, this.name.length));

          Meteor.call('saveStudentAnswer', Session.get('ModuleId'), Session.get('lectureId'), Session.get('assignmentId'), Session.get('assignmentType'), "MCQ", question_id, count, Session.get('studentId'));
          count = 1;
        }
        count++;
      });

      $('input[class="sq"], textarea').each(function(){  
        var user_answer = $(this).val();
        var question_id = parseInt(this.name.substr(8, this.name.length));

        Meteor.call('saveStudentAnswer', Session.get('ModuleId'), Session.get('lectureId'), Session.get('assignmentId'), Session.get('assignmentType'), "short_answer", question_id, user_answer, Session.get('studentId'));        
      });
    }
  });


  Template.image.helpers({
    emptyURL: function (url) {
      return url === "";
    }
  });

  Template.option.helpers({
    question_id: function () {
      return questionIdCounter - 1;
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
  Meteor.subscribe('getDesignThinking');
  Meteor.subscribe('images');
  Meteor.subscribe('messages');

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
  var part_number = 0;
  var latest;
  var curr_question;
  var graph_module, graph_lecture, graph_assignment;

  var mcqOptionsArray = [];
  var questionArray = [];
  var answerArray = [];
  var mcqQuestions = [];
  var imageArray = [];

  var shortAnswerQuestionsNumber = [];
  var fillInTheBlanksArray = [];

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
    },
    'click #designThinking': function(e) {
      e.preventDefault();
      window.location = 'designThinkingActivity';
    },
    'click #solveDesignThinking': function(e) {
      e.preventDefault();
      window.location = 'solveDesignThinking';
    }
    /*,
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
    },
    'click #faqs': function () {
      window.location = "faqs";
    },
    'click #about': function () {
      window.location = "about";
    },
    'click #contact': function () {
      window.location = "contact";
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
      if (getCookie('lecturer') == "false") {
        return false;
      } else {
        return true;
      }
    },
    studentCheck: function() {
      if (getCookie('student') == "false") {
        return false;
      } else {
        return true;
      }
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
      toastr.success("ALE saved successfully", "Success");
    },
    'click #delete_assignment': function (e) {
      e.preventDefault();
      if (confirm("Are you sure you want to delete this ALE")) {
        toastr.success("ALE deleted successfully", "Success");
        location.reload();
      }
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
        toastr.success("ALE edited successfully", "Success");
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
    if ((window.location.href).indexOf("answerAnalysis") > -1) {
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
    } else {
      //Design Thinking Activity
      var id = "#body" + e.currentTarget.id;
      var element = document.getElementById("sel" + analysis_question);
      if (element == undefined || element == null) {
        Blaze.renderWithData(Template.questionTypeSelection, {my: "data"}, $(id)[0]);
      }
    }
  },
  'click #add_sub_parts': function(e) {
    e.preventDefault();
    var id = "body" + e.currentTarget.parentNode.id.substr(8, e.currentTarget.parentNode.id.length);
    var element = document.getElementById(id);
    console.log(element.childNodes);
    Blaze.renderWithData(Template.addSubParts, {my: "data"}, $("#" + id)[0]);
    Blaze.renderWithData(Template.addSubParts, {my: "data"}, $("#" + id)[0]);
  }
});

Template.questionTypeSelection.events({
  'change .form-control': function(e) {
    e.preventDefault();
    var id = "#inside_body" + numberToWords(e.currentTarget.id.substr(3, e.currentTarget.id.length));
    if (e.currentTarget.value == "Description Question") {
      document.getElementById(id.substr(1, id.length)).innerHTML = "";
      Blaze.renderWithData(Template.descriptionQuestion, {my: "data"}, $(id)[0]);
    } else if (e.currentTarget.value == "Short Answer Question") {
      document.getElementById(id.substr(1, id.length)).innerHTML = "";
      Blaze.renderWithData(Template.shortAnswerQuestions, {my: "data"}, $(id)[0]);
      Blaze.renderWithData(Template.shortAnswerQuestion, {my: "data"}, $(id)[0]);
      shortAnswerQuestionsNumber[e.currentTarget.id.substr(3, e.currentTarget.id.length)] = 1;
    } else if (e.currentTarget.value == "Fill in the blanks") {
      document.getElementById(id.substr(1, id.length)).innerHTML = "";
      Blaze.renderWithData(Template.fillInTheBlanks, {my: "data"}, $(id)[0]);
    } else if (e.currentTarget.value == "Freehand Sketching") {
      document.getElementById(id.substr(1, id.length)).innerHTML = "";
      Blaze.renderWithData(Template.freehandSketching, {my: "data"}, $(id)[0]);
    }
  }
});

Template.freehandSketching.onRendered(function() {
  (function($) {
    $.fn.paintBrush = function(options) {
      var undoHistory = [];
      var settings = {
          'targetID': 'canvas-display'
        },

        $this = $(this),
        o = {},
        ui = {},

        core = {
          init: function(options) {
            ui.$loadParentDiv = o.targetID;
            core.draw();
            core.controls();
            //core.toggleScripts();
          },

          canvasInit: function() {
            context = document.getElementById("canvas-display").getContext("2d");
            context.lineCap = "round";
            //Fill it with white background
            context.save();
            context.fillStyle = '#fff';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
          },

          saveActions: function() {
            var imgData = document.getElementById("canvas-display").toDataURL("image/png");
            undoHistory.push(imgData);
            $('#undo').removeAttr('disabled');

          },

          undoDraw: function() {
            if (undoHistory.length > 0) {
              var undoImg = new Image();
              $(undoImg).load(function() {
                var context = document.getElementById("canvas-display").getContext("2d");
                context.drawImage(undoImg, 0, 0);
              });
              undoImg.src = undoHistory.pop();
              if (undoHistory.length == 0)
                $('#undo').attr('disabled', 'disabled');
            }
          },

          draw: function() {
            var canvas, cntxt, top, left, draw, draw = 0;
            canvas = document.getElementById("canvas-display");
            cntxt = canvas.getContext("2d");
            top = $('#canvas-display').offset().top;
            left = $('#canvas-display').offset().left;
            core.canvasInit();

            //Drawing Code
            $('#canvas-display').mousedown(function(e) {
                if (e.button == 0) {
                  draw = 1;
                  core.saveActions(); //Start The drawing flow. Save the state
                  cntxt.beginPath();
                  cntxt.moveTo(e.pageX - left, e.pageY - top);
                } else {
                  draw = 0;
                }
              })
              .mouseup(function(e) {
                if (e.button != 0) {
                  draw = 1;
                } else {
                  draw = 0;
                  cntxt.lineTo(e.pageX - left + 1, e.pageY - top + 1);
                  cntxt.stroke();
                  cntxt.closePath();
                }
              })
              .mousemove(function(e) {
                if (draw == 1) {
                  cntxt.lineTo(e.pageX - left + 1, e.pageY - top + 1);
                  cntxt.stroke();
                }
              });

          },

          controls: function() {
            canvas = document.getElementById("canvas-display");
            cntxt = canvas.getContext("2d");
            $('#export').click(function(e) {
              e.preventDefault();
              window.open(canvas.toDataURL(), 'Canvas Export', 'height=400,width=400');
            });

            $('#clear').click(function(e) {
              e.preventDefault();
              canvas.width = canvas.width;
              canvas.height = canvas.height;
              core.canvasInit();
              $('#colors li:first').click();
              $('#brush_size').change();
              //core.toggleScripts();
              undoHistory = [];
            });

            $('#brush_size').change(function(e) {
              e.preventDefault();
              cntxt.lineWidth = $(this).val();
              //core.toggleScripts();
            });

            $('#colors li').click(function(e) {
              e.preventDefault();
              $('#colors li').removeClass('selected');
              $(this).addClass('selected');
              cntxt.strokeStyle = $(this).css('background-color');
              //core.toggleScripts();
            });

            //Undo Binding
            $('#undo').click(function(e) {
              e.preventDefault();
              core.undoDraw()
              //core.toggleScripts();
            });

            //Init the brush and color
            $('#colors li:first').click();
            $('#brush_size').change();

            $('#controls').click(function() {
              core.toggleScripts();
            });
          },

          toggleScripts: function() {
            $('#colors').slideToggle(400);
            $('#control-buttons').toggle(400);
          }
        };

      $.extend(true, o, settings, options);

      core.init();

    };
  })($);
  $('#canvas-display').paintBrush();
});

Template.canvas.onRendered(function() {
  (function($) {
    $.fn.paintBrush = function(options) {
      var undoHistory = [];
      var settings = {
          'targetID': 'canvas-display2'
        },

        $this = $(this),
        o = {},
        ui = {},

        core = {
          init: function(options) {
            ui.$loadParentDiv = o.targetID;
            core.draw();
            core.controls();
            //core.toggleScripts();
          },

          canvasInit: function() {
            context = document.getElementById("canvas-display2").getContext("2d");
            context.lineCap = "round";
            //Fill it with white background
            context.save();
            context.fillStyle = '#fff';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
          },

          saveActions: function() {
            var imgData = document.getElementById("canvas-display2").toDataURL("image/png");
            undoHistory.push(imgData);
            $('#undo').removeAttr('disabled');

          },

          undoDraw: function() {
            if (undoHistory.length > 0) {
              var undoImg = new Image();
              $(undoImg).load(function() {
                var context = document.getElementById("canvas-display2").getContext("2d");
                context.drawImage(undoImg, 0, 0);
              });
              undoImg.src = undoHistory.pop();
              if (undoHistory.length == 0)
                $('#undo').attr('disabled', 'disabled');
            }
          },

          draw: function() {
            var canvas, cntxt, top, left, draw, draw = 0;
            canvas = document.getElementById("canvas-display2");
            cntxt = canvas.getContext("2d");
            top = $('#canvas-display2').offset().top;
            left = $('#canvas-display2').offset().left;
            core.canvasInit();

            //Drawing Code
            $('#canvas-display2').mousedown(function(e) {
                if (e.button == 0) {
                  draw = 1;
                  core.saveActions(); //Start The drawing flow. Save the state
                  cntxt.beginPath();
                  cntxt.moveTo(e.pageX - left, e.pageY - top);
                } else {
                  draw = 0;
                }
              })
              .mouseup(function(e) {
                if (e.button != 0) {
                  draw = 1;
                } else {
                  draw = 0;
                  cntxt.lineTo(e.pageX - left + 1, e.pageY - top + 1);
                  cntxt.stroke();
                  cntxt.closePath();
                }
              })
              .mousemove(function(e) {
                if (draw == 1) {
                  cntxt.lineTo(e.pageX - left + 1, e.pageY - top + 1);
                  cntxt.stroke();
                }
              });

          },

          controls: function() {
            canvas = document.getElementById("canvas-display2");
            cntxt = canvas.getContext("2d");
            $('#export').click(function(e) {
              e.preventDefault();
              window.open(canvas.toDataURL(), 'Canvas Export', 'height=400,width=400');
            });

            $('#clear').click(function(e) {
              e.preventDefault();
              canvas.width = canvas.width;
              canvas.height = canvas.height;
              core.canvasInit();
              $('#colors li:first').click();
              $('#brush_size').change();
              //core.toggleScripts();
              undoHistory = [];
            });

            $('#brush_size').change(function(e) {
              e.preventDefault();
              cntxt.lineWidth = $(this).val();
              //core.toggleScripts();
            });

            $('#colors li').click(function(e) {
              e.preventDefault();
              $('#colors li').removeClass('selected');
              $(this).addClass('selected');
              cntxt.strokeStyle = $(this).css('background-color');
              //core.toggleScripts();
            });

            //Undo Binding
            $('#undo').click(function(e) {
              e.preventDefault();
              core.undoDraw()
              //core.toggleScripts();
            });

            //Init the brush and color
            $('#colors li:first').click();
            $('#brush_size').change();

            $('#controls').click(function() {
              core.toggleScripts();
            });
          },

          toggleScripts: function() {
            $('#colors').slideToggle(400);
            $('#control-buttons').toggle(400);
          }
        };

      $.extend(true, o, settings, options);

      core.init();

    };
  })($);
  $('#canvas-display2').paintBrush();
});

Template.addSubParts.events({
  'click .click': function(e) {
    console.log(e.currentTarget.id);
  }
});

Template.shortAnswerQuestion.events({
  'click #add_short_answer_question': function(e) {
    e.preventDefault();
    $('.clickHide').hide();
    var id = "#" + e.currentTarget.parentNode.id;
    Blaze.renderWithData(Template.shortAnswerQuestion, {my: "data"}, $(id)[0]);

    if (shortAnswerQuestionsNumber[wordsToNumber(e.currentTarget.parentNode.id.substr(11, e.currentTarget.parentNode.id.length))] == null || shortAnswerQuestionsNumber[wordsToNumber(e.currentTarget.parentNode.id.substr(11, e.currentTarget.parentNode.id.length))] == undefined) {
      shortAnswerQuestionsNumber[wordsToNumber(e.currentTarget.parentNode.id.substr(11, e.currentTarget.parentNode.id.length))] = 2;
    } else {
      shortAnswerQuestionsNumber[wordsToNumber(e.currentTarget.parentNode.id.substr(11, e.currentTarget.parentNode.id.length))]++;
    }
  }
});

Template.fillInTheBlanks.events({
  'click #add_text': function(e) {
    e.preventDefault();
    var id = "#fillInTheBlanksQuestions" + e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length);
    Blaze.renderWithData(Template.addText, {my: "data"}, $(id)[0]);

    if (fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))] == undefined) {
      fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))] = [];
      fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))].push('t');
    } else
      fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))].push('t');
  },
  'click #add_blank': function(e) {
    e.preventDefault();
    var id = "#fillInTheBlanksQuestions" + e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length);
    Blaze.renderWithData(Template.addBlank, {my: "data"}, $(id)[0]);
    if (fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))] == undefined) {
      fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))] = [];
      fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))].push('b');
    } else
      fillInTheBlanksArray[wordsToNumber(e.currentTarget.parentNode.parentNode.id.substr(11, e.currentTarget.parentNode.parentNode.id.length))].push('b');
  }
});

Template.fillInTheBlanks.helpers({
  fillId: function() {
    var id = "fillInTheBlanksQuestions" + numberToWords(analysis_question);
    return id;
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
  body_question_inside: function(){
    return "inside_body" + numberToWords(analysis_question);
  },
  click_question: function(){
    return numberToWords(analysis_question+1);
  }
});

Template.addSubParts.helpers({
  part_number: function() {
    part_number = part_number + 1;
    var returnNumber = part_number;
    if (part_number == 2) {
      part_number = 0;
    }
    return returnNumber;
  },
  heading: function() {
    return "heading" + numberToWords(part_number+1) + "." + numberToWords(analysis_question+1);
  },
  collapse: function() {
    return "collapse" + numberToWords(part_number+1) + "." + numberToWords(analysis_question+1);
  },
  second_heading: function() {
    return "heading" + numberToWords(part_number) + "." + numberToWords(analysis_question);
  },
  second_collapse: function() {
    return "collapse" + numberToWords(part_number) + "." + numberToWords(analysis_question);
  },
  body_question: function(){
    return "body" + numberToWords(part_number) + "." + numberToWords(analysis_question);
  },
  click_question: function(){
    return numberToWords(part_number+1) + "." + numberToWords(analysis_question);
  }
});

Template.questionTypeSelection.helpers({
  question_number: function() {
    return "sel" + analysis_question.toString();
  }
})

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

Template.designThinkingActivity.events({
  'click #add_question_designThinking': function (e) {
    e.preventDefault();
    Blaze.renderWithData(Template.addAccordionField, {my: "data"}, $("#accordion")[0]);
    var element = document.getElementById(numberToWords(analysis_question));
    element.click();
  },
  'click #generatePDF': function (e) {
    e.preventDefault();
    $('#accordion').scrollTop(0);
    var form = $('#collapseOne'),
        cache_width = form.width(),
        a4  =[ 595.28,  841.89];

    getCanvas(form, a4).then(function(canvas){
      var img = canvas.toDataURL("image/png"),
          doc = new jsPDF({
              unit:'px', 
              format:'a4'
          });     
      doc.addImage(img, 'JPEG', 20, 20);
      doc.save('test.pdf');
      form.width(cache_width);
    });
  },
  'click #save_designThinking': function (e) {
    e.preventDefault();
    var accordion = document.getElementById('accordion');
    var accordionInnerHtml = accordion.innerHTML;
    var module_id = document.getElementById('module_id').value;
    var activity_title = document.getElementById('activity_title').value;
    var id = module_id + "_" + activity_title;

    var questionValues = [];

    var selects = document.getElementsByTagName('select');
    var desc = document.getElementsByClassName('desc');
    var short_questions = document.getElementsByClassName('short_question');
    var short_hints = document.getElementsByClassName('short_hints');
    var short_title = document.getElementsByClassName('short_title');
    var fill_title = document.getElementsByClassName('fill_title');
    var fill_text = document.getElementsByClassName('fill_text');
    var fill_hint = document.getElementsByClassName('fill_hint');
    var free_title = document.getElementsByClassName('free_title');

    var j=0;
    var k=0;
    var l=0;
    var m=0;
    var n=0;
    var p=0;
    for (var i=0; i<selects.length; i++) {
      var values = {
        questionType: selects[i].value
      }

      if (selects[i].value == "Description Question") {
        values.title = desc[j*2].value;
        values.question = desc[j*2 + 1].value;
        j++;
      } else if (selects[i].value == "Short Answer Question") {
        values.title = short_title[k].value;
        values.questions = [];
        values.hints = [];
        for (var x=0; x<shortAnswerQuestionsNumber[i+1]; x++) {
          values.questions.push(short_questions[x].value);
          values.hints.push(short_hints[x].value);
        }
        k++;
      } else if (selects[i].value == "Fill in the blanks") {
        values.title = fill_title[l].value;
        values.text = [];
        values.hints = [];
        values.sequence = fillInTheBlanksArray[i+1];   //sequence of occurence of text and blanks
        for (var x=0; x<fillInTheBlanksArray[i+1].length; x++) {
          if (fillInTheBlanksArray[i+1][x] == 't') {
            values.text.push(fill_text[m].value);
            m++;
          } else {
            values.hints.push(fill_hint[n].value);
            n++;
          }
        }
        l++;
      } else if (selects[i].value == "Freehand Sketching") {
        values.title = free_title[p].value;
        p++;
      }

      questionValues.push(values);
    }

    Meteor.call('saveDesignThinking', id, accordionInnerHtml, questionValues);
    Meteor.call('createNotification');
    toastr.success("Activity saved successfully", "Success");
  },
  'click #delete_designThinking' : function(e) {
    e.preventDefault();
    var id = module_id + "_" + activity_title;
    if (confirm("Are you sure?") == true) {
      Meteor.call('deleteDesignThinking', id);
      toastr.success("Activity deleted successfully", "Success");
      location.reload();
    }
  },
  'click #new_designThinking': function (e) {
    e.preventDefault();
    $('#newOrOld').hide();
    $('#otherButtons').show();
  },
  'click #retrieve_designThinking': function (e) {
    e.preventDefault();
    $('#newOrOld').hide();
    $('#otherButtons').show();
    var module_id = document.getElementById('module_id').value;
    var activity_title = document.getElementById('activity_title').value;
    var id = module_id + "_" + activity_title;
    var element = DesignThinking.find({_id: id}).fetch();
    var accordion = document.getElementById('accordion');
    accordion.innerHTML = element[0].html;
    console.log(accordion);
    analysis_question = accordion.childNodes.length;

    var data = element[0].data;

    var selects = document.getElementsByTagName('select');
    var desc = document.getElementsByClassName('desc');
    var short_questions = document.getElementsByClassName('short_question');
    var short_hints = document.getElementsByClassName('short_hints');
    var short_title = document.getElementsByClassName('short_title');
    var fill_title = document.getElementsByClassName('fill_title');
    var fill_text = document.getElementsByClassName('fill_text');
    var fill_hint = document.getElementsByClassName('fill_hint');
    var free_title = document.getElementsByClassName('free_title');

    var j=0;
    var k=0;
    var l=0;
    var m=0;
    var n=0;
    var p=0;
    var q=0;

    for (var i=0; i<selects.length; i++) {
      selects[i].value = data[i].questionType;
      if (data[i].questionType == "Description Question") {
        desc[j*2].value = data[i].title;
        desc[j*2 + 1].value = data[i].question;
        j++;
      } else if (data[i].questionType == "Short Answer Question") {
        short_title[k].value = data[i].title;
        shortAnswerQuestionsNumber[i+1] = data[i].questions.length;
        for (var x=0; x<data[i].questions.length; x++) {
          short_questions[l].value = data[i].questions[x];
          short_hints[l].value = data[i].hints[x];
          l++;
        }
        k++;
      } else if (data[i].questionType == "Fill in the blanks") {
        fill_title[m].value = data[i].title;
        fillInTheBlanksArray[i+1] = data[i].sequence;
        var temp = 0;
        var temp2 = 0;
        for (var x=0; x<data[i].sequence.length; x++) {
          if (data[i].sequence[x] == "t") {
            fill_text[n].value = data[i].text[temp];
            temp++;
            n++;
          } else {
            fill_hint[p].value = data[i].hints[temp2];
            temp2++;
            p++;
          }
        }
      } else if (data[i].questionType == "Freehand Sketching") {
        free_title[q].value = data[i].title;
        q++;
      }
    }
  }
});

Template.solveDesignThinking.events({
  'click #save_solveDesignThinking' : function(e) {
    e.preventDefault();
    toastr.success('Answer recorded successfully', 'Success');
  },
  'click #getDesignThinkingActivity': function(e) {
    e.preventDefault();
    $('#pageTabs').show();

    var tabsList = document.getElementById('tabsList');
    var tabsContent = document.getElementById('tabsContent');
    var module_id = document.getElementById('module_id').value;
    var activity_title = document.getElementById('activity_title').value;
    var id = module_id + "_" + activity_title;
    var element = DesignThinking.find({_id: id}).fetch()[0];

    for (var i=0; i<element.data.length; i++) {
      /* Populate tabsList */
      var li = document.createElement("li");
      var textValue = "Question " + (i+1).toString();
      li.setAttribute("role", "presentation");
      if (i == 0) {
        li.setAttribute("class", "active");
      }

      var a = document.createElement("a");
      a.setAttribute("href", "#question" + (i+1).toString());
      a.setAttribute("aria-controls", "home");
      a.setAttribute("role", "tab");
      a.setAttribute("data-toggle", "tab");

      a.appendChild(document.createTextNode(textValue));

      li.appendChild(a);

      tabsList.appendChild(li);
      /* Populate tabsList end */

      /* Populate tabsContent */
      var div = document.createElement('div');
      div.setAttribute("role", "tabpanel");
      if (i == 0) {
        div.setAttribute("class", "tab-pane active");
      } else {
        div.setAttribute("class", "tab-pane");
      }
      div.setAttribute("id", "question" + (i+1).toString());

      if (element.data[i].questionType == "Description Question") {
        var h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode(element.data[i].title));
        div.appendChild(h3);

        var h4 = document.createElement('h4');
        var strong = document.createElement('strong');
        h4.setAttribute("style", "color:black;");
        strong.appendChild(document.createTextNode(element.data[i].question));
        h4.appendChild(strong);
        div.appendChild(h4);

        var textarea = document.createElement('textarea');
        textarea.setAttribute("type", "text");
        textarea.setAttribute("class", "form-control");
        textarea.setAttribute("rows", "10");
        textarea.setAttribute("class", "desc");
        textarea.setAttribute("placeholder", "Enter your answer here");
        textarea.setAttribute("style", "min-width:80%;");

        div.appendChild(textarea);
      } else if (element.data[i].questionType == "Short Answer Question") {
        var h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode(element.data[i].title));
        div.appendChild(h3);

        for (var j=0; j<element.data[i].questions.length; j++) {
          var h4 = document.createElement('h4');
          var strong = document.createElement('strong');
          h4.setAttribute("style", "color:black; display:inline;");
          strong.appendChild(document.createTextNode(element.data[i].questions[j]));
          h4.appendChild(strong);
          div.appendChild(h4);

          var p = document.createElement('p');
          p.setAttribute("style", "color:black; display:inline;");
          p.appendChild(document.createTextNode(" (Hint: " + element.data[i].hints[j] + ")"));
          div.appendChild(p);
          div.appendChild(document.createElement('br'));
          div.appendChild(document.createElement('br'));

          var textarea = document.createElement('textarea');
          textarea.setAttribute("type", "text");
          textarea.setAttribute("class", "form-control");
          textarea.setAttribute("rows", "5");
          textarea.setAttribute("class", "short");
          textarea.setAttribute("placeholder", "Enter your answer here");
          textarea.setAttribute("style", "min-width:80%;");

          div.appendChild(textarea);
          div.appendChild(document.createElement('br'));
          div.appendChild(document.createElement('br'));
        }

      } else if (element.data[i].questionType == "Fill in the blanks") {
        var h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode(element.data[i].title));
        div.appendChild(h3);

        var k=0;
        for (var j=0; j<element.data[i].sequence.length; j++) {
          if (element.data[i].sequence[j] == "t") {
            var h4 = document.createElement('h4');
            var strong = document.createElement('strong');
            h4.setAttribute("style", "color:black; display:inline;");
            strong.appendChild(document.createTextNode(element.data[i].text[k]));
            h4.appendChild(strong);
            div.appendChild(h4);

            var p = document.createElement('p');
            p.setAttribute("style", "color:black; display:inline;");
            p.appendChild(document.createTextNode(" (Hint: " + element.data[i].hints[k] + ")"));
            div.appendChild(p);
            div.appendChild(document.createElement('br'));
            div.appendChild(document.createElement('br'));
            k++;
          } else {
            var textarea = document.createElement('textarea');
            textarea.setAttribute("type", "text");
            textarea.setAttribute("class", "form-control");
            textarea.setAttribute("rows", "1");
            textarea.setAttribute("class", "fill");
            textarea.setAttribute("placeholder", "Enter your answer here");
            textarea.setAttribute("style", "min-width:80%;");

            div.appendChild(textarea);
            div.appendChild(document.createElement('br'));
            div.appendChild(document.createElement('br'));
          }
        }
      } else if (element.data[i].questionType == "Freehand Sketching") {
        var h3 = document.createElement('h3');
        h3.appendChild(document.createTextNode(element.data[i].title));
        div.appendChild(h3);
      }

      tabsContent.appendChild(div);

      if (element.data[i].questionType == "Freehand Sketching") {
        Blaze.renderWithData(Template.canvas, {my: "data"}, $("#question" + (i+1).toString())[0]);
      }
      /* Populate tabsContent end */
    }
  }
});

function getCanvas(form, a4){
 form.width((a4[0]*1.33333) -80).css('max-width','none');
 return html2canvas(form,{
     imageTimeout:2000,
     removeContainer:true
    }); 
}
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

/*Chat application*/
Template.messages.helpers({
    messages: function() {
        return Messages.find({}, { sort: { time: -1}});
    }
});

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { // 13 is the enter key event
      var name = Meteor.user().username;
      var message = document.getElementById('message');
      if (message.value != '') {
        Messages.insert({
          name: name,
          message: message.value,
          time: Date.now(),
        });

        document.getElementById('message').value = '';
        message.value = '';
      }
    }
  }
}


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

              /*notification.onclick = function (e) {
                e.preventDefault();
                window.open(notifications[i].url);      
              };*/

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
      
      if ((/^[a-zA-Z]+$/.test(data))) {
          setCookie('lecturer', true);
          setCookie('student', false);
      } else {
          setCookie('student', true);
          setCookie('lecturer', false);
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

function canvasProperties() {
    (function($) {
    $.fn.paintBrush = function(options) {
      var undoHistory = [];
      var settings = {
          'targetID': 'canvas-display'
        },

        $this = $(this),
        o = {},
        ui = {},

        core = {
          init: function(options) {
            ui.$loadParentDiv = o.targetID;
            core.draw();
            core.controls();
            //core.toggleScripts();
          },

          canvasInit: function() {
            context = document.getElementById("canvas-display").getContext("2d");
            context.lineCap = "round";
            //Fill it with white background
            context.save();
            context.fillStyle = '#fff';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.restore();
          },

          saveActions: function() {
            var imgData = document.getElementById("canvas-display").toDataURL("image/png");
            undoHistory.push(imgData);
            $('#undo').removeAttr('disabled');

          },

          undoDraw: function() {
            if (undoHistory.length > 0) {
              var undoImg = new Image();
              $(undoImg).load(function() {
                var context = document.getElementById("canvas-display").getContext("2d");
                context.drawImage(undoImg, 0, 0);
              });
              undoImg.src = undoHistory.pop();
              if (undoHistory.length == 0)
                $('#undo').attr('disabled', 'disabled');
            }
          },

          draw: function() {
            var canvas, cntxt, top, left, draw, draw = 0;
            canvas = document.getElementById("canvas-display");
            cntxt = canvas.getContext("2d");
            top = $('#canvas-display').offset().top;
            left = $('#canvas-display').offset().left;
            core.canvasInit();

            //Drawing Code
            $('#canvas-display').mousedown(function(e) {
                if (e.button == 0) {
                  draw = 1;
                  core.saveActions(); //Start The drawing flow. Save the state
                  cntxt.beginPath();
                  cntxt.moveTo(e.pageX - left, e.pageY - top);
                } else {
                  draw = 0;
                }
              })
              .mouseup(function(e) {
                if (e.button != 0) {
                  draw = 1;
                } else {
                  draw = 0;
                  cntxt.lineTo(e.pageX - left + 1, e.pageY - top + 1);
                  cntxt.stroke();
                  cntxt.closePath();
                }
              })
              .mousemove(function(e) {
                if (draw == 1) {
                  cntxt.lineTo(e.pageX - left + 1, e.pageY - top + 1);
                  cntxt.stroke();
                }
              });

          },

          controls: function() {
            canvas = document.getElementById("canvas-display");
            cntxt = canvas.getContext("2d");
            $('#export').click(function(e) {
              e.preventDefault();
              window.open(canvas.toDataURL(), 'Canvas Export', 'height=400,width=400');
            });

            $('#clear').click(function(e) {
              e.preventDefault();
              canvas.width = canvas.width;
              canvas.height = canvas.height;
              core.canvasInit();
              $('#colors li:first').click();
              $('#brush_size').change();
              //core.toggleScripts();
              undoHistory = [];
            });

            $('#brush_size').change(function(e) {
              e.preventDefault();
              cntxt.lineWidth = $(this).val();
              //core.toggleScripts();
            });

            $('#colors li').click(function(e) {
              e.preventDefault();
              $('#colors li').removeClass('selected');
              $(this).addClass('selected');
              cntxt.strokeStyle = $(this).css('background-color');
              //core.toggleScripts();
            });

            //Undo Binding
            $('#undo').click(function(e) {
              e.preventDefault();
              core.undoDraw()
              //core.toggleScripts();
            });

            //Init the brush and color
            $('#colors li:first').click();
            $('#brush_size').change();

            $('#controls').click(function() {
              core.toggleScripts();
            });
          },

          toggleScripts: function() {
            $('#colors').slideToggle(400);
            $('#control-buttons').toggle(400);
          }
        };

      $.extend(true, o, settings, options);

      core.init();

    };
  })($);
  $('#canvas-display').paintBrush();
}