var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs = require('fs');
var path = require('path');
var path = require('ejs');
var flash = require('express-flash');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'TCAGEYay'}));
app.use(flash());
var content = fs.readFileSync("static/index.html", 'utf8');
app.use("/static", express.static('static'));
app.set('view engine', 'ejs');
app.use(function(req,res,next){
  res.locals.session = req.session;
  next();
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: "Error",
    message: err.message,
    error: {}
  });
});

app.get('/', function (req, res) {
  res.render('index', {title: 'The Contemporary American Gothic Experience'});
});

app.get('/dashboard', function (req, res) {
  if (req.session.user)
    res.render('dashboard', {title: 'My Dashboard'});
  else
    res.render('notLoggedIn', {title: 'My Dashboard'});
});

app.get('/myaccount', function (req, res) {
  if (req.session.user)
    res.render('account/myaccount', {title: 'My Account'});
  else
    res.render('notLoggedIn', {title: 'My Account'});
});

app.get('/about', function (req, res) {
  res.render('about', {title: 'About TCAGE'});
});

app.get('/tvmovies', function (req, res) {
  res.render('tvmovies', {title: 'Television Shows and Movies'});
});

app.get('/photography', function (req, res) {
  res.render('photography', {title: 'Photography'});
});

app.get('/crewdsongallery', function (req, res) {
  res.render('crewdsongallery', {title: 'Gregory Crewdson Gallery'});
});

app.get('/shermangallery', function (req, res) {
  res.render('shermangallery', {title: 'Cindy Sherman Gallery'});
});

app.get('/walkergallery', function (req, res) {
  res.render('walkergallery', {title: 'Kara Walker Gallery'});
});

app.get('/citations', function (req, res) {
  res.render('citations', {title: 'Citations'});
});

app.get('/exhibit', function (req, res) {
  res.render('exhibit', {title: 'Exhibit Information'});
});

app.get('/editaccount', function (req, res) {
  if (req.session.user)
    res.render('account/editaccount', {title: 'Edit Account'});
  else
    res.render('notLoggedIn', {title: 'Edit Account'});
});

app.post('/editaccount', function (req, res) {
  var i = req.session.uid;
  var users = fs.readFileSync('data/users.json', 'utf8');
  var userJSON = JSON.parse(users);
  var taken = false;
  for (var j = 0; j < userJSON.length; j++) {
    if (req.body.eUser.username == userJSON[j]["username"]) {
      if (!(userJSON[j]["username"] == userJSON[i]["username"])) {
        taken = true;
        req.flash("notification", "Username already taken.");
        res.redirect('/editaccount');
        break;
      }
    }
    else if (req.body.eUser.email == userJSON[j]["email"]) {
      if (!(userJSON[j]["email"] == userJSON[i]["email"])) {
        taken = true;
        req.flash("notification", "Email already in use.");
        res.redirect('/editaccount');
        break;
      }
    }
  }
  if (!taken) {
    userJSON[i]["firstName"] = req.body.eUser.firstName;
    userJSON[i]["lastName"] = req.body.eUser.lastName;
    userJSON[i]["email"] = req.body.eUser.email;
    userJSON[i]["username"] = req.body.eUser.username;
    userJSON[i]["password"] = req.body.eUser.password;
    req.session.user = userJSON[i];
    var jsonString = JSON.stringify(userJSON, null, 2);
    fs.writeFile("data/users.json", jsonString);
    req.flash("notification", "Account Information Edited!");
    res.redirect('/');
  }
});

app.get('/register',function(req,res) {
  res.render('account/register', {title: 'Register'});
});

