var request = require('request');
var fs = require('fs');
var Q = require('q');
var mongoose = require('mongoose');
var littleUrl;
var _ = require('underscore');
var counter=0;
var repeat=false;
var Q = require('q');
var Xray = require('x-ray');
var x = Xray();
var urlTable=[];
var bigCounter = 0;
var clickUrl = '.conn-wrapper:eq('+bigCounter+')';
var cookies=[];
var y="test ";
var Horseman = require('node-horseman');
var horseman = new Horseman();
var db = mongoose.createConnection('mongodb://localhost/CrawlerDataBase');

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

var myModel = db.model('modelo', CrawlerSchema);
var Horso = {
	options: {
		url: 'https://www.linkedin.com/profile/view?id=AA4AABj0fLUB552Y0oxkrhnCJjLuGNdT2xDo6JI&amp;authType=name&amp;authToken=kvxt&amp;goback=&amp;trk=abook_conn',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
			'cookie' :'li_at=AQEDARzFBw4ETJnOAAABU4UtgnAAAAFThZtfcE4Ar0dKb7K9qZdF3ITJhhm7zgdOMDPq6hUo8_joIXPmfXrtyie8MeIN9RqK-abWu-a9QyxPpff957O7sqNpG5V8t4ZbnrKSr6yw4iuSdwTqb7w2Tr9v'
		}
	},
	options2: {
		url: 'https://www.linkedin.com/people/conn-details?i=&contactMemberID=18033037',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36',
			'cookie' :'li_at=AQEDARzFBw4BjdhWAAABU4lCuQoAAAFTibCWCk4ARqQo67Nb_hVUtiM99zPiiFcgrL6Ugd9AhysLEI0D1fotVLg0GKGYnFaQzesMzddm1lJ2PfS87w-8v7hT6hsTuNuI3JdnmaLXdgKdjE4SlaV-LAIS'
		}
	},
	findCookie: function(callback) {

		var deferred = Q.defer();
		console.log("PHASE 1 : OPENING LINKEDIN")
		horseman
		.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0").log("	Setting Mozilla Agent")
		.open("https://www.linkedin.com/uas/login?goback=&trk=hb_signin").log("		Opening linkedIn via Horseman")
		.type('input[name="session_key"]', 'mahmoud.ellouze922@gmail.com').log("	Typing session key")
		.type('input[name="session_password"]', '33ivalice').log("		Typing password session")
		.keyboardEvent("keypress", 16777221).log("		Executing keyboard event")
		.waitForNextPage().log("		Wait for next page")
		.open("https://www.linkedin.com/people/connections?trk=nav_responsive_tab_network").log("		opening network")
		.waitForNextPage().log("		Wait for next page")
		.cookies()
		.then(function(cookies) {
			console.log("		Extracting cookies");
			for (var i in cookies) {
				if (cookies[i].name == "li_at") {
					var cookie = "li_at=" + cookies[i].value;
					console.log(cookie)
					Horso.options.headers.cookie=cookie;
					Horso.options2.headers.cookie=cookie;
				}
			}
			deferred.resolve();
		})
		.then(function() {Horso.chooseFunction();
		})
	},
	chooseFunction : function() {
		console.log("PHASE 2 : CHOOSE FUNCTION")
		if (bigCounter>=10){
			console.log("		Turning the page");
			bigCounter = 0;
			clickUrl = '.conn-wrapper:eq('+bigCounter+')';
			Horso.getProfile2();
		}else {
			console.log("		Keep the same page");
			Horso.getProfile();
		}
	},
	getProfile2 : function (){
		console.log("PHASE 3 : GETTING PROFILE (next page)");
		horseman
		.click("span:contains('Suivante')")
		.waitForNextPage()
		
		.then(function(){  console.log("		The click Url is : "+ clickUrl)
	})
		.click(clickUrl).log("		Clicking on profile")
		.on('resourceReceived',function( msg ){

			urlTable[counter]=String(msg.url);
			var res = urlTable[counter].substr(0, 44);

			if((res=='https://www.linkedin.com/people/conn-details')&&(repeat==false)){
				repeat=true ;
				y=urlTable[counter]; 
				console.log("		The Url response received is : "+y);
				Horso.options2.url=y;
				Horso.doFirstRequest();
			}

			counter++;
		})
	},
	getProfile : function(){
		console.log("PHASE 3 : GETTING PROFILE (same page)");
		horseman
		.waitForNextPage()
		.then(function(){  console.log("The click Url is : "+  clickUrl)})
		.click(clickUrl).log("		Clicking on profile")
		.on('resourceReceived',function( msg ){


			urlTable[counter]=String(msg.url);
			var res = urlTable[counter].substr(0, 44);

			if((res=='https://www.linkedin.com/people/conn-details')&&(repeat==false)){
				repeat=true ;
				y=urlTable[counter]; 
				console.log("		The Url response is : "+y);
				Horso.options2.url=y;
				Horso.doFirstRequest();
			}

			counter++;
		})
	},
	doFirstRequest : function(){
		console.log("PHASE 4 : REQUESTING THE PROFILE ID")
		request(Horso.options2, function(error, response, body) {

			x(body, '.connection-name', 'a@href')
			(function(err, result) {
				console.log("		The id of the profile is  : "+result);
				Horso.options.url=result;
				Horso.doRequest();
			})
		});
	},
	findTwo :  function(myUrl) {
		horseman
		.open(myUrl).log("opening phase 2   :   " + myUrl)
		.waitForNextPage().log("waiting phase 2")
		.html(".connection-name")
		.then(function(body) {

			console.log("extracting URL")
			var pieceOfString = String(body);
			var trueUrl = pieceOfString.substr(pieceOfString.indexOf('"')+1,pieceOfString.indexOf('conn')-6);
			console.log("the final url is   :   " + trueUrl);
			Horso.options.url=trueUrl;
			Horso.doRequest();
		})
	},
	doRequest: function(error) {
		if (error) {
			console.log(error);
		}
		console.log("PHASE 5 : REQUESTING COMPLETE PROFILE");
		console.log("		Requesting the data from the profile");

		request(Horso.options, function(error, response, body) {
fs.writeFile("test", body);
			Horso.crawl(body);
		});


	},
	crawl: function(body) {
		console.log("PHASE 6 : CRAWLING THE PROFILE");
		var selectedCheckers = Horso.generateXRayParams();
		x(body, '#profile', selectedCheckers)
		(function(err, result) {
			repeat=false;
			var ProfileModel = new myModel(result);
			myModel.findOne({
				'url': result.url 
			}, function(err, userObj) {
				if (err) {
					console.log(err);
				} else if (userObj) {
					console.log('Found the profile in the database');
					console.log(userObj.url)
				} else {
					console.log("Did\'nt find the profile in the database");
					ProfileModel.save(function(err) {
						if (err) throw err; 

						console.log('		Profile saved successfully!');
					});
				}
			});
			console.log(result);
			bigCounter ++;
			console.log("		Number of profile checked in the page  is "+ bigCounter);
			clickUrl = '.conn-wrapper:eq('+bigCounter+')';
			console.log("===============================================================================================")
			Horso.chooseFunction();

		})
	},
	getEnabledCheckers: function() {
		return _.where(Horso.checkers, {
			state: true
		});
	},


	generateXRayParams: function() {
		var checkers = Horso.getEnabledCheckers();

		var payload = {};

		checkers.forEach(function(checker) {
			payload[checker.name] = x(checker.selectors, checker.fields);
		})

		return payload; 
	},
	checkers: [
	{
		name: 'experience',
		state: true,
		selectors: "#background-experience .editable-item.section-item",
		fields: [{
			title: "h4",
			company: "h5",
			date : "span",
			description: "p"
		}]
	},{
		name : 'email',
		state : true,
		selectors : '#email',
		fields : 'a'
	},
	 {
		name: 'skills',
		state: true,
		selectors: ".skill-pill",
		fields: [{
			number: ".num-endorsements@data-count",
			title: ".endorse-item-name-text@text"
		}]
	}, {
		name: 'recommendation',
		state: true, 
		selectors: ".endorsement-info",
		fields: [{
			recommender: "h5",
			position: "h6",
			description: "p"
		}]
	}, {
		name: 'education',
		state: true,
		selectors: ".education",
		fields: [{
			title: "h4",
			diploma: "h5",
			date: ".education-date"
		}]
	}, {
		name: 'language',
		state: true,
		selectors: "#languages-view  li.section-item",
		fields: ["li"]
	}, {
		name: 'interest',
		state: true,
		selectors: ".interests-listing li",
		fields: ["a"]
	}, {
		name: 'consultedpeople',
		state: true,
		selectors: ".insights-browse-map li",
		fields: [{
			title: "h4",
			adress: "a@href"

		}]
	}, {
		name: 'url',
		state: true,
		selectors: ".profile-actions ",
		fields: ".view-public-profile"

	},{
		name : 'identifier',
		state : true,
		selectors : "#name-container",
		fields : "h1"
	}
	]

}

var searchProfile = function(){
	Horso.findCookie();
}
module.exports = {
	searchProfile: searchProfile
	
}

//Horso.doFirstRequest()
