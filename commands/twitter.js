const fs = require('fs');
var Utilities = require('../modules/utilities.js')

exports.run = (e, params, discordie) => {
	let settings = JSON.parse(fs.readFileSync('./settings.json','utf8'));

	switch(params[0]){
		case 'watch':
			handlename = params[1];
			if(!settings.hasOwnProperty("twitter")) settings.twitter = [];
			if(handlename.startsWith('@')){
				handlename = handlename.split('')
				handlename.shift();
				handlename = handlename.join('');
			}
			settings.twitter.push({"handle":handlename, "channel":e.message.channel.id});
			e.message.channel.sendMessage("Watching tweets from **@"+handlename+"** user.");
			Utilities.twitterService(discordie, settings);
			break;

		case 'stop' :
			if(settings.twitter.find(h=>h.channel == e.message.channel.id))
				settings.twitter.splice(settings.twitter.indexOf(settings.twitter.find(h=>h.channel==e.message.channel.id)),1);
			e.message.channel.sendMessage("Stopped watching tweets.");
			break;

		default:
			var embed = {
				"color":123134,
				"fields":[
					{"name":"twitter watch ``<username>``", "value":"Watches and posts tweets from the mentioned twitter username"},
					{"name":"twitter stop", "value":"Stops watching the twitter feed"}
				]
			};
			e.message.channel.sendMessage(" ",false,embed);
	}

	fs.writeFile("./settings.json", JSON.stringify(settings, null, 4), err => {
		if(err) console.log(err);
	});
}