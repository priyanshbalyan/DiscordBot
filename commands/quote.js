var request = require('request');

exports.run = (e, params, discordie) => {
	var options = {
		url: 'https://andruxnet-random-famous-quotes.p.mashape.com/',
		headers:{
			"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
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