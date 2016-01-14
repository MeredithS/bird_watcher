var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/birds';
var ObjectID = require('mongodb').ObjectID;
var geocoder = require('geocoder');

var db

// Configuration
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

MongoClient.connect(mongoUrl, function(err,database){
	if(err){
		console.log(err);
	}
	console.log('connected');
	db = database;
	process.on("exit", db.close);
});

// Routes
app.get('/', function(req, res){
	db.collection('sightings').find({}).limit(3).sort({date:-1}).toArray(function(err,results){
		results.forEach(function(result){
			result.date = new Date(result.date)
		})
	res.render('index', {birds: results});	
	})
})  

app.get('/sightings/new', function(req,res){
	res.render('form');
})

app.get('/api/sightings',function(req,res){
	db.collection('sightings').find({}).toArray(function(err,results){
		res.json(results);
	})
})

app.post('/sightings',function(req,res){
	geocoder.geocode(req.body.sighting.location, function(err,result){
		var latLong = result.results[0].geometry.location;
			var objToSave = {
				date: Date(), 
				bird: req.body.sighting.bird, 
				Location: req.body.sighting.location,
				Lat_Long:latLong
			}; 
			db.collection('sightings').insert(objToSave, function(err,result){
					 if(req.body['non-demo-form']){
					 	res.redirect('/');
					 }else{
						res.send(objToSave);
					}
				})
			})
});

app.get('/demo', function(req,res){
	res.render('demo');
})

app.get('/sightings', function(req,res){
	db.collection('sightings').find({}).toArray
	(function(err,result){
		res.json(result);
	})
})

app.get('/sightings/:bird_id/edit', function(req,res){
	console.log(req.params)
	db.collection('sightings').findOne({ _id: ObjectID(req.params.bird_id)},function(err, result){
		res.json(result);
	})
})

app.put('/sightings/edit', function(req,res){
	console.log(req.body);
})

app.listen(process.env.PORT || 3000);
