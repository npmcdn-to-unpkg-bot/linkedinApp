var mongoose = require('mongoose');

;
mongoose.connect('mongodb://localhost/CrawlerDataBase');
var cat;
var db = mongoose.connection;
var CrawlerSchema = mongoose.Schema({
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
db.once('open', function() {
var myModel = mongoose.model('myModel', CrawlerSchema);
	myModel.find(function (err, kittens) {
  if (err) return console.error(err);
  cat = kittens
  
})
  // we're connected!
});
var dog = 'doge'
// setTimeout(function(){ console.log(cat); }, 5000);
module.exports = {
	cat: cat,
	dog : dog
}