app.post('/register',function(req,res) {
  var taken = false;
  var users = fs.readFileSync('data/users.json', 'utf8');
  var userJSON = JSON.parse(users);
  for (var i = 0; i < userJSON.length; i++) {
    if (req.body.rUser.username == userJSON[i]["username"]) {
      taken = true;
      req.flash("notification", "Username already taken.");
      res.redirect('/register');
      break;
    }
    else if (req.body.rUser.email == userJSON[i]["email"]) {
      taken = true;
      req.flash("notification", "Email already in use.");
      res.redirect('/register');
      break;
    }
  }
  if (!taken) {
    var newUser = {
      "id": userJSON[userJSON.length - 1].id + 1,
      "userType": "student",
      "username": req.body.rUser.username,
      "password": req.body.rUser.password,
      "firstName": req.body.rUser.firstName,
      "lastName": req.body.rUser.lastName,
      "email": req.body.rUser.email,
      "clubs_member": [],
      "clubs_leader": []
    };
    userJSON.push(newUser);
    var jsonString = JSON.stringify(userJSON, null, 2);
    fs.writeFile("data/users.json", jsonString);
    req.flash("notification", "New Account Added");
    res.redirect('/');
  }
});

app.post('/login',function(req,res) {
  var users = fs.readFileSync('data/users.json', 'utf8');
  var userJSON = JSON.parse(users);
  for (var i = 0; i < userJSON.length; i++) {
    if (req.body.lUser.username == userJSON[i]["username"] && req.body.lUser.password == userJSON[i]["password"]) {
      req.session.user = userJSON[i];
      req.session.uid = i;
      break;
    }
  }
  if (req.session.user) {
    req.flash("notification", "Successfully logged in!");
  }
  else {
    req.flash("notification", "Could not log in - username or password was incorrect");
  }
  res.redirect('/');
});

app.get('/logout',function(req,res) {
  req.session.user = null;
  req.session.uid = null;
  // req.session.destroy();
  req.flash("notification", "Successfully Logged Out!");
  res.redirect('/');
});

app.get('/schedule',function(req,res) {
  res.render('schedule', {title: 'Schedule'});
});

app.get('/schedulevisit',function(req,res) {
  if (req.session.user)
    res.render('schedulevisit', {title: 'Schedule Visit'});
  else
    res.render('notLoggedIn', {title: 'Schedule Visit'});
});

app.get('/users',function(req,res) {
  var users = fs.readFileSync('data/users.json', 'utf8');
  res.send(users);
});

app.get('/users/:id',function(req,res) {
	var userId = req.params.id;
	var users = fs.readFileSync('data/users.json', 'utf8');
	JSON.parse(users);
	var u = users[userID]
	res.send(JSON.stringify(u));
});

app.put('/users/:id',function(req,res) {

});

app.delete('/users/:id',function(req,res) {

});

app.get('/allclubs',function(req,res) {
  var clubs = fs.readFileSync('data/clubs.json', 'utf8');
  var clubsJSON = JSON.parse(clubs);
  var allClubs = [];
  for (var i = 0; i < clubsJSON.length; i++) {
    var temp = {
      "clubname": clubsJSON[i]["clubname"],
      "description": clubsJSON[i]["description"]
    };
    allClubs.push(temp);
  }
  res.render('clubs/allclubs', {title: 'All Clubs', clubs: allClubs});
});

app.get('/clubs',function(req,res) {
  if (req.session.user)
    res.render('clubs/clubs', {title: 'My Clubs'});
  else
    res.render('notLoggedIn', {title: 'My Clubs'});
});

app.post('/clubs',function(req,res) {

});

app.get('/clubs/:id',function(req,res) {

});

app.put('/clubs/:id',function(req,res) {

});

app.delete('/clubs/:id',function(req,res) {

});

app.get('/clubs/events',function(req,res) {

});


app.get('/clubs/:id/events',function(req,res) {

});

app.put('/clubs/:id/events',function(req,res) {

});

app.post('/clubs/:id/events',function(req,res) {

});

app.get('/clubs/announcements',function(req,res) {

});

app.get('/clubs/:id/announcements',function(req,res) {

});

app.put('/clubs/:id/announcements',function(req,res) {

});

app.post('/clubs/:id/announcements',function(req,res) {

});

app.put('/clubs/:id/request',function(req,res) {

});

app.use(function(req, res, next){
  res.status(404).render('404', {title: "404 Not Found"});
});

var server = app.listen(process.env.PORT || 4000, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});