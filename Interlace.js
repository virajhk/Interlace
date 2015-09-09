Router.route('/', function () {
  //this.render('firstPage');
  this.render('firstPage');
});

Router.route('/quizQuestions');

if (Meteor.isClient) {

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

      var module = document.getElementById('module_id').value;
      var lecture = document.getElementById('lecture_id').value;
      var assignment = document.getElementById('assignment_id').value;

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

      console.log(ale);
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

  if (getCookie('token') != '') {
    Session.set('logincheck', true);
    Populate_UserName();
    //Populate_Module();
    Populate_UserId();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
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
  var LoginURL = APIDomain + "api/login/?apikey=HkwaOupOwuKRoKglP8Gep&url=http%3A%2F%2Flocalhost:3000";

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
