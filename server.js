var express = require('express');
var app = express();
var path = require('path');
var fs  = require('fs');
var bodyParser = require('body-parser');


app.use(bodyParser.json());
// app.use(bodParser.urlencoded({extended: true}));
var MongoClient = require('mongodb').MongoClient

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


