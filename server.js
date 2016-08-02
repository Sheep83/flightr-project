var express = require('express');
var app = express();
var path = require('path');
var fs  = require('fs');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;


app.use(bodyParser.json());
// app.use(bodParser.urlencoded({extended: true}));

// Connection url
var url = 'mongodb://localhost:27017/flightr';

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

app.use(express.static('client/build'));

var server = app.listen(3000, function(){
  var host = server.address().address;
  var port = server.address().port;
  console.log('Flightr app listening on port 3000!');
})

app.get('/savedsearches', function(req,res){
    // Connection URL
    var url = 'mongodb://localhost:27017/flightr';
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('savedsearches');
      collection.find({}).toArray(function(err, docs) {
        res.json(docs)
        db.close();
      });
    });
  })

app.post('/savedsearches', function(req,res){
  var url = 'mongodb://localhost:27017/flightr';
    MongoClient.connect(url, function(err, db) {
      var collection = db.collection('savedsearches');
        collection.insert(req.body)
        res.status(200).end()
        db.close();
    });
  })




