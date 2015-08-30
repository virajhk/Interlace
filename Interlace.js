if (Meteor.isClient) {

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

  //check query string for search token
  if (search.token && search.token.length > 0 && search.token != 'undefined') {
      Token = search.token;
      setCookie('token', Token);
      //document.cookie="token="+Token;
  }

  if (getCookie('token') === '')
    logout();

  Template.body.events({
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

  if (getCookie('token') != '') {
    Session.set('logincheck', true);
    Populate_UserName();
    Populate_Module();
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
  Session.set('logincheck', false);
  $('#lbl_Name').html('');
  $('#lbl_Modules').html('');
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

        $('#lbl_Modules').html(lbl_Module);
    });
}


function expand_box(element) {
    if(element.offsetWidth == 200) {
      element.setAttribute("style", "width:1068px; height:600px");
    } else {
      element.setAttribute("style", "width:200px; height:100px");
    }
}
