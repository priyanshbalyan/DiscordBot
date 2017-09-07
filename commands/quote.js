var request = require('request');
const Config = require('../config.json');

exports.run = (e, params, discordie) => {
	var options = {
		url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
		headers:{
			"X-Mashape-Authorization":Config.MASHAPE_KEY
		}
	};
	request(options, (err, res, body) => {
		if(!err){
			var resp = JSON.parse(body);
			console.log(body);
			var embed = {
				"color": 123134,
				"author":{
					"name": resp.quote,
				},
				"footer":{
					"text": resp.author+" | "+resp.category
				}
			};
		}
		else
			var embed = {
				"description": "Can't fetch quotes."
			}
		e.message.channel.sendMessage(" ",false,embed);
	});
}