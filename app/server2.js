var app = require('http').createServer(handler),
    fs = require('fs')
    app.listen(8081);
var count = 0;
console.log("HHHHHHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
var mongoose = require('mongoose');
var cat;
// mongoose.connect('mongodb://localhost/CrawlerDataBase');
// var db = mongoose.connection;
var db = mongoose.createConnection('mongodb://localhost/CrawlerDataBase')
var CrawlerSchema = mongoose.Schema({
  identifier : String ,
  experience: [{
    title: String,
    company: String,
    date : String,
    description: String
  }],
  email : String,
  skills: [{
    number: String,
    title: String
  }],
  recommendation: [{
    recommender: String,
    position: String,
    description: String
  }],
  education: [{
    title: String,
    diploma: String,
    date: String
  }],
  language: [String],
  interest: [String],
  consultedpeople: [{
    title: String,
    adress: String

  }],
  url: String

});
db.on('error', console.error.bind(console, 'connection error:'));

var myModel = db.model('mymodels', CrawlerSchema);
  myModel.find(function (err, kittens) {
  if (err) return console.error(err);
  cat = kittens
  
})
  // we're connected!

function handler(req, res) {
  if (req.url == '/index.html' || req.url == '/') {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html: ' + err);
      }
      
      res.writeHead(200);
      res.end(data);
    });
  }
  else if (req.url == '/stream') {
    res.writeHead(200, {
      'Content-type': 'text/event-stream',
      'Cache-control': 'no-cache',
      'Connection': 'keep-alive'
    });
    setInterval(function() {
      res.write('data:' + createMsg() +   '\n\n');
    }, 2000);
  }

  else {
    res.writeHead(404);
    res.end();
  }
}

function createMsg() {
    var msg = {};

    msg.hostname = cat[count].identifier;
   count++;

    return JSON.stringify(msg);
}
