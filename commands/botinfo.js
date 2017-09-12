const moment = require('moment');
const Config = require('./config.json');

exports.run = (e, params, discordie) => {

	var embed = {
		"author":{
			"name":discordie.User.username+"#"+discordie.User.discriminator+"'s Info",
			"icon_url":discordie.User.avatarURL
		},
		"description":"[Invite link](https://discordapp.com/oauth2/authorize?client_id=289776005504040960&scope=bot)",
		"footer":{
			"text":"Version "+Config.VERSION+" | npm packages: discordie, request, fs, xml2js, easyimage"
		},
		"fields":[
			{ "name": "Developer", "value":"Raiden#6960", "inline":true},
			{ "name": "NodeJS Version", "value":process.version, "inline":true},
			{ "name": "Library", "value":"Discordie", "inline":true},
			{ "name": "Architecture", "value":process.arch, "inline":true},
			{ "name": "Platform", "value":process.platform, "inline":true},
			{ "name": "GitHub", "value":"Soon", "inline":true},
			{ "name": "Memory Usage", "value":Math.floor(process.memoryUsage().heapUsed/1024/1024)+"MB / "+Math.floor(process.memoryUsage().heapTotal/1024/1024)+"MB Total", "inline":true},			
			{ "name": "Uptime", "value":moment(process.uptime()*1000).from(moment(0),true), "inline":true},
			{ "name": "Support Server", "value":"[Link](http://discord.gg/URyEVcs)"}
		]
	};	
	e.message.channel.sendMessage('', false, embed);
}