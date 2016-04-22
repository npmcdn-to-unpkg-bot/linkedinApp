var mongoose = require('mongoose');

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
module.exports =  mongoose.model('Todo', CrawlerSchema);


