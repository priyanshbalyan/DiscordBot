var request = require('request');

exports.run = (e, params, discordie) => {
	if(!params || params.length<1) return e.message.channel.sendMessage("No term provided.");

	var options = {
			url:"https://mashape-community-urban-dictionary.p.mashape.com/define?term="+params.join("+"),
			headers:{
				"X-Mashape-Authorization":"HmaQCMEY70mshSFJUYoFuPD7fGM6p1YRwqjjsnIZVEiVUI5SzE"
			}
	};
	request(options, (err,res,body) => {
		if(!err){
			var resp = JSON.parse(body);
			//console.log(resp);
			var embed = {
				"color":123134,
				"author":{
					"name": "Defintion for \""+params.join(" ")+"\" by "+resp.list[0].author
				},
				"description":resp.list[0].definition,
				"thumbnail":{
					"url":"http://error.urbandictionary.com/logo.png?width=89&height=29"
				},
				"fields":[{
					"name":"Examples",
					"value":resp.list[0].example
				},
				{
					"name":"Rating",
					"value":resp.list[0].thumbs_up+" :thumbsup: | :thumbsdown: "+resp.list[0].thumbs_down
				}]
			};
				
		}else var embed = {"description": "Can't fetch data from urban dictionary"};
			
		e.message.channel.sendMessage(" ", false, embed);
	});
}