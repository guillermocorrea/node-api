/**
 * Created by EXTIGLGCORREAG on 07/05/2014.
 */
// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bears'); // connect to our database

var Bear = require('./models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

router.route('/bears')
    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var bear = new Bear(); 		// create a new instance of the Bear model
        bear.name = req.body.name;  // set the bears name (comes from the request)

        // save the bear and check for errors
        bear.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'Bear created!' });
        });
    })
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });
// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err) res.send(err);
            if (!bear) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            res.json(bear);
        });
    })
    .put(function (req, res) {
        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err) res.send(err);
            bear.name = req.body.name; 	// update the bears info
            // save the bear
            bear.save(function (err) {
                if (err) res.send(err);
                res.json({ message: 'Bear updated!' });
            });
        });
    })
    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err) res.send(err);
            if (!bear) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            // save the bear
            Bear.remove({
                _id: req.params.bear_id
            }, function(err, bear) {
                if (err) res.send(err);
                res.json({ message: 'Successfully deleted' });
            });
        });
    });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);