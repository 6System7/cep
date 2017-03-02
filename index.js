//  Imports
var express = require('express')
var MongoClient = require('mongodb').MongoClient
var passport = require('passport')
var Strategy = require('passport-local').Strategy
var connectEnsure = require('connect-ensure-login')
var bodyParser = require("body-parser");

//  Passport setup
passport.use(new Strategy(
    function(username, password, cb) {
        db.users.findByUsername(username, function(err, user) {
            if (err) {
                return cb(err)
            }
            if (!user) {
                return cb(null, false)
            }
            if (user.password != password) {
                return cb(null, false)
            }
            return cb(null, user)
        })
    }
))

passport.serializeUser(function(user, cb) {
    cb(null, user.id)
})

passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function(err, user) {
        if (err) {
            return cb(err)
        }
        cb(null, user)
    })
})

// Connection URL
// TODO replace to whatever this should be
var dbURL = 'mongodb://localhost:27017/myproject';
var db;
// Use connect method to connect to the Server
MongoClient.connect(dbURL, function(err, dbIN) {
    //assert.equal(null, err);
    if (err) {
        console.log("Failed to connect to database", err);
    }
    console.log("Connected correctly to server");
    db = dbIN;
    //db.close();
});

var app = express()

app.use('/pdf', express.static(__dirname + '/node_modules/pdfmake/build'))
app.use(express.static('public'))

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(require('express-session')({
    secret: 'Brother, May I have some oats?',
    resave: false,
    saveUninitialized: false
}))

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
        'local', {
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
        //Takes an updated dataset (in JSON format) as input and writes all data to the database
        //Get the required parameters
        var dataset = req.body.pals;

        //Since all data is in a single document, no separation of data is needed
        //Simply insert the dataset into the collection
        var collection = db.collection('pals');
        for (index in dataset) {
            collection.save(dataset[index], function(err, results) {
                if (err) {
                    console.log("Update failed: " + err.toString());
                } else {
                    console.log("Update success");
                }
            });
        }
        res.send('done');
    }
)

app.get('/getPal',
    //connectEnsure.ensureLoggedIn('/login'),
    function(req, res) {
        //Takes no input, retrieves a list of all PALs in the database and sends them back
        //TODO
        //Get the PALs
        var collection = db.collection('pals');
        var pals = collection.find().toArray(function(err, result) {
            if (err) {
                console.log("Retrieval failed: " + err.toString());
            } else {
                console.log("Retrieval success");
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            }
        });
    }
)

app.post('/delPal',
    //connectEnsure.ensureLoggedIn('/login'),
    function(req, res) {
        //Takes an id belonging to a PAL in the database and deletes it
        //Get the required parameters
        var id = req.body.id;
        var collection = db.collection('pals');
        db.collection('pals').deleteOne({_id: id}, function(err, results) {
            if (err){
                console.log("Deletion failed: " + err.toString());
                res.send('fail');
            } else {
                console.log("Deletion success");
                res.send('success');
            }
        });
    }
)

// TODO we need an /admin path, for managing admin accounts

//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
    res.render('404page')
    //have a 404 page now but need it to take away passport.
})

const PORT = 8080
app.listen(PORT, function() {
    console.log('Web Services App listening on port ' + PORT)
})
