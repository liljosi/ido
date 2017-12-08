// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');
 
// Configuration
mongoose.connect('mongodb://localhost/reviewking');
 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
// Models
var Job = mongoose.model('Job', {
    title: String,
    description: String,
    rating: Number,
    price: Number,
    phone:Number
});
 
// Routes
 
    // Get jobs
    app.get('/api/jobs', function(req, res) {
 
        console.log("fetching jobs");
 
        // use mongoose to get all jobs in the database
        Job.find(function(err, jobs) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(jobs); // return all jobs in JSON format
        });
    });

    app.get('/api/hello',(req,res)=>{
        res.send('Hola mundo');

    });
 
    // create job and send back all jobs after creation
    app.post('/api/jobs', function(req, res) {
 
        console.log("creating job");
 
        // create a job, information comes from request from Ionic
        Job.create({
            title : req.body.title,
            description : req.body.description,
            rating: req.body.rating,
            price: req.body.price,
            phone: req.body.phone,
            done : false
        }, function(err, job) {
            if (err)
                res.send(err);
 
            // get and return all the jobs after you create another
            Job.find(function(err, jobs) {
                if (err)
                    res.send(err)
                res.json(jobs);
            });
        });
 
    });
 
    // delete a job
    app.delete('/api/jobs/:job_id', function(req, res) {
        Job.remove({
            _id : req.params.job_id
        }, function(err, job) {
 
        });
    });
 
 
// listen (start app with node server.js) ======================================
app.listen(3000);
console.log("App listening on port 3000");