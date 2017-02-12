var express = require('express')
var mongodb = require('mongodb')

var app = express()

const PUBLIC_DIRECTORY = 'public'
const PATH_PREFIX = __dirname + '/' + PUBLIC_DIRECTORY
// console.log(PATH_PREFIX)

app.use(express.static(PUBLIC_DIRECTORY))

app.get('/', function(req, res) {
  res.sendFile(PATH_PREFIX + '/index.html')
})

app.get('/login', function(req, res) {
  res.sendFile(PATH_PREFIX + '/login.html')
})

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
  // console.log(req)
  res.status(404).send('uh')
});

app.use('/pdf', express.static(__dirname + '/node_modules/pdfmake/build'));
app.use('/report', express.static(__dirname + '/modules/reportGen.js'));

const PORT = 8080;
app.listen(PORT, function () {
  console.log('Web Services App listening on port ' + PORT)
})
