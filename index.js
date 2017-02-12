//  Imports
var express = require('express')
var MongoClient = require('mongodb').MongoClient
var passport = require('passport')
var Strategy = require('passport-local').Strategy
var connectEnsure = require('connect-ensure-login')
//  Passport setup
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err) }
      if (!user) { return cb(null, false) }
      if (user.password != password) { return cb(null, false) }
      return cb(null, user)
    })
  }
))

passport.serializeUser(function(user, cb) {
  cb(null, user.id)
})

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

// Connection URL 
var dbURL = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server 
MongoClient.connect(dbURL, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");
  //db.close();
});

var app = express()

app.use('/pdf', express.static(__dirname + '/node_modules/pdfmake/build'))
app.use(express.static('public'))
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(require('express-session')({
  secret: 'Brother, May I have some oats?',
  resave: false,
  saveUninitialized: false }
))

app.use(passport.initialize())
app.use(passport.session())

app.get('/',
  //connectEnsure.ensureLoggedIn('/login'),
  function(req, res) {
    res.render('index')
})

app.get('/login',
  function(req, res) {
    res.render('login')
})

app.post('/login',
  passport.authenticate(
    'local',
    {
      successReturnToOrRedirect: '/',
      failureRedirect: '/login' 
    }
  )
)

app.get('/addPal',
  //connectEnsure.ensureLoggedIn('/login'),
  function(req, res) {
    res.render('addPal')
  }
)

app.post('/addPal',
  //connectEnsure.ensureLoggedIn('/login'),
  function(req, res) {
    //TODO
  }
)

app.get('/getPal',
  //connectEnsure.ensureLoggedIn('/login'),
  function(req, res) {
    //TODO
  }
)

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
  res.status(404).send('uh')
})

const PORT = 8080
app.listen(PORT, function () {
  console.log('Web Services App listening on port ' + PORT)
})
