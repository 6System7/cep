var express = require('express')
var mongodb = require('mongodb')
var passport = require('passport')
var passportHTTP = require('passport-http')

var app = express()

const PUBLIC_DIRECTORY = 'public'
const PATH_PREFIX = __dirname + '/' + PUBLIC_DIRECTORY

app.use(express.static(PUBLIC_DIRECTORY))

app.get('/', function(req, res) {
  res.sendFile(PATH_PREFIX + '/index.html')
})

app.get('/login', function(req, res) {
  res.sendFile(PATH_PREFIX + '/login.html')
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
  console.log(req)
  res.status(404).send('uh')
});

const PORT = 8080;
app.listen(PORT, function () {
  console.log('Web Services App listening on port ' + PORT)
})
