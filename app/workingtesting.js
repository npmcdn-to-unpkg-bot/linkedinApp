var mongoose = require('mongoose');
var a=0;
var db = mongoose.createConnection('mongodb://localhost/CrawlerDataBase');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("	Connected to the database");
});

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

var myModel = db.model('mymodels', CrawlerSchema);

var mahmoud = {"email":"","identifier":"","education":{"educ":[{"name":"Enit","begin":"","end":""}]},"language":{"lang":[{"name":""}]},"skill":{"sk":[{"name":"Linux","number":2}]},"experience":{"exp":[{"position":"","company":0}]}}


var convert = function (mahmoudo){
	var lango=[];
	console.log("the parametres are : "+ mahmoudo)
	var result ={$and:[]

	};
	if (mahmoudo.email != '') {
		result.$and.push({email : { "$regex":  mahmoudo.email, "$options": 'i' }});
	}
	if (mahmoudo.identifier != '') {
		result.$and.push ({identifier : { "$regex":  mahmoudo.identifier, "$options": 'i' }});
	}
	
	if (mahmoudo.skill.sk[0].name != "") {
		for(var i= 0; i < mahmoudo.skill.sk.length; i++)
		{
			result.$and.push({skills: { $elemMatch: {  number: { $gte: mahmoudo.skill.sk[i].number, $lt: 85 } , title: mahmoud.skill.sk[i].name } }});
			console.log('ha' +mahmoudo.skill.sk[i].name )
		}
	}

	if (mahmoudo.language.lang[0].name != "") {
		for(var i= 0; i < mahmoudo.language.lang.length; i++)
		{

			lango.push(mahmoudo.language.lang[i].name)
		}
		result.$and.push({language: { $in: lango }});
	}
	return result;
}

var searching = function(parametre){
	var resp = convert (parametre);
	myModel.
find(resp)
.exec(function(err, result){
	for (var k in result) {
		console.log(result[k].identifier);
		console.log(a++);
		console.log("=======================================================================================")
	}

});
 }
searching(mahmoud);

