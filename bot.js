const request = require('request');
const Discordie = require('discordie');
const fs = require('fs');

const Utilities = require("./modules/utilities.js");
const Moderation = require("./modules/moderation.js");
const Setter = require("./modules/setter.js");
const Tags = require("./modules/tags.js");

const Events = Discordie.Events;
const discordie = new Discordie();

var prefix = "]";

var Key = require('./key.js');
discordie.connect({
	token: Key.getBotToken() //Paste your Bot Application Token here instead of Key.getBotToken()
});

let settings = JSON.parse(fs.readFileSync("./settings.json","utf8"));

//connected to discord
discordie.Dispatcher.on(Events.GATEWAY_READY, e => {
	console.log("connected as " + discordie.User.username);
	var game = {name: prefix+"help"};
	discordie.User.setGame(game);
});

//New member joined the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_ADD, e => {
	//e.message.channel.sendMessage('Welcome!');
	Setter.welcome(e, discordie, settings);
});

//member left the server
discordie.Dispatcher.on(Events.GUILD_MEMBER_REMOVE, e => {
	//e.message.channel.sendMessage('A User has left this channel.');
});

discordie.Dispatcher.on(Events.MESSAGE_DELETE, e => {
	//embed(e, e.message.content, "delete");
	Setter.deletelog(e, discordie, settings)
});

discordie.Dispatcher.on(Events.MESSAGE_REACTION_ADD, e => {	
	Setter.starboard(e, discordie, settings);
});

commands = ['ping', 'rng', 'flipcoin', 'help', 'getroles', 'avatar', 'quote', 'weather', 'clean', '8ball', 'serverinfo', 'userinfo', 'emote', 'lovecalc', 'kick', 'ban', 'say', 'set', 'urban', 'mute', 'unmute'];
desc = ['Check ping', 'Gives a random number between 1 to 100', 'Flips a coin', 'Shows this message', 'Get the roles of the mentioned user', 'Shows user\'s avatar', 'Get a quote', 'Get weather data for a location \nUsage : ``weather <Location>``', 'Cleans messages', 'Ask 8ball anything', 'Get Server Info', 'Get user info', 'Get Emote URL', 'Calculates love between people\nUsage: ``lovecalc <mention1> <mention2>``', 'Kicks a user', 'Bans a user', 'Make the bot say something', 'Set various channels for specific features of the bot.', 'Get definition of the word from urban dictionary', 'Mute a user for a specified time', 'Unmutes the muted user'];
//new message on server
discordie.Dispatcher.on(Events.MESSAGE_CREATE, e=>{
	//console.log(e.message.author.username);     
	var start = Date.now();
	if(!e.message.content.startsWith(prefix)) return;
	
	var cmd = e.message.content.split(' ')[0].split("");
	const params = e.message.content.split(/\n|\s/).slice(1); //split at space and new line
	cmd.shift();
	cmd = cmd.join("");

	console.log(params);
	try{
	switch(cmd){
		case commands[0] : e.message.channel.sendMessage('Pong!').then(m=>m.edit('Pong! ``'+(Date.now()-start)+'ms``'));
			break;

		case commands[1] : Utilities.fembed(e, "Your random number is " + Math.round(Math.random()*100));
			break;

		case commands[2] : Utilities.fembed(e, "Its " + (Math.random() > 0.5 ? "Heads" : "Tails"));
			break;

		case commands[3] : var str = "Commands available : \n";
			for(var i=0 ; i<commands.length ; i++){
				str += "**"+commands[i]+"**" + "\n" ;
				str += desc[i] + "\n" ;
			}
			str += "Use "+prefix+" as a prefix for the commands.";
			Utilities.fembed(e, str);
			break;
		
		case commands[4] : 
			if(e.message.mentions.length>0) var guildmember = discordie.Users.getMember(e.message.guild,e.message.mentions[0]);
			else var guildmember = e.message.member;
			var roleNames = guildmember.roles.map(role => role.name);
			var str = (roleNames.join("\n") || "No Roles");
			var embed = {
				"color":123134,
				"author":{
					"name": guildmember.name+"'s Roles",
				},
				"description":str
			};
			e.message.channel.sendMessage(" ", false, embed);

			break;
		
		case commands[5] : 
			if(e.message.mentions.length>0) var user = e.message.mentions[0];
			else var user = e.message.author;
			var embed = {
				"color":123134,
				"author":{
					"name": e.message.author.username+" #"+e.message.author.discriminator,
				},
				"image":{
					"url":user.avatarURL+"?size=1024"
				}
			};
			e.message.channel.sendMessage(" ",false,embed);
			break;
		
		case commands[6] : Utilities.quote(e);
			break;
		
		case commands[7] : Utilities.weather(e, params) ;
			break;
		
		case commands[8] : 
			e.message.channel.fetchMessages()
			.then(obj => {
				let msgarray = obj.messages;
				msgarray = msgarray.filter(m => m.author.id === discordie.User.id);   //ES2017 syntax
				msgarray.length = 100 + 1;
				msgarray.map(m => m.delete().catch(console.error));
			});

			break;

		case commands[9] : 
			if(params != "")
				Utilities.fembed(e, Utilities.eightball()+", "+e.message.author.username);
			else
				e.message.channel.sendMessage(e.message.author.username+", The correct usage is ``"+prefix+"8ball <question>``");
			break;

		case commands[10] :
			var guild = e.message.guild;
			e.message.channel.sendMessage(" ",false,Utilities.guildinfo(guild,discordie));
			break;

		case commands[11] :
			if(e.message.mentions.length>0) var user = e.message.mentions[0];
			else var user = e.message.author;
			
			e.message.channel.sendMessage(" ", false, Utilities.userinfo(e, user));
			break;

		case commands[12] :
			let regex = /(<:([^>]+):(\d+)>)/ig;
			match = regex.exec(e.message.content);
			var emojiurl = e.message.guild.getEmojiURL(match[3]);
			e.message.channel.sendMessage("Emoji Name: "+match[2]+"\n"+emojiurl);
			break;

		case commands[13] :
			if(e.message.mentions.length>=2){
				var fname = e.message.mentions[0].username;
				var sname = e.message.mentions[1].username;
				Utilities.lovecalc(e, fname,sname);
			}else
				e.message.channel.sendMessage("The Correct usage is\n``"+prefix+"lovecalc <mention1> <mention2>``");
			break;

		case commands[14]:
			Moderation.kick(e, Discordie);
			break;

		case commands[15]:
			Moderation.ban(e, Discordie);
			break;

		case commands[16]:
			e.message.channel.sendMessage(params.join(" "));
			console.log(e.message.attachments);
			break;

		case commands[17]://set
			Setter.set(e, Discordie, settings, params);
			break;

		case commands[18]:
			Utilities.urban(e, params);
			break;

		case commands[19]:
			Moderation.mute(e, params);
			break;

		case commands[20]:
			Moderation.unmute(e, params);
			break;

		case "invite":
			e.message.channel.sendMessage("Invite me using this link - \nhttps://discordapp.com/oauth2/authorize?client_id=289776005504040960&scope=bot");
			break;

		case "getperms":
			Utilities.getperms(e);
			break;

		case "star":
			discordie.Messages.get(params[0]).addReaction(e.message.reactions[0].emoji);
			break;

		case "tag":
			Tags.tag(e, params);
			
			break;

		case "eval":
			if(e.message.author.id !== "279207740340043776") return;

			break;

		case "die":
			if(e.message.author.id !== "279207740340043776") return;
			discordie.disconnect();
			break;
	}
	
	}catch(err){e.message.channel.sendMessage("```"+err.message+"```");}
});