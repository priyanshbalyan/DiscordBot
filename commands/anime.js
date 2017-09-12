let request = require('request');
const Config = require('../config.json');
let parser = require('xml2js').parseString;

exports.run = (e, params, discordie) => {
	let username = Config.MAL_USERNAME;
	let password = Config.MAL_PASSWORD;

	console.log(params);
	let url = "https://"+username+":"+password+"@myanimelist.net/api/anime/search.xml?q="+params.join("+");
	let options = {
		explicitArray:false
	};

	if(params.length < 1) return e.message.channel.sendMessage("No anime name provided.");

	request(url, (err, res, body)=>{
		if(!err){
			parser(body, options, (err,result)=>{
				//console.log(JSON.stringify(result));
				let anime = result.anime.entry;
				let embed = {
					"author":{
						"name":anime.english
					},
					"thumbnail":{
						"url":anime.image
					},
					"description":anime.title+"\n"+anime.synopsis.substr(0,300)+"...",
					"fields":[
						{"name":"Episodes", "value":anime.episodes, "inline":true},
						{"name":"Score", "value":anime.score, "inline":true},
						{"name":"Type", "value":anime.type, "inline":true},
						{"name":"Status", "value":anime.status, "inline":true}
					],
					"footer":{
						"text":anime.status+" | "+anime.start_date+" to "+anime.end_date
					}
				};
				return e.message.channel.sendMessage("", false, embed);
			});
		}else
			return e.message.channel.sendMessage("Error occured while fetching MAL data. ``"+err.message+"``");
	});
	
}